import { BlockType } from "../enums/block-type";
import { toPixelSize } from "../game-variables";

export class Block {
    constructor(x, y, blockType, canvas) {
        this.x = x;
        this.y = y;
        this.blockType = blockType;
        this.canvas = canvas;
    }

    draw() {
        const ctx = this.canvas.getContext("2d");
        switch (this.blockType) {
            case BlockType.WALL:
                ctx.fillStyle = "#686b7a";
                break;

            case BlockType.FLOOR:
                ctx.fillStyle = "#41663d";
                break;
        }
        ctx.fillRect(this.x, this.y, toPixelSize(16), toPixelSize(16));
    }
}