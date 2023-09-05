import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { createElem, drawSprite, setElemSize } from "../utilities/draw-utilities";
import { heart } from "./sprites";

export class LifeBar {
    constructor(totalLife, isPlayer, parentCanv, currentLife) {
        this.isPlayer = isPlayer;
        this.totalLife = totalLife;
        this.life = currentLife || totalLife;
        this.parentCanv = parentCanv;
        this.parentRect;

        this.lifeBackgroundCanv = createElem(isPlayer ? GameVars.gameDiv : parentCanv, "canvas", null, ["heartB"]);
        this.lifeCanv = createElem(isPlayer ? GameVars.gameDiv : parentCanv, "canvas", null, ["heart"]);

        this.init();
    }

    init() {
        this.draw();
        this.updateLifeBar = true;
        this.update();
    }

    addLife() {
        this.life += GameVars.heartLifeVal;
        this.life = this.life > this.totalLife ? this.totalLife : this.life;
        this.draw();
        this.updateLifeBar = true;
    }

    takeDmg(amount) {
        this.life -= amount;
        this.life = this.life < 0 ? 0 : this.life;
        this.updateLifeBar = true;
    }

    update() {
        if (!this.isPlayer) {
            this.parentRect = this.parentCanv.getBoundingClientRect();
            this.lifeBackgroundCanv.style.transform = 'translate(' +
                ((this.parentRect.width / 2) - (this.lifeCanv.width / 2)) + 'px, ' +
                -toPixelSize(13) + 'px)';
            this.lifeCanv.style.transform = 'translate(' +
                ((this.parentRect.width / 2) - (this.lifeCanv.width / 2) + toPixelSize(2)) + 'px, ' +
                -toPixelSize(13) + 'px)';
        }
        if (this.updateLifeBar) {
            this.updateLifeBar = false;
            this.lifeCanv.getContext("2d").clearRect((this.life * this.lifeCanv.width) / this.totalLife, 0, this.lifeCanv.width, this.lifeCanv.height);
        }
    }

    draw() {
        setElemSize(this.lifeBackgroundCanv, toPixelSize(7 * (this.totalLife / GameVars.heartLifeVal) + (this.totalLife / GameVars.heartLifeVal) + 3), toPixelSize(11));
        setElemSize(this.lifeCanv, toPixelSize(8 * (this.totalLife / GameVars.heartLifeVal) - 1), toPixelSize(11));

        if (this.isPlayer) {
            this.lifeBackgroundCanv.style.transform = 'translate(' + toPixelSize(12) + 'px, ' + toPixelSize(24) + 'px)';
            this.lifeCanv.style.transform = 'translate(' + toPixelSize(14) + 'px, ' + toPixelSize(24) + 'px)';
        }

        this.lifeBackgroundCanv.getContext("2d").clearRect(0, 0, this.lifeBackgroundCanv.width, this.lifeBackgroundCanv.height);
        this.lifeCanv.getContext("2d").clearRect(0, 0, this.lifeCanv.width, this.lifeCanv.height);

        genSmallBox(this.lifeBackgroundCanv, 0, 0, (8 * (this.totalLife / GameVars.heartLifeVal)) + 2, 10, toPixelSize(1), "#00000066", "#100f0f66");
        
        for (let i = 0; i < this.totalLife / GameVars.heartLifeVal; i++) {
            drawSprite(this.lifeBackgroundCanv, heart, toPixelSize(1), 2 + (8 * i), 2, { "ho": "#2f1519", "hi": "#100f0f" });
            drawSprite(this.lifeCanv, heart, toPixelSize(1), (8 * i), 2, { "ho": "#edeef7", "hi": "#a80000" });
        }
    }
}