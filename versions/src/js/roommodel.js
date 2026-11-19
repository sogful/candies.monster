const vertex = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 texcoord;
    uniform vec3 center;
    uniform float size;
    uniform vec3 angles;
    uniform float aspect;
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
        gl_Position = vec4(point.x * 3.5 / aspect, point.y * 3.5, depth * 1.0202 - 0.202, depth);
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

/*//////////////////////////////////////////////////////////////////////*/

function shader(gl, type, source) {
    const result = gl.createShader(type);
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(result));
    return result;
}

function program(gl) {
    const result = gl.createProgram();
    gl.attachShader(result, shader(gl, gl.VERTEX_SHADER, vertex));
    gl.attachShader(result, shader(gl, gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(result);
    if (!gl.getProgramParameter(result, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(result));
    gl.useProgram(result);
    return result;
}

function gettexture(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
    });
}

function geometry(gl, pipeline, data) {
    const header = new DataView(data);
    if (header.getUint32(0, true) !== 0x46546c67 || header.getUint32(4, true) !== 2) throw new Error("Invalid model");
    const length = header.getUint32(12, true);
    const layout = JSON.parse(new TextDecoder().decode(new Uint8Array(data, 20, length)));
    const offset = 28 + length;
    const mesh = layout.meshes[0].primitives[0];
    const buffers = new Map();
    function bind(target, index) {
        const view = layout.bufferViews[index];
        if (!buffers.has(index)) {
            const buffer = gl.createBuffer();
            buffers.set(index, buffer);
            gl.bindBuffer(target, buffer);
            gl.bufferData(target, new Uint8Array(data, offset + (view.byteOffset || 0), view.byteLength), gl.STATIC_DRAW);
        } else gl.bindBuffer(target, buffers.get(index));
        return view;
    }
    for (const [name, key, count] of [["position","POSITION",3],["normal","NORMAL",3],["texcoord","TEXCOORD_0",2]]) {
        const field = layout.accessors[mesh.attributes[key]];
        const view = bind(gl.ARRAY_BUFFER, field.bufferView);
        const attribute = gl.getAttribLocation(pipeline, name);
        gl.enableVertexAttribArray(attribute);
        gl.vertexAttribPointer(attribute, count, field.componentType, false, view.byteStride || 0, field.byteOffset || 0);
    }
    const bounds = layout.accessors[mesh.attributes.POSITION];
    gl.uniform3fv(gl.getUniformLocation(pipeline, "center"), bounds.min.map((min, axis) => (min + bounds.max[axis]) / 2));
    gl.uniform1f(gl.getUniformLocation(pipeline, "size"), Math.max(...bounds.min.map((min, axis) => bounds.max[axis] - min)));
    const indices = layout.accessors[mesh.indices];
    bind(gl.ELEMENT_ARRAY_BUFFER, indices.bufferView);
    return indices;
}

/*//////////////////////////////////////////////////////////////////////*/

export async function roommodel(canvas) {
    const gl = canvas.getContext("webgl", {alpha: true, antialias: true});
    if (!gl) throw new Error("WebGL unavailable");
    const path = "/assets/images/room/";
    const [data, image] = await Promise.all([
        fetch(path + "omnom.glb").then(response => {
            if (!response.ok) throw new Error("Model unavailable");
            return response.arrayBuffer();
        }),
        gettexture(path + "omnom.png")
    ]);
    const pipeline = program(gl);
    const indices = geometry(gl, pipeline, data);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.enable(gl.DEPTH_TEST);

    const angles = gl.getUniformLocation(pipeline, "angles");
    const aspect = gl.getUniformLocation(pipeline, "aspect");
    let frame = 0;
    let visible = false;
    let previous = 0;
    let time = 0;

    function draw() {
        const scale = Math.min(devicePixelRatio || 1, 1.75);
        const width = Math.max(1, Math.round(canvas.clientWidth * scale));
        const height = Math.max(1, Math.round(canvas.clientHeight * scale));
        if (canvas.width !== width) canvas.width = width;
        if (canvas.height !== height) canvas.height = height;
        gl.viewport(0, 0, width, height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniform1f(aspect, width / height);
        gl.uniform3f(angles, time * 0.43 + 0.15, 0.19 + Math.sin(time * 0.53) * 0.3, Math.sin(time * 0.38) * 0.17);
        gl.drawElements(gl.TRIANGLES, indices.count, indices.componentType, indices.byteOffset || 0);
        canvas.dataset.ready = "true";
    }

    function animate(now) {
        if (previous && now - previous >= 29) {
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
            draw();
            if (!document.hidden) frame = requestAnimationFrame(animate);
        }
    }

    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("resize", () => {if (visible) draw()});
    return {show: open => {visible = open; refresh()}};
}
