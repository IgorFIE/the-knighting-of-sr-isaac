import { GameVars, toPixelSize } from "../game-variables";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { fist, greatsword, shortSword } from "./sprites";

export class Weapon {
    constructor(x, y, weaponType) {
        this.weaponType = weaponType;
        this.x = x;
        this.y = y;

        this.weaponDiv = createElem(GameVars.gameDiv, "div");
        this.weaponCanv = createElem(this.weaponDiv, "canvas", null, null, greatsword[0].length * toPixelSize(3), greatsword.length * toPixelSize(3));

        this.update(x, y);
        this.draw();
    }

    update(x, y) {
        this.weaponCanv.style.transform = 'translate(' + (x + toPixelSize(1)) + 'px, ' + (y - toPixelSize(31)) + 'px) rotate(45deg)';
    }

    draw() {
        drawSprite(this.weaponCanv, greatsword, toPixelSize(3));
    }
}