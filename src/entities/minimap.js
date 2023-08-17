import { RoomType, isSpecialRoom } from "../enums/room-type";
import { GameVars, toPixelSize } from "../game-variables";
import { genLargeBox, genSmallBox } from "../utilities/box-generator";
import { createElem } from "../utilities/draw-utilities";
import { Player } from "./player";

export class Minimap {
    constructor() {
        this.minimapCanv = createElem(GameVars.gameDiv, "canvas", "minimap", null, toPixelSize(56), toPixelSize(56));
        this.minimapCanv.style.transform = 'translate(' + (GameVars.gameW - this.minimapCanv.width - toPixelSize(16)) + 'px, ' + toPixelSize(16) + 'px)';

        this.visited = {};

        this.update();
    }

    update() {
        if (!this.visited[GameVars.player.roomY + "|" + GameVars.player.roomX]) {
            this.visited[GameVars.player.roomY + "|" + GameVars.player.roomX] = true;
        }

        this.minimapCanv.getContext("2d").clearRect(0, 0, this.minimapCanv.width, this.minimapCanv.height);

        genSmallBox(this.minimapCanv, 0, 0, 27, 27, toPixelSize(2), "#00000066", "#100f0f66");
        for (let y = -2; y <= 2; y++) {
            for (let x = -2; x <= 2; x++) {
                if (x === 0 && y === 0) {
                    continue;
                }
                if (this.validatePos(GameVars.player.roomX + x, GameVars.player.roomY + y)) {
                    if (this.visited[(GameVars.player.roomY + y) + "|" + (GameVars.player.roomX + x)]) {
                        this.createMiniMapRoom(x, y, "#703a33", "#2f1519");
                    } else if (GameVars.gameBoard.board[GameVars.player.roomY + y][GameVars.player.roomX + x] &&
                        this.containsVisitedBlockArround(GameVars.player.roomX + x, GameVars.player.roomY + y)) {
                        this.createMiniMapRoom(x, y, "#703a3366", "#2f151966");
                    }
                }
            }
        }
        this.createMiniMapRoom(0, 0, "#ffff57", "#cd9722");
    }

    createMiniMapRoom(x, y, lineColor, backgroundColor) {
        genSmallBox(this.minimapCanv, ((x + 2) * 5) + 1, ((y + 2) * 5) + 1, 5, 5, toPixelSize(2), lineColor, backgroundColor);
        this.createSpecialRoomIcon(x, y);
    }

    createSpecialRoomIcon(x, y) {
        let roomType = GameVars.gameBoard.board[GameVars.player.roomY + y][GameVars.player.roomX + x].roomType;
        if (isSpecialRoom(roomType) && roomType !== RoomType.KEY) {
            const ctx = this.minimapCanv.getContext("2d");
            ctx.fillStyle = "";
            switch (GameVars.gameBoard.board[GameVars.player.roomY + y][GameVars.player.roomX + x]?.roomType) {
                case RoomType.BOSS:
                    ctx.fillStyle = "#a80000";
                    break;
                case RoomType.TREASURE:
                    ctx.fillStyle = "#ffff57";
                    break;
            }
            ctx.fillRect(toPixelSize(6) + (x + 2) * toPixelSize(10), toPixelSize(6) + (y + 2) * toPixelSize(10), toPixelSize(4), toPixelSize(4));
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