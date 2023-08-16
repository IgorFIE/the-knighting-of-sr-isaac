import { GameVars, toPixelSize } from "../game-variables";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { fist, greatsword, shortSword } from "./sprites";

export class Weapon {
    constructor(x, y, weaponType) {
        this.weaponType = weaponType;
        this.x = x;
        this.y = y;

        this.weaponCanv = createElem(GameVars.gameDiv, "canvas", null, null, greatsword[0].length * toPixelSize(2), greatsword.length * toPixelSize(2));

        this.update(x, y);
        this.draw();
    }

    update(x, y) {
        this.weaponCanv.style.transform = 'translate(' + (x + toPixelSize(3)) + 'px, ' + (y - toPixelSize(3)) + 'px) rotate(45deg)';
    }

    draw() {
        drawSprite(this.weaponCanv, greatsword, toPixelSize(2));
    }
}