import { GameVars } from "./game-variables";
import { GameBoard } from "./entities/game-board";
import { Player } from "./entities/player";
import { createElem } from "./utilities/draw-utilities";

export class Game {
    constructor() {
        GameVars.gameBoard = new GameBoard(5);
        this.player = new Player(GameVars.gameBoard.board.length / 2, GameVars.gameBoard.board.length / 2);

        GameVars.gameBoard.board[this.player.roomY][this.player.roomX].roomCanv.classList.remove("hidden");
    }

    update() {
        this.player.update();
    }

    draw() {
    }
}