import { CircleObject } from "../collision-objects/circle-object";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { checkForCollisions } from "../utilities/collision-utilities";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { key, knight } from "./sprites";
import { LifeBar } from "./life-bar";
import { Weapon } from "./weapon";
import { deadAnim } from "../utilities/animation-utilities";

export class Player {
    constructor() {
        this.hasKey = false;
        this.isAlive = true;

        this.collisionObj = new CircleObject(GameVars.gameW / 2, GameVars.gameH / 2, toPixelSize(4));
        this.fakeMovCircle = new CircleObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r);

        this.div = createElem(GameVars.gameDiv, "div", null, ["player"]);

        this.shadowCanv = createElem(this.div, "canvas", null, null, toPixelSize(2) * 7, toPixelSize(2) * 6);
        this.shadowCanv.style.transform = 'translate(' + -toPixelSize(4) + 'px, ' + toPixelSize(8) + 'px)';

        this.playerCanv = createElem(this.div, "canvas", null, null, knight[0].length * toPixelSize(2), knight.length * toPixelSize(2));

        this.playerRightWeapon = new Weapon(0, 0, GameVars.lastPlayerRightWeaponType || WeaponType.FIST, -1, this, "#cd9722", null, true);
        this.playerLeftWeapon = new Weapon(0, 0, GameVars.lastPlayerLeftWeaponType || WeaponType.FIST, 1, this, "#cd9722", null, true);

        this.lifeBar = new LifeBar(GameVars.heartLifeVal * 3, true, this.playerCanv, GameVars.lastPlayerLife);

        this.keyCanv = createElem(GameVars.gameDiv, "canvas", null, ["hidden"], (key[0].length * toPixelSize(2)) + toPixelSize(4), (key.length * toPixelSize(2)) + toPixelSize(4));
        this.keyCanv.style.transform = 'translate(' + toPixelSize(12) + 'px, ' + toPixelSize(37) + 'px)';

        this.update();
        this.draw();

        let playerRect = this.playerCanv.getBoundingClientRect();
        this.div.style.width = playerRect.width + "px";
        this.div.style.height = playerRect.height + "px";
        this.div.style.transformOrigin = "70% 95%";
    }

    update() {
        if (this.lifeBar.life > 0) {
            if (this.hasKey) this.keyCanv.classList.remove("hidden");
            this.handleInput();
            this.atk();
            this.lifeBar.update();
        } else {
            if (this.isAlive) {
                this.clearAnim();
                this.lifeBar.update();
                this.isAlive = false;
                GameVars.sound.playOverSound();
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
            GameVars.sound.walkSound();
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

    validateMovement(x, y, ignoreCollisions) {
        this.fakeMovCircle.x = x;
        this.fakeMovCircle.y = y;
        ignoreCollisions ? this.move(this.fakeMovCircle) : checkForCollisions(this.fakeMovCircle, GameVars.currentRoom.roomX, GameVars.currentRoom.roomY, (circle) => this.move(circle));
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
        drawSprite(this.playerCanv, knight, toPixelSize(2), 0, 0, { "hd": "#cd9722", "hl": "#ffff57", "cm": "#9e6800" });

        genSmallBox(this.keyCanv, 0, 0, 4, 8, toPixelSize(2), "#00000066", "#100f0f66");
        drawSprite(this.keyCanv, key, toPixelSize(2), 1, 1);
    }
}