import { CircleObject } from "../collision-objects/circle-object";
import { EnemyType } from "../enums/enemy-type";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { deadAnim } from "../utilities/animation-utilities";
import { genSmallBox } from "../utilities/box-generator";
import { rectCircleCollision, checkForCollisions, distBetwenObjs } from "../utilities/collision-utilities";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { createId, randomNumb, randomNumbOnRange } from "../utilities/general-utilities";
import { LifeBar } from "./life-bar";
import { enemyChainMailColors, knight } from "./sprites";
import { Weapon } from "./weapon";

export class Enemy {
    constructor(roomX, roomY, x, y, enemyType, roomDiv) {
        this.isAlive = true;
        this.id = createId();
        this.roomX = roomX;
        this.roomY = roomY;
        this.x = x;
        this.y = y;
        this.enemyType = enemyType;
        this.enemySize = enemyType === EnemyType.BASIC ? 2 : 4;
        this.roomCanv = roomDiv;

        this.enemyKeys = {};

        this.enemyChainColor = enemyChainMailColors[randomNumb(enemyChainMailColors.length)];

        this.collisionObj = new CircleObject(x, y, toPixelSize(enemyType === EnemyType.BASIC ? 4 : 8));
        this.fakeMovCircle = new CircleObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r);

        this.div = createElem(roomDiv, "div", null, ["enemy"]);

        this.shadowCanv = createElem(this.div, "canvas", null, null, toPixelSize(this.enemySize) * 7, toPixelSize(this.enemySize) * 6);
        this.shadowCanv.style.transform = 'translate(' + -toPixelSize(this.enemySize * 2) + 'px, ' + toPixelSize(this.enemySize * 4) + 'px)';

        this.enemyCanv = createElem(this.div, "canvas", null, null,
            knight[0].length * toPixelSize(this.enemySize),
            knight.length * toPixelSize(this.enemySize));

        this.enemyRightWeapon = new Weapon(0, 0, WeaponType.SWORD, -1, this, "#686b7a", this.enemySize);
        this.enemyLeftWeapon = new Weapon(0, 0, WeaponType.FIST, 1, this, "#686b7a", this.enemySize);

        this.lifeBar = new LifeBar((enemyType === EnemyType.BASIC ? randomNumbOnRange(1, 2) : randomNumbOnRange(6, 8)) * GameVars.heartLifeVal, false, this.div);

        this.draw();

        let rect = this.enemyCanv.getBoundingClientRect();
        this.div.style.width = rect.width + "px";
        this.div.style.height = rect.height + "px";
        this.div.style.transformOrigin = "70% 95%";
    }

    update() {
        if (this.lifeBar.life > 0) {
            this.handleInput();
            this.atk();
            this.lifeBar.update();
        } else {
            if (this.isAlive) {
                this.lifeBar.update();
                this.isAlive = false;
                this.div.animate(deadAnim(this.div.style.transform), { duration: 500, fill: "forwards" }).finished.then(() => {
                    this.destroy();
                });
            }
        }
        this.enemyKeys = {};
    }

    handleInput() {
        let newRectX = this.collisionObj.x;
        let newRectY = this.collisionObj.y;

        const xDistance = GameVars.player.collisionObj.x - this.collisionObj.x;
        const yDistance = GameVars.player.collisionObj.y - this.collisionObj.y;

        if (xDistance < -toPixelSize(2) || xDistance > toPixelSize(2)) {
            xDistance > 0 ? this.enemyKeys['d'] = true : this.enemyKeys['a'] = true;
        }

        if (yDistance < -toPixelSize(2) || yDistance > toPixelSize(2)) {
            yDistance > 0 ? this.enemyKeys['s'] = true : this.enemyKeys['w'] = true;
        }

        const movKeys = Object.keys(this.enemyKeys).filter((key) => (key === 'w' || key === 's' || key === 'a' || key === 'd') && this.enemyKeys[key]);
        if (movKeys.length > 0) {
            this.enemyCanv.style.animation = "walk 0.16s infinite ease-in-out";
            this.enemyLeftWeapon.weaponCanv.style.animation = this.enemyLeftWeapon.isPerformingAction ? "" : "weaponWalkLeft 0.16s infinite ease-in-out";
            this.enemyRightWeapon.weaponCanv.style.animation = this.enemyRightWeapon.isPerformingAction ? "" : "weaponWalkRight 0.16s infinite ease-in-out";
        } else {
            this.enemyCanv.style.animation = "";
            this.enemyLeftWeapon.weaponCanv.style.animation = "";
            this.enemyRightWeapon.weaponCanv.style.animation = "";
        }

        // //todo momentarily solution
        const enemySpeed = toPixelSize(1);
        const distance = movKeys.length > 1 ? enemySpeed / 1.4142 : enemySpeed;

        if (this.enemyKeys['d']) { newRectX += distance; }
        if (this.enemyKeys['a']) { newRectX -= distance; }
        if (this.enemyKeys['w']) { newRectY -= distance; }
        if (this.enemyKeys['s']) { newRectY += distance; }

        this.validateMovement(this.collisionObj.x, newRectY);
        this.validateMovement(newRectX, this.collisionObj.y);
    }

    validateMovement(x, y, ignoreCollisions) {
        this.fakeMovCircle.x = x;
        this.fakeMovCircle.y = y;
        ignoreCollisions ? this.move(this.fakeMovCircle) : checkForCollisions(this.fakeMovCircle, this.roomX, this.roomY, (circle) => this.move(circle), this);
    }

    move(circle) {
        this.collisionObj.x = circle.x;
        this.collisionObj.y = circle.y;
        this.div.style.transform = 'translate(' +
            (this.collisionObj.x - (knight[0].length * toPixelSize(this.enemySize)) / 2) + 'px, ' +
            (this.collisionObj.y - (knight.length * toPixelSize(this.enemySize)) / 4 * 3) + 'px)';
    }

    atk() {
        if (distBetwenObjs(GameVars.player.collisionObj, this.collisionObj) < this.getWeaponDistance(this.enemyRightWeapon)) {
            this.enemyRightWeapon.action();
        }
        if (distBetwenObjs(GameVars.player.collisionObj, this.collisionObj) < this.getWeaponDistance(this.enemyLeftWeapon)) {
            this.enemyLeftWeapon.action();
        }

        this.enemyRightWeapon.update();
        this.enemyLeftWeapon.update();
    }

    getWeaponDistance(weapon) {
        switch (weapon.weaponType) {
            case WeaponType.FIST:
                return toPixelSize(weapon.sprite.length * weapon.size) * 4;
            default:
                return toPixelSize(weapon.sprite.length * weapon.size) * 2;
        }
    }

    draw() {
        genSmallBox(this.shadowCanv, 0, 0, 6, 5, toPixelSize(this.enemySize), "#00000033", "#00000033");
        drawSprite(this.enemyCanv, knight, toPixelSize(this.enemySize), 0, 0, { "hd": "#999a9e", "hl": "#686b7a", "cm": this.enemyChainColor });
    }

    destroy() {
        this.div.parentNode.removeChild(this.div);
        GameVars.gameBoard.board[this.roomY][this.roomX].enemies.splice(
            GameVars.gameBoard.board[this.roomY][this.roomX].enemies.indexOf(this), 1);
    }
}