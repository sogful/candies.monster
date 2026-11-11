export function camera(map, width, height) {
    const windowwidth = Math.min(map.width, 2560 / 3);
    const windowheight = Math.min(map.height, 480);
    const scale = Math.min(width / windowwidth, height / windowheight);
    const visiblewidth = width / scale;
    const visibleheight = height / scale;
    const slackx = visiblewidth - windowwidth;
    const slacky = visibleheight - windowheight;
    const scrollx = map.width - windowwidth;
    const scrolly = map.height - windowheight;
    const focus = map.objects.find(item => ["candy", "candyleft", "candyright"].includes(item.type)) || {x: 0, y: 0};
    const horizontal = map.width > 2560 / 3;
    const anchorx = scrollx > slackx ? (horizontal && focus.x <= map.width / 2 ? 1 : 0) : 0.5;
    const anchory = scrolly > slacky ? (!horizontal && focus.y <= map.height / 2 ? 1 : 0) : 0.5;
    return {scale, x: (scrollx - slackx) * anchorx, y: (scrolly - slacky) * anchory, width: visiblewidth, height: visibleheight};
}

/*//////////////////////////////////////////////////////////////////////*/

export function backdrop(context, map, image, view) {
    if (!image) return;
    const zoom = Math.max(view.width / image.width, view.height / image.height);
    const width = image.width * zoom;
    const height = image.height * zoom;
    const left = map.width / 2 - width / 2;
    const top = 240 - height / 2;
    const firstcolumn = Math.floor((view.x - left) / width);
    const firstrow = Math.floor((view.y - top) / height);
    for (let row = firstrow; top + row * height < view.y + view.height; row++) {
        for (let column = firstcolumn; left + column * width < view.x + view.width; column++) {
            context.drawImage(image, left + column * width, top + row * height, width, height);
        }
    }
}
