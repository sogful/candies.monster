import {roomgeometry, shinegeometry} from "./roomscene.js";

const vertex = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 texcoord;
    uniform vec3 center;
    uniform float size;
    uniform vec3 angles;
    uniform vec2 projection;
    varying vec2 uv;
    varying vec3 lightnormal;

    vec3 turn(vec3 point) {
        float a = angles.x;
        point.xz = mat2(cos(a), sin(a), -sin(a), cos(a)) * point.xz;
        a = angles.y;
        point.yz = mat2(cos(a), sin(a), -sin(a), cos(a)) * point.yz;
        a = angles.z;
        point.xy = mat2(cos(a), sin(a), -sin(a), cos(a)) * point.xy;
        return point;
    }

    void main() {
        vec3 point = (position - center) / size;
        point = turn(vec3(point.x, point.z, -point.y));
        float depth = 2.7 - point.z;
        gl_Position = vec4(point.xy * projection, depth * 1.0202 - 0.202, depth);
        lightnormal = turn(vec3(normal.x, normal.z, -normal.y));
        uv = texcoord;
    }
`;

const fragment = `
    precision mediump float;
    varying vec2 uv;
    varying vec3 lightnormal;
    uniform sampler2D surface;

    void main() {
        vec4 texel = texture2D(surface, uv);
        float light = dot(normalize(lightnormal), normalize(vec3(-0.35, 0.75, 1.0)));
        gl_FragColor = vec4(texel.rgb * (0.72 + 0.28 * max(0.0, light)), texel.a);
    }
`;

const roomvertex = `
    attribute vec3 position;
    attribute vec2 texcoord;
    attribute float brightness;
    uniform vec2 projection;
    uniform vec4 spin;
    varying vec2 uv;
    varying float shade;

    void main() {
        vec3 point = position;
        if (spin.w > 0.0) {
            point *= spin.w;
            float a = spin.x;
            point.xy = mat2(cos(a), sin(a), -sin(a), cos(a)) * point.xy;
            a = spin.y;
            point.yz = mat2(cos(a), sin(a), -sin(a), cos(a)) * point.yz;
            a = spin.z;
            point.xz = mat2(cos(a), sin(a), -sin(a), cos(a)) * point.xz;
            point.z -= 0.9;
        }
        float depth = 2.7 - point.z;
        gl_Position = vec4(point.xy * projection, depth * 1.0202 - 0.202, depth);
        uv = texcoord;
        shade = brightness;
    }
`;

const roomfragment = `
    precision mediump float;
    varying vec2 uv;
    varying float shade;
    uniform sampler2D surface;
    uniform vec4 tint;

    void main() {
        vec4 pixel = texture2D(surface, uv);
        if (pixel.a < 0.005) discard;
        gl_FragColor = vec4(pixel.rgb * tint.rgb * shade, pixel.a * tint.a);
    }
`;

/*//////////////////////////////////////////////////////////////////////*/

function shader(gl, type, source) {
    const result = gl.createShader(type);
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(result));
    return result;
}

function program(gl, vsource, fsource) {
    const result = gl.createProgram();
    gl.attachShader(result, shader(gl, gl.VERTEX_SHADER, vsource));
    gl.attachShader(result, shader(gl, gl.FRAGMENT_SHADER, fsource));
    gl.linkProgram(result);
    if (!gl.getProgramParameter(result, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(result));
    gl.useProgram(result);
    return result;
}

function getimage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
    });
}

function texture(gl, image) {
    const result = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, result);
    if (image) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255,255,255,255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return result;
}

function geometry(gl, pipeline, data) {
    const header = new DataView(data);
    if (header.getUint32(0, true) !== 0x46546c67 || header.getUint32(4, true) !== 2) throw new Error("Invalid model");
    const length = header.getUint32(12, true);
    const layout = JSON.parse(new TextDecoder().decode(new Uint8Array(data, 20, length)));
    const offset = 28 + length;
    const mesh = layout.meshes[0].primitives[0];
    const buffers = new Map();
    function buffer(target, index) {
        const view = layout.bufferViews[index];
        if (!buffers.has(index)) {
            const buffer = gl.createBuffer();
            buffers.set(index, buffer);
            gl.bindBuffer(target, buffer);
            gl.bufferData(target, new Uint8Array(data, offset + (view.byteOffset || 0), view.byteLength), gl.STATIC_DRAW);
        }
        return buffers.get(index);
    }
    const fields = [];
    for (const [name, key, count] of [["position","POSITION",3],["normal","NORMAL",3],["texcoord","TEXCOORD_0",2]]) {
        const field = layout.accessors[mesh.attributes[key]];
        const view = layout.bufferViews[field.bufferView];
        const attribute = gl.getAttribLocation(pipeline, name);
        fields.push({attribute, count, field, view, vertices: buffer(gl.ARRAY_BUFFER, field.bufferView)});
    }
    const bounds = layout.accessors[mesh.attributes.POSITION];
    gl.uniform3fv(gl.getUniformLocation(pipeline, "center"), bounds.min.map((min, axis) => (min + bounds.max[axis]) / 2));
    gl.uniform1f(gl.getUniformLocation(pipeline, "size"), Math.max(...bounds.min.map((min, axis) => bounds.max[axis] - min)));
    const indices = layout.accessors[mesh.indices];
    const elements = buffer(gl.ELEMENT_ARRAY_BUFFER, indices.bufferView);
    return () => {
        for (const {attribute, count, field, view, vertices} of fields) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
            gl.enableVertexAttribArray(attribute);
            gl.vertexAttribPointer(attribute, count, field.componentType, false, view.byteStride || 0, field.byteOffset || 0);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements);
        gl.drawElements(gl.TRIANGLES, indices.count, indices.componentType, indices.byteOffset || 0);
    };
}

/*//////////////////////////////////////////////////////////////////////*/

function roomscene(gl, poster, glow) {
    const pipeline = program(gl, roomvertex, roomfragment);
    const projection = gl.getUniformLocation(pipeline, "projection");
    const spin = gl.getUniformLocation(pipeline, "spin");
    const tint = gl.getUniformLocation(pipeline, "tint");
    const positions = gl.getAttribLocation(pipeline, "position");
    const coords = gl.getAttribLocation(pipeline, "texcoord");
    const brightness = gl.getAttribLocation(pipeline, "brightness");
    const wall = gl.createBuffer();
    const paper = gl.createBuffer();
    const rays = gl.createBuffer();
    const seed = Math.random() * 4294967296 >>> 0;
    const white = texture(gl);
    const picture = texture(gl, poster);
    const shine = texture(gl, glow);
    let walls = 0;
    let posters = 0;

    function upload(buffer, data) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return data.length / 6;
    }

    upload(rays, shinegeometry());

    function resize(horizontal, vertical) {
        gl.useProgram(pipeline);
        gl.uniform2f(projection, horizontal, vertical);
        const shapes = roomgeometry(horizontal, vertical, poster.width / poster.height, seed);
        walls = upload(wall, shapes.walls);
        posters = upload(paper, shapes.posters);
    }

    function paint(buffer, art, count) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(positions, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 24, 12);
        gl.vertexAttribPointer(brightness, 1, gl.FLOAT, false, 24, 20);
        gl.bindTexture(gl.TEXTURE_2D, art);
        gl.drawArrays(gl.TRIANGLES, 0, count);
    }

    function draw(time) {
        gl.useProgram(pipeline);
        gl.enableVertexAttribArray(positions);
        gl.enableVertexAttribArray(coords);
        gl.enableVertexAttribArray(brightness);
        gl.uniform4f(spin, 0, 0, 0, 0);
        gl.uniform4f(tint, 1, 1, 1, 1);
        paint(wall, white, walls);
        gl.enable(gl.BLEND);
        paint(paper, picture, posters);
        gl.depthMask(false);
        gl.uniform4f(tint, 0.22, 1, 0.28, 0.93);
        gl.uniform4f(spin, time * Math.PI / 6, 0.61, -0.35, 1.08);
        paint(rays, shine, 6);
        gl.uniform4f(spin, 1.22 - time * Math.PI / 7.5, -0.61, 0.35, 0.99);
        paint(rays, shine, 6);
        gl.depthMask(true);
        gl.disable(gl.BLEND);
    }

    return {resize, draw};
}

/*//////////////////////////////////////////////////////////////////////*/

export async function roommodel(canvas) {
    const gl = canvas.getContext("webgl", {alpha: false, antialias: false});
    if (!gl) throw new Error("WebGL unavailable");
    const path = "/assets/images/room/";
    const [data, image, poster, glow] = await Promise.all([
        fetch(path + "omnom.glb").then(response => {
            if (!response.ok) throw new Error("Model unavailable");
            return response.arrayBuffer();
        }),
        getimage(path + "omnom.png"),
        getimage("/assets/images/wonderful.png"),
        getimage("/assets/images/level/starglow.webp")
    ]);
    const pipeline = program(gl, vertex, fragment);
    const drawmesh = geometry(gl, pipeline, data);
    const skin = texture(gl, image);
    const scene = roomscene(gl, poster, glow);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(1, 1, 1, 1);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const angles = gl.getUniformLocation(pipeline, "angles");
    const projection = gl.getUniformLocation(pipeline, "projection");
    let frame = 0;
    let visible = false;
    let previous = 0;
    let time = 0;
    let pointer = null;
    let lastx = 0;
    let lasty = 0;
    let turnx = 0;
    let turny = 0;
    let ready = false;

    function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        scene.draw(time);
        gl.useProgram(pipeline);
        gl.bindTexture(gl.TEXTURE_2D, skin);
        gl.uniform3f(angles, turnx + time * 0.43 + 0.15, turny + 0.19 + Math.sin(time * 0.53) * 0.3, Math.sin(time * 0.38) * 0.17);
        drawmesh();
        if (!ready) {
            ready = true;
            canvas.dataset.ready = "true";
        }
    }

    function resize() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!width || !height) return;
        const compact = matchMedia("(pointer: coarse)").matches || width <= 650;
        const budget = compact ? 265000 : 680000;
        const scale = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(budget / (width * height)));
        const pixelswide = Math.max(1, Math.floor(width * scale));
        const pixelshigh = Math.max(1, Math.floor(height * scale));
        if (canvas.width !== pixelswide) canvas.width = pixelswide;
        if (canvas.height !== pixelshigh) canvas.height = pixelshigh;
        gl.viewport(0, 0, pixelswide, pixelshigh);
        const aspect = width / height;
        const vertical = 2.7 * Math.min(1, aspect);
        const horizontal = vertical / aspect;
        gl.useProgram(pipeline);
        gl.uniform2f(projection, horizontal, vertical);
        scene.resize(horizontal, vertical);
    }

    function animate(now) {
        const interval = pointer === null ? 32 : 15;
        if (previous && now - previous >= interval) {
            time += Math.min(now - previous, 60) / 1000;
            previous = now;
            draw();
        } else if (!previous) previous = now;
        frame = requestAnimationFrame(animate);
    }

    function refresh() {
        cancelAnimationFrame(frame);
        previous = 0;
        if (visible) {
            resize();
            draw();
            if (!document.hidden) frame = requestAnimationFrame(animate);
        }
    }

    function enddrag() {
        pointer = null;
        canvas.classList.remove("dragging");
    }

    canvas.addEventListener("pointerdown", event => {
        if (pointer !== null || event.button !== 0) return;
        pointer = event.pointerId;
        lastx = event.clientX;
        lasty = event.clientY;
        canvas.setPointerCapture(pointer);
        canvas.classList.add("dragging");
    });
    canvas.addEventListener("pointermove", event => {
        if (event.pointerId !== pointer) return;
        turnx += (event.clientX - lastx) * 0.014;
        turny += (event.clientY - lasty) * 0.014;
        lastx = event.clientX;
        lasty = event.clientY;
    });
    for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) {
        canvas.addEventListener(name, event => {if (event.pointerId === pointer) enddrag()});
    }

    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("resize", () => {
        if (!visible) return;
        resize();
        draw();
    });
    return {show: open => {
        visible = open;
        if (!open) enddrag();
        refresh();
    }};
}
