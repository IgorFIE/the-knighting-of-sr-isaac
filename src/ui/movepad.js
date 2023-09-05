import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { createElem, setElemSize } from "../utilities/draw-utilities";
import { convertTextToPixelArt, drawPixelTextInCanvas } from "../utilities/text";

export class MovePad {
    constructor() {
        this.movePadCanv = createElem(GameVars.gameDiv, "canvas", null, null, null, null, GameVars.isMobile, null,
            (e) => {
                const canvBox = this.movePadCanv.getBoundingClientRect();
                const touch = e.changedTouches[0];

                const xAmount = ((touch.pageX - canvBox.x) - (this.movePadCanv.width / 2)) / (this.movePadCanv.width / 2);
                const yAmount = ((touch.pageY - canvBox.y) - (this.movePadCanv.height / 2)) / (this.movePadCanv.height / 2);

                const xFinalValue = (Math.abs(xAmount) >= 0.2 ? 1 : 0) * xAmount < 0 ? -1 : 1;
                const yFinalValue = (Math.abs(yAmount) >= 0.2 ? 1 : 0) * yAmount < 0 ? -1 : 1;

                let needsRedraw = GameVars.keys["w"] !== yFinalValue < 0 ||
                    GameVars.keys["s"] !== yFinalValue > 0 ||
                    GameVars.keys["a"] !== xFinalValue < 0 ||
                    GameVars.keys["d"] !== xFinalValue > 0;

                GameVars.keys["w"] = yFinalValue < 0;
                GameVars.keys["s"] = yFinalValue > 0;
                GameVars.keys["a"] = xFinalValue < 0;
                GameVars.keys["d"] = xFinalValue > 0;

                needsRedraw && this.update();
            },
            (e) => {
                GameVars.keys["w"] = false;
                GameVars.keys["s"] = false;
                GameVars.keys["a"] = false;
                GameVars.keys["d"] = false;
                this.update();
            }
        );
        this.update();
    }

    update() {
        setElemSize(this.movePadCanv, toPixelSize(64), toPixelSize(64));
        this.movePadCanv.style.translate = toPixelSize(12) + 'px ' + (GameVars.gameH - this.movePadCanv.height - toPixelSize(12)) + 'px';

        this.movePadCanv.getContext("2d").clearRect(0, 0, this.movePadCanv.width, this.movePadCanv.height);

        genSmallBox(this.movePadCanv, 13, 13, 6, 6, toPixelSize(2), "#ffff57", "#100f0f66");

        genSmallBox(this.movePadCanv, 11, 1, 10, 10, toPixelSize(2), GameVars.keys["w"] ? "#ffffffaa" : "#00000066", GameVars.keys["w"] ? "#ffffff66" : "#100f0f66");
        drawPixelTextInCanvas(convertTextToPixelArt('^'), this.movePadCanv, toPixelSize(3), 11, 4, "#edeef7", 1);

        genSmallBox(this.movePadCanv, 1, 11, 10, 10, toPixelSize(2), GameVars.keys["a"] ? "#ffffffaa" : "#00000066", GameVars.keys["a"] ? "#ffffff66" : "#100f0f66");
        drawPixelTextInCanvas(convertTextToPixelArt('<'), this.movePadCanv, toPixelSize(3), 4, 11, "#edeef7", 1);

        genSmallBox(this.movePadCanv, 21, 11, 10, 10, toPixelSize(2), GameVars.keys["d"] ? "#ffffffaa" : "#00000066", GameVars.keys["d"] ? "#ffffff66" : "#100f0f66");
        drawPixelTextInCanvas(convertTextToPixelArt('>'), this.movePadCanv, toPixelSize(3), 18, 11, "#edeef7", 1);

        genSmallBox(this.movePadCanv, 11, 21, 10, 10, toPixelSize(2), GameVars.keys["s"] ? "#ffffffaa" : "#00000066", GameVars.keys["s"] ? "#ffffff66" : "#100f0f66");
        drawPixelTextInCanvas(convertTextToPixelArt('~'), this.movePadCanv, toPixelSize(3), 11, 18, "#edeef7", 1);
    }
}