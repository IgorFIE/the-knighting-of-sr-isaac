import { GameVars, toPixelSize } from "./game-variables";
import { GameBoard } from "./entities/game-board";
import { Player } from "./entities/player";
import { rectCircleCollision } from "./utilities/collision-utilities";

export class Game {
    constructor() {
        GameVars.gameBoard = new GameBoard(5);
        GameVars.gameBoard.printBoard();

        this.player = new Player(GameVars.gameBoard.board.length / 2, GameVars.gameBoard.board.length / 2);

        GameVars.gameBoard.board[this.player.roomY][this.player.roomX].roomCanv.classList.remove("hidden");

        this.currentRoom = GameVars.gameBoard.board[this.player.roomY][this.player.roomX];
        this.nextRoom;

        this.isChangingRoom = false;
        this.triggerBlock;
        this.transitionAmount;
        this.playerTransitionAmount;
    }

    update() {

        if (!this.isChangingRoom) {
            this.triggerBlock = this.currentRoom.doorTriggers.find(trigger => rectCircleCollision(this.player.collisionObj, trigger.collisionObj));
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
            this.player.move(this.player.collisionObj.x + (xAmount ? this.playerTransitionAmount : 0), this.player.collisionObj.y + (yAmount ? this.playerTransitionAmount : 0));

            if (this.nextRoom.x === 0 && this.nextRoom.y === 0) {
                this.currentRoom.roomCanv.classList.add("hidden");
                this.currentRoom = this.nextRoom;
                this.player.roomX = this.nextRoom.roomX;
                this.player.roomY = this.nextRoom.roomY;
                this.isChangingRoom = false;
            }
        }
        else {
            this.player.update();
        }
    }

    draw() {
    }
}