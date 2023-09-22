import { SquareObject } from "../../collision-objects/square-object";
import { toPixelSize } from "../../game-variables";
import { genSmallBox } from "../../utilities/box-generator";
import { drawSprite } from "../../utilities/draw-utilities";

export class Stone {
  constructor(room, blockRoomX, blockRoomY) {
    this.room = room;
    this.elapsedTime = 0;

    this.init(
      blockRoomX * toPixelSize(16) + toPixelSize(4),
      blockRoomY * toPixelSize(16) + toPixelSize(4),
    );
  }

  init(x, y) {
    this.collisionObj = new SquareObject(x, y, toPixelSize(8), toPixelSize(8));
  }

  draw() {
    genSmallBox(
      this.room.environmentCanv,
      Math.round(this.collisionObj.x / toPixelSize(2) - 3),
      Math.round(this.collisionObj.y / toPixelSize(2) - 1),
      9,
      8,
      toPixelSize(2),
      "#00000044",
      "#00000044",
    );
    drawSprite(
      this.room.environmentCanv,
      stone,
      toPixelSize(2),
      Math.round(this.collisionObj.x / toPixelSize(2)) - 2,
      Math.round(this.collisionObj.y / toPixelSize(2)) - 2,
      { lt: "#999a9e", md: "#686b7a", dk: "#3e3846" },
    );

    // const ctx = this.room.environmentCanv.getContext('2d');
    // ctx.beginPath();
    // ctx.rect(this.collisionObj.x, this.collisionObj.y, this.collisionObj.w, this.collisionObj.h);
    // ctx.stroke();
  }
}

const stone = [
  [null, "lt", "lt", "lt", "lt", "lt", "lt", null],
  ["dk", "md", "md", "md", "md", "lt", "md", "lt"],
  ["dk", "md", "md", "md", "lt", "dk", "md", "lt"],
  ["dk", "md", "md", "lt", "dk", "md", "md", "lt"],
  ["dk", "md", "dk", "dk", "md", "md", "lt", "lt"],
  ["dk", "dk", "md", "md", "dk", "dk", "md", "lt"],
  ["dk", "md", "md", "dk", "md", "md", "md", "lt"],
  [null, "dk", "dk", "dk", "dk", "dk", "dk", null],
];
