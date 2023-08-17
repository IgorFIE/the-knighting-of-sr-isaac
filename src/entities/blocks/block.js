import { SquareObject } from "../../collision-objects/square-object";
import { BlockType } from "../../enums/block-type";
import { toPixelSize } from "../../game-variables";

export class Block {
    constructor(x, y, blockType, canvas) {
        this.collisionObj = new SquareObject(x, y, toPixelSize(16), toPixelSize(16));
        this.blockType = blockType;
        this.canvas = canvas;
    }

    draw() {
        const ctx = this.canvas.getContext("2d");
        switch (this.blockType) {
            case BlockType.WALL:
                ctx.fillStyle = "#686b7a";
                break;

            case BlockType.DOOR:
                ctx.fillStyle = "#3e3846";
                break;

            case BlockType.FLOOR:
                ctx.fillStyle = "#41663d";
                break;
        }
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
    }
}