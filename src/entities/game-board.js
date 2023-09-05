import { DoorType } from "../enums/door-type";
import { RoomType, isSpecialRoom } from "../enums/room-type";
import { randomNumb } from "../utilities/general-utilities";
import { Room } from "./room";

export class GameBoard {
    constructor(size) {
        this.size = size;
        this.board = [];
        this.rooms = [];
    }

    init() {
        this.initBoardArray();
        this.createBoardRooms();
        this.createPaths();
        this.draw();
        this.hideRooms();
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
        let x = Math.floor(this.board.length / 2);
        let y = Math.floor(this.board.length / 2);

        while (this.rooms.length != this.size) {
            if (this.board[y][x] == null) {
                this.board[y][x] = new Room(x, y);
                this.rooms.push(this.board[y][x]);
            }

            switch (randomNumb(4)) {
                case 0:
                    y - 1 >= 0 && y--;
                    break;
                case 1:
                    y + 1 < this.board.length && y++;
                    break;
                case 2:
                    x - 1 >= 0 && x--;
                    break;
                case 3:
                    x + 1 < this.board.length && x++;
                    break;
            }
        }
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
            y - 1 >= 0 && this.board[y - 1][x] != null && countSides++;
            y + 1 < this.board.length && this.board[y + 1][x] != null && countSides++;
            x - 1 >= 0 && this.board[y][x - 1] != null && countSides++;
            x + 1 < this.board.length && this.board[y][x + 1] != null && countSides++;
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

    createPaths() {
        let w, h, doorType;
        this.rooms.forEach((room) => {
            w = room.backBlocks[0].length;
            h = room.backBlocks.length;
            if (room.roomY - 1 >= 0 && this.board[room.roomY - 1][room.roomX]) {
                doorType = this.getDoorBasedOnRoomType(isSpecialRoom(this.board[room.roomY][room.roomX].roomType) ? this.board[room.roomY][room.roomX].roomType : this.board[room.roomY - 1][room.roomX].roomType);
                room.setDoor((w / 2) - 3, (w / 2) + 1, 0, 0, 0, -1, doorType);
                room.setDoor((w / 2) - 2, (w / 2), 1, 1, 0, -1, doorType);
            }
            if (room.roomY + 1 < this.board.length && this.board[room.roomY + 1][room.roomX]) {
                doorType = this.getDoorBasedOnRoomType(isSpecialRoom(this.board[room.roomY][room.roomX].roomType) ? this.board[room.roomY][room.roomX].roomType : this.board[room.roomY + 1][room.roomX].roomType);
                room.setDoor((w / 2) - 2, (w / 2), h - 2, h - 2, 0, 1, doorType);
                room.setDoor((w / 2) - 3, (w / 2) + 1, h - 1, h - 1, 0, 1, doorType);
            }
            if (room.roomX - 1 >= 0 && this.board[room.roomY][room.roomX - 1]) {
                doorType = this.getDoorBasedOnRoomType(isSpecialRoom(this.board[room.roomY][room.roomX].roomType) ? this.board[room.roomY][room.roomX].roomType : this.board[room.roomY][room.roomX - 1].roomType);
                room.setDoor(0, 0, (h / 2) - 3, (h / 2) + 1, -1, 0, doorType);
                room.setDoor(1, 1, (h / 2) - 2, (h / 2), -1, 0, doorType);
            }
            if (room.roomX + 1 < this.board[0].length && this.board[room.roomY][room.roomX + 1]) {
                doorType = this.getDoorBasedOnRoomType(isSpecialRoom(this.board[room.roomY][room.roomX].roomType) ? this.board[room.roomY][room.roomX].roomType : this.board[room.roomY][room.roomX + 1].roomType);
                room.setDoor(w - 2, w - 2, (h / 2) - 2, (h / 2), 1, 0, doorType);
                room.setDoor(w - 1, w - 1, (h / 2) - 3, (h / 2) + 1, 1, 0, doorType);
            }
        });
    }

    getDoorBasedOnRoomType(roomType) {
        switch (roomType) {
            case RoomType.TREASURE:
                return DoorType.TREASURE;
            case RoomType.BOSS:
                return DoorType.BOSS;
        }
        return DoorType.NORMAL;
    };

    draw() {
        this.rooms.forEach(room => room.draw());
    }

    hideRooms() {
        this.rooms.forEach(room => room.roomDiv.classList.add("hidden"));
    }
}