import { SquareObject } from "../../collision-objects/square-object";
import { BlockType } from "../../enums/block-type";
import { GameVars, toPixelSize } from "../../game-variables";
import { generateBox } from "../../utilities/box-generator";
import { randomNumb } from "../../utilities/general-utilities";

export class Block {
    constructor(room, blockRoomX, blockRoomY, blockType) {
        this.room = room;
        this.blockRoomX = blockRoomX;
        this.blockRoomY = blockRoomY;
        this.collisionObj = new SquareObject(blockRoomX * toPixelSize(16), blockRoomY * toPixelSize(16), toPixelSize(16), toPixelSize(16));
        this.blockType = blockType;
    }

    draw() {
        const ctx = this.room.roomCanv.getContext("2d");
        switch (this.blockType) {
            case BlockType.WALL:
                ctx.fillStyle = "#686b7a";
                ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
                generateBox(this.room.roomCanv,
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
                generateBox(this.room.roomCanv,
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

            case BlockType.DOOR_OPEN:
                if ((this.blockRoomX === this.room.backBlocks[0].length - 1 || this.blockRoomX === 0) &&
                    this.blockRoomY - 1 > 0 && this.room.backBlocks[this.blockRoomY - 1][this.blockRoomX].blockType == BlockType.WALL) {
                    this.createWallBlock(ctx, this.collisionObj.x, this.collisionObj.y - toPixelSize(8));
                } else if ((this.blockRoomX === this.room.backBlocks[0].length - 1 || this.blockRoomX === 0) &&
                    this.blockRoomY + 1 < this.room.backBlocks.length && this.room.backBlocks[this.blockRoomY + 1][this.blockRoomX].blockType == BlockType.WALL) {
                    this.createWallBlock(ctx, this.collisionObj.x, this.collisionObj.y + toPixelSize(8));
                } else if ((this.blockRoomY === this.room.backBlocks.length - 1 || this.blockRoomY === 0) &&
                    this.blockRoomX - 1 > 0 && this.room.backBlocks[this.blockRoomY][this.blockRoomX - 1].blockType == BlockType.WALL) {
                    this.createWallBlock(ctx, this.collisionObj.x - toPixelSize(8), this.collisionObj.y);
                } else if ((this.blockRoomY === this.room.backBlocks.length - 1 || this.blockRoomY === 0) &&
                    this.blockRoomX + 1 < this.room.backBlocks[0].length && this.room.backBlocks[this.blockRoomY][this.blockRoomX + 1].blockType == BlockType.WALL) {
                    this.createWallBlock(ctx, this.collisionObj.x + toPixelSize(8), this.collisionObj.y);
                }
                break;

            case BlockType.DOOR_CLOSE:
                ctx.fillStyle = "#3e3846";
                ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
                break;

            case BlockType.FLOOR:
                ctx.fillStyle = "#41663d";
                ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
                generateBox(this.room.roomCanv,
                    this.convertToMapPixel(this.collisionObj.x), this.convertToMapPixel(this.collisionObj.y),
                    this.convertToMapPixel(this.collisionObj.w - toPixelSize(2)), this.convertToMapPixel(this.collisionObj.h - toPixelSize(2)),
                    toPixelSize(2), "#52804d", () => randomNumb(100) < 5);
                break;
        }
    }

    createWallBlock(ctx, x, y) {
        ctx.fillStyle = "#686b7a";
        ctx.fillRect(x, y, toPixelSize(16), toPixelSize(16));
        ctx.fillStyle = "#3e3846";
        ctx.fillRect(x, y + toPixelSize(14), toPixelSize(16), toPixelSize(2));
        ctx.fillRect(x, y, toPixelSize(2), toPixelSize(16));
        ctx.fillStyle = "#999a9e";
        ctx.fillRect(x, y, toPixelSize(16), toPixelSize(2));
        ctx.fillRect(x + toPixelSize(14), y, toPixelSize(2), toPixelSize(16));
    }

    validateBlock(x, y, endX, endY, insideFn, topLeftFn, bottomLeftFn, topRightFn, bottomRightFn, topBottomFn, leftRightFn) {
        if (this.blockRoomX > 0 && this.blockRoomX < GameVars.roomWidth - 1 && this.blockRoomY > 0 && this.blockRoomY < GameVars.roomHeight - 1) {
            return insideFn(x, y, endX, endY);
        } else if (this.blockRoomX === 0 && this.blockRoomY === 0) {
            return topLeftFn(x, y, endX, endY);
        } else if (this.blockRoomX === 0 && this.blockRoomY >= GameVars.roomHeight - 1) {
            return bottomLeftFn(x, y, endX, endY);
        } else if (this.blockRoomX >= GameVars.roomWidth - 1 && this.blockRoomY === 0) {
            return topRightFn(x, y, endX, endY);
        } else if (this.blockRoomX >= GameVars.roomWidth - 1 && this.blockRoomY >= GameVars.roomHeight - 1) {
            return bottomRightFn(x, y, endX, endY);
        } else if ((this.blockRoomY === 0 && this.blockRoomX > 0 && this.blockRoomX < GameVars.roomWidth - 1) || this.blockRoomY >= GameVars.roomHeight - 1) {
            return topBottomFn(x, y, endX, endY);
        } else {
            return leftRightFn(x, y, endX, endY);
        }
    }

    convertToMapPixel(value, amount = 2) {
        return value / toPixelSize(amount);
    }
}