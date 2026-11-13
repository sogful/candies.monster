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
    const x = scrollx > slackx ? Math.max(0, Math.min(scrollx - slackx, focus.x - visiblewidth / 2)) : (scrollx - slackx) / 2;
    const y = scrolly > slacky ? Math.max(0, Math.min(scrolly - slacky, focus.y - visibleheight / 2)) : (scrolly - slacky) / 2;
    return {scale, x, y, width: visiblewidth, height: visibleheight};
}

/*//////////////////////////////////////////////////////////////////////*/

export function backdrop(context, map, image, view, full = false) {
    if (!image) return;
    const zoom = Math.max((full ? 2560 / 3 : view.width) / image.width, (full ? 480 : view.height) / image.height);
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
    if (!image.seam || !image.section) return;
    const section = image.section;
    const scale = width / (2559 / 3);
    const count = Math.max(0, Math.ceil(map.height / 480 - 0.001) - 1);
    for (let row = 0; row < count; row++) {
        const y = top + section.offset * scale + row * height;
        const seamheight = section.height * scale;
        if (y > view.y + view.height || y + seamheight < view.y) continue;
        for (let column = firstcolumn; left + column * width < view.x + view.width; column++) {
            context.drawImage(image.seam, left + column * width, y, section.width * scale, seamheight);
        }
    }
}
