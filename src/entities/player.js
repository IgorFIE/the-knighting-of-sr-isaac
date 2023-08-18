import { CircleObject } from "../collision-objects/circle-object";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { rectCircleCollision } from "../utilities/collision-utilities";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { knight, playerColors, shadow } from "./sprites";
import { Weapon } from "./weapon";

export class Player {
    constructor(roomX, roomY) {
        this.roomX = roomX;
        this.roomY = roomY;

        this.collisionObj = new CircleObject(GameVars.gameW / 2, GameVars.gameH / 2, toPixelSize(6));
        this.fakeMovRect = new CircleObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r);

        this.playerDiv = createElem(GameVars.gameDiv, "div", null, ["player"]);

        this.shadowCanv = createElem(this.playerDiv, "canvas", null, null, toPixelSize(3) * 7, toPixelSize(3) * 6);
        this.shadowCanv.style.transform = 'translate(' + -toPixelSize(6) + 'px, ' + toPixelSize(12) + 'px)';

        this.playerCanv = createElem(this.playerDiv, "canvas", null, null, knight[0].length * toPixelSize(3), knight.length * toPixelSize(3));

        this.playerRightWeapon = new Weapon(0, 0, WeaponType.FIST, -1, this.playerDiv, playerColors.hd);
        this.playerLeftWeapon = new Weapon(0, 0, WeaponType.FIST, 1, this.playerDiv, playerColors.hd);
        this.update();
        this.draw();
    }

    update() {
        this.handleInput();
        this.atk();
        this.playerRightWeapon.update();
        this.playerLeftWeapon.update();
    }

    handleInput() {
        let newRectX = this.collisionObj.x;
        let newRectY = this.collisionObj.y;

        const movKeys = Object.keys(GameVars.keys).filter((key) => (
            key == 'w' || key == 's' || key == 'a' || key == 'd' ||
            key == 'W' || key == 'S' || key == 'A' || key == 'D' ||
            key == 'ArrowUp' || key == 'ArrowDown' || key == 'ArrowLeft' || key == 'ArrowRight'
        ) && GameVars.keys[key]);

        if (movKeys.length > 0) {
            this.playerCanv.style.animation = "walk 0.16s infinite ease-in-out";
            this.playerLeftWeapon.weaponCanv.style.animation = this.playerLeftWeapon.isPerformingAction ? "" : "weaponWalkLeft 0.16s infinite ease-in-out";
            this.playerRightWeapon.weaponCanv.style.animation = this.playerRightWeapon.isPerformingAction ? "" : "weaponWalkRight 0.16s infinite ease-in-out";
        } else {
            this.playerCanv.style.animation = "";
            this.playerLeftWeapon.weaponCanv.style.animation = "";
            this.playerRightWeapon.weaponCanv.style.animation = "";
        }

        //todo momentarily solution
        const playerSpeed = toPixelSize(4);
        const distance = movKeys.length > 1 ? playerSpeed / 1.4142 : playerSpeed;

        if (GameVars.keys['d'] || GameVars.keys['D'] || GameVars.keys['ArrowRight']) { newRectX += distance; }
        if (GameVars.keys['a'] || GameVars.keys['A'] || GameVars.keys['ArrowLeft']) { newRectX -= distance; }
        if (GameVars.keys['w'] || GameVars.keys['W'] || GameVars.keys['ArrowUp']) { newRectY -= distance; }
        if (GameVars.keys['s'] || GameVars.keys['S'] || GameVars.keys['ArrowDown']) { newRectY += distance; }

        this.validateMovement(this.collisionObj.x, newRectY);
        this.validateMovement(newRectX, this.collisionObj.y);
    }

    validateMovement(x, y) {
        this.fakeMovRect.x = x;
        this.fakeMovRect.y = y;

        if (!GameVars.gameBoard.board[this.roomY][this.roomX].walls.find((wall) => rectCircleCollision(this.fakeMovRect, wall.collisionObj))) {
            this.move(x, y);
        }
    }

    move(x, y) {
        this.collisionObj.x = x;
        this.collisionObj.y = y;
        this.playerDiv.style.transform = 'translate(' +
            (this.collisionObj.x - (knight[0].length * toPixelSize(3)) / 2) + 'px, ' +
            (this.collisionObj.y - (knight.length * toPixelSize(3)) / 4 * 3) + 'px)';
    }

    atk() {
        if (GameVars.keys['v'] || GameVars.keys['V']) {
            this.playerRightWeapon.action();
        }
        if (GameVars.keys['b'] || GameVars.keys['B']) {
            this.playerLeftWeapon.action();
        }
    }

    draw() {
        genSmallBox(this.shadowCanv, 0, 0, 6, 5, toPixelSize(3), "#00000066", "#00000066");
        drawSprite(this.playerCanv, knight, toPixelSize(3), 0, 0, playerColors);
    }
}