import { SquareObject } from "../../collision-objects/square-object";
import { BlockType } from "../../enums/block-type";
import { toPixelSize } from "../../game-variables";
import { genetateInsideBoxColor } from "../../utilities/box-generator";

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
                ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
                break;

            case BlockType.DOOR:
                ctx.fillStyle = "#3e3846";
                ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
                break;

            case BlockType.FLOOR:
                ctx.fillStyle = "#41663d";
                // genetateInsideBoxColor(this.canvas, this.collisionObj.x / toPixelSize(2), this.collisionObj.y / toPixelSize(2), this.collisionObj.w / toPixelSize(2), this.collisionObj.h / toPixelSize(2), toPixelSize(2), "#41663d");
                ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(16), toPixelSize(16));
                break;
        }
    }
}