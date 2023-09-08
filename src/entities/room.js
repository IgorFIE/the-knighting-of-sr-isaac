import { BlockType } from "../enums/block-type";
import { DoorType } from "../enums/door-type";
import { EnemyType } from "../enums/enemy-type";
import { ItemType } from "../enums/item-type";
import { RoomType } from "../enums/room-type";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { circleToCircleCollision, distBetwenObjs } from "../utilities/collision-utilities";
import { createElem, setElemSize } from "../utilities/draw-utilities";
import { randomNumb, randomNumbOnRange } from "../utilities/general-utilities";
import { Block } from "./blocks/block";
import { Bonfire } from "./blocks/bonfire";
import { DoorTrigger } from "./blocks/door-trigger";
import { Spikes } from "./blocks/spikes";
import { Enemy } from "./enemy";
import { Item } from "./item";

export class Room {
    constructor(roomX, roomY) {
        // board position
        this.roomX = roomX;
        this.roomY = roomY;

        // translation position
        this.x = 0;
        this.y = 0;

        this.roomType = RoomType.EMPTY;

        this.items = [];
        this.enemies = [];
        this.projectiles = [];

        this.roomDiv = createElem(GameVars.gameDiv, "div", null, ["room"]);
        this.roomCanv = createElem(this.roomDiv, "canvas");
        this.doorCanv = createElem(this.roomDiv, "canvas");
        this.spikeCanv = createElem(this.roomDiv, "canvas");

        this.initRoomBlocks();
        this.populateRandomEnemies();
        this.createSpikes();
    }

    initRoomBlocks() {
        this.backBlocks = [];
        this.floors = [];
        this.walls = [];
        this.doors = [];
        this.doorTriggers = [];

        let obj, blockType;
        for (let y = 0; y < GameVars.roomHeight; y++) {
            this.backBlocks.push([]);
            for (let x = 0; x < GameVars.roomWidth; x++) {
                blockType = (y <= 1 || x <= 1 || y >= GameVars.roomHeight - 2 || x >= GameVars.roomWidth - 2) ? BlockType.WALL : BlockType.FLOOR;
                obj = new Block(this, x, y, blockType);
                this.backBlocks[y].push(obj);
                blockType === BlockType.WALL ? this.walls.push(obj) : this.floors.push(obj);
            }
        }
    }

    populateRandomEnemies() {
        let count = randomNumbOnRange(GameVars.gameLevel, GameVars.gameLevel + 1);
        count = count > 10 ? 10 : count;
        while (this.enemies.length !== count) {
            let newEnemy = new Enemy(this,
                randomNumbOnRange(GameVars.gameW / 3, (GameVars.gameW / 3) * 2),
                randomNumbOnRange(GameVars.gameH / 3, (GameVars.gameH / 3) * 2),
                EnemyType.BASIC);
            !this.enemies.find(enemy => circleToCircleCollision(newEnemy.collisionObj, enemy.collisionObj)) && this.enemies.push(newEnemy) || newEnemy.div.remove();
        }
    }

    createSpikes() {
        this.spikesBlocks = [];
        for (let y = 0; y < GameVars.roomHeight; y++) {
            for (let x = 0; x < GameVars.roomWidth; x++) {
                (y > 3 && y <= GameVars.roomHeight - 4 && x > 3 && x <= GameVars.roomWidth - 4) &&
                    !(y > 5 && y <= GameVars.roomHeight - 6 && x > 5 && x <= GameVars.roomWidth - 6) &&
                    randomNumb(100) < 5 &&
                    this.spikesBlocks.push(new Spikes(this, x, y));
            }
        }
    }

    setSpecialRoomType(roomType) {
        this.roomType = roomType;
        switch (this.roomType) {
            case RoomType.KEY:
                this.items.push(new Item(GameVars.gameW / 2, GameVars.gameH / 2, ItemType.KEY, null, this));
                break;
            case RoomType.TREASURE:
                this.cleanEnemies();
                this.items.push(new Item(
                    (GameVars.gameW / 2) + toPixelSize(randomNumbOnRange(-32, 32)),
                    (GameVars.gameH / 2) + toPixelSize(randomNumbOnRange(-32, 32)),
                    ItemType.HEART, null, this));
                const maxValue = GameVars.gameLevel + 6 >= Object.keys(WeaponType).length ? Object.keys(WeaponType).length - 1 : GameVars.gameLevel + 6;
                this.items.push(new Item(GameVars.gameW / 2, GameVars.gameH / 2, ItemType.WEAPON, randomNumbOnRange(maxValue - 3, maxValue), this));
                break;
            case RoomType.BOSS:
                this.cleanEnemies();
                this.items.push(new Bonfire((GameVars.gameW / 2), (GameVars.gameH / 2), this));
                this.enemies.push(new Enemy(this, GameVars.gameW / 2, GameVars.gameH / 2, EnemyType.BOSS));
                break;
        }
    }

    cleanEnemies() {
        while (this.enemies.length > 0) {
            this.enemies[0].destroy();
        }
    }

    removeSpikes() {
        this.spikeCanv.getContext("2d").clearRect(0, 0, this.spikeCanv.width, this.spikeCanv.height);
        this.spikesBlocks = [];
    }

    reInit() {
        this.roomDiv.classList.remove("hidden");
        this.initRoomBlocks();

        setElemSize(this.spikeCanv, toPixelSize(GameVars.gameWdAsPixels), toPixelSize(GameVars.gameHgAsPixels));
        this.spikeCanv.getContext("2d").clearRect(0, 0, this.spikeCanv.width, this.spikeCanv.height);
        this.spikesBlocks.forEach(spikes => {
            const newPos = GameVars.calcResizePos(spikes.collisionObj.x, spikes.collisionObj.y);
            spikes.init(newPos.x, newPos.y);
            spikes.draw();
        });

        this.projectiles.forEach(projectile => projectile.destroy());
        this.items.forEach(item => {
            const newPos = GameVars.calcResizePos(item.x, item.y);
            item.init(newPos.x, newPos.y);
        });
        this.enemies.forEach(enemy => {
            const newPos = GameVars.calcResizePos(enemy.collisionObj.x, enemy.collisionObj.y);
            enemy.init(newPos.x, newPos.y);
        });
        this.roomDiv.classList.add("hidden");
    }

    setDoor(startX, finishX, startY, finishY, xDir, yDir, doorType) {
        let block;
        for (let y = Math.round(startY); y <= Math.round(finishY); y++) {
            for (let x = Math.round(startX); x <= Math.round(finishX); x++) {
                block = this.backBlocks[y][x];
                this.walls.splice(this.walls.indexOf(block), 1);

                block.blockType = BlockType.DOOR_CLOSE;
                block.doorType = doorType;
                this.doors.push(block);

                this.backBlocks[y][x] = new DoorTrigger(this, block.blockRoomX, block.blockRoomY, BlockType.FLOOR, xDir, yDir);
                this.floors.push(this.backBlocks[y][x]);

                ((xDir === -1 && x === 0) || (xDir === 1 && x === this.backBlocks[0].length - 1) ||
                    (yDir === -1 && y === 0) || (yDir === 1 && y === this.backBlocks.length - 1)) && this.doorTriggers.push(this.backBlocks[y][x]);
            }
        }
    }

    update(x, y) {
        if (x !== undefined && y !== undefined) {
            let xAmount = x - this.x;
            let yAmount = y - this.y;
            this.x = x;
            this.y = y;
            this.roomDiv.style.translate = this.x + 'px ' + this.y + 'px';
            this.enemies.forEach(enemy => enemy.validateMovement(enemy.collisionObj.x + xAmount, enemy.collisionObj.y + yAmount, true));
            this.items.forEach(item => item.validateMovement(item.collisionObj.x + xAmount, item.collisionObj.y + yAmount));
            this.projectiles.forEach(projectile => projectile.destroy());
            this.projectiles = [];
        } else {
            this.items.forEach(item => item.update());
            this.enemies.forEach(enemy => enemy.update());
            this.projectiles = this.projectiles.filter(projectile => projectile.update());
            this.spikesBlocks.forEach(spikes => spikes.update());
        }
        this.enemies.length === 0 && this.openDoors();
    }

    openDoors() {
        const isKeyPressed = !!(GameVars.keys['v'] || GameVars.keys['V'] || GameVars.keys['b'] || GameVars.keys['B']);
        const shouldOpenTreasureDoor = isKeyPressed && GameVars.player.hasKey && this.checkIfInRangeOfPlayer(DoorType.TREASURE);
        const shouldOpenBossDoor = isKeyPressed && this.checkIfInRangeOfPlayer(DoorType.BOSS);
        const doorsToRedraw = this.doors.filter(door => {
            let oldBlockType = door.blockType;
            if (door.blockType !== BlockType.DOOR_OPEN) {
                switch (door.doorType) {
                    case DoorType.TREASURE:
                        if (shouldOpenTreasureDoor) {
                            door.blockType = BlockType.DOOR_OPEN;
                            GameVars.sound.openDoorSound();
                        }
                        break;
                    case DoorType.BOSS:
                        if (shouldOpenBossDoor) {
                            door.blockType = BlockType.DOOR_OPEN;
                            GameVars.sound.openDoorSound();
                        }
                        break;
                    default:
                        door.blockType = BlockType.DOOR_OPEN;
                        GameVars.sound.openDoorSound();
                        break;
                }
            }
            return oldBlockType !== door.blockType;
        });
        if (doorsToRedraw.length > 0) {
            this.doorCanv.getContext("2d").clearRect(0, 0, this.doorCanv.width, this.doorCanv.height);
            this.doors.forEach(door => door.draw());
        }
    }

    checkIfInRangeOfPlayer(doorType) {
        return !!this.doors.find(door => door.doorType === doorType && distBetwenObjs(GameVars.player.collisionObj, door.collisionObj) < toPixelSize(32));
    }

    draw() {
        setElemSize(this.roomCanv, toPixelSize(GameVars.gameWdAsPixels), toPixelSize(GameVars.gameHgAsPixels));
        setElemSize(this.doorCanv, toPixelSize(GameVars.gameWdAsPixels), toPixelSize(GameVars.gameHgAsPixels));
        setElemSize(this.spikeCanv, toPixelSize(GameVars.gameWdAsPixels), toPixelSize(GameVars.gameHgAsPixels));

        this.floors.forEach(block => block.draw());
        this.drawRoomShadows();
        this.walls.forEach(block => block.draw());
        this.doors.forEach(block => block.draw());
        this.spikesBlocks.forEach(spikes => spikes.draw());
    }

    drawRoomShadows() {
        const ctx = this.roomCanv.getContext("2d");
        ctx.fillStyle = "#00000033";
        ctx.fillRect(0, 0, toPixelSize(34), toPixelSize(GameVars.gameHgAsPixels));
        ctx.fillRect(toPixelSize(34), 0, toPixelSize(GameVars.gameWdAsPixels), toPixelSize(34));
        ctx.fillRect(this.backBlocks[0][this.backBlocks[0].length - 2].collisionObj.x - toPixelSize(2), toPixelSize(34), toPixelSize(34), toPixelSize(GameVars.gameHgAsPixels));
        ctx.fillRect(toPixelSize(34),
            this.backBlocks[this.backBlocks.length - 2][0].collisionObj.y - toPixelSize(2),
            this.backBlocks[this.backBlocks.length - 2][this.backBlocks[0].length - 4].collisionObj.x - toPixelSize(4),
            toPixelSize(34));
    }
}