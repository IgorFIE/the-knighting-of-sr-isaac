import { SquareObject } from "../../collision-objects/square-object";
import { GameVars, toPixelSize } from "../../game-variables";
import { rectCircleCollision } from "../../utilities/collision-utilities";
import { drawSprite } from "../../utilities/draw-utilities";

export class Spikes {
    constructor(room, blockRoomX, blockRoomY) {
        this.room = room;
        this.elapsedTime = 0;

        this.init((blockRoomX * toPixelSize(16)) + toPixelSize(2), (blockRoomY * toPixelSize(16)) + toPixelSize(2));
    }

    init(x, y) {
        this.collisionObj = new SquareObject(x, y, toPixelSize(12), toPixelSize(12));
    }

    update() {
        if (this.elapsedTime / 0.25 >= 1) {
            GameVars.currentRoom.enemies.forEach(enemy => {
                if (rectCircleCollision(enemy.collisionObj, this.collisionObj)) {
                    GameVars.sound.enemyTakeDmgSound();
                    enemy.lifeBar.takeDmg(1);
                }
            });
            if (rectCircleCollision(GameVars.player.collisionObj, this.collisionObj)) {
                GameVars.gameDiv.parentNode.style.animation = "takedmg 400ms ease-in-out";
                GameVars.sound.playerTakeDmgSound();
                GameVars.player.lifeBar.takeDmg(1);
            }
            this.elapsedTime = 0;
        } else {
            this.elapsedTime += GameVars.deltaTime;
        }
    }

    draw() {
        const ctx = this.room.environmentCanv.getContext('2d');
        ctx.fillStyle = "#00000044";
        ctx.fillRect(this.collisionObj.x, this.collisionObj.y, toPixelSize(12), toPixelSize(12));
        for (let y = -1; y < 6; y += 4) {
            for (let x = -1; x < 8; x += 5) {
                drawSprite(this.room.environmentCanv, spike, toPixelSize(2), (this.collisionObj.x / toPixelSize(2)) + x, (this.collisionObj.y / toPixelSize(2)) + y);
            }
        }
    }
}

const spike = [
    [null, "#edeef7", null],
    ["#999a9e", "#3e3846", "#edeef7"]
];