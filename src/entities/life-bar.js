import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { emptyHeartColors, fullHeartColors, heart } from "./sprites";

export class LifeBar {
    constructor(life, isPlayer, parentCanv) {
        this.isPlayer = isPlayer;
        this.totalLife = life;
        this.life = life;
        this.parentCanv = parentCanv;
        this.parentRect;

        this.lifeBackgroundCanv = createElem(GameVars.gameDiv, "canvas", null, null, toPixelSize(7 * (this.totalLife / 8) + (this.totalLife / 2) + 3), toPixelSize(11));
        this.lifeCanv = createElem(GameVars.gameDiv, "canvas", null, null, toPixelSize(7 * (this.totalLife / 8) + (this.totalLife / 8) + 3), toPixelSize(11));
        // this.lifeCanv = createElem(GameVars.gameDiv, "canvas", null, null, toPixelSize(7 * (life / 2) + (life / 2) + 3), toPixelSize(7));

        if (isPlayer) {
            this.lifeBackgroundCanv.style.transform = 'translate(' + toPixelSize(12) + 'px, ' + toPixelSize(12) + 'px)';
            this.lifeCanv.style.transform = 'translate(' + toPixelSize(12) + 'px, ' + toPixelSize(12) + 'px)';
        }
        this.update();
        this.draw();
    }

    update() {
        if (!this.isPlayer) {
            this.parentRect = this.parentCanv.getBoundingClientRect();
            this.lifeBackgroundCanv.style.transform = 'translate(' +
                ((this.parentRect.x + this.parentRect.width / 2) - (this.lifeCanv.width / 2)) + 'px, ' +
                (this.parentRect.y - toPixelSize(13)) + 'px)';
            this.lifeCanv.style.transform = 'translate(' +
                ((this.parentRect.x + this.parentRect.width / 2) - (this.lifeCanv.width / 2)) + 'px, ' +
                (this.parentRect.y - toPixelSize(13)) + 'px)';

            // this.lifeCanv.style.transform = 'translate(' +
            //     ((this.parentRect.x + this.parentRect.width / 2) - (this.lifeCanv.width / 2)) + 'px, ' +
            //     (this.parentRect.y - toPixelSize(9)) + 'px)';
        }

        this.lifeCanv.getContext("2d").clearRect((this.life * this.lifeCanv.width) / this.totalLife, 0, this.lifeCanv.width, this.lifeCanv.height);
    }

    draw() {
        this.lifeBackgroundCanv.getContext("2d").clearRect(0, 0, this.lifeBackgroundCanv.width, this.lifeBackgroundCanv.height);
        genSmallBox(this.lifeBackgroundCanv, 0, 0, (8 * (this.totalLife / 8)) + 2, 10, toPixelSize(1), "#00000066", "#100f0f66");
        for (let i = 0; i < this.totalLife / 8; i++) {
            drawSprite(this.lifeBackgroundCanv, heart, toPixelSize(1), 2 + (8 * i), 2, emptyHeartColors);
        }

        this.lifeCanv.getContext("2d").clearRect(0, 0, this.lifeCanv.width, this.lifeCanv.height);
        for (let i = 0; i < this.totalLife / 8; i++) {
            drawSprite(this.lifeCanv, heart, toPixelSize(1), 2 + (8 * i), 2, fullHeartColors);
        }

        // this.lifeCanv.getContext("2d").clearRect(0, 0, this.lifeCanv.width, this.lifeCanv.height);
        // genSmallBox(this.lifeCanv, 0, 0, (8 * (this.life / 2)) + 2, 6, toPixelSize(1), "#00000066", "#100f0f66");
        // genSmallBox(this.lifeCanv, 1, 1, (8 * (this.life / 2)), 4, toPixelSize(1), "#edeef7", "#a80000");
    }
}