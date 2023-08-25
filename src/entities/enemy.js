import { CircleObject } from "../collision-objects/circle-object";
import { EnemyType } from "../enums/enemy-type";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { deadAnim } from "../utilities/animation-utilities";
import { genSmallBox } from "../utilities/box-generator";
import { rectCircleCollision, checkForCollisions, distBetwenObjs, circleToCircleCollision } from "../utilities/collision-utilities";
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

        this.enemyChainColor = enemyChainMailColors[randomNumb(enemyChainMailColors.length)];

        this.collisionObj = new CircleObject(x, y, toPixelSize(this.enemySize * 2));
        this.fakeMovCircle = new CircleObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r);

        this.enemyKeys = {};
        this.targetPos = new CircleObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r);
        this.movTimeElapsed = 0;

        this.div = createElem(roomDiv, "div", null, ["enemy"]);

        this.shadowCanv = createElem(this.div, "canvas", null, null, toPixelSize(this.enemySize) * 7, toPixelSize(this.enemySize) * 6);
        this.shadowCanv.style.transform = 'translate(' + -toPixelSize(this.enemySize * 2) + 'px, ' + toPixelSize(this.enemySize * 4) + 'px)';

        this.enemyCanv = createElem(this.div, "canvas", null, null,
            knight[0].length * toPixelSize(this.enemySize),
            knight.length * toPixelSize(this.enemySize));

        this.setEnemyWeapons();

        this.lifeBar = new LifeBar(this.getEnemyLife() * GameVars.heartLifeVal, false, this.div);

        this.draw();

        let rect = this.enemyCanv.getBoundingClientRect();
        this.div.style.width = rect.width + "px";
        this.div.style.height = rect.height + "px";
        this.div.style.transformOrigin = "70% 95%";
    }

    setEnemyWeapons() {
        if (GameVars.gameLevel === 1) {
            this.enemyRightWeapon = new Weapon(0, 0, WeaponType.FIST, -1, this, "#686b7a", this.enemySize);
            this.enemyLeftWeapon = new Weapon(0, 0, WeaponType.FIST, 1, this, "#686b7a", this.enemySize);
        } else if (GameVars.gameLevel === 2) {
            const isLeftWeapon = randomNumb(2) === 0;
            this.enemyRightWeapon = new Weapon(0, 0, isLeftWeapon ? WeaponType.FIST : randomNumbOnRange(1, 3), -1, this, "#686b7a", this.enemySize);
            this.enemyLeftWeapon = new Weapon(0, 0, isLeftWeapon ? randomNumbOnRange(1, 3) : WeaponType.FIST, 1, this, "#686b7a", this.enemySize);
        } else {
            this.enemyRightWeapon = new Weapon(0, 0, randomNumbOnRange(1, 3), -1, this, "#686b7a", this.enemySize);
            this.enemyLeftWeapon = new Weapon(0, 0, randomNumbOnRange(1, 3), 1, this, "#686b7a", this.enemySize);
        }
    }

    getEnemyLife() {
        if (GameVars.gameLevel === 1) {
            return this.enemyType === EnemyType.BASIC ? 1 : 6;
        } else if (GameVars.gameLevel === 2) {
            return this.enemyType === EnemyType.BASIC ? randomNumbOnRange(1, 2) : randomNumbOnRange(6, 8);
        } else {
            return this.enemyType === EnemyType.BASIC ? randomNumbOnRange(2, 3) : randomNumbOnRange(8, 10);
        }
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

        if (distBetwenObjs(this.collisionObj, GameVars.player.collisionObj) < toPixelSize(32)) {
            if (circleToCircleCollision(this.collisionObj, this.targetPos) || this.movTimeElapsed / 0.4 >= 1) {
                this.setTargetPosWeaponBased();
                this.movTimeElapsed = 0;
            } else {
                this.movTimeElapsed += GameVars.deltaTime;
            }
        } else {
            this.targetPos.x = GameVars.player.collisionObj.x;
            this.targetPos.y = GameVars.player.collisionObj.y;
        }


        const xDistance = this.targetPos.x - this.collisionObj.x;
        const yDistance = this.targetPos.y - this.collisionObj.y;

        if (xDistance < -toPixelSize(4) || xDistance > toPixelSize(4)) {
            xDistance > 0 ? this.enemyKeys['d'] = true : this.enemyKeys['a'] = true;
        }

        if (yDistance < -toPixelSize(4) || yDistance > toPixelSize(4)) {
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

        const enemySpeed = toPixelSize(1);
        const distance = movKeys.length > 1 ? enemySpeed / 1.4142 : enemySpeed;

        if (this.enemyKeys['d']) { newRectX += distance; }
        if (this.enemyKeys['a']) { newRectX -= distance; }
        if (this.enemyKeys['w']) { newRectY -= distance; }
        if (this.enemyKeys['s']) { newRectY += distance; }

        this.validateMovement(this.collisionObj.x, newRectY);
        this.validateMovement(newRectX, this.collisionObj.y);
    }

    setTargetPosWeaponBased() {
        this.targetPos.x = GameVars.player.collisionObj.x;
        this.targetPos.y = GameVars.player.collisionObj.y;

        let weaponToUse = randomNumb(2) === 0 ? this.enemyLeftWeapon : this.enemyRightWeapon;
        switch (weaponToUse.weaponType) {
            case WeaponType.FIST:
            case WeaponType.SHIELD:
                this.targetPos.x += toPixelSize(randomNumbOnRange(-32, 32));
                this.targetPos.y += toPixelSize(randomNumbOnRange(-32, -2));
                break;
            case WeaponType.SWORD:
                this.targetPos.x += toPixelSize(weaponToUse.handDir > 0 ? randomNumbOnRange(-32, -2) : randomNumbOnRange(2, 32));
                this.targetPos.y += toPixelSize(randomNumbOnRange(-32, 32));
                break;
            case WeaponType.GREATSWORD:
                this.targetPos.x += toPixelSize(randomNumbOnRange(-32, 32));
                this.targetPos.y += toPixelSize(randomNumbOnRange(-32, 32));
                break;
        }
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