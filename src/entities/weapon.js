import { WeaponType } from "../enums/weapon-type";
import { toPixelSize } from "../game-variables";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { getWeaponSprite } from "./sprites";

export class Weapon {
    constructor(x, y, weaponType, handDir, parentDiv, color) {
        this.handDir = handDir;
        this.weaponType = weaponType;
        this.sprite = getWeaponSprite(this.weaponType);
        this.x = x;
        this.y = y;
        this.isPerformingAction = false;

        this.weaponDiv = createElem(parentDiv, "div", null, ["weapon"]);
        this.weaponCanv = createElem(this.weaponDiv, "canvas", null, null, this.sprite[0].length * toPixelSize(2), this.sprite.length * toPixelSize(2));

        this.atkAnimation = this.getWeaponAnimation();

        this.setWeaponPos();
        this.draw(color);
    }

    getWeaponAnimation() {
        switch (this.weaponType) {
            case WeaponType.FIST:
                return this.weaponCanv.animate({
                    transform: ["translateY(0)", "translateY( " + toPixelSize(6) + "px)"],
                    easing: ["ease-in", "ease-out"],
                    offset: [0, 0.5]
                }, 100);
            case WeaponType.SHIELD:
                return this.weaponCanv.animate({
                    transform: ["translateY(0) scale(1)", "translateY( " + toPixelSize(4) + "px)  scale(2)"],
                    easing: ["ease-in", "ease-out"],
                    offset: [0, 0.5]
                }, 200);
            case WeaponType.SWORD:
                return this.weaponCanv.animate({
                    transform: ["rotate(0)", "rotate(" + 180 * this.handDir + "deg)"],
                    easing: ["ease-in", "ease-out"],
                    offset: [0, 0.25]
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
                this.weaponDiv.style.transform = 'translate(' + (this.x + toPixelSize(this.handDir === -1 ? -2 : 4)) + 'px, ' + (this.y + toPixelSize(9)) + 'px)';
                break;
            case WeaponType.SHIELD:
                this.weaponDiv.style.transform = 'translate(' + (this.x + toPixelSize(4 * this.handDir)) + 'px, ' + (this.y + toPixelSize(6)) + 'px)';
                break;
            case WeaponType.SWORD:
                this.weaponDiv.style.transform = 'translate(' + (this.x + toPixelSize(6 * this.handDir)) + 'px, ' + (this.y + toPixelSize(0)) + 'px)';
                this.weaponCanv.style.transformOrigin = "50% 90%";
                break;
            case WeaponType.GREATSWORD:
                this.weaponDiv.style.transform = 'translate(' + (this.x + toPixelSize(this.handDir === - 1 ? -20 : 16)) + 'px, ' + (this.y - toPixelSize(this.handDir === - 1 ? 1 : 11)) + 'px) rotate(' + 45 * this.handDir + 'deg)';
                this.weaponCanv.style.transformOrigin = "50% 100%";
                break;
        }
    }

    update() {
        if (this.atkAnimation.playState === "finished") {
            this.isPerformingAction = false;
        }
    }

    action() {
        if (!this.isPerformingAction) {
            this.isPerformingAction = true;
            this.atkAnimation.play();
        }
    }

    draw(color) {
        drawSprite(this.weaponCanv, this.sprite, toPixelSize(2), null, null, { "wc": color });
    }

    destroy() {
        this.weaponDiv.parentNode.removeChild(this.weaponDiv);
    }
}