export const genSmallBox = (canvas, startX, startY, endX, endY, pixelSize, color, bgColor) => {
    const conditionFn = (x, y, endX, endY) => {
        return (y === 0 && (x > 0 && x < endX)) ||
            (y === endY && (x > 0 && x < endX)) ||
            (x === 0 && (y > 0 && y < endY)) ||
            (x === endX && (y > 0 && y < endY));
    }
    if (bgColor) {
        genetateInsideBoxColor(canvas, startX, startY, endX, endY, pixelSize, bgColor);
    }
    generateBox(canvas, startX, startY, endX, endY, pixelSize, color, conditionFn);
};

export const generateBox = (canvas, startX, startY, endX, endY, pixelSize, color, conditionFn) => {
    const ctx = canvas.getContext("2d");
    for (let y = 0; y <= endY; y++) {
        for (let x = 0; x <= endX; x++) {
            if (conditionFn(x, y, endX, endY)) {
                ctx.fillStyle = color;
                ctx.fillRect(
                    Math.round((startX * pixelSize) + (x * pixelSize)),
                    Math.round((startY * pixelSize) + (y * pixelSize)),
                    pixelSize, pixelSize);
            }
        }
    }
};

const genetateInsideBoxColor = (canvas, startX, startY, endX, endY, pixelSize, bgColor) => {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bgColor;
    ctx.fillRect(
        Math.round((startX * pixelSize) + pixelSize),
        Math.round((startY * pixelSize) + pixelSize),
        Math.round((endX * pixelSize) - pixelSize),
        Math.round((endY * pixelSize) - pixelSize)
    );
};