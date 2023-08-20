import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { fullHeartColors, heart } from "./sprites";

export class LifeBar {
    constructor(life, isPlayer, parentCanv) {
        this.isPlayer = isPlayer;
        this.life = life;
        this.parentCanv = parentCanv;
        this.parentRect;

        this.lifeCanv = createElem(GameVars.gameDiv, "canvas", null, null, toPixelSize(7 * (life / 2) + (life / 2) + 3), toPixelSize(11));

        if (isPlayer) {
            this.lifeCanv.style.transform = 'translate(' + toPixelSize(12) + 'px, ' + toPixelSize(12) + 'px)';
        }
        this.update();
        this.draw();
    }

    update() {
        if (!this.isPlayer) {
            this.parentRect = this.parentCanv.getBoundingClientRect();
            this.lifeCanv.style.transform = 'translate(' +
                ((this.parentRect.x + this.parentRect.width / 2) - (this.lifeCanv.width / 2)) + 'px, ' +
                (this.parentRect.y - toPixelSize(13)) + 'px)';
        }
    }

    draw() {
        this.lifeCanv.getContext("2d").clearRect(0, 0, this.lifeCanv.width, this.lifeCanv.height);
        genSmallBox(this.lifeCanv, 0, 0, (8 * (this.life / 2)) + 2, 10, toPixelSize(1), "#00000066", "#100f0f66");
        for (let i = 0; i < this.life / 2; i++) {
            drawSprite(this.lifeCanv, heart, toPixelSize(1), 2 + (8 * i), 2, fullHeartColors);
        }
    }
}