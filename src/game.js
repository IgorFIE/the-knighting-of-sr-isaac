import { GameVars, toPixelSize } from "./game-variables";
import { GameBoard } from "./entities/game-board";
import { Player } from "./entities/player";
import { rectCircleCollision } from "./utilities/collision-utilities";
import { isSpecialRoom } from "./enums/room-type";
import { randomNumb } from "./utilities/general-utilities";
import { Minimap } from "./entities/minimap";

export class Game {
    constructor() {
        GameVars.gameBoard = new GameBoard(5);

        this.currentRoom = this.getStartRoom(GameVars.gameBoard.board[GameVars.gameBoard.board.length / 2][GameVars.gameBoard.board[0].length / 2]);
        this.nextRoom;

        GameVars.player = new Player(this.currentRoom.roomX, this.currentRoom.roomY);
        GameVars.gameBoard.board[this.currentRoom.roomY][this.currentRoom.roomX].roomCanv.classList.remove("hidden");

        this.minimap = new Minimap();

        this.isChangingRoom = false;
        this.triggerBlock;
        this.transitionAmount;
        this.playerTransitionAmount;
    }

    getStartRoom(room) {
        if (!isSpecialRoom(room)) {
            return room;
        }
        return this.getStartRoom(GameVars.gameBoard.rooms[randomNumb(GameVars.gameBoard.rooms.length)]);
    }

    update() {
        if (!this.isChangingRoom) {
            this.triggerBlock = this.currentRoom.doorTriggers.find(trigger => rectCircleCollision(GameVars.player.collisionObj, trigger.collisionObj));
            if (this.triggerBlock) {
                this.isChangingRoom = true;
                this.nextRoom = GameVars.gameBoard.board[this.currentRoom.roomY + this.triggerBlock.yDir][this.currentRoom.roomX + this.triggerBlock.xDir];

                this.nextRoom.roomCanv.classList.remove("hidden");
                this.nextRoom.update(GameVars.gameW * this.triggerBlock.xDir, GameVars.gameH * this.triggerBlock.yDir);
                this.transitionAmount = -((GameVars.gameW * this.triggerBlock.xDir) + (GameVars.gameH * this.triggerBlock.yDir)) / 16;
                this.playerTransitionAmount = this.transitionAmount + (toPixelSize(4) * this.triggerBlock.xDir) + (toPixelSize(4) * this.triggerBlock.yDir)
            }
        }

        if (this.isChangingRoom) {
            let xAmount = this.triggerBlock.xDir != 0 ? this.transitionAmount : 0;
            let yAmount = this.triggerBlock.yDir != 0 ? this.transitionAmount : 0;

            this.currentRoom.update(this.currentRoom.x + xAmount, this.currentRoom.y + yAmount);
            this.nextRoom.update(this.nextRoom.x + xAmount, this.nextRoom.y + yAmount);
            GameVars.player.move(GameVars.player.collisionObj.x + (xAmount ? this.playerTransitionAmount : 0), GameVars.player.collisionObj.y + (yAmount ? this.playerTransitionAmount : 0));

            if (this.nextRoom.x === 0 && this.nextRoom.y === 0) {
                this.currentRoom.roomCanv.classList.add("hidden");
                this.currentRoom = this.nextRoom;
                GameVars.player.roomX = this.nextRoom.roomX;
                GameVars.player.roomY = this.nextRoom.roomY;
                this.isChangingRoom = false;
                this.minimap.update();
            }
        }
        else {
            GameVars.player.update();
        }
    }
}