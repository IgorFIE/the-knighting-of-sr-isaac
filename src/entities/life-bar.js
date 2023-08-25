import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { emptyHeartColors, fullHeartColors, heart } from "./sprites";

export class LifeBar {
    constructor(totalLife, isPlayer, parentCanv, currentLife) {
        this.tookDmg = false;
        this.isPlayer = isPlayer;
        this.totalLife = totalLife;
        this.life = currentLife || totalLife;
        this.parentCanv = parentCanv;
        this.parentRect;

        this.lifeBackgroundCanv = createElem(isPlayer ? GameVars.gameDiv : parentCanv, "canvas", null, ["heartB"], toPixelSize(7 * (this.totalLife / GameVars.heartLifeVal) + (this.totalLife / GameVars.heartLifeVal) + 3), toPixelSize(11));
        this.lifeCanv = createElem(isPlayer ? GameVars.gameDiv : parentCanv, "canvas", null, ["heart"], toPixelSize(7 * (this.totalLife / GameVars.heartLifeVal) + (this.totalLife / GameVars.heartLifeVal) + 3), toPixelSize(11));

        if (isPlayer) {
            this.lifeBackgroundCanv.style.transform = 'translate(' + toPixelSize(12) + 'px, ' + toPixelSize(12) + 'px)';
            this.lifeCanv.style.transform = 'translate(' + toPixelSize(12) + 'px, ' + toPixelSize(12) + 'px)';
        }
        this.update();
        this.draw();
    }

    takeDmg(amount) {
        this.life -= amount;
        this.life = this.life < 0 ? 0 : this.life;
        this.tookDmg = true;
    }

    update() {
        if (!this.isPlayer) {
            this.parentRect = this.parentCanv.getBoundingClientRect();
            this.lifeBackgroundCanv.style.transform = 'translate(' +
                ((this.parentRect.width / 2) - (this.lifeCanv.width / 2)) + 'px, ' +
                -toPixelSize(13) + 'px)';
            this.lifeCanv.style.transform = 'translate(' +
                ((this.parentRect.width / 2) - (this.lifeCanv.width / 2)) + 'px, ' +
                -toPixelSize(13) + 'px)';
        }
        this.lifeCanv.getContext("2d").clearRect((this.life * this.lifeCanv.width) / this.totalLife, 0, this.lifeCanv.width, this.lifeCanv.height);
        this.tookDmg = false;
    }

    draw() {
        this.lifeBackgroundCanv.getContext("2d").clearRect(0, 0, this.lifeBackgroundCanv.width, this.lifeBackgroundCanv.height);
        genSmallBox(this.lifeBackgroundCanv, 0, 0, (8 * (this.totalLife / GameVars.heartLifeVal)) + 2, 10, toPixelSize(1), "#00000066", "#100f0f66");
        for (let i = 0; i < this.totalLife / GameVars.heartLifeVal; i++) {
            drawSprite(this.lifeBackgroundCanv, heart, toPixelSize(1), 2 + (8 * i), 2, emptyHeartColors);
        }

        this.lifeCanv.getContext("2d").clearRect(0, 0, this.lifeCanv.width, this.lifeCanv.height);
        for (let i = 0; i < this.totalLife / GameVars.heartLifeVal; i++) {
            drawSprite(this.lifeCanv, heart, toPixelSize(1), 2 + (8 * i), 2, fullHeartColors);
        }
    }
}