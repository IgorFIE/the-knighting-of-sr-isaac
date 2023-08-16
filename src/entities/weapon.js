import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { fist, getWeaponSprite, greatsword, shortSword } from "./sprites";

export class Weapon {
    constructor(x, y, weaponType) {
        this.weaponType = weaponType;
        this.sprite = getWeaponSprite(this.weaponType);
        this.x = x;
        this.y = y;

        this.weaponDiv = createElem(GameVars.gameDiv, "div", null, ["weapon"]);
        this.weaponCanv = createElem(this.weaponDiv, "canvas", null, null, this.sprite[0].length * toPixelSize(3), this.sprite.length * toPixelSize(3));

        this.update(x, y);
        this.draw();
    }

    update(x, y) {
        this.x = x;
        this.y = y;
        switch (this.weaponType) {
            case WeaponType.GREATSWORD:
                this.weaponDiv.style.transform = 'translate(' + (x + toPixelSize(17)) + 'px, ' + (y - toPixelSize(33)) + 'px) rotate(45deg)';
                break;
            default:
                this.weaponDiv.style.transform = 'translate(' + (x + toPixelSize(1)) + 'px, ' + (y - toPixelSize(4)) + 'px)';
        }
    }

    atk() {
        if (this.weaponType == WeaponType.GREATSWORD) {
            this.weaponCanv.style.animation = "greatswordAtk 1s ease-in-out";
            this.weaponCanv.style.transformOrigin = "50% 100%";
        }
    }

    draw() {
        drawSprite(this.weaponCanv, this.sprite, toPixelSize(3));
    }
}