import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { knight, playerColors } from "./sprites";
import { Weapon } from "./weapon";

export class Player {
    constructor(roomX, roomY) {
        this.roomX = roomX;
        this.roomY = roomY;

        this.x = GameVars.gameW / 2;
        this.y = GameVars.gameH / 2;

        this.playerCanv = createElem(GameVars.gameDiv, "canvas", "player", null, knight[0].length * toPixelSize(2), knight.length * toPixelSize(2));

        this.playerWeapon = new Weapon(this.x, this.y, WeaponType.FIST);

        this.update();
        this.draw();
    }

    update() {
        this.playerCanv.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)';
    }

    draw() {
        drawSprite(this.playerCanv, knight, toPixelSize(2), 0, 0, playerColors);
    }
}