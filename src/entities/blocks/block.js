import { SquareObject } from "../../collision-objects/square-object";
import { BlockType } from "../../enums/block-type";
import { GameVars, toPixelSize } from "../../game-variables";
import { generateBox } from "../../utilities/box-generator";
import { randomNumb } from "../../utilities/general-utilities";

export class Block {
    constructor(roomX, roomY, blockType, canvas) {
        this.roomX = roomX;
        this.roomY = roomY;
        this.collisionObj = new SquareObject(roomX * toPixelSize(16), roomY * toPixelSize(16), toPixelSize(16), toPixelSize(16));
        this.blockType = blockType;
        this.canvas = canvas;
    }

    draw() {
        const ctx = this.canvas.getContext("2d");
        switch (this.blockType) {
            case BlockType.WALL:
                ctx.fillStyle = "#686b7a";
                ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
                generateBox(this.canvas,
                    this.convertToMapPixel(this.collisionObj.x), this.convertToMapPixel(this.collisionObj.y),
                    this.convertToMapPixel(this.collisionObj.w - toPixelSize(2)), this.convertToMapPixel(this.collisionObj.h - toPixelSize(2)),
                    toPixelSize(2), "#3e3846", (x, y, endX, endY) => {
                        return randomNumb(100) < 3 || this.validateBlock(x, y, endX, endY,
                            (x, y, endX, endY) => x === 0 || y === endY,
                            (x, y, endX, endY) => x === 0,
                            (x, y, endX, endY) => x === 0 || y === endY,
                            (x, y, endX, endY) => x === 0 && y === endY,
                            (x, y, endX, endY) => y === endY,
                            (x, y, endX, endY) => x === endX - 3 || y === endY,
                            (x, y, endX, endY) => x === 0 || y === endY - 4
                        );
                    });
                generateBox(this.canvas,
                    this.convertToMapPixel(this.collisionObj.x), this.convertToMapPixel(this.collisionObj.y),
                    this.convertToMapPixel(this.collisionObj.w - toPixelSize(2)), this.convertToMapPixel(this.collisionObj.h - toPixelSize(2)),
                    toPixelSize(2), "#999a9e", (x, y, endX, endY) => {
                        return this.validateBlock(x, y, endX, endY,
                            (x, y, endX, endY) => y === 0 || x === endX,
                            (x, y, endX, endY) => y === 0,
                            (x, y, endX, endY) => x === endX && y === 0,
                            (x, y, endX, endY) => x === endX || y === 0,
                            (x, y, endX, endY) => x === endY,
                            (x, y, endX, endY) => x === endX - 4 || y === 0,
                            (x, y, endX, endY) => x === endX || y === endY - 3
                        );
                    });
                break;

            case BlockType.DOOR:
                ctx.fillStyle = "#3e3846";
                ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
                break;

            case BlockType.FLOOR:
                ctx.fillStyle = "#41663d";
                ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
                generateBox(this.canvas,
                    this.convertToMapPixel(this.collisionObj.x), this.convertToMapPixel(this.collisionObj.y),
                    this.convertToMapPixel(this.collisionObj.w - toPixelSize(2)), this.convertToMapPixel(this.collisionObj.h - toPixelSize(2)),
                    toPixelSize(2), "#52804d", () => randomNumb(100) < 5);
                break;
        }
    }

    validateBlock(x, y, endX, endY, insideFn, topLeftFn, bottomLeftFn, topRightFn, bottomRightFn, topBottomFn, leftRightFn) {
        if (this.roomX > 0 && this.roomX < GameVars.roomWidth - 1 && this.roomY > 0 && this.roomY < GameVars.roomHeight - 1) {
            return insideFn(x, y, endX, endY);
        } else if (this.roomX === 0 && this.roomY === 0) {
            return topLeftFn(x, y, endX, endY);
        } else if (this.roomX === 0 && this.roomY >= GameVars.roomHeight - 1) {
            return bottomLeftFn(x, y, endX, endY);
        } else if (this.roomX >= GameVars.roomWidth - 1 && this.roomY === 0) {
            return topRightFn(x, y, endX, endY);
        } else if (this.roomX >= GameVars.roomWidth - 1 && this.roomY >= GameVars.roomHeight - 1) {
            return bottomRightFn(x, y, endX, endY);
        } else if ((this.roomY === 0 && this.roomX > 0 && this.roomX < GameVars.roomWidth - 1) || this.roomY >= GameVars.roomHeight - 1) {
            return topBottomFn(x, y, endX, endY);
        } else {
            return leftRightFn(x, y, endX, endY);
        }
    }

    convertToMapPixel(value, amount = 2) {
        return value / toPixelSize(amount);
    }
}