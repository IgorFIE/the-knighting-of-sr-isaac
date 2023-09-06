import { CircleObject } from "../collision-objects/circle-object";
import { EnemySubType, EnemyType, enemyChainMailColors } from "../enums/enemy-type";
import { ItemType } from "../enums/item-type";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { deadAnim } from "../utilities/animation-utilities";
import { genSmallBox } from "../utilities/box-generator";
import { checkForCollisions, distBetwenObjs, circleToCircleCollision } from "../utilities/collision-utilities";
import { createElem, drawSprite, setElemSize } from "../utilities/draw-utilities";
import { randomNumb, randomNumbOnRange } from "../utilities/general-utilities";
import { Item } from "./item";
import { LifeBar } from "./life-bar";
import { knight } from "./sprites";
import { Weapon } from "./weapon";

export class Enemy {
    constructor(room, x, y, enemyType, enemySubType) {
        this.isAlive = true;
        this.room = room;

        this.enemyType = enemyType;
        this.enemySubType = enemySubType || enemyChainMailColors[randomNumb(3)];
        this.enemySize = enemyType === EnemyType.BASIC ? 2 : 4;
        this.enemySpeed = 1 + (randomNumbOnRange(-5, 0) / 10);

        this.enemyKeys = new Map();
        this.movTimeElapsed = 0;

        this.div = createElem(room.roomDiv, "div", null, ["enemy"]);
        this.shadowCanv = createElem(this.div, "canvas");
        this.enemyCanv = createElem(this.div, "canvas");

        this.lifeBar = new LifeBar(this.getEnemyLife() * GameVars.heartLifeVal, false, this.div);

        this.init(x, y);
    }

    init(x, y) {
        this.activationDistance = this.enemySize * this.getEnemyDistance();

        this.collisionObj = new CircleObject(x, y, toPixelSize(this.enemySize * 2));
        this.fakeMovCircle = new CircleObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r);
        this.targetPos = new CircleObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r);

        setElemSize(this.shadowCanv, toPixelSize(this.enemySize) * 7, toPixelSize(this.enemySize) * 6);
        this.shadowCanv.style.translate = -toPixelSize(this.enemySize * 2) + 'px ' + toPixelSize(this.enemySize * 4) + 'px';

        setElemSize(this.enemyCanv, knight[0].length * toPixelSize(this.enemySize), knight.length * toPixelSize(this.enemySize));

        this.setEnemyWeapons();

        this.lifeBar.init();

        this.draw();
    }

    getEnemyDistance() {
        switch (this.enemySubType) {
            case EnemySubType.AGRESSIVE:
                return 8;
            case EnemySubType.DEFENSIVE:
                return 16;
        }
        return 19;
    }

    setEnemyWeapons() {
        if (this.enemyRightWeapon) {
            this.enemyRightWeapon.init();
            this.enemyLeftWeapon.init();
        } else {
            const maxValue = GameVars.gameLevel + 2 >= Object.keys(WeaponType).length ? Object.keys(WeaponType).length - 1 : GameVars.gameLevel + 2;
            if (GameVars.gameLevel < 4) {
                const isLeftWeapon = randomNumb(2) === 0;
                this.enemyRightWeapon = new Weapon(isLeftWeapon ? WeaponType.FIST : randomNumbOnRange(0, maxValue), -1, this, "#686b7a", this.enemySize);
                this.enemyLeftWeapon = new Weapon(isLeftWeapon ? randomNumbOnRange(0, maxValue) : WeaponType.FIST, 1, this, "#686b7a", this.enemySize);
            } else {
                const isLeftWeapon = randomNumb(2) === 0;
                this.enemyRightWeapon = new Weapon(isLeftWeapon ? WeaponType.SHIELD : randomNumbOnRange(2, maxValue), -1, this, "#686b7a", this.enemySize);
                this.enemyLeftWeapon = new Weapon(isLeftWeapon ? randomNumbOnRange(2, maxValue) : WeaponType.SHIELD, 1, this, "#686b7a", this.enemySize);
            }
        }

        this.rightWeaponActivationRange = this.getWeaponDistance(this.enemyRightWeapon);
        this.leftWeaponActivationRange = this.getWeaponDistance(this.enemyLeftWeapon);

        this.priorityWeapon = (this.enemyRightWeapon.weaponType === WeaponType.FIST || this.enemyRightWeapon.weaponType === WeaponType.SHIELD) ? this.enemyLeftWeapon : this.enemyRightWeapon;
    }

    getWeaponDistance(weapon) {
        return toPixelSize(weapon.sprite.length * weapon.size) * (weapon.weaponType === WeaponType.FIST ? 4 : 2);
    }

    getEnemyLife() {
        if (GameVars.gameLevel < 3) {
            return this.enemyType === EnemyType.BASIC ? 1 : 6;
        } else if (GameVars.gameLevel < 5) {
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
                this.enemyType === EnemyType.BOSS ? GameVars.enemyBossKills++ : GameVars.enemyKills++;
                GameVars.sound.deadSound();
                this.lifeBar.update();
                this.isAlive = false;
                this.div.animate(deadAnim(this.div.style.transform), { duration: 500, fill: "forwards" }).finished.then(() => {
                    if (this.enemyType === EnemyType.BOSS) {
                        for (let i = randomNumbOnRange(1, 2); i > 0; i--) {
                            this.room.items.push(new Item(
                                (GameVars.gameW / 2) + toPixelSize(randomNumbOnRange(-32, 32)),
                                (GameVars.gameH / 2) + toPixelSize(randomNumbOnRange(-32, 32)),
                                ItemType.HEART, null, this.room));
                        }
                    }
                    this.destroy();
                });
            }
        }
    }

    handleInput() {
        let newRectX = this.collisionObj.x;
        let newRectY = this.collisionObj.y;

        this.setTargetPosBasedOnEnemySubType();

        const xDistance = this.targetPos.x - this.collisionObj.x;
        const yDistance = this.targetPos.y - this.collisionObj.y;

        if (xDistance < -toPixelSize(4) || xDistance > toPixelSize(4)) {
            xDistance > 0 ? this.enemyKeys.set('d', true) : this.enemyKeys.set('a', true);
        }

        if (yDistance < -toPixelSize(4) || yDistance > toPixelSize(4)) {
            yDistance > 0 ? this.enemyKeys.set('s', true) : this.enemyKeys.set('w', true);
        }

        if (this.enemyKeys.size > 0) {
            this.enemyCanv.style.animation = "walk 0.16s infinite ease-in-out";
            this.enemyLeftWeapon.weaponCanv.style.animation = this.enemyLeftWeapon.isPerformingAction ? "" : "weaponWalkLeft 0.16s infinite ease-in-out";
            this.enemyRightWeapon.weaponCanv.style.animation = this.enemyRightWeapon.isPerformingAction ? "" : "weaponWalkRight 0.16s infinite ease-in-out";
            GameVars.sound.walkSound();
        } else {
            this.enemyCanv.style.animation = "";
            this.enemyLeftWeapon.weaponCanv.style.animation = "";
            this.enemyRightWeapon.weaponCanv.style.animation = "";
        }

        const distance = toPixelSize(this.enemyKeys.size > 1 ? this.enemySpeed / 1.4142 : this.enemySpeed);
        if (this.enemyKeys.has('d')) { newRectX += distance; }
        if (this.enemyKeys.has('a')) { newRectX -= distance; }
        if (this.enemyKeys.has('w')) { newRectY -= distance; }
        if (this.enemyKeys.has('s')) { newRectY += distance; }

        this.enemyKeys.clear();

        this.validateMovement(this.collisionObj.x, newRectY);
        this.validateMovement(newRectX, this.collisionObj.y);
    }

    setTargetPosBasedOnEnemySubType() {
        switch (this.enemySubType) {
            case EnemySubType.AGRESSIVE:
                if (distBetwenObjs(this.collisionObj, GameVars.player.collisionObj) < toPixelSize(this.activationDistance)) {
                    if (circleToCircleCollision(this.collisionObj, this.targetPos) || this.movTimeElapsed / 0.4 >= 1) {
                        this.setTargetPosWeaponBased(this.activationDistance);
                        this.movTimeElapsed = 0;
                    } else {
                        this.movTimeElapsed += GameVars.deltaTime;
                    }
                } else {
                    this.targetPos.x = GameVars.player.collisionObj.x;
                    this.targetPos.y = GameVars.player.collisionObj.y;
                }
                break;

            case EnemySubType.DEFENSIVE:
                if (this.movTimeElapsed / 0.2 >= 1) {
                    if (circleToCircleCollision(this.collisionObj, this.targetPos) || randomNumb(100) < 66) {
                        this.setTargetPosWeaponBased(this.activationDistance);
                    } else {
                        this.targetPos.x = this.collisionObj.x;
                        this.targetPos.y = this.collisionObj.y;
                    }
                    this.movTimeElapsed = 0;
                } else {
                    this.movTimeElapsed += GameVars.deltaTime;
                }
                break;

            case EnemySubType.AFRAID:
                if (this.movTimeElapsed / 0.6 >= 1) {
                    if (distBetwenObjs(this.collisionObj, GameVars.player.collisionObj) <= toPixelSize(this.activationDistance)) {
                        let xDiff = Math.round(this.collisionObj.x - GameVars.player.collisionObj.x);
                        let yDiff = Math.round(this.collisionObj.y - GameVars.player.collisionObj.y);

                        this.targetPos.x = this.collisionObj.x + (Math.abs(xDiff) < toPixelSize(20) ? randomNumbOnRange(-this.activationDistance * 2, this.activationDistance * 2) : xDiff);
                        this.targetPos.y = this.collisionObj.y + (Math.abs(yDiff) < toPixelSize(20) ? randomNumbOnRange(-this.activationDistance * 2, this.activationDistance * 2) : yDiff);

                        this.movTimeElapsed = 0;
                    } else {
                        if (randomNumb(2) === 0) {
                            this.setTargetPosWeaponBased(this.activationDistance);
                        } else {
                            this.targetPos.x = this.collisionObj.x;
                            this.targetPos.y = this.collisionObj.y;
                        }
                        this.movTimeElapsed = 0;
                    }
                } else {
                    this.movTimeElapsed += GameVars.deltaTime;
                }
                break;
        }
    }

    setTargetPosWeaponBased(distance) {
        this.targetPos.x = GameVars.player.collisionObj.x;
        this.targetPos.y = GameVars.player.collisionObj.y;
        switch (this.priorityWeapon.weaponType) {
            case WeaponType.FIST:
            case WeaponType.SHIELD:
            case WeaponType.SPEAR:
                this.targetPos.x += toPixelSize(randomNumbOnRange(-distance, distance));
                this.targetPos.y += toPixelSize(randomNumbOnRange(-distance, -distance / 8));
                break;
            case WeaponType.SWORD:
            case WeaponType.AXE:
            case WeaponType.MORNING_STAR:
                this.targetPos.x += toPixelSize(this.priorityWeapon.handDir > 0 ? randomNumbOnRange(-distance, -distance / 8) : randomNumbOnRange(distance / 8, distance));
                this.targetPos.y += toPixelSize(randomNumbOnRange(-distance, distance));
                break;
            case WeaponType.HAMMER:
            case WeaponType.HALBERD:
                this.targetPos.x += toPixelSize(this.priorityWeapon.handDir > 0 ? randomNumbOnRange(-distance, -distance / 8) : randomNumbOnRange(distance / 8, distance));
                this.targetPos.y += toPixelSize(randomNumbOnRange(distance / 8, distance));
                break;
            case WeaponType.GREATSWORD:
                this.targetPos.x += toPixelSize(randomNumbOnRange(-distance, distance));
                this.targetPos.y += toPixelSize(randomNumbOnRange(-distance, distance));
                break;
        }
    }

    validateMovement(x, y, ignoreCollisions) {
        this.fakeMovCircle.x = x;
        this.fakeMovCircle.y = y;
        ignoreCollisions ? this.move(this.fakeMovCircle) : checkForCollisions(this.fakeMovCircle, this.room.roomX, this.room.roomY, (circle) => this.move(circle), this);
    }

    move(circle) {
        this.collisionObj.x = circle.x;
        this.collisionObj.y = circle.y;
        this.div.style.translate = (this.collisionObj.x - (knight[0].length * toPixelSize(this.enemySize)) / 2) + 'px ' +
            (this.collisionObj.y - (knight.length * toPixelSize(this.enemySize)) / 4 * 3) + 'px';
    }

    atk() {
        distBetwenObjs(GameVars.player.collisionObj, this.collisionObj) < this.rightWeaponActivationRange && randomNumb(100) < this.atkProbablility() && this.enemyRightWeapon.action();
        distBetwenObjs(GameVars.player.collisionObj, this.collisionObj) < this.leftWeaponActivationRange && randomNumb(100) < this.atkProbablility() && this.enemyLeftWeapon.action();

        this.enemyRightWeapon.update();
        this.enemyLeftWeapon.update();
    }

    atkProbablility() {
        switch (this.enemySubType) {
            case EnemySubType.AGRESSIVE:
                return 75;
            case EnemySubType.DEFENSIVE:
                return 50;
        }
        return 25;
    }

    draw() {
        genSmallBox(this.shadowCanv, 0, 0, 6, 5, toPixelSize(this.enemySize), "#00000033", "#00000033");
        drawSprite(this.enemyCanv, knight, toPixelSize(this.enemySize), 0, 0, { "hd": "#999a9e", "hl": "#686b7a", "cm": this.enemySubType });

        let enemyRect = this.enemyCanv.getBoundingClientRect();
        this.div.style.width = enemyRect.width + "px";
        this.div.style.height = enemyRect.height + "px";
        this.div.style.transformOrigin = "70% 95%";
    }

    destroy() {
        this.div.remove();
        this.room.enemies.splice(this.room.enemies.indexOf(this), 1);
    }
}