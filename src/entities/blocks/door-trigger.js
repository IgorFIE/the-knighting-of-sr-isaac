import { Block } from "./block";

export class DoorTrigger extends Block {
    constructor(x, y, blockType, canvas, xDir, yDir) {
        super(x, y, blockType, canvas);
        this.xDir = xDir;
        this.yDir = yDir;
    }
}