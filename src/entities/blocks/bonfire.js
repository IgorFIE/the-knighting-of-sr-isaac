import { CircleObject } from "../../collision-objects/circle-object";
import { GameVars, toPixelSize } from "../../game-variables";
import { circleToCircleCollision } from "../../utilities/collision-utilities";
import { createElem, drawSprite } from "../../utilities/draw-utilities";
import { moveLevel } from "../../utilities/level-utilities";
import { convertTextToPixelArt, drawPixelTextInCanvas } from "../../utilities/text";
import { shortSword } from "../sprites";

export class Bonfire {
    constructor(x, y, room) {
        this.room = room;
        this.timeElapsed = 0;

        this.collisionObj = new CircleObject(x, y, toPixelSize(16));

        this.bonfireDiv = createElem(room.roomDiv, "div", null, ["bonfire"]);
        this.swordCanv = createElem(this.bonfireDiv, "canvas", null, null, shortSword.length * toPixelSize(2), shortSword.length * toPixelSize(2));
        this.bonfireCanv = createElem(this.bonfireDiv, "canvas", null, null, bonfire.length * toPixelSize(2), bonfire.length * toPixelSize(2));
        this.bonfireTextCanv = createElem(this.bonfireDiv, "canvas", null, null, toPixelSize(80), toPixelSize(6));

        this.bonfireDiv.style.transform = 'translate(' + (x - (this.bonfireCanv.width / 2)) + 'px, ' + (y - (this.bonfireCanv.height / 2)) + 'px)';
        this.swordCanv.style.transform = 'translate(' + toPixelSize(0) + 'px, ' + toPixelSize(-8) + 'px) rotate(-160deg)';
        this.bonfireTextCanv.style.transform = 'translate(' + toPixelSize(-30) + 'px, ' + toPixelSize(-10) + 'px)';

        this.draw();
    }

    update() {
        if (this.room.enemies.length === 0) {
            if (this.timeElapsed === 0) this.drawOn();
            if (this.timeElapsed / 1 >= 1) {
                if (circleToCircleCollision(GameVars.player.collisionObj, this.collisionObj) &&
                    (GameVars.keys['v'] || GameVars.keys['V'] || GameVars.keys['b'] || GameVars.keys['B'])) {
                    GameVars.sound.spawnSound();
                    moveLevel();
                }
            } else {
                this.timeElapsed += GameVars.deltaTime;
            }
        }
    }

    validateMovement(x, y) {
        this.collisionObj.x = x;
        this.collisionObj.y = y;
        this.bonfireDiv.style.transform = 'translate(' +
            (this.collisionObj.x - (this.bonfireCanv.width / 2)) + 'px, ' +
            (this.collisionObj.y - (this.bonfireCanv.height / 2)) + 'px)';
    }

    draw() {
        drawSprite(this.swordCanv, shortSword, toPixelSize(2), null, null);
        drawSprite(this.bonfireCanv, bonfire, toPixelSize(2), null, null, { bt: "#686b7a", bm: "#3e3846" });
    }

    drawOn() {
        drawPixelTextInCanvas(convertTextToPixelArt("ascend to next level"), this.bonfireTextCanv, toPixelSize(1), 40, 3, "#edeef7", 1);
        this.bonfireCanv.getContext("2d").clearRect(0, 0, this.bonfireCanv.width, this.bonfireCanv.height);
        drawSprite(this.bonfireCanv, bonfire, toPixelSize(2), null, null, { bt: "#edeef7", bm: "#cd9722" });
    }
}

const bonfire = [
    [null, null, null, null, "bm", null, null],
    [null, null, null, "bm", null, null, null],
    [null, "#38252e", "bm", "bm", "bm", "#38252e", null],
    ["#38252e", "bm", "bm", "bm", "bm", "bm", "#38252e"],
    ["#38252e", "bm", "bm", "bt", "bm", "bm", "#38252e"],
    ["#38252e", "bm", "bt", "bt", "bt", "bm", "#38252e"],
    ["#38252e", "#38252e", "bt", "bt", "bt", "#38252e", "#38252e"],
    [null, "#38252e", "#38252e", "#38252e", "#38252e", "#38252e", null],
];