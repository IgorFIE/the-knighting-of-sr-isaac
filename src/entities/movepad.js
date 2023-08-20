import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { createElem } from "../utilities/draw-utilities";

export class MovePad {
    // constructor() {
    //     this.movePadCanv = createElem(GameVars.gameDiv, "canvas", null, null, toPixelSize(66), toPixelSize(66), null,
    //         (e) => GameVars.keys["b"] = true,
    //         (e) => GameVars.keys["b"] = false
    //     );
    //     this.movePadCanv.style.transform = 'translate(' + toPixelSize(12) + 'px, ' + (GameVars.gameH - this.movePadCanv.height - toPixelSize(12)) + 'px)';
    //     this.draw();
    // }

    // draw() {
    //     // genSmallBox(this.movePadCanv, 0, 0, 60, 60, toPixelSize(2), "#00000066", "#100f0f66");

    //     genSmallBox(this.movePadCanv, 13, 13, 6, 6, toPixelSize(2), "#00000066", "#100f0f66");

    //     genSmallBox(this.movePadCanv, 11, 1, 10, 10, toPixelSize(2), "#00000066", "#100f0f66");
    //     genSmallBox(this.movePadCanv, 1, 11, 10, 10, toPixelSize(2), "#00000066", "#100f0f66");
    //     genSmallBox(this.movePadCanv, 21, 11, 10, 10, toPixelSize(2), "#00000066", "#100f0f66");
    //     genSmallBox(this.movePadCanv, 11, 21, 10, 10, toPixelSize(2), "#00000066", "#100f0f66");
    // }

    constructor() {
        this.movePadDiv = createElem(GameVars.gameDiv, "div");
        this.createBtn(20, 40, "w");
        this.createBtn(20, 0, "s");
        this.createBtn(0, 20, "a");
        this.createBtn(40, 20, "d");
    }

    createBtn(xPos, yPos, key) {
        let movePadCanv = createElem(this.movePadDiv, "canvas", null, null, toPixelSize(22), toPixelSize(22), null,
            (e) => GameVars.keys[key] = true,
            (e) => GameVars.keys[key] = false
        );
        genSmallBox(movePadCanv, 0, 0, 10, 10, toPixelSize(2), "#00000066", "#100f0f66");
        movePadCanv.style.transform = 'translate(' + toPixelSize(12 + xPos) + 'px, ' + (GameVars.gameH - movePadCanv.height - toPixelSize(12 + yPos)) + 'px)';
    }

    draw() {
        // genSmallBox(this.movePadCanv, 0, 0, 60, 60, toPixelSize(2), "#00000066", "#100f0f66");

        genSmallBox(this.movePadCanv, 13, 13, 6, 6, toPixelSize(2), "#00000066", "#100f0f66");

        genSmallBox(this.movePadCanv, 11, 1, 10, 10, toPixelSize(2), "#00000066", "#100f0f66");
        genSmallBox(this.movePadCanv, 1, 11, 10, 10, toPixelSize(2), "#00000066", "#100f0f66");
        genSmallBox(this.movePadCanv, 21, 11, 10, 10, toPixelSize(2), "#00000066", "#100f0f66");
        genSmallBox(this.movePadCanv, 11, 21, 10, 10, toPixelSize(2), "#00000066", "#100f0f66");
    }
}