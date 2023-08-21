import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { getWeaponSprite } from "./sprites";

export class Weapon {
    constructor(x, y, weaponType, handDir, parentDiv, color, size) {
        this.handDir = handDir;
        this.weaponType = weaponType;
        this.sprite = getWeaponSprite(this.weaponType);
        this.x = x;
        this.y = y;
        this.size = size || 2;
        this.isPerformingAction = false;

        this.weaponDiv = createElem(parentDiv, "div", null, ["weapon"]);
        this.weaponCanv = createElem(this.weaponDiv, "canvas", null, null, this.sprite[0].length * toPixelSize(this.size), this.sprite.length * toPixelSize(this.size));

        this.atkAnimation = this.getWeaponAnimation();

        this.setWeaponPos();
        this.draw(color);
    }

    getWeaponAnimation() {
        switch (this.weaponType) {
            case WeaponType.FIST:
                return this.weaponCanv.animate({
                    transform: ["translateY(0)", "translateY( " + toPixelSize(this.size * 3) + "px)", "translateY(0)"],
                    easing: ["ease-in", "ease-out", "ease-out"],
                    offset: [0, 0.5, 1]
                }, 100);
            case WeaponType.SHIELD:
                return this.weaponCanv.animate({
                    transform: ["translateY(0) scale(1)", "translateY( " + toPixelSize(this.size * 3) + "px)  scale(2)", "translateY(0) scale(1)"],
                    easing: ["ease-in", "ease-out", "ease-out"],
                    offset: [0, 0.5, 1]
                }, 200);
            case WeaponType.SWORD:
                return this.weaponCanv.animate({
                    transform: ["rotate(0)", "rotate(" + 180 * this.handDir + "deg)", "rotate(0)"],
                    easing: ["ease-in", "ease-out", "ease-in"],
                    offset: [0, 0.25, 1]
                }, 250);
            case WeaponType.GREATSWORD:
                this.weaponCanv.style.animation = "greatswordAtk 1s ease-in-out";
                return this.weaponCanv.animate({
                    transform: ["rotate(0)", "rotate(" + 360 * this.handDir + "deg)"],
                    easing: ["ease-in", "ease-out"],
                    offset: [0, 1]
                }, 1000);
        }
    }

    setWeaponPos() {
        switch (this.weaponType) {
            case WeaponType.FIST:
                this.weaponDiv.style.transform = 'translate(' + (this.x + toPixelSize(this.handDir === -1 ? -this.size : this.size * 2)) + 'px, ' + (this.y + toPixelSize(this.size * 4.5)) + 'px)';
                break;
            case WeaponType.SHIELD:
                this.weaponDiv.style.transform = 'translate(' + (this.x + toPixelSize(this.size * 2 * this.handDir)) + 'px, ' + (this.y + toPixelSize(this.size * 3)) + 'px)';
                break;
            case WeaponType.SWORD:
                this.weaponDiv.style.transform = 'translate(' + (this.x + toPixelSize(this.size * 3 * this.handDir)) + 'px, ' + (this.y) + 'px)';
                this.weaponCanv.style.transformOrigin = "50% 90%";
                break;
            case WeaponType.GREATSWORD:
                this.weaponDiv.style.transform = 'translate(' + (this.x + toPixelSize(this.handDir === - 1 ? -(this.size * 10) : this.size * 8)) + 'px, ' + (this.y - toPixelSize(this.handDir === - 1 ? this.size * 0.5 : this.size * 5.5)) + 'px) rotate(' + 45 * this.handDir + 'deg)';
                this.weaponCanv.style.transformOrigin = "50% 100%";
                break;
        }
    }

    action() {
        if (!this.isPerformingAction) {
            this.isPerformingAction = true;
            this.atkAnimation = this.getWeaponAnimation();
            this.atkAnimation.finished.then(() => this.isPerformingAction = false);
        }
    }

    draw(color) {
        drawSprite(this.weaponCanv, this.sprite, toPixelSize(this.size), null, null, { "wc": color });
    }

    destroy() {
        this.weaponDiv.parentNode.removeChild(this.weaponDiv);
    }
}