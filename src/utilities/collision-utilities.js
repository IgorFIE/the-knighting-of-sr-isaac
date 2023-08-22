import { GameVars } from "../game-variables";

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

export const circleToCircleCollision = (circle1, circle2) => {
    let num = circle1.x - circle2.x;
    let num2 = circle1.y - circle2.y;
    return Math.sqrt(num * num + num2 * num2) <= circle1.r + circle2.r;
}

export const validateMovement = (fakeMovCircle, roomX, roomY, fn) => {
    if (!(GameVars.gameBoard.board[roomY][roomX].walls.find((wall) => rectCircleCollision(fakeMovCircle, wall.collisionObj)) ||
        GameVars.gameBoard.board[roomY][roomX].enemies.find((enemy) => circleToCircleCollision(fakeMovCircle, enemy.collisionObj)) ||
        (GameVars.currentRoom.isDoorsOpen && GameVars.gameBoard.board[roomY][roomX].doors.find((door) => rectCircleCollision(fakeMovCircle, door.collisionObj))))) {
        fn(fakeMovCircle);
    }
}

export const lineCircleCollision = (line, circle) => {
    return distanceSegmentToPoint(line[0], line[1], circle) < circle.r;
}

/**
 * https://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
 * Returns the distance from line segment AB to point C
 */
const distanceSegmentToPoint = (A, B, C) => {
    // Compute vectors AC and AB
    const AC = sub(C, A);
    const AB = sub(B, A);

    // Get point D by taking the projection of AC onto AB then adding the offset of A
    const D = add(proj(AC, AB), A);

    const AD = sub(D, A);
    // D might not be on AB so calculate k of D down AB (aka solve AD = k * AB)
    // We can use either component, but choose larger value to reduce the chance of dividing by zero
    const k = Math.abs(AB.x) > Math.abs(AB.y) ? AD.x / AB.x : AD.y / AB.y;

    // Check if D is off either end of the line segment
    if (k <= 0.0) {
        return Math.sqrt(hypot2(C, A));
    } else if (k >= 1.0) {
        return Math.sqrt(hypot2(C, B));
    }

    return Math.sqrt(hypot2(C, D));
}

// Define some common functions for working with vectors
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const dot = (a, b) => a.x * b.x + a.y * b.y;
const hypot2 = (a, b) => dot(sub(a, b), sub(a, b));

// Function for projecting some vector a onto b
function proj(a, b) {
    const k = dot(a, b) / dot(b, b);
    return { x: k * b.x, y: k * b.y };
}