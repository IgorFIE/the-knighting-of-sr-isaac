import { CircleObject } from "../collision-objects/circle-object";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { rectCircleCollision, checkForCollisions } from "../utilities/collision-utilities";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { knight, playerColors, shadow } from "./sprites";
import { LifeBar } from "./life-bar";
import { Weapon } from "./weapon";
import { createId } from "../utilities/general-utilities";
import { deadAnim } from "../utilities/animation-utilities";

export class Player {
    constructor(roomX, roomY) {
        this.isAlive = true;
        this.id = createId();
        this.roomX = roomX;
        this.roomY = roomY;

        this.collisionObj = new CircleObject(GameVars.gameW / 2, GameVars.gameH / 2, toPixelSize(4));
        this.fakeMovCircle = new CircleObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r);

        this.div = createElem(GameVars.gameDiv, "div", null, ["player"]);

        this.shadowCanv = createElem(this.div, "canvas", null, null, toPixelSize(2) * 7, toPixelSize(2) * 6);
        this.shadowCanv.style.transform = 'translate(' + -toPixelSize(4) + 'px, ' + toPixelSize(8) + 'px)';

        this.playerCanv = createElem(this.div, "canvas", null, null, knight[0].length * toPixelSize(2), knight.length * toPixelSize(2));

        this.playerRightWeapon = new Weapon(0, 0, WeaponType.SWORD, -1, this, playerColors.hd);
        this.playerLeftWeapon = new Weapon(0, 0, WeaponType.FIST, 1, this, playerColors.hd);

        this.lifeBar = new LifeBar(GameVars.heartLifeVal * 3, true, this.playerCanv);

        this.update();
        this.draw();

        let rect = this.playerCanv.getBoundingClientRect();
        this.div.style.width = rect.width + "px";
        this.div.style.height = rect.height + "px";
        this.div.style.transformOrigin = "70% 95%";
    }

    update() {
        if (this.lifeBar.life > 0) {
            this.handleInput();
            this.atk();
            this.lifeBar.update();
        } else {
            if (this.isAlive) {
                this.clearAnim();
                this.lifeBar.update();
                this.isAlive = false;
                this.div.animate(deadAnim(this.div.style.transform), { duration: 500, fill: "forwards" }).finished.then(() => {
                    GameVars.isGameOver = true;
                });
            }
        }
    }

    handleInput() {
        let newRectX = this.collisionObj.x;
        let newRectY = this.collisionObj.y;

        const movKeys = Object.keys(GameVars.keys).filter((key) => (
            key === 'w' || key === 's' || key === 'a' || key === 'd' ||
            key === 'W' || key === 'S' || key === 'A' || key === 'D' ||
            key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight'
        ) && GameVars.keys[key]);

        if (movKeys.length > 0) {
            this.playerCanv.style.animation = "walk 0.16s infinite ease-in-out";
            this.playerLeftWeapon.weaponCanv.style.animation = this.playerLeftWeapon.isPerformingAction ? "" : "weaponWalkLeft 0.16s infinite ease-in-out";
            this.playerRightWeapon.weaponCanv.style.animation = this.playerRightWeapon.isPerformingAction ? "" : "weaponWalkRight 0.16s infinite ease-in-out";
        } else {
            this.clearAnim();
        }

        //todo momentarily solution
        const playerSpeed = toPixelSize(2);
        const distance = movKeys.length > 1 ? playerSpeed / 1.4142 : playerSpeed;

        if (GameVars.keys['d'] || GameVars.keys['D'] || GameVars.keys['ArrowRight']) { newRectX += distance; }
        if (GameVars.keys['a'] || GameVars.keys['A'] || GameVars.keys['ArrowLeft']) { newRectX -= distance; }
        if (GameVars.keys['w'] || GameVars.keys['W'] || GameVars.keys['ArrowUp']) { newRectY -= distance; }
        if (GameVars.keys['s'] || GameVars.keys['S'] || GameVars.keys['ArrowDown']) { newRectY += distance; }

        this.validateMovement(this.collisionObj.x, newRectY);
        this.validateMovement(newRectX, this.collisionObj.y);
    }

    clearAnim() {
        this.playerCanv.style.animation = "";
        this.playerLeftWeapon.weaponCanv.style.animation = "";
        this.playerRightWeapon.weaponCanv.style.animation = "";
    }

    validateMovement(x, y) {
        this.fakeMovCircle.x = x;
        this.fakeMovCircle.y = y;
        checkForCollisions(this.fakeMovCircle, this.roomX, this.roomY, true, (circle) => this.move(circle));
    }

    move(circle) {
        this.collisionObj.x = circle.x;
        this.collisionObj.y = circle.y;
        this.div.style.transform = 'translate(' +
            (this.collisionObj.x - (knight[0].length * toPixelSize(2)) / 2) + 'px, ' +
            (this.collisionObj.y - (knight.length * toPixelSize(2)) / 4 * 3) + 'px)';
    }

    atk() {
        if (GameVars.keys['v'] || GameVars.keys['V']) {
            this.playerRightWeapon.action();
        }
        if (GameVars.keys['b'] || GameVars.keys['B']) {
            this.playerLeftWeapon.action();
        }
        this.playerRightWeapon.update();
        this.playerLeftWeapon.update();
    }

    draw() {
        genSmallBox(this.shadowCanv, 0, 0, 6, 5, toPixelSize(2), "#00000033", "#00000033");
        drawSprite(this.playerCanv, knight, toPixelSize(2), 0, 0, playerColors);
    }
}