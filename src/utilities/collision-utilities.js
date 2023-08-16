export const rectCollision = (rect1, rect2) => {
    return !(rect2.x > rect1.w + rect1.x || rect1.x > rect2.w + rect2.x || rect2.y > rect1.h + rect1.y || rect1.y > rect2.h + rect2.y);
}

export const rectCircleCollision = (circle, rect) => {
    var distX = Math.abs(circle.x - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) { return false; }
    if (distY > (rect.h / 2 + circle.r)) { return false; }

    if (distX <= (rect.w / 2)) { return true; }
    if (distY <= (rect.h / 2)) { return true; }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}