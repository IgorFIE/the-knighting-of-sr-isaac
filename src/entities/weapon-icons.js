import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { convertTextToPixelArt, drawPixelTextInCanvas } from "../utilities/text";
import { getWeaponSprite, playerColors } from "./sprites";

export class WeaponIcons {
    constructor() {
        this.leftCanv = createElem(GameVars.gameDiv, "canvas", null, null, toPixelSize(40), toPixelSize(40));
        this.rightCanv = createElem(GameVars.gameDiv, "canvas", null, null, toPixelSize(40), toPixelSize(40));

        this.leftCanv.style.transform = 'translate(' + (GameVars.gameW - this.leftCanv.width - toPixelSize(16)) + 'px, ' + (GameVars.gameH - this.leftCanv.height - toPixelSize(16)) + 'px)';
        this.rightCanv.style.transform = 'translate(' + (GameVars.gameW - this.leftCanv.width - toPixelSize(40 + 32)) + 'px, ' + (GameVars.gameH - this.leftCanv.height - toPixelSize(16)) + 'px)';

        this.update();
    }

    update() {
        console.log("HERE");
        this.drawIcon(this.leftCanv, "B", GameVars.player.playerLeftWeapon.weaponType);
        this.drawIcon(this.rightCanv, "V", GameVars.player.playerRightWeapon.weaponType);
    }

    drawIcon(canvas, letter, weaponType) {
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        genSmallBox(canvas, 0, 0, 19, 19, toPixelSize(2), "#00000066", "#100f0f66");
        this.drawWeapon(canvas, weaponType);
        genSmallBox(canvas, 12, 12, 7, 7, toPixelSize(2), "#ffff57", "#100f0f66");
        drawPixelTextInCanvas(convertTextToPixelArt(letter), canvas, GameVars.pixelSize, 32, 32, "#edeef7", 2);
    }

    drawWeapon(canvas, weaponType) {
        let pixelSize, x, y;
        switch (weaponType) {
            case WeaponType.FIST:
                pixelSize = 6; x = 2; y = 2;
                break;
            case WeaponType.SHIELD:
                pixelSize = 6; x = 1; y = 1;
                break;
            case WeaponType.SWORD:
                pixelSize = 6; x = 1; y = 0;
                break;
            case WeaponType.GREATSWORD:
                pixelSize = 5; x = 0; y = -2;
                break;
        }
        drawSprite(canvas, getWeaponSprite(weaponType), toPixelSize(pixelSize), x, y, { "wc": playerColors.hd });
    }
}