import { CircleObject } from "../collision-objects/circle-object";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { knight, playerColors } from "./sprites";
import { Weapon } from "./weapon";

export class Player {
    constructor(roomX, roomY) {
        this.roomX = roomX;
        this.roomY = roomY;

        this.collisionObj = new CircleObject(GameVars.gameW / 2, GameVars.gameH / 2, toPixelSize(3));
        this.fakeMovRect = new CircleObject(GameVars.gameW / 2, GameVars.gameH / 2, toPixelSize(3));

        this.playerCanv = createElem(GameVars.gameDiv, "canvas", "player", null, knight[0].length * toPixelSize(2), knight.length * toPixelSize(2));

        this.playerWeapon = new Weapon(this.collisionObj.x, this.collisionObj.y, WeaponType.FIST);

        this.update();
        this.draw();
    }

    update() {
        this.move();
        this.playerWeapon.update(this.collisionObj.x, this.collisionObj.y);
        this.playerCanv.style.transform = 'translate(' + this.collisionObj.x + 'px, ' + this.collisionObj.y + 'px)';
    }

    move() {
        let newRectX = this.collisionObj.x;
        let newRectY = this.collisionObj.y;

        const isMultiDirection = GameVars.keys ? Object.keys(GameVars.keys).filter((key) => (
            key == 'w' || key == 's' || key == 'a' || key == 'd' ||
            key == 'W' || key == 'S' || key == 'A' || key == 'D' ||
            key == 'ArrownUp' || key == 'ArrownDown' || key == 'ArrownLeft' || key == 'ArrownRight')
            && GameVars.keys[key]).length > 1 : false;

        //todo momentarily solution
        const playerSpeed = toPixelSize(1);
        const distance = isMultiDirection ? playerSpeed / 1.4142 : playerSpeed;

        if (GameVars.keys['d'] || GameVars.keys['D'] || GameVars.keys['ArrowRight']) { newRectX += distance; }
        if (GameVars.keys['a'] || GameVars.keys['A'] || GameVars.keys['ArrowLeft']) { newRectX -= distance; }
        if (GameVars.keys['w'] || GameVars.keys['W'] || GameVars.keys['ArrowUp']) { newRectY -= distance; }
        if (GameVars.keys['s'] || GameVars.keys['S'] || GameVars.keys['ArrowDown']) { newRectY += distance; }

        this.fakeMovRect.x = newRectX;
        this.fakeMovRect.y = newRectY;

        // check for collisions
        this.collisionObj.x = newRectX;
        this.collisionObj.y = newRectY;
    }

    draw() {
        drawSprite(this.playerCanv, knight, toPixelSize(2), 0, 0, playerColors);
    }
}