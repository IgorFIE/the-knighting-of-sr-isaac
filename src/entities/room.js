import { BlockType } from "../enums/block-type";
import { RoomType } from "../enums/room-type";
import { GameVars, toPixelSize } from "../game-variables";
import { createElem } from "../utilities/draw-utilities";
import { Block } from "./blocks/block";
import { DoorTrigger } from "./blocks/door-trigger";

export class Room {
    constructor(roomX, roomY) {
        this.isDoorsOpen = false;
        this.roomX = roomX;
        this.roomY = roomY;

        this.x = 0;
        this.y = 0;

        this.roomType = RoomType.EMPTY;
        this.backBlocks = [];
        this.frontBlocks = [];
        this.floors = [];
        this.walls = [];
        this.doors = [];
        this.doorTriggers = [];
        this.items = [];
        this.enemies = [];

        this.roomDiv = createElem(GameVars.gameDiv, "div", null, ["room", "hidden"]);
        this.roomCanv = createElem(this.roomDiv, "canvas", null, null, toPixelSize(GameVars.gameWdAsPixels), toPixelSize(GameVars.gameHgAsPixels));

        this.initRoomBlocks();
    }

    initRoomBlocks() {
        let obj;
        let blockType;
        for (let y = 0; y < GameVars.roomHeight; y++) {
            this.backBlocks.push([]);
            this.frontBlocks.push([]);
            for (let x = 0; x < GameVars.roomWidth; x++) {
                blockType = (y <= 1 || x <= 1 || y >= GameVars.roomHeight - 2 || x >= GameVars.roomWidth - 2) ? BlockType.WALL : BlockType.FLOOR;
                obj = new Block(this, x, y, blockType);
                this.backBlocks[y].push(obj);
                blockType === BlockType.WALL ? this.walls.push(obj) : this.floors.push(obj);
                this.frontBlocks[y].push(null);
            }
        }
    }

    setSpecialRoomType(roomType) {
        this.roomType = roomType;
        let heightCenter = Math.floor(GameVars.roomHeight / 2);
        let widthCenter = Math.floor(GameVars.roomWidth / 2);
        if (this.roomType == RoomType.KEY) {
            this.frontBlocks[heightCenter][widthCenter] = new Block(this, widthCenter, heightCenter, BlockType.KEY);
        } else if (this.roomType == RoomType.TREASURE) {
            this.frontBlocks[heightCenter][widthCenter] = new Block(this, widthCenter, heightCenter, BlockType.TREASURE);
        } else if (this.roomType == RoomType.BOSS) {
            this.frontBlocks[heightCenter][widthCenter] = new Block(this, widthCenter, heightCenter, BlockType.BOSS);
        }
    }

    setDoor(startX, finishX, startY, finishY, xDir, yDir) {
        let block;
        for (let y = Math.round(startY); y <= Math.round(finishY); y++) {
            for (let x = Math.round(startX); x <= Math.round(finishX); x++) {
                block = this.backBlocks[y][x];
                this.walls.splice(this.walls.indexOf(block), 1);

                block.blockType = BlockType.DOOR_OPEN;
                this.doors.push(block);

                this.backBlocks[y][x] = new DoorTrigger(this, block.blockRoomX, block.blockRoomY, BlockType.FLOOR, xDir, yDir);
                this.floors.push(this.backBlocks[y][x]);

                if ((xDir === -1 && x === 0) || (xDir === 1 && x === this.backBlocks[0].length - 1) ||
                    (yDir === -1 && y === 0) || (yDir === 1 && y === this.backBlocks.length - 1)) {
                    this.doorTriggers.push(this.backBlocks[y][x]);
                }
            }
        }
    }

    update(x, y) {
        if (x != null && y != null) {
            this.x = x;
            this.y = y;
            this.roomDiv.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        }
        this.items.forEach(item => item.update());
        this.enemies.forEach(enemy => enemy.update());
    }

    draw() {
        this.floors.forEach(block => block.draw());
        this.drawRoomShadows();
        this.walls.forEach(block => block.draw());
        this.doors.forEach(block => block.draw());
        // this.frontBlocks.forEach(row => row.forEach(block => block?.draw()));
    }

    drawRoomShadows() {
        let ctx = this.roomCanv.getContext("2d");
        ctx.fillStyle = "#00000033";
        ctx.fillRect(0, 0, toPixelSize(34), toPixelSize(GameVars.gameHgAsPixels));
        ctx.fillRect(toPixelSize(34), 0, toPixelSize(GameVars.gameWdAsPixels), toPixelSize(34));
        ctx.fillRect(this.backBlocks[0][this.backBlocks[0].length - 2].collisionObj.x - toPixelSize(2), toPixelSize(34), toPixelSize(34), toPixelSize(GameVars.gameHgAsPixels));
        ctx.fillRect(toPixelSize(34),
            this.backBlocks[this.backBlocks.length - 2][0].collisionObj.y - toPixelSize(2),
            this.backBlocks[this.backBlocks.length - 2][this.backBlocks[0].length - 4].collisionObj.x - toPixelSize(4),
            toPixelSize(34));
    }

    consoleLogRoom() {
        let room = "";
        for (let y = 0; y < GameVars.roomHeight; y++) {
            let newLine = "";
            for (let x = 0; x < GameVars.roomWidth; x++) {
                if (this.backBlocks[y][x].blockType == BlockType.WALL) {
                    newLine += "#";
                } else if (this.frontBlocks[y][x]?.blockType == BlockType.KEY) {
                    newLine += "K";
                } else if (this.frontBlocks[y][x]?.blockType == BlockType.TREASURE) {
                    newLine += "T";
                } else if (this.frontBlocks[y][x]?.blockType == BlockType.BOSS) {
                    newLine += "B";
                } else {
                    newLine += " ";
                }
            }
            room += newLine + "\n";
        }
        console.log(room);
    }
}