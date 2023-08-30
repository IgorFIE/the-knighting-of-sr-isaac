import { CircleObject } from "../collision-objects/circle-object";
import { ItemType } from "../enums/item-type";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { circleToCircleCollision } from "../utilities/collision-utilities";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { fullHeartColors, getWeaponSprite, heart, key } from "./sprites";
import { Weapon } from "./weapon";

export class Item {
    constructor(x, y, itemType, subType, parentDiv) {
        this.wasPicked = false;
        this.x = x;
        this.y = y;
        this.itemType = itemType;
        this.subType = subType;
        this.sprite = this.getSprite(itemType, subType);
        this.size = toPixelSize(itemType === ItemType.HEART ? 1 : 2);

        this.timeElapsed = 0;

        this.collisionObj = new CircleObject(
            x + (this.sprite[0].length * this.size / 2),
            y + (this.sprite.length * this.size / 2),
            (this.sprite[0].length > this.sprite.length ? this.sprite[0].length : this.sprite.length) * this.size / 2);
        this.fakeMovCircle = new CircleObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r);

        this.itemDiv = createElem(parentDiv, "div", null, ["item"]);
        this.itemCanv = createElem(this.itemDiv, "canvas", null, null, this.sprite[0].length * this.size, this.sprite.length * this.size);

        this.itemDiv.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)';

        this.draw();
    }

    getSprite(itemType, subType) {
        switch (itemType) {
            case ItemType.KEY:
                return key;
            case ItemType.HEART:
                return heart;
            case ItemType.WEAPON:
                return getWeaponSprite(subType);
        }
    }

    update() {
        if (this.timeElapsed / 1 >= 1) {
            if (circleToCircleCollision(GameVars.player.collisionObj, this.collisionObj)) {
                switch (this.itemType) {
                    case ItemType.KEY:
                        GameVars.keyCaught++;
                        GameVars.player.hasKey = true;
                        this.wasPicked = true;
                        break;
                    case ItemType.HEART:
                        if (GameVars.player.lifeBar.life !== GameVars.player.lifeBar.totalLife) {
                            GameVars.player.lifeBar.addLife();
                            this.wasPicked = true;
                        }
                        break;
                    case ItemType.WEAPON:
                        if (!this.wasPicked && (GameVars.keys['v'] || GameVars.keys['B'])) {
                            this.wasPicked = true;
                            this.dropCurrentWeapon(GameVars.player.playerRightWeapon);
                            GameVars.player.playerRightWeapon.destroy();
                            GameVars.player.playerRightWeapon = new Weapon(0, 0, this.subType, -1, GameVars.player, "#cd9722");
                            GameVars.weaponIcons.update();
                        }
                        if (!this.wasPicked && (GameVars.keys['b'] || GameVars.keys['B'])) {
                            this.wasPicked = true;
                            this.dropCurrentWeapon(GameVars.player.playerLeftWeapon);
                            GameVars.player.playerLeftWeapon.destroy();
                            GameVars.player.playerLeftWeapon = new Weapon(0, 0, this.subType, 1, GameVars.player, "#cd9722");
                            GameVars.weaponIcons.update();
                        }
                        break;
                }
                if (this.wasPicked) {
                    GameVars.sound.pickItem();
                    this.destroy();
                }
            }
        } else {
            this.timeElapsed += GameVars.deltaTime;
        }
    }

    validateMovement(x, y) {
        this.collisionObj.x = x;
        this.collisionObj.y = y;
        this.itemDiv.style.transform = 'translate(' +
            (this.collisionObj.x - (this.sprite[0].length * this.size) / 2) + 'px, ' +
            (this.collisionObj.y - (this.sprite.length * this.size) / 2) + 'px)';
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
        drawSprite(this.itemCanv, this.sprite, this.size, null, null, this.itemType === ItemType.HEART ? fullHeartColors : { "wc": "#686b7a" });
    }
}