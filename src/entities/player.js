import { CircleObject } from "../collision-objects/circle-object";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { rectCircleCollision } from "../utilities/collision-utilities";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { knight, playerColors } from "./sprites";
import { Weapon } from "./weapon";

export class Player {
    constructor(roomX, roomY) {
        this.roomX = roomX;
        this.roomY = roomY;

        this.collisionObj = new CircleObject(GameVars.gameW / 2, GameVars.gameH / 2, toPixelSize(6));
        this.fakeMovRect = new CircleObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r);

        this.playerDiv = createElem(GameVars.gameDiv, "div", "player");
        this.playerCanv = createElem(this.playerDiv, "canvas", null, null, knight[0].length * toPixelSize(3), knight.length * toPixelSize(3));
        this.collisionCanv = createElem(GameVars.gameDiv, "canvas", null, null, toPixelSize(GameVars.gameWdAsPixels), toPixelSize(GameVars.gameHgAsPixels));

        this.playerWeapon = new Weapon(this.collisionObj.x, this.collisionObj.y, WeaponType.FIST);

        this.update();
        this.draw();
    }

    update() {
        this.move();
        this.playerWeapon.update(this.collisionObj.x, this.collisionObj.y);
        this.playerCanv.style.transform = 'translate(' +
            (this.collisionObj.x - (knight[0].length * toPixelSize(3)) / 2) + 'px, ' +
            (this.collisionObj.y - (knight.length * toPixelSize(3)) / 4 * 3) + 'px)';

        // let context = this.collisionCanv.getContext("2d");
        // context.beginPath();
        // context.arc(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r, 0, 2 * Math.PI, false);
        // context.stroke();
    }

    move() {
        let newRectX = this.collisionObj.x;
        let newRectY = this.collisionObj.y;

        const movKeys = Object.keys(GameVars.keys).filter((key) => (
            key == 'w' || key == 's' || key == 'a' || key == 'd' ||
            key == 'W' || key == 'S' || key == 'A' || key == 'D' ||
            key == 'ArrowUp' || key == 'ArrowDown' || key == 'ArrowLeft' || key == 'ArrowRight')
            && GameVars.keys[key]);
        if (movKeys.length > 0) {
            this.playerDiv.style.animation = "walk 0.16s infinite ease-in-out";
            this.playerWeapon.weaponDiv.style.animation = "walk2 0.16s infinite ease-in-out";
        } else {
            this.playerDiv.style.animation = "";
            this.playerWeapon.weaponDiv.style.animation = "";
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
            this.collisionObj.x = newRectX;
            this.collisionObj.y = newRectY;
        }
    }

    draw() {
        drawSprite(this.playerCanv, knight, toPixelSize(3), 0, 0, playerColors);
    }
}