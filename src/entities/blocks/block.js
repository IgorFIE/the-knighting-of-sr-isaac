import { SquareObject } from "../../collision-objects/square-object";
import { BlockType } from "../../enums/block-type";
import { DoorType } from "../../enums/door-type";
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
        this.doorType = DoorType.NORMAL;
    }

    draw() {
        const doorCtx = this.room.doorCanv.getContext("2d");
        switch (this.blockType) {
            case BlockType.WALL:
                const blockColors = getBlockColors();
                const roomCtx = this.room.roomCanv.getContext("2d");
                roomCtx.fillStyle = blockColors.md;
                roomCtx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
                generateBox(this.room.roomCanv,
                    convertToMapPixel(this.collisionObj.x), convertToMapPixel(this.collisionObj.y),
                    convertToMapPixel(this.collisionObj.w - toPixelSize(2)), convertToMapPixel(this.collisionObj.h - toPixelSize(2)),
                    toPixelSize(2), blockColors.dk, (x, y, endX, endY) => {
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
                    convertToMapPixel(this.collisionObj.x), convertToMapPixel(this.collisionObj.y),
                    convertToMapPixel(this.collisionObj.w - toPixelSize(2)), convertToMapPixel(this.collisionObj.h - toPixelSize(2)),
                    toPixelSize(2), blockColors.lt, (x, y, endX, endY) => {
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

            case BlockType.DOOR_CLOSE:
                const doorColors = this.doorType === DoorType.TREASURE ? { "lt": "#ffff57", "md": "#cd9722", "dk": "#9e6800" } :
                    this.doorType === DoorType.BOSS ? { "lt": "#703a33", "md": "#641f14", "dk": "#431313" } :
                        { "lt": "#865433", "md": "#843d0d", "dk": "#2f1519" };
                this.createDoor(doorCtx, () => {
                    doorCtx.fillStyle = doorColors.md;
                    doorCtx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
                    generateBox(this.room.doorCanv,
                        convertToMapPixel(this.collisionObj.x), convertToMapPixel(this.collisionObj.y),
                        convertToMapPixel(this.collisionObj.w - toPixelSize(2)), convertToMapPixel(this.collisionObj.h - toPixelSize(2)),
                        toPixelSize(2), doorColors.lt, (x, y, endX, endY) => {
                            return (y === 0 && this.blockRoomY !== 1 && this.blockRoomY < Math.round(GameVars.roomHeight) - 1) || // Top lines
                                (x === endX && this.blockRoomX > 0 && this.blockRoomX !== Math.round(GameVars.roomWidth) - 2) || // right Lines
                                (y < 3 && this.blockRoomY === 0) || // topDoorFrame
                                (x > endX - 3 && this.blockRoomX === Math.round(GameVars.roomWidth) - 1)
                                ;
                        });
                    generateBox(this.room.doorCanv,
                        convertToMapPixel(this.collisionObj.x), convertToMapPixel(this.collisionObj.y),
                        convertToMapPixel(this.collisionObj.w - toPixelSize(2)), convertToMapPixel(this.collisionObj.h - toPixelSize(2)),
                        toPixelSize(2), doorColors.dk, (x, y, endX, endY) => {
                            return (y === endY && this.blockRoomY > 0 && this.blockRoomY !== Math.round(GameVars.roomHeight) - 2) || //Bottom lines
                                (x === 0 && ((this.blockRoomX === 0 || this.blockRoomX === Math.round(GameVars.roomWidth) - 2) ||
                                    (this.blockRoomX > 1 && this.blockRoomX < Math.round(GameVars.roomWidth) - 2))) || // left lines
                                (y < 2 && this.blockRoomY === 0) || // top door frame
                                (y > endY - 2 && this.blockRoomY === Math.round(GameVars.roomHeight) - 1) || // bottom door frame
                                (x < 2 && this.blockRoomX === 0) || // left door frame
                                (x > endX - 2 && this.blockRoomX === Math.round(GameVars.roomWidth) - 1) // right door frame
                                ;
                        });
                    if (this.blockRoomY < 3 || this.blockRoomY > Math.round(GameVars.roomHeight) - 3) {
                        this.createDoorFrame(doorCtx, this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(8));
                    } else {
                        this.createDoorFrame(doorCtx, this.collisionObj.x + toPixelSize(8), this.collisionObj.y, toPixelSize(8), toPixelSize(16));
                    }

                    if (this.doorType === DoorType.TREASURE) {
                        if ((this.blockRoomX === 1 && this.room.backBlocks[this.blockRoomY - 1][this.blockRoomX].blockType == BlockType.FLOOR && this.room.backBlocks[this.blockRoomY + 1][this.blockRoomX].blockType == BlockType.FLOOR) ||
                            (this.blockRoomX === Math.round(GameVars.roomWidth) - 1 && this.room.backBlocks[this.blockRoomY - 2][this.blockRoomX].blockType == BlockType.FLOOR && this.room.backBlocks[this.blockRoomY + 2][this.blockRoomX].blockType == BlockType.FLOOR)) {
                            this.createKeyHole(doorCtx, this.collisionObj.x, this.collisionObj.y + toPixelSize(4));
                        }
                        if ((this.blockRoomY === 0 && this.room.backBlocks[this.blockRoomY][this.blockRoomX - 2].blockType == BlockType.FLOOR && this.room.backBlocks[this.blockRoomY][this.blockRoomX + 2].blockType == BlockType.FLOOR) ||
                            (this.blockRoomY === Math.round(GameVars.roomHeight) - 2 && this.room.backBlocks[this.blockRoomY][this.blockRoomX - 1].blockType == BlockType.FLOOR && this.room.backBlocks[this.blockRoomY][this.blockRoomX + 1].blockType == BlockType.FLOOR)) {
                            this.createKeyHole(doorCtx, this.collisionObj.x + toPixelSize(6), this.collisionObj.y + toPixelSize(10));
                        }
                    }
                });
                break;

            case BlockType.DOOR_OPEN:
                this.createDoor(doorCtx);
                break;

            case BlockType.FLOOR:
                createFloorBlock(this.room.roomCanv, this.collisionObj.x, this.collisionObj.y);
                break;
        }
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

    createDoor(ctx, elseFn) {
        if ((this.blockRoomX === this.room.backBlocks[0].length - 1 || this.blockRoomX === 0) &&
            this.blockRoomY - 1 > 0 && this.room.backBlocks[this.blockRoomY - 1][this.blockRoomX].blockType == BlockType.WALL) {
            createWallBlock(ctx, this.collisionObj.x, this.collisionObj.y - toPixelSize(8));
            this.createDoorFrame(ctx, this.collisionObj.x, this.collisionObj.y + toPixelSize(8), toPixelSize(16), toPixelSize(8));
        } else if ((this.blockRoomX === this.room.backBlocks[0].length - 1 || this.blockRoomX === 0) &&
            this.blockRoomY + 1 < this.room.backBlocks.length && this.room.backBlocks[this.blockRoomY + 1][this.blockRoomX].blockType == BlockType.WALL) {
            createWallBlock(ctx, this.collisionObj.x, this.collisionObj.y + toPixelSize(8));
            this.createDoorFrame(ctx, this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(8));
        } else if ((this.blockRoomY === this.room.backBlocks.length - 1 || this.blockRoomY === 0) &&
            this.blockRoomX - 1 > 0 && this.room.backBlocks[this.blockRoomY][this.blockRoomX - 1].blockType == BlockType.WALL) {
            createWallBlock(ctx, this.collisionObj.x - toPixelSize(8), this.collisionObj.y);
            this.createDoorFrame(ctx, this.collisionObj.x + toPixelSize(8), this.collisionObj.y, toPixelSize(8), toPixelSize(16));
        } else if ((this.blockRoomY === this.room.backBlocks.length - 1 || this.blockRoomY === 0) &&
            this.blockRoomX + 1 < this.room.backBlocks[0].length && this.room.backBlocks[this.blockRoomY][this.blockRoomX + 1].blockType == BlockType.WALL) {
            createWallBlock(ctx, this.collisionObj.x + toPixelSize(8), this.collisionObj.y);
            this.createDoorFrame(ctx, this.collisionObj.x, this.collisionObj.y, toPixelSize(8), toPixelSize(16));
        } else {
            if (elseFn) elseFn();
        }
    }

    createDoorFrame(ctx, x, y, w, h) {
        ctx.fillStyle = "#843d0d";
        ctx.fillRect(x, y, w, h);

        ctx.fillStyle = "#865433";
        ctx.fillRect(x, y, w, toPixelSize(2));
        ctx.fillRect(x + w - toPixelSize(2), y, toPixelSize(2), h);

        ctx.fillStyle = "#2f1519";
        ctx.fillRect(x + toPixelSize(w / toPixelSize(2)), y + toPixelSize((h / toPixelSize(2)) - 2), toPixelSize(2), toPixelSize(2));
        ctx.fillRect(x, y + h - toPixelSize(2), w, toPixelSize(2));
        ctx.fillRect(x, y, toPixelSize(2), h);
    }

    createKeyHole(ctx, x, y) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(x, y, toPixelSize(6), toPixelSize(6));

        ctx.fillStyle = "#3e3846";
        ctx.fillRect(x, y + toPixelSize(6), toPixelSize(6), toPixelSize(2));
        ctx.fillRect(x - toPixelSize(2), y, toPixelSize(2), toPixelSize(6));

        ctx.fillStyle = "#999a9e";
        ctx.fillRect(x, y - toPixelSize(2), toPixelSize(6), toPixelSize(2));
        ctx.fillRect(x + toPixelSize(6), y, toPixelSize(2), toPixelSize(6));
    }

    convertToMapPixel(value, amount = 2) {
        return value / toPixelSize(amount);
    }
}

const getBlockColors = () => {
    return GameVars.gameLevel < 3 ? { "lt": "#999a9e", "md": "#686b7a", "dk": "#3e3846" } :
        GameVars.gameLevel < 5 ? { "lt": "#703a33", "md": "#38252e", "dk": "#1b1116" } :
            { "lt": "#431313", "md": "#2f1519", "dk": "#100f0f" };
};

export const createWallBlock = (ctx, x, y) => {
    const blockColors = getBlockColors();
    ctx.fillStyle = blockColors.md;
    ctx.fillRect(x, y, toPixelSize(16), toPixelSize(16));

    ctx.fillStyle = blockColors.dk;
    ctx.fillRect(x, y + toPixelSize(14), toPixelSize(16), toPixelSize(2));
    ctx.fillRect(x, y, toPixelSize(2), toPixelSize(16));

    ctx.fillStyle = blockColors.lt;
    ctx.fillRect(x, y, toPixelSize(16), toPixelSize(2));
    ctx.fillRect(x + toPixelSize(14), y, toPixelSize(2), toPixelSize(16));
};

export const createFloorBlock = (canvas, x, y) => {
    const floorColors = GameVars.gameLevel < 3 ? { "lt": "#52804d", "md": "#41663d" } :
        GameVars.gameLevel < 5 ? { "lt": "#41663d", "md": "#2f492c" } :
            { "lt": "#703a33", "md": "#38252e" };
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = floorColors.md;
    ctx.fillRect(x, y, toPixelSize(16), toPixelSize(16));
    generateBox(canvas,
        convertToMapPixel(x), convertToMapPixel(y),
        convertToMapPixel(toPixelSize(14)), convertToMapPixel(toPixelSize(14)),
        toPixelSize(2), floorColors.lt, () => randomNumb(100) < 5);
};

const convertToMapPixel = (value, amount = 2) => {
    return value / toPixelSize(amount);
};