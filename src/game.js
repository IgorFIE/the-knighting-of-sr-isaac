import { GameVars, toPixelSize } from "./game-variables";
import { GameBoard } from "./entities/game-board";
import { Player } from "./entities/player";
import { rectCircleCollision } from "./utilities/collision-utilities";
import { isSpecialRoom } from "./enums/room-type";
import { randomNumb } from "./utilities/general-utilities";
import { Minimap } from "./ui/minimap";
import { WeaponIcons } from "./ui/weapon-icons";
import { MovePad } from "./ui/movepad";
import { convertTextToPixelArt, drawPixelTextInCanvas } from "./utilities/text";

export class Game {
    constructor() {
        GameVars.isGameOver = false;
        GameVars.gameBoard = new GameBoard(GameVars.gameBoardSize);
        GameVars.gameBoard.init();

        GameVars.currentRoom = this.getStartRoom(GameVars.gameBoard.board[GameVars.gameBoard.board.length / 2][GameVars.gameBoard.board[0].length / 2]);
        GameVars.currentRoom.cleanEnemies();
        this.nextRoom;

        this.drawMainRoomText();

        GameVars.player = new Player();
        GameVars.gameBoard.board[GameVars.currentRoom.roomY][GameVars.currentRoom.roomX].roomDiv.classList.remove("hidden");

        // GameVars.atkCanv = createElem(GameVars.gameDiv, "canvas", null, null, GameVars.gameW, GameVars.gameH);

        this.minimap = new Minimap();
        GameVars.weaponIcons = new WeaponIcons();
        if (GameVars.isMobile) GameVars.movePad = new MovePad();

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
        // GameVars.atkCanv.getContext("2d").clearRect(0, 0, GameVars.atkCanv.width, GameVars.atkCanv.height);
        if (!this.isChangingRoom) {
            this.triggerBlock = GameVars.currentRoom.doorTriggers.find(trigger => rectCircleCollision(GameVars.player.collisionObj, trigger.collisionObj));
            if (this.triggerBlock) {
                this.isChangingRoom = true;
                this.nextRoom = GameVars.gameBoard.board[GameVars.currentRoom.roomY + this.triggerBlock.yDir][GameVars.currentRoom.roomX + this.triggerBlock.xDir];

                this.nextRoom.roomDiv.classList.remove("hidden");
                this.nextRoom.update(GameVars.gameW * this.triggerBlock.xDir, GameVars.gameH * this.triggerBlock.yDir);
                this.transitionAmount = -((GameVars.gameW * this.triggerBlock.xDir) + (GameVars.gameH * this.triggerBlock.yDir)) / 16;
                this.playerTransitionAmount = this.transitionAmount + (toPixelSize(4) * this.triggerBlock.xDir) + (toPixelSize(4) * this.triggerBlock.yDir)
            }
        }

        if (this.isChangingRoom) {
            let xAmount = this.triggerBlock.xDir != 0 ? this.transitionAmount : 0;
            let yAmount = this.triggerBlock.yDir != 0 ? this.transitionAmount : 0;

            GameVars.currentRoom.update(GameVars.currentRoom.x + xAmount, GameVars.currentRoom.y + yAmount);
            this.nextRoom.update(this.nextRoom.x + xAmount, this.nextRoom.y + yAmount);
            GameVars.player.validateMovement(GameVars.player.collisionObj.x + (xAmount ? this.playerTransitionAmount : 0), GameVars.player.collisionObj.y + (yAmount ? this.playerTransitionAmount : 0), true);

            if (this.nextRoom.x === 0 && this.nextRoom.y === 0) {
                GameVars.currentRoom.roomDiv.classList.add("hidden");
                GameVars.currentRoom = this.nextRoom;
                this.isChangingRoom = false;
                this.minimap.update();
            }
        }
        else {
            GameVars.currentRoom.update();
            GameVars.player.update();
        }
    }

    drawMainRoomText() {
        const textColor = this.getTutorColor();
        drawPixelTextInCanvas(convertTextToPixelArt("level " + GameVars.gameLevel), GameVars.currentRoom.roomCanv, toPixelSize(2),
            GameVars.gameW / toPixelSize(4), (GameVars.gameH / toPixelSize(4)) - 20, textColor, 1);

        drawPixelTextInCanvas(convertTextToPixelArt("^"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            GameVars.gameW / toPixelSize(4), (GameVars.gameH / toPixelSize(4)) - 6, textColor, 1);
        drawPixelTextInCanvas(convertTextToPixelArt("~"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            GameVars.gameW / toPixelSize(4), (GameVars.gameH / toPixelSize(4)) + 6, textColor, 1);

        drawPixelTextInCanvas(convertTextToPixelArt("<"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            (GameVars.gameW / toPixelSize(4)) - 6, (GameVars.gameH / toPixelSize(4)), textColor, 1);
        drawPixelTextInCanvas(convertTextToPixelArt(">"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            (GameVars.gameW / toPixelSize(4)) + 6, (GameVars.gameH / toPixelSize(4)), textColor, 1);

        if (!GameVars.isMobile) {
            drawPixelTextInCanvas(convertTextToPixelArt("w"), GameVars.currentRoom.roomCanv, toPixelSize(2),
                GameVars.gameW / toPixelSize(4), (GameVars.gameH / toPixelSize(4)) - 12, textColor, 1);
            drawPixelTextInCanvas(convertTextToPixelArt("s"), GameVars.currentRoom.roomCanv, toPixelSize(2),
                GameVars.gameW / toPixelSize(4), (GameVars.gameH / toPixelSize(4)) + 12, textColor, 1);

            drawPixelTextInCanvas(convertTextToPixelArt("a"), GameVars.currentRoom.roomCanv, toPixelSize(2),
                (GameVars.gameW / toPixelSize(4)) - 12, (GameVars.gameH / toPixelSize(4)), textColor, 1);
            drawPixelTextInCanvas(convertTextToPixelArt("d"), GameVars.currentRoom.roomCanv, toPixelSize(2),
                (GameVars.gameW / toPixelSize(4)) + 12, (GameVars.gameH / toPixelSize(4)), textColor, 1);
        }

        drawPixelTextInCanvas(convertTextToPixelArt("r atk"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            (GameVars.gameW / toPixelSize(4)) - 18, (GameVars.gameH / toPixelSize(4)) + 20, textColor, 1);
        drawPixelTextInCanvas(convertTextToPixelArt(GameVars.isMobile ? "a" : "v"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            (GameVars.gameW / toPixelSize(4)) - 18, (GameVars.gameH / toPixelSize(4)) + 28, textColor, 1);

        drawPixelTextInCanvas(convertTextToPixelArt("l atk"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            (GameVars.gameW / toPixelSize(4)) + 18, (GameVars.gameH / toPixelSize(4)) + 20, textColor, 1);
        drawPixelTextInCanvas(convertTextToPixelArt("b"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            (GameVars.gameW / toPixelSize(4)) + 18, (GameVars.gameH / toPixelSize(4)) + 28, textColor, 1);
    }

    getTutorColor() {
        if (GameVars.gameLevel < 3) {
            return "#2f492c";
        } else if (GameVars.gameLevel < 6) {
            return "#38252e";
        } else {
            return "#1b1116";
        }
    }
}