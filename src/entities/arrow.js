import { CircleObject } from "../collision-objects/circle-object";
import { GameVars, toPixelSize } from "../game-variables";
import { circleToCircleCollision } from "../utilities/collision-utilities";
import { createElem, drawSprite } from "../utilities/draw-utilities";

export class Arrow {
    constructor(x, y, dir, color, size, isPlayer) {
        this.dir = dir;
        this.color = color;
        this.size = size;
        this.isPlayer = isPlayer;

        this.speed = toPixelSize(3);
        this.wasDestroyed = false;

        this.canv = createElem(GameVars.currentRoom.roomDiv, "canvas", null, null, arrow[0].length * toPixelSize(size), arrow.length * toPixelSize(size));
        this.canv.style.transformOrigin = "50% 0%";

        this.collisionObj = new CircleObject(x, y, toPixelSize(size));

        this.draw();
        this.update();
    }

    update() {
        this.collisionObj.x += this.speed * this.dir;
        this.collisionObj.y -= this.speed;
        this.speed = 99 * this.speed / 100;
        this.canv.style.translate = this.collisionObj.x + 'px ' + this.collisionObj.y + 'px';
        this.canv.style.rotate = 45 * this.dir + 'deg';

        Math.round(this.speed) === 0 && this.destroy();

        if (this.isPlayer) {
            GameVars.currentRoom.enemies.forEach(enemy => {
                if (!this.wasDestroyed && circleToCircleCollision(enemy.collisionObj, this.collisionObj)) {
                    this.destroy();
                    GameVars.sound.enemyTakeDmgSound();
                    enemy.lifeBar.takeDmg(3);
                }
            });
        } else {
            if (!this.wasDestroyed && circleToCircleCollision(GameVars.player.collisionObj, this.collisionObj)) {
                this.destroy();
                GameVars.gameDiv.parentNode.style.animation = "takedmg 400ms ease-in-out";
                GameVars.sound.playerTakeDmgSound();
                GameVars.player.lifeBar.takeDmg(3);
            }
        }
    }

    destroy() {
        this.wasDestroyed = true;
        GameVars.currentRoom.arrows.splice(GameVars.currentRoom.arrows.indexOf(this), 1);
        this.canv.remove();
    }

    draw() {
        drawSprite(this.canv, arrow, toPixelSize(this.size), null, null, { "wc": this.color });
    }
}

const arrow = [
    ["#edeef7"],
    ["#edeef7"],
    ["wc"],
    ["wc"],
    ["wc"],
    ["wc"],
    ["wc"],
    ["#edeef7"]
];