import { WeaponType, getWeaponSprite } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { lineCircleCollision } from "../utilities/collision-utilities";
import { createElem, drawSprite, setElemSize } from "../utilities/draw-utilities";
import { Arrow } from "./arrow";

export class Weapon {
    constructor(weaponType, handDir, parent, color, size, isPlayer) {
        this.color = color;
        this.handDir = handDir;
        this.weaponType = weaponType;
        this.parentDiv = parent.div;
        this.size = size || 2;
        this.dmg = this.getDamage() * (this.size - 1);
        this.damagedObjs = new Map();

        this.sprite = getWeaponSprite(this.weaponType);
        this.isPerformingAction = false;
        this.isPlayer = isPlayer;

        this.weaponDiv = createElem(this.parentDiv, "div", null, ["weapon"]);
        this.weaponCanv = createElem(this.weaponDiv, "canvas");

        this.init();
    }

    init() {
        setElemSize(this.weaponCanv, this.sprite[0].length * toPixelSize(this.size), this.sprite.length * toPixelSize(this.size));

        this.atkAnimation = this.getWeaponAnimation();
        this.relativePos = this.getRelativePos();
        this.setWeaponPos();
        this.atkLine = this.getWeaponAtkLine();

        this.draw();
    }

    getWeaponAnimation() {
        switch (this.weaponType) {
            case WeaponType.FIST:
                return this.weaponCanv.animate({
                    transform: ["translateY(0)", "translateY( " + toPixelSize(this.size * 3) + "px)", "translateY(0)"],
                    easing: ["ease-in", "ease-out", "ease-out"],
                    offset: [0, 0.5, 1]
                }, 100);
            case WeaponType.MORNING_STAR:
                return this.weaponCanv.animate({
                    transform: ["rotate(0)", "rotate(" + 360 * this.handDir + "deg)"],
                    easing: ["ease-in", "ease-out"],
                    offset: [0, 1]
                }, 175);
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
            case WeaponType.AXE:
                return this.weaponCanv.animate({
                    transform: ["rotate(0)", "rotate(" + 225 * this.handDir + "deg)", "rotate(0)"],
                    easing: ["ease-in", "ease-out", "ease-in"],
                    offset: [0, 0.35, 1]
                }, 300);
            case WeaponType.SPEAR:
                return this.weaponCanv.animate({
                    transform: ["translateY(0)", "translateY( " + toPixelSize(this.size * 12) + "px)", "translateY(0)"],
                    easing: ["ease-in", "ease-out", "ease-out"],
                    offset: [0, 0.5, 1]
                }, 500);
            case WeaponType.HALBERD:
                return this.weaponCanv.animate({
                    transform: ["rotate(0) translateY(0)", "rotate(" + -20 * this.handDir + "deg) translateY( " + -toPixelSize(this.size * 6) + "px)", "rotate(0) translateY(0)"],
                    easing: ["ease-in", "ease-out", "ease-out"],
                    offset: [0, 0.45, 1]
                }, 500);
            case WeaponType.HAMMER:
                return this.weaponCanv.animate({
                    transform: ["rotate(0)", "rotate(" + -180 * this.handDir + "deg)", "rotate(0)"],
                    easing: ["ease-in", "ease-out", "ease-in"],
                    offset: [0, 0.40, 1]
                }, 750);
            case WeaponType.CROSSBOW:
                return this.weaponCanv.animate({
                    transform: ["translateY(0)", "translateY( " + toPixelSize(this.size * 4) + "px)", "translateY(0)"],
                    easing: ["ease-in", "ease-out", "ease-out"],
                    offset: [0, 0.1, 1]
                }, 900);
            case WeaponType.GREATSWORD:
                return this.weaponCanv.animate({
                    transform: ["rotate(0)", "rotate(" + 360 * this.handDir + "deg)"],
                    easing: ["ease-in", "ease-out"],
                    offset: [0, 1]
                }, 1000);
        }
    }

    getRelativePos() {
        switch (this.weaponType) {
            case WeaponType.FIST:
                return { x: toPixelSize(this.handDir === -1 ? -this.size : this.size * 2), y: toPixelSize(this.size * 4.5) };
            case WeaponType.SHIELD:
                return { x: toPixelSize(this.size * 2 * this.handDir), y: toPixelSize(this.size * 3) };
            case WeaponType.SWORD:
                return { x: toPixelSize(this.size * 3 * this.handDir), y: -toPixelSize(2), r: -90 };
            case WeaponType.GREATSWORD:
                return { x: toPixelSize(this.handDir === - 1 ? -(this.size * 10) : this.size * 8), y: -toPixelSize(this.handDir === - 1 ? this.size * 0.5 : this.size * 5.5), r: 45 * this.handDir };
            case WeaponType.SPEAR:
                return { x: toPixelSize(this.handDir === - 1 ? -(this.size * 2) : this.size * 4), y: -toPixelSize(this.size) };
            case WeaponType.HALBERD:
                return { x: toPixelSize(this.handDir === - 1 ? -(this.size * 4) : this.size * 4), y: -toPixelSize(this.size * 8), r: 0 };
            case WeaponType.HAMMER:
                return { x: toPixelSize(this.handDir === - 1 ? -(this.size * 4) : this.size * 9), y: -toPixelSize(this.handDir === - 1 ? -this.size * 8 : -this.size * 6), r: 135 * this.handDir };
            case WeaponType.AXE:
                return { x: toPixelSize(this.handDir === - 1 ? -(this.size * 6) : this.size * 7), y: -toPixelSize(this.handDir === - 1 ? -this.size * 2 : 0), r: 45 * this.handDir };
            case WeaponType.MORNING_STAR:
                return { x: toPixelSize(this.handDir === - 1 ? -(this.size * 5) : this.size * 6), y: -toPixelSize(this.handDir === - 1 ? -this.size * 4 : -this.size * 2), r: 45 * this.handDir };
            case WeaponType.CROSSBOW:
                return { x: toPixelSize(this.handDir === - 1 ? -(this.size * 10) : this.size * 8), y: toPixelSize(this.handDir === - 1 ? this.size * 2 : -this.size * 3), r: 45 * this.handDir };
        }
    }

    setWeaponPos() {
        this.weaponDiv.style.transform = 'translate(' + this.relativePos.x + 'px, ' + this.relativePos.y + 'px)';
        switch (this.weaponType) {
            case WeaponType.SWORD:
                this.weaponCanv.style.transformOrigin = "50% 90%";
                break;
            case WeaponType.GREATSWORD:
            case WeaponType.HAMMER:
            case WeaponType.AXE:
            case WeaponType.MORNING_STAR:
            case WeaponType.CROSSBOW:
            case WeaponType.HALBERD:
                this.weaponDiv.style.transform += ' rotate(' + this.relativePos.r + 'deg)';
                this.weaponCanv.style.transformOrigin = "50% 100%";
                break;
        }
    }

    getWeaponAtkLine() {
        switch (this.weaponType) {
            case WeaponType.FIST:
            case WeaponType.SHIELD:
                return [
                    { x: this.relativePos.x, y: this.relativePos.y + (this.sprite.length * toPixelSize(this.size)) },
                    { x: this.relativePos.x + (this.sprite[0].length * toPixelSize(this.size)), y: this.relativePos.y + (this.sprite.length * toPixelSize(this.size)) },
                ];
            case WeaponType.SWORD:
                return [
                    { x: this.relativePos.x + (this.sprite[0].length / 2 * toPixelSize(this.size)), y: this.relativePos.y + ((90 * this.sprite.length * toPixelSize(this.size)) / 100) }
                ];
            case WeaponType.GREATSWORD:
            case WeaponType.HAMMER:
            case WeaponType.AXE:
            case WeaponType.MORNING_STAR:
                let anglePoint1 = this.retrieveAnglePoint(
                    this.relativePos.x,
                    this.relativePos.y,
                    this.sprite.length * toPixelSize(this.size),
                    this.relativePos.r + 72.5
                );
                let anglePoint2 = this.retrieveAnglePoint(
                    this.relativePos.x,
                    this.relativePos.y,
                    this.sprite[0].length / 2 * toPixelSize(this.size),
                    this.relativePos.r
                );
                return [
                    { x: anglePoint1.x, y: anglePoint1.y },
                    { x: anglePoint2.x, y: anglePoint2.y },
                ];
            case WeaponType.HALBERD:
                return [
                    { x: this.relativePos.x + (this.sprite[0].length / 2) * toPixelSize(this.size), y: this.relativePos.y + (this.sprite.length * toPixelSize(this.size) / 2) },
                    { x: this.relativePos.x + (this.sprite[0].length / 2) * toPixelSize(this.size), y: this.relativePos.y },
                ];
            case WeaponType.SPEAR:
                return [
                    { x: this.relativePos.x + toPixelSize(this.size / 2), y: this.relativePos.y + (this.sprite.length * toPixelSize(this.size) / 2) },
                    { x: this.relativePos.x + toPixelSize(this.size / 2), y: this.relativePos.y + (this.sprite.length * toPixelSize(this.size)) },
                ];
        }
    }

    getUpdatedWeaponAtkLine(box, transform) {
        switch (this.weaponType) {
            case WeaponType.FIST:
                return [
                    { x: box.x + this.atkLine[0].x, y: box.y + this.atkLine[0].y + (transform.f * 1.5) },
                    { x: box.x + this.atkLine[1].x, y: box.y + this.atkLine[1].y + (transform.f * 1.5) }
                ];
            case WeaponType.SHIELD:
                return [
                    { x: box.x + this.atkLine[0].x - (toPixelSize(this.size) * (transform.m11 - 1)), y: box.y + this.atkLine[0].y + transform.f * transform.m11 },
                    { x: box.x + this.atkLine[1].x + (toPixelSize(this.size) * (transform.m11 - 1)), y: box.y + this.atkLine[1].y + transform.f * transform.m11 }
                ];
            case WeaponType.SWORD:
                const swordAnglePoint = this.retrieveAnglePoint(
                    box.x + this.atkLine[0].x,
                    box.y + this.atkLine[0].y,
                    this.sprite.length * toPixelSize(this.size),
                    (Math.atan2(transform.b, transform.a) * 180 / Math.PI) + this.relativePos.r
                );
                return [
                    { x: box.x + this.atkLine[0].x, y: box.y + this.atkLine[0].y },
                    { x: swordAnglePoint.x, y: swordAnglePoint.y }
                ];
            case WeaponType.GREATSWORD:
            case WeaponType.HAMMER:
            case WeaponType.AXE:
            case WeaponType.MORNING_STAR:
                const rotationAnglePoint = this.retrieveAnglePoint(
                    box.x + this.atkLine[0].x,
                    box.y + this.atkLine[0].y,
                    this.sprite.length * toPixelSize(this.size),
                    (Math.atan2(transform.b, transform.a) * 180 / Math.PI) + this.relativePos.r - 90
                );
                return [
                    { x: box.x + this.atkLine[0].x, y: box.y + this.atkLine[0].y },
                    { x: rotationAnglePoint.x, y: rotationAnglePoint.y }
                ];
            case WeaponType.HALBERD:
                const topPoint = this.retrieveAnglePoint(
                    box.x + this.atkLine[1].x,
                    box.y + this.atkLine[1].y + (this.sprite.length * toPixelSize(this.size)) + (transform.f * 1.1),
                    this.sprite.length * toPixelSize(this.size),
                    (Math.atan2(transform.b, transform.a) * 180 / Math.PI) + this.relativePos.r - 90
                );
                const bottomPoint = this.retrieveAnglePoint(
                    box.x + this.atkLine[1].x,
                    box.y + this.atkLine[1].y + (this.sprite.length * toPixelSize(this.size)) + (transform.f * 1.1),
                    (this.sprite.length * toPixelSize(this.size) / 2),
                    (Math.atan2(transform.b, transform.a) * 180 / Math.PI) + this.relativePos.r - 90
                );
                return [
                    { x: bottomPoint.x, y: bottomPoint.y },
                    { x: topPoint.x, y: topPoint.y }
                ];
            case WeaponType.SPEAR:
                return [
                    { x: box.x + this.atkLine[0].x, y: box.y + this.atkLine[0].y + (transform.f * 1.1) },
                    { x: box.x + this.atkLine[1].x, y: box.y + this.atkLine[1].y + (transform.f * 1.1) }
                ];
        }
    }

    retrieveAnglePoint(x, y, length, angle) {
        return {
            x: Math.round(x + length * Math.cos(angle * Math.PI / 180)),
            y: Math.round(y + length * Math.sin(angle * Math.PI / 180))
        };
    }

    update() {
        // if (GameVars.atkCanv) {
        if (this.isPerformingAction && this.weaponType !== WeaponType.CROSSBOW) {
            let transform = new WebKitCSSMatrix(window.getComputedStyle(this.weaponCanv).transform);
            let newAtkLine = this.getUpdatedWeaponAtkLine(this.parentDiv.getBoundingClientRect(), transform);

            // just for debug
            // const ctx = GameVars.atkCanv.getContext("2d");
            // ctx.beginPath();
            // ctx.moveTo(newAtkLine[0].x, newAtkLine[0].y);
            // ctx.lineTo(newAtkLine[1].x, newAtkLine[1].y);
            // ctx.strokeStyle = 'red';
            // ctx.lineWidth = toPixelSize(1);
            // ctx.stroke();

            if (this.isPlayer) {
                GameVars.currentRoom.enemies.forEach(enemy => lineCircleCollision(newAtkLine, enemy.collisionObj) && this.dealDmgToBlock(enemy));
            } else {
                lineCircleCollision(newAtkLine, GameVars.player.collisionObj) && this.dealDmgToBlock(GameVars.player);
            }
        }
        // }
    }

    dealDmgToBlock(obj) {
        if (!this.damagedObjs.has(obj)) {
            if (this.isPlayer) {
                GameVars.sound.enemyTakeDmgSound();
            } else {
                GameVars.gameDiv.parentNode.style.animation = "takedmg 400ms ease-in-out";
                GameVars.sound.playerTakeDmgSound();
            }
            this.damagedObjs.set(obj, true);
            obj.lifeBar.takeDmg(this.dmg);
            this.weaponType === WeaponType.SHIELD && obj.validateMovement(obj.collisionObj.x + toPixelSize(6 * this.handDir), obj.collisionObj.y + toPixelSize(12));
        }
    }

    getDamage() {
        switch (this.weaponType) {
            case WeaponType.FIST:
                return 1;
            case WeaponType.SHIELD:
                return 2;
            case WeaponType.SWORD:
            case WeaponType.MORNING_STAR:
                return 3;
            case WeaponType.SPEAR:
                return 6;
            case WeaponType.AXE:
                return 5;
            case WeaponType.HAMMER:
                return 7;
            case WeaponType.HALBERD:
                return 8;
            case WeaponType.GREATSWORD:
                return 9;
        }
    }

    action() {
        if (!this.isPerformingAction) {
            GameVars.sound.atkSound();
            this.isPerformingAction = true;
            if (this.weaponType == WeaponType.CROSSBOW) {
                const box = this.weaponCanv.getBoundingClientRect();
                GameVars.currentRoom.arrows.push(new Arrow(box.x + (box.width / 2), box.y + (box.height / 2), this.handDir, this.color, this.size));
            }
            this.atkAnimation = this.getWeaponAnimation();
            this.atkAnimation.finished.then(() => {
                this.isPerformingAction = false;
                this.damagedObjs.clear();
            });
        }
    }

    draw() {
        drawSprite(this.weaponCanv, this.sprite, toPixelSize(this.size), null, null, { "wc": this.color });
    }

    destroy() {
        this.weaponDiv.parentNode.removeChild(this.weaponDiv);
    }
}