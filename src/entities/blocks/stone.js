import { SquareObject } from "../../collision-objects/square-object";
import { toPixelSize } from "../../game-variables";
import { genSmallBox } from "../../utilities/box-generator";
import { drawSprite } from "../../utilities/draw-utilities";

export class Stone {
    constructor(room, blockRoomX, blockRoomY) {
        this.room = room;
        this.elapsedTime = 0;

        this.init((blockRoomX * toPixelSize(16)), (blockRoomY * toPixelSize(16)));
    }

    init(x, y) {
        this.collisionObj = new SquareObject(x, y, toPixelSize(16), toPixelSize(16));
    }

    draw() {
        genSmallBox(this.room.environmentCanv,
            Math.round(this.collisionObj.x / toPixelSize(2) - 1),
            Math.round(this.collisionObj.y / toPixelSize(2) + 1),
            9, 8, toPixelSize(2), "#00000044", "#00000044");
        drawSprite(this.room.environmentCanv, stone, toPixelSize(2),
            Math.round(this.collisionObj.x / toPixelSize(2)),
            Math.round(this.collisionObj.y / toPixelSize(2)));
    }
}

const stone = [
    [null, "#999a9e", "#999a9e", "#999a9e", "#999a9e", "#999a9e", "#999a9e", null],
    ["#3e3846", "#686b7a", "#686b7a", "#686b7a", "#686b7a", "#999a9e", "#686b7a", "#999a9e"],
    ["#3e3846", "#686b7a", "#686b7a", "#686b7a", "#999a9e", "#3e3846", "#686b7a", "#999a9e"],
    ["#3e3846", "#686b7a", "#686b7a", "#999a9e", "#3e3846", "#686b7a", "#686b7a", "#999a9e"],
    ["#3e3846", "#686b7a", "#3e3846", "#3e3846", "#686b7a", "#686b7a", "#999a9e", "#999a9e"],
    ["#3e3846", "#3e3846", "#686b7a", "#686b7a", "#3e3846", "#3e3846", "#686b7a", "#999a9e"],
    ["#3e3846", "#686b7a", "#686b7a", "#3e3846", "#686b7a", "#686b7a", "#686b7a", "#999a9e"],
    [null, "#3e3846", "#3e3846", "#3e3846", "#3e3846", "#3e3846", "#3e3846", null],
];