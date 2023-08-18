import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { fist, getWeaponSprite, greatsword, shortSword } from "./sprites";

export class Weapon {
    constructor(x, y, weaponType, handDir, parentDiv, color) {
        this.handDir = handDir;
        this.weaponType = weaponType;
        this.sprite = getWeaponSprite(this.weaponType);
        this.x = x;
        this.y = y;

        this.weaponDiv = createElem(parentDiv, "div", null, ["weapon"]);
        this.weaponCanv = createElem(this.weaponDiv, "canvas", null, null, this.sprite[0].length * toPixelSize(3), this.sprite.length * toPixelSize(3));

        this.setWeaponPos();
        this.draw(color);
    }

    setWeaponPos() {
        switch (this.weaponType) {
            case WeaponType.FIST:
                this.weaponDiv.style.transform = 'translate(' + (this.x + toPixelSize(this.handDir === -1 ? -3 : 6)) + 'px, ' + (this.y + toPixelSize(13)) + 'px)';
                break;
            case WeaponType.SHIELD:
                this.weaponDiv.style.transform = 'translate(' + (this.x + toPixelSize(6 * this.handDir)) + 'px, ' + (this.y + toPixelSize(9)) + 'px)';
                break;
            case WeaponType.SWORD:
                this.weaponDiv.style.transform = 'translate(' + (this.x + toPixelSize(9 * this.handDir)) + 'px, ' + (this.y + toPixelSize(0)) + 'px)';
                break;
            case WeaponType.GREATSWORD:
                this.weaponDiv.style.transform = 'translate(' + (this.x + toPixelSize(24 * this.handDir)) + 'px, ' + (this.y - toPixelSize(16)) + 'px) rotate(45deg)';
                break;
        }
    }

    action() {
        switch (this.weaponType) {
            case WeaponType.FIST:
                this.weaponCanv.style.animation = "fistAtk 0.1s ease-in-out";
                break;
            case WeaponType.SHIELD:
                this.weaponCanv.style.animation = "shieldBlock 0.2s ease-in-out";
                break;
            case WeaponType.SWORD:
                this.weaponCanv.style.animation = "swordAtk 0.25s ease-in";
                this.weaponCanv.style.transformOrigin = "50% 90%";
                break;
            case WeaponType.GREATSWORD:
                this.weaponCanv.style.animation = "greatswordAtk 1s ease-in-out";
                this.weaponCanv.style.transformOrigin = "50% 100%";
                break;
        }
    }

    draw(color) {
        drawSprite(this.weaponCanv, this.sprite, toPixelSize(3), null, null, { "sd": color });
    }
}