import { RoomType, isSpecialRoom } from "../enums/room-type";
import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { createElem, setElemSize } from "../utilities/draw-utilities";

export class Minimap {
    constructor() {
        this.minimapCanv = createElem(GameVars.gameDiv, "canvas", "minimap");
        this.visited = {};
        this.update();
    }

    update() {
        setElemSize(this.minimapCanv, toPixelSize(46), toPixelSize(46));
        this.minimapCanv.style.transform = 'translate(' + (GameVars.gameW - this.minimapCanv.width - toPixelSize(12)) + 'px, ' + toPixelSize(24) + 'px)';

        !this.visited[GameVars.currentRoom.roomY + "|" + GameVars.currentRoom.roomX] && (this.visited[GameVars.currentRoom.roomY + "|" + GameVars.currentRoom.roomX] = true);

        this.minimapCanv.getContext("2d").clearRect(0, 0, this.minimapCanv.width, this.minimapCanv.height);

        genSmallBox(this.minimapCanv, 0, 0, 22, 22, toPixelSize(2), "#00000066", "#100f0f66");
        for (let y = -2; y <= 2; y++) {
            for (let x = -2; x <= 2; x++) {
                if (x === 0 && y === 0) continue;
                if (this.validatePos(GameVars.currentRoom.roomX + x, GameVars.currentRoom.roomY + y)) {
                    if (this.visited[(GameVars.currentRoom.roomY + y) + "|" + (GameVars.currentRoom.roomX + x)]) {
                        this.createMiniMapRoom(x, y, "#703a33", "#2f1519");
                    } else if (GameVars.gameBoard.board[GameVars.currentRoom.roomY + y][GameVars.currentRoom.roomX + x] &&
                        this.containsVisitedBlockArround(GameVars.currentRoom.roomX + x, GameVars.currentRoom.roomY + y)) {
                        this.createMiniMapRoom(x, y, "#703a3366", "#2f151966");
                    }
                }
            }
        }
        this.createMiniMapRoom(0, 0, "#ffff57", "#cd9722");
    }

    createMiniMapRoom(x, y, lineColor, backgroundColor) {
        genSmallBox(this.minimapCanv, ((x + 2) * 4) + 1, ((y + 2) * 4) + 1, 4, 4, toPixelSize(2), lineColor, backgroundColor);
        this.createSpecialRoomIcon(x, y);
    }

    createSpecialRoomIcon(x, y) {
        let roomType = GameVars.gameBoard.board[GameVars.currentRoom.roomY + y][GameVars.currentRoom.roomX + x].roomType;
        if (isSpecialRoom(roomType) && roomType !== RoomType.KEY) {
            const ctx = this.minimapCanv.getContext("2d");
            ctx.fillStyle = "";
            switch (roomType) {
                case RoomType.BOSS:
                    ctx.fillStyle = "#a80000";
                    break;
                case RoomType.TREASURE:
                    ctx.fillStyle = "#ffff57";
                    break;
            }
            this.minimapCanv.getContext("2d").fillRect(
                ((x + 2) * toPixelSize(8)) + toPixelSize(5),
                ((y + 2) * toPixelSize(8)) + toPixelSize(5),
                toPixelSize(4), toPixelSize(4));
        }
    }

    validatePos(x, y) {
        return y >= 0 && y < GameVars.gameBoard.board.length && x >= 0 && x < GameVars.gameBoard.board[0].length;
    }

    containsVisitedBlockArround(x, y) {
        return (this.validatePos(x - 1, y) && this.visited[y + "|" + (x - 1)]) ||
            (this.validatePos(x + 1, y) && this.visited[y + "|" + (x + 1)]) ||
            (this.validatePos(x, y - 1) && this.visited[(y - 1) + "|" + x]) ||
            (this.validatePos(x, y + 1) && this.visited[(y + 1) + "|" + x]);
    }
}