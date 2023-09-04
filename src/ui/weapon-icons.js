import { WeaponType, getWeaponSprite } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { createElem, drawSprite, setElemSize } from "../utilities/draw-utilities";
import { convertTextToPixelArt, drawPixelTextInCanvas } from "../utilities/text";

export class WeaponIcons {
    constructor() {
        this.rightCanv = createElem(GameVars.gameDiv, "canvas", null, null, null, null, GameVars.isMobile, null,
            (e) => {
                let needsRedraw = GameVars.keys['v'] !== true;
                GameVars.keys['v'] = true;
                needsRedraw && this.update();
            },
            (e) => {
                GameVars.keys['v'] = false;
                this.update();
            });
        this.leftCanv = createElem(GameVars.gameDiv, "canvas", null, null, null, null, GameVars.isMobile, null,
            (e) => {
                let needsRedraw = GameVars.keys['b'] !== true;
                GameVars.keys['b'] = true;
                needsRedraw && this.update();
            },
            (e) => {
                GameVars.keys['b'] = false;
                this.update();
            });
        this.update();
    }

    update() {
        setElemSize(this.rightCanv, toPixelSize(30), toPixelSize(30));
        setElemSize(this.leftCanv, toPixelSize(30), toPixelSize(30));

        this.leftCanv.style.transform = 'translate(' + (GameVars.gameW - this.leftCanv.width - toPixelSize(12)) + 'px, ' + (GameVars.gameH - this.leftCanv.height - toPixelSize(12)) + 'px)';
        this.rightCanv.style.transform = 'translate(' + (GameVars.gameW - this.leftCanv.width - toPixelSize(30 + 24)) + 'px, ' + (GameVars.gameH - this.leftCanv.height - toPixelSize(12)) + 'px)';

        this.drawIcon(this.rightCanv, GameVars.isMobile ? "A" : "V", GameVars.player.playerRightWeapon.weaponType, GameVars.keys['v'] || GameVars.keys['V']);
        this.drawIcon(this.leftCanv, GameVars.isMobile ? "B" : "B", GameVars.player.playerLeftWeapon.weaponType, GameVars.keys['b'] || GameVars.keys['B']);
    }

    drawIcon(canvas, letter, weaponType, isTouch) {
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        genSmallBox(canvas, 0, 0, 14, 14, toPixelSize(2), isTouch ? "#ffffffaa" : "#00000066", isTouch ? "#ffffff66" : "#100f0f66");
        this.drawWeapon(canvas, weaponType);
        genSmallBox(canvas, 9, 9, 5, 5, toPixelSize(2), "#ffff57", "#100f0f66");
        drawPixelTextInCanvas(convertTextToPixelArt(letter), canvas, toPixelSize(1), 24, 24, "#edeef7", 1);
    }

    drawWeapon(canvas, weaponType) {
        let pixelSize, x, y;
        switch (weaponType) {
            case WeaponType.FIST:
                pixelSize = 6; x = 1; y = 1;
                break;
            case WeaponType.SHIELD:
                pixelSize = 5; x = 1; y = 1;
                break;
            case WeaponType.SWORD:
                pixelSize = 5; x = 1; y = -2;
                break;
            case WeaponType.GREATSWORD:
                pixelSize = 4; x = 0; y = -2;
                break;
            case WeaponType.SPEAR:
                pixelSize = 5; x = 2; y = -8;
                break;
            case WeaponType.AXE:
                pixelSize = 5; x = 1; y = 1;
                break;
            case WeaponType.HAMMER:
            case WeaponType.MORNING_STAR:
                pixelSize = 5; x = 1; y = 2;
                break;
            case WeaponType.CROSSBOW:
                pixelSize = 4; x = -1; y = 0;
                break;
        }
        drawSprite(canvas, getWeaponSprite(weaponType), toPixelSize(pixelSize), x, y, { "wc": "#cd9722" });
    }
}