import { Block } from "./block";

export class DoorTrigger extends Block {
  constructor(room, x, y, blockType, xDir, yDir) {
    super(room, x, y, blockType);
    this.xDir = xDir;
    this.yDir = yDir;
  }
}
