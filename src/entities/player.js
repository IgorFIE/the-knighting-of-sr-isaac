import { CircleObject } from "../collision-objects/circle-object";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { rectCircleCollision } from "../utilities/collision-utilities";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { knight, playerColors } from "./sprites";
import { Weapon } from "./weapon";

export class Player {
    constructor(roomX, roomY) {
        this.isAtk = false;
        this.roomX = roomX;
        this.roomY = roomY;

        this.collisionObj = new CircleObject(GameVars.gameW / 2, GameVars.gameH / 2, toPixelSize(6));
        this.fakeMovRect = new CircleObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r);

        this.playerDiv = createElem(GameVars.gameDiv, "div", null, ["player"]);
        this.playerCanv = createElem(this.playerDiv, "canvas", null, null, knight[0].length * toPixelSize(3), knight.length * toPixelSize(3));

        this.playerWeapon = new Weapon(this.collisionObj.x, this.collisionObj.y, WeaponType.GREATSWORD);

        this.update();
        this.draw();
    }

    update() {
        if (!this.isAtk) this.handleInput();
        this.atk();
    }

    handleInput() {
        let newRectX = this.collisionObj.x;
        let newRectY = this.collisionObj.y;

        const movKeys = Object.keys(GameVars.keys).filter((key) => (
            key == 'w' || key == 's' || key == 'a' || key == 'd' ||
            key == 'W' || key == 'S' || key == 'A' || key == 'D' ||
            key == 'ArrowUp' || key == 'ArrowDown' || key == 'ArrowLeft' || key == 'ArrowRight') && GameVars.keys[key]);

        if (movKeys.length > 0) {
            this.playerCanv.style.animation = "walk 0.16s infinite ease-in-out";
            this.playerWeapon.weaponCanv.style.animation = "walk2 0.16s infinite ease-in-out";
        } else {
            this.playerCanv.style.animation = "";
            this.playerWeapon.weaponCanv.style.animation = "";
        }

        //todo momentarily solution
        const playerSpeed = toPixelSize(4);
        const distance = movKeys.length > 1 ? playerSpeed / 1.4142 : playerSpeed;

        if (GameVars.keys['d'] || GameVars.keys['D'] || GameVars.keys['ArrowRight']) { newRectX += distance; }
        if (GameVars.keys['a'] || GameVars.keys['A'] || GameVars.keys['ArrowLeft']) { newRectX -= distance; }
        if (GameVars.keys['w'] || GameVars.keys['W'] || GameVars.keys['ArrowUp']) { newRectY -= distance; }
        if (GameVars.keys['s'] || GameVars.keys['S'] || GameVars.keys['ArrowDown']) { newRectY += distance; }

        this.fakeMovRect.x = newRectX;
        this.fakeMovRect.y = newRectY;

        if (!GameVars.gameBoard.board[this.roomY][this.roomX].walls.find((wall) => rectCircleCollision(this.fakeMovRect, wall.collisionObj))) {
            this.move(newRectX, newRectY);
        }
    }

    move(x, y) {
        this.collisionObj.x = x;
        this.collisionObj.y = y;
        this.playerWeapon.update(this.collisionObj.x, this.collisionObj.y);
        this.playerDiv.style.transform = 'translate(' +
            (this.collisionObj.x - (knight[0].length * toPixelSize(3)) / 2) + 'px, ' +
            (this.collisionObj.y - (knight.length * toPixelSize(3)) / 4 * 3) + 'px)';
    }

    atk() {
        if (!this.isAtk && GameVars.keys[' ']) {
            this.isAtk = true;
            this.playerCanv.style.animation = "";
            this.playerWeapon.atk();
            this.playerWeapon.weaponCanv.addEventListener("animationend", () => {
                this.isAtk = false;
                this.playerWeapon.weaponCanv.style.animation = "";
            });
        }
    }

    draw() {
        drawSprite(this.playerCanv, knight, toPixelSize(3), 0, 0, playerColors);
    }
}