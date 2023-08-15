import { BlockType } from "../enums/block-type";

export class Block {
    constructor(x, y, blockType) {
        this.x = x;
        this.y = y;
        this.blockType = blockType;
    }

    draw() {
        // todo based on the blocktype draw in x, y the sprite
    }
}