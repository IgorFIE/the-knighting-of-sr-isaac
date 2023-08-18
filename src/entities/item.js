import { CircleObject } from "../collision-objects/circle-object";
import { ItemType } from "../enums/item-type";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { circleToCircleCollision } from "../utilities/collision-utilities";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { getItemSprite, getWeaponSprite, playerColors } from "./sprites";
import { Weapon } from "./weapon";

export class Item {
    constructor(x, y, itemType, subType, parentDiv) {
        this.x = x;
        this.y = y;
        this.itemType = itemType;
        this.subType = subType;
        this.sprite = this.getSprite(itemType, subType);

        this.timeElapsed = 0;

        this.collisionObj = new CircleObject(x, y, toPixelSize(this.sprite[0].length * 6))

        this.itemDiv = createElem(parentDiv, "div", null, ["item"]);
        this.itemCanv = createElem(this.itemDiv, "canvas", null, null, this.sprite[0].length * toPixelSize(3), this.sprite.length * toPixelSize(3));

        this.itemDiv.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)';

        this.draw();
    }

    getSprite(itemType, subType) {
        switch (itemType) {
            case ItemType.POWER_UP:
                return getItemSprite(subType);
            case ItemType.WEAPON:
                return getWeaponSprite(subType);
        }
    }

    update() {
        if (this.timeElapsed / 1 >= 1) {
            if (circleToCircleCollision(GameVars.player.collisionObj, this.collisionObj)) {
                if (this.itemType == ItemType.WEAPON) {
                    if (GameVars.keys['v'] || GameVars.keys['V']) {
                        this.dropCurrentWeapon(GameVars.player.playerRightWeapon);
                        GameVars.player.playerRightWeapon.destroy();
                        GameVars.player.playerRightWeapon = new Weapon(0, 0, this.subType, -1, GameVars.player.playerDiv, playerColors.hd);
                        this.destroy();
                        GameVars.weaponIcons.update();
                    }
                    if (GameVars.keys['b'] || GameVars.keys['B']) {
                        this.dropCurrentWeapon(GameVars.player.playerLeftWeapon);
                        GameVars.player.playerLeftWeapon.destroy();
                        GameVars.player.playerLeftWeapon = new Weapon(0, 0, this.subType, 1, GameVars.player.playerDiv, playerColors.hd);
                        this.destroy();
                        GameVars.weaponIcons.update();
                    }
                }
            }
        } else {
            this.timeElapsed += GameVars.deltaTime;
        }
    }

    dropCurrentWeapon(weapon) {
        if (weapon.weaponType != WeaponType.FIST) {
            GameVars.currentRoom.items.push(
                new Item(this.x, this.y, ItemType.WEAPON, weapon.weaponType, GameVars.currentRoom.roomDiv)
            );
        }
    }

    destroy() {
        GameVars.currentRoom.items.splice(GameVars.currentRoom.items.indexOf(this), 1);
        this.itemDiv.parentNode.removeChild(this.itemDiv);
    }

    draw() {
        drawSprite(this.itemCanv, this.sprite, toPixelSize(3), null, null, { "wc": "#686b7a" });
    }
}