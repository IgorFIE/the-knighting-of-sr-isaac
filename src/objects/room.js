import { BlockType } from "../enums/block-type";
import { RoomType } from "../enums/room-type";
import { GameVars } from "../game-variables";
import { Block } from "./block";

export class Room {
    constructor(roomX, roomY) {
        this.roomX = roomX;
        this.roomY = roomY;
        this.roomType = RoomType.EMPTY;
        this.backBlocks = [];
        this.frontBlocks = [];
        this.initRoomBlocks();
    }

    initRoomBlocks() {
        for (let y = 0; y < GameVars.roomHeight; y++) {
            this.backBlocks.push([]);
            this.frontBlocks.push([]);
            for (let x = 0; x < GameVars.roomWidth; x++) {
                if (y == 0 || x == 0 || y == GameVars.roomHeight - 1 || x == GameVars.roomWidth - 1) {
                    this.backBlocks[y].push(new Block(x, y, BlockType.WALL));
                } else {
                    this.backBlocks[y].push(new Block(x, y, BlockType.FLOOR));
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

    draw() {
        this.backBlocks.forEach(row => row.forEach(block => block?.draw()));
        this.frontBlocks.forEach(row => row.forEach(block => block?.draw()));
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