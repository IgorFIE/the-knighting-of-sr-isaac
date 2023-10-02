import { CircleObject } from "../collision-objects/circle-object";
import { ProjectileType, getProjectileSprite } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { circleToCircleCollision } from "../utilities/collision-utilities";
import { createElem, drawSprite } from "../utilities/draw-utilities";

export class Projectile {
  constructor(x, y, dir, color, size, projectileType, isPlayer) {
    this.dir = dir;
    this.color = color;
    this.size = size;
    this.projectileType = projectileType;
    this.sprite = getProjectileSprite(projectileType);
    this.isPlayer = isPlayer;

    this.dmg = this.getDamage() * (size - 1);
    this.speed = toPixelSize(this.getSpeed() * (size - 1));

    this.wasDestroyed = false;

    this.canv = createElem(
      GameVars.currentRoom.roomDiv,
      "canvas",
      null,
      null,
      this.sprite[0].length * toPixelSize(size),
      this.sprite.length * toPixelSize(size),
    );

    if (projectileType !== ProjectileType.ARROW) {
      this.canv.style.transformOrigin = "50% 50%";
      this.anim = this.canv.animate(
        {
          rotate: [0 + "deg", -360 + "deg"],
          offset: [0, 1],
        },
        { duration: 300 },
      ); // no idea why iterations: Infinity stopped working... https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/KeyframeEffect#parameters
      this.anim.persist();
    } else {
      this.canv.style.transformOrigin = "50% 0%";
    }

    this.collisionObj = new CircleObject(
      x,
      y,
      this.sprite[0].length * toPixelSize(size),
    );

    this.draw();
    this.update();
  }

  getDamage() {
    switch (this.projectileType) {
      case ProjectileType.KNIVE:
        return 2;
      case ProjectileType.AXE:
        return 4;
    }
    return 3;
  }

  getSpeed() {
    switch (this.projectileType) {
      case ProjectileType.KNIVE:
        return 1;
      case ProjectileType.AXE:
        return 2;
    }
    return 3;
  }

  update() {
    this.collisionObj.x += this.speed * this.dir;
    this.speed = (99 * this.speed) / 100;

    switch (this.projectileType) {
      case ProjectileType.ARROW:
        this.collisionObj.y -= this.speed;
        this.canv.style.rotate = 45 * this.dir + "deg";
        break;
      case ProjectileType.KNIVE:
        this.collisionObj.y += this.speed;
        this.canv.style.rotate = -45 * this.dir + "deg";
        break;
    }

    this.projectileType !== ProjectileType.ARROW &&
      this.anim.playState === "finished" &&
      this.anim.play();

    this.move();

    if (this.isPlayer) {
      GameVars.currentRoom.enemies.forEach((enemy) => {
        if (
          !this.wasDestroyed &&
          circleToCircleCollision(enemy.collisionObj, this.collisionObj)
        ) {
          this.destroy();
          GameVars.sound.enemyTakeDmgSound();
          enemy.lifeBar.takeDmg(this.dmg);
        }
      });
    } else {
      if (
        !this.wasDestroyed &&
        circleToCircleCollision(GameVars.player.collisionObj, this.collisionObj)
      ) {
        this.destroy();
        GameVars.gameDiv.parentNode.style.animation =
          "takedmg 400ms ease-in-out";
        GameVars.sound.playerTakeDmgSound();
        GameVars.player.lifeBar.takeDmg(this.dmg);
      }
    }

    Math.round(this.speed) <= 0 && !this.wasDestroyed && this.destroy();

    // const ctx = GameVars.atkCanv.getContext("2d");
    // ctx.beginPath();
    // ctx.arc(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r, 0, 2 * Math.PI);
    // ctx.stroke();

    return !this.wasDestroyed;
  }

  move() {
    if (this.projectileType === ProjectileType.ARROW) {
      this.canv.style.translate =
        this.collisionObj.x + "px " + this.collisionObj.y + "px";
    } else {
      this.canv.style.translate =
        this.collisionObj.x -
        this.canv.width / 2 +
        "px " +
        (this.collisionObj.y - this.canv.height / 2) +
        "px";
    }
  }

  destroy() {
    this.wasDestroyed = true;
    this.canv.remove();
  }

  draw() {
    drawSprite(this.canv, this.sprite, toPixelSize(this.size), null, null, {
      wc: this.color,
    });
  }
}
