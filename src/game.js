import { GameVars, toPixelSize } from "./game-variables";
import { GameBoard } from "./entities/game-board";
import { Player } from "./entities/player";
import { rectCircleCollision } from "./utilities/collision-utilities";
import { isSpecialRoom } from "./enums/room-type";
import { randomNumb } from "./utilities/general-utilities";
import { Minimap } from "./ui/minimap";
import { Item } from "./entities/item";
import { ItemType } from "./enums/item-type";
import { WeaponType } from "./enums/weapon-type";
import { WeaponIcons } from "./ui/weapon-icons";
import { MovePad } from "./ui/movepad";
import { createElem } from "./utilities/draw-utilities";
import { Bonfire } from "./entities/blocks/bonfire";
import { convertTextToPixelArt, drawPixelTextInCanvas } from "./utilities/text";

export class Game {
    constructor() {
        GameVars.isGameOver = false;
        GameVars.gameBoard = new GameBoard(GameVars.gameBoardSize);
        GameVars.gameBoard.init();

        // TODO REMOVE ME LATER
        // GameVars.gameBoard.consoleLogBoard();

        GameVars.currentRoom = this.getStartRoom(GameVars.gameBoard.board[GameVars.gameBoard.board.length / 2][GameVars.gameBoard.board[0].length / 2]);
        GameVars.currentRoom.cleanEnemies();
        this.nextRoom;

        this.drawMainRoomText();

        GameVars.player = new Player(GameVars.currentRoom.roomX, GameVars.currentRoom.roomY);
        GameVars.gameBoard.board[GameVars.currentRoom.roomY][GameVars.currentRoom.roomX].roomDiv.classList.remove("hidden");

        //TODO REMOVE ME AFTERWARDS OR LET PLAYER PICK SOME RANDOM WEAPONS?
        // GameVars.currentRoom.items.push(new Item(GameVars.gameW / 4, GameVars.gameH / 4, ItemType.WEAPON, WeaponType.SWORD, GameVars.currentRoom.roomDiv));
        // GameVars.currentRoom.items.push(new Item((GameVars.gameW / 4) * 2, GameVars.gameH / 4, ItemType.WEAPON, WeaponType.SHIELD, GameVars.currentRoom.roomDiv));
        // GameVars.currentRoom.items.push(new Item((GameVars.gameW / 4) * 3, GameVars.gameH / 4, ItemType.WEAPON, WeaponType.GREATSWORD, GameVars.currentRoom.roomDiv));

        // GameVars.currentRoom.items.push(new Item((GameVars.gameW / 4) * 3, (GameVars.gameH / 4) * 3, ItemType.KEY, null, GameVars.currentRoom.roomDiv));

        // GameVars.currentRoom.items.push(new Item((GameVars.gameW / 4) * 3, (GameVars.gameH / 4) * 3, ItemType.HEART, null, GameVars.currentRoom.roomDiv));

        // GameVars.currentRoom.items.push(new Bonfire((GameVars.gameW / 4), (GameVars.gameH / 4), GameVars.currentRoom));

        // GameVars.currentRoom.enemies.push(new Enemy(GameVars.currentRoom.roomX, GameVars.currentRoom.roomY, (GameVars.gameW / 4), (GameVars.gameH / 4) * 3, EnemyType.BASIC, GameVars.currentRoom.roomDiv));
        // GameVars.currentRoom.enemies.push(new Enemy(GameVars.currentRoom.roomX, GameVars.currentRoom.roomY, (GameVars.gameW / 4) * 3, (GameVars.gameH / 4) * 3, EnemyType.BOSS, GameVars.currentRoom.roomDiv));

        GameVars.atkCanv = createElem(GameVars.gameDiv, "canvas", null, null, GameVars.gameW, GameVars.gameH);

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
        GameVars.atkCanv.getContext("2d").clearRect(0, 0, GameVars.atkCanv.width, GameVars.atkCanv.height);
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
                GameVars.player.roomX = this.nextRoom.roomX;
                GameVars.player.roomY = this.nextRoom.roomY;
                this.isChangingRoom = false;
                this.minimap.update();
            }
        }
        else {
            GameVars.currentRoom.update();
            GameVars.player.update();
            GameVars.weaponIcons.update();
        }
    }

    drawMainRoomText() {
        drawPixelTextInCanvas(convertTextToPixelArt("level " + GameVars.gameLevel), GameVars.currentRoom.roomCanv, toPixelSize(2),
            GameVars.gameW / toPixelSize(4), (GameVars.gameH / toPixelSize(4)) - 28, "#2f492c", 1);

        drawPixelTextInCanvas(convertTextToPixelArt("^"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            GameVars.gameW / toPixelSize(4), (GameVars.gameH / toPixelSize(4)) - 6, "#2f492c", 1);
        drawPixelTextInCanvas(convertTextToPixelArt("~"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            GameVars.gameW / toPixelSize(4), (GameVars.gameH / toPixelSize(4)) + 6, "#2f492c", 1);

        drawPixelTextInCanvas(convertTextToPixelArt("<"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            (GameVars.gameW / toPixelSize(4)) - 6, (GameVars.gameH / toPixelSize(4)), "#2f492c", 1);
        drawPixelTextInCanvas(convertTextToPixelArt(">"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            (GameVars.gameW / toPixelSize(4)) + 6, (GameVars.gameH / toPixelSize(4)), "#2f492c", 1);

        if (!GameVars.isMobile) {
            drawPixelTextInCanvas(convertTextToPixelArt("w"), GameVars.currentRoom.roomCanv, toPixelSize(2),
                GameVars.gameW / toPixelSize(4), (GameVars.gameH / toPixelSize(4)) - 12, "#2f492c", 1);
            drawPixelTextInCanvas(convertTextToPixelArt("s"), GameVars.currentRoom.roomCanv, toPixelSize(2),
                GameVars.gameW / toPixelSize(4), (GameVars.gameH / toPixelSize(4)) + 12, "#2f492c", 1);

            drawPixelTextInCanvas(convertTextToPixelArt("a"), GameVars.currentRoom.roomCanv, toPixelSize(2),
                (GameVars.gameW / toPixelSize(4)) - 12, (GameVars.gameH / toPixelSize(4)), "#2f492c", 1);
            drawPixelTextInCanvas(convertTextToPixelArt("d"), GameVars.currentRoom.roomCanv, toPixelSize(2),
                (GameVars.gameW / toPixelSize(4)) + 12, (GameVars.gameH / toPixelSize(4)), "#2f492c", 1);
        }

        drawPixelTextInCanvas(convertTextToPixelArt("r atk"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            (GameVars.gameW / toPixelSize(4)) - 24, (GameVars.gameH / toPixelSize(4)) + 20, "#2f492c", 1);
        drawPixelTextInCanvas(convertTextToPixelArt(GameVars.isMobile ? "a" : "v"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            (GameVars.gameW / toPixelSize(4)) - 24, (GameVars.gameH / toPixelSize(4)) + 28, "#2f492c", 1);

        drawPixelTextInCanvas(convertTextToPixelArt("l atk"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            (GameVars.gameW / toPixelSize(4)) + 24, (GameVars.gameH / toPixelSize(4)) + 20, "#2f492c", 1);
        drawPixelTextInCanvas(convertTextToPixelArt("b"), GameVars.currentRoom.roomCanv, toPixelSize(2),
            (GameVars.gameW / toPixelSize(4)) + 24, (GameVars.gameH / toPixelSize(4)) + 28, "#2f492c", 1);
    }
}