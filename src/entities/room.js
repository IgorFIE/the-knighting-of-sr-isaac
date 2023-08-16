import { BlockType } from "../enums/block-type";
import { RoomType } from "../enums/room-type";
import { GameVars, toPixelSize } from "../game-variables";
import { createElem } from "../utilities/draw-utilities";
import { Block } from "./block";

export class Room {
    constructor(roomX, roomY) {
        this.roomX = roomX;
        this.roomY = roomY;
        this.roomType = RoomType.EMPTY;
        this.backBlocks = [];
        this.frontBlocks = [];
        this.walls = [];

        this.roomCanv = createElem(GameVars.gameDiv, "canvas", null, ["hidden"], toPixelSize(GameVars.gameWdAsPixels), toPixelSize(GameVars.gameHgAsPixels));

        this.initRoomBlocks();
    }

    initRoomBlocks() {
        let obj;
        for (let y = 0; y < GameVars.roomHeight; y++) {
            this.backBlocks.push([]);
            this.frontBlocks.push([]);
            for (let x = 0; x < GameVars.roomWidth; x++) {
                if (y <= 1 || x <= 1 || y >= GameVars.roomHeight - 2 || x >= GameVars.roomWidth - 2) {
                    obj = new Block(x * toPixelSize(16), y * toPixelSize(16), BlockType.WALL, this.roomCanv);
                    this.backBlocks[y].push(obj);
                    this.walls.push(obj)
                } else {
                    this.backBlocks[y].push(new Block(x * toPixelSize(16), y * toPixelSize(16), BlockType.FLOOR, this.roomCanv));
                }
                this.frontBlocks[y].push(null);
            }
        }
    }

    setSpecialRoomType(roomType) {
        this.roomType = roomType;
        let heightCenter = Math.floor(GameVars.roomHeight / 2);
        let widthCenter = Math.floor(GameVars.roomWidth / 2);
        if (this.roomType == RoomType.KEY) {
            this.frontBlocks[heightCenter][widthCenter] = new Block(widthCenter, heightCenter, BlockType.KEY);
        } else if (this.roomType == RoomType.TREASURE) {
            this.frontBlocks[heightCenter][widthCenter] = new Block(widthCenter, heightCenter, BlockType.TREASURE);
        } else if (this.roomType == RoomType.BOSS) {
            this.frontBlocks[heightCenter][widthCenter] = new Block(widthCenter, heightCenter, BlockType.BOSS);
        }
    }

    setDoor(startX, finishX, startY, finishY) {
        for (let y = Math.round(startY); y <= Math.round(finishY); y++) {
            for (let x = Math.round(startX); x <= Math.round(finishX); x++) {
                this.walls.splice(this.walls.indexOf(this.backBlocks[y][x]), 1);
                this.backBlocks[y][x].blockType = BlockType.DOOR;
                // this.frontBlocks[y][x] = new Block(x * toPixelSize(16), y * toPixelSize(16), BlockType.DOOR, this.roomCanv);
            }
        }
    }

    update(x, y) {
        this.roomCanv.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }

    draw() {
        this.backBlocks.forEach(row => row.forEach(block => block?.draw()));
        // this.frontBlocks.forEach(row => row.forEach(block => block?.draw()));
    }

    // TODO Remove after
    printRoom() {
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