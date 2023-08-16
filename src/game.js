import { GameVars } from "./game-variables";
import { GameBoard } from "./objects/game-board";
import { Player } from "./objects/player";
import { createElem } from "./utilities/draw-utilities";

export class Game {
    constructor() {
        this.gameBoard = new GameBoard(5);
        this.player = new Player(this.gameBoard.board.length / 2, this.gameBoard.board.length / 2);

        this.gameBoard.board[this.player.roomY][this.player.roomX].roomCanv.classList.remove("hidden");
    }

    update() {

    }

    draw() {
    }
}