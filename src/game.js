import { RoomType } from "./enums/room-type";
import { Board } from "./objects/board";
import { Room } from "./objects/room";

export class Game {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;

        this.board = new Board(5);

        this.room = new Room(0, 0);
        this.room.setSpecialRoomType(RoomType.KEY);
    }

    update() {
        this.board.printBoard();
        this.room.printRoom();
    }
}