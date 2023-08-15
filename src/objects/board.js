import { RoomType, isSpecialRoom } from "../enums/room-type";
import { randomNumb } from "../utilities/general-utilities";
import { Room } from "./room";

export class Board {
    constructor(size) {
        this.size = size;
        this.board = [];
        this.rooms = [];
        this.initBoardArray();
        this.createBoardRooms();
    }

    initBoardArray() {
        for (let y = 0; y < this.size * 2; y++) {
            this.board.push([]);
            for (let x = 0; x < this.size * 2; x++) {
                this.board[y].push(null);
            }
        }
    }

    createBoardRooms() {
        let amount = this.size;
        let x = Math.floor(this.board.length / 2);
        let y = Math.floor(this.board.length / 2);

        while (this.rooms.length != amount) {
            if (this.board[y][x] == null) {
                this.board[y][x] = new Room(x, y);
                this.rooms.push(this.board[y][x]);
            }

            switch (randomNumb(4)) {
                case 0:
                    if (y - 1 >= 0) y--;
                    break;
                case 1:
                    if (y + 1 < this.board.length) y++;
                    break;
                case 2:
                    if (x - 1 >= 0) x--;
                    break;
                case 3:
                    if (x + 1 < this.board.length) x++;
                    break;
            }
        }
        this.printBoard();

        this.createSpecialRoom(RoomType.KEY);
        this.createSpecialRoom(RoomType.TREASURE);
        this.createSpecialRoom(RoomType.BOSS);
    }

    createSpecialRoom(roomType) {
        let x = randomNumb(this.board.length);
        let y = randomNumb(this.board.length);
        while (!this.canPlaceSpecialRoom(x, y)) {
            x = randomNumb(this.board.length);
            y = randomNumb(this.board.length);
        }
        this.board[y][x] = new Room(x, y);
        this.board[y][x].setSpecialRoomType(roomType);
        this.rooms.push(this.board[y][x]);
    }

    canPlaceSpecialRoom(x, y) {
        if (this.board[y][x] == null) {
            let countSides = 0;
            if (y - 1 >= 0 && this.board[y - 1][x] != null) countSides++;
            if (y + 1 < this.board.length && this.board[y + 1][x] != null) countSides++;
            if (x - 1 >= 0 && this.board[y][x - 1] != null) countSides++;
            if (x + 1 < this.board.length && this.board[y][x + 1] != null) countSides++;
            return (countSides == 1 || countSides == 2) && !this.containsSpecialRoomArround(x, y);
        }
        return false;
    }

    containsSpecialRoomArround(startX, startY) {
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                if (startX + x >= 0 && startX + x < this.board.length &&
                    startY + y >= 0 && startY + y < this.board.length &&
                    this.board[startY + y][startX + x] != null &&
                    isSpecialRoom(this.board[startY + y][startX + x].roomType)) {
                    return true;
                }
            }
        }
        return false;
    }


    // TODO Remove after
    printBoard() {
        let room = "";
        for (let y = 0; y < this.board.length; y++) {
            let newLine = "";
            for (let x = 0; x < this.board.length; x++) {
                if (this.board[y][x]?.roomType == RoomType.EMPTY) {
                    newLine += "  ";
                } else if (this.board[y][x]?.roomType == RoomType.KEY) {
                    newLine += "K ";
                } else if (this.board[y][x]?.roomType == RoomType.TREASURE) {
                    newLine += "T ";
                } else if (this.board[y][x]?.roomType == RoomType.BOSS) {
                    newLine += "B ";
                } else {
                    newLine += "# ";
                }
            }
            room += newLine + "\n";
        }
        console.log(room);
    }
}