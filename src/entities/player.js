import { CircleObject } from "../collision-objects/circle-object";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { checkForCollisions } from "../utilities/collision-utilities";
import {
  createElem,
  drawSprite,
  setElemSize,
} from "../utilities/draw-utilities";
import { key, knight } from "./sprites";
import { LifeBar } from "./life-bar";
import { Weapon } from "./weapon";
import {
  deadAnim,
  walk,
  weaponWalkLeft,
  weaponWalkRight,
} from "../utilities/animation-utilities";
import { Item } from "./item";
import { ItemType } from "../enums/item-type";

export class Player {
  constructor() {
    this.hasKey = false;
    this.isAlive = true;

    this.div = createElem(GameVars.gameDiv, "div", null, ["player"]);
    this.shadowCanv = createElem(this.div, "canvas");
    this.playerCanv = createElem(this.div, "canvas");
    this.keyCanv = createElem(GameVars.gameDiv, "canvas", null, ["hidden"]);

    this.lifeBar = new LifeBar(
      GameVars.heartLifeVal * 3,
      true,
      false,
      this.playerCanv,
      GameVars.lastPlayerLife,
    );

    this.init(GameVars.gameW / 2, GameVars.gameH / 2);
  }

  init(x, y) {
    this.playerSpeed = toPixelSize(2);

    this.collisionObj = new CircleObject(x, y, toPixelSize(4));
    this.fakeMovCircle = new CircleObject(
      this.collisionObj.x,
      this.collisionObj.y,
      this.collisionObj.r,
    );

    setElemSize(this.shadowCanv, toPixelSize(2) * 7, toPixelSize(2) * 6);
    this.shadowCanv.style.translate =
      -toPixelSize(4) + "px " + toPixelSize(8) + "px";

    setElemSize(
      this.playerCanv,
      knight[0].length * toPixelSize(2),
      knight.length * toPixelSize(2),
    );

    if (this.playerRightWeapon) {
      this.playerRightWeapon.init();
      this.playerLeftWeapon.init();
    } else {
      this.playerRightWeapon = new Weapon(
        GameVars.lastPlayerRightWeaponType || WeaponType.FIST,
        -1,
        this,
        "#cd9722",
        null,
        true,
      );
      this.playerLeftWeapon = new Weapon(
        GameVars.lastPlayerLeftWeaponType || WeaponType.FIST,
        1,
        this,
        "#cd9722",
        null,
        true,
      );
    }

    this.walkAnim = this.playerCanv.animate(walk(), {
      duration: 160,
      fill: "forwards",
    });

    this.lifeBar.init();

    setElemSize(
      this.keyCanv,
      key[0].length * toPixelSize(2) + toPixelSize(4),
      key.length * toPixelSize(2) + toPixelSize(4),
    );
    this.keyCanv.style.translate =
      toPixelSize(12) + "px " + toPixelSize(37) + "px";

    this.draw();
  }

  pickWeapon(x, y, weaponType, handDir) {
    if (handDir > 0) {
      this.dropWeapon(x, y, this.playerLeftWeapon);
      this.playerLeftWeapon = new Weapon(
        weaponType,
        handDir,
        this,
        "#cd9722",
        null,
        true,
      );
    } else {
      this.dropWeapon(x, y, this.playerRightWeapon);
      this.playerRightWeapon = new Weapon(
        weaponType,
        handDir,
        this,
        "#cd9722",
        null,
        true,
      );
    }
  }

  dropWeapon(x, y, weapon) {
    weapon.weaponType != WeaponType.FIST &&
      GameVars.currentRoom.items.push(
        new Item(
          x,
          y,
          ItemType.WEAPON,
          weapon.weaponType,
          GameVars.currentRoom,
        ),
      );
    weapon.destroy();
  }

  update() {
    if (this.lifeBar.life > 0) {
      this.hasKey && this.keyCanv.classList.remove("hidden");
      this.handleInput();
      this.atk();
      this.lifeBar.update();
    } else {
      if (this.isAlive) {
        this.lifeBar.update();
        this.isAlive = false;
        this.div
          .animate(deadAnim(), { duration: 500, fill: "forwards" })
          .finished.then(() => {
            GameVars.sound.playOverSound();
            GameVars.isGameOver = true;
          });
      }
    }
  }

  handleInput() {
    let newRectX = this.collisionObj.x;
    let newRectY = this.collisionObj.y;

    const movKeys = Object.keys(GameVars.keys).filter(
      (key) =>
        (key === "w" ||
          key === "s" ||
          key === "a" ||
          key === "d" ||
          key === "W" ||
          key === "S" ||
          key === "A" ||
          key === "D" ||
          key === "ArrowUp" ||
          key === "ArrowDown" ||
          key === "ArrowLeft" ||
          key === "ArrowRight") &&
        GameVars.keys[key],
    );

    if (movKeys.length > 0 && this.walkAnim.playState === "finished") {
      this.walkAnim.play();
      this.playerLeftWeapon.weaponCanv.animate(weaponWalkLeft(), {
        duration: 160,
      });
      this.playerRightWeapon.weaponCanv.animate(weaponWalkRight(), {
        duration: 160,
      });
      GameVars.sound.walkSound();
    }

    const distance =
      movKeys.length > 1 ? this.playerSpeed / 1.4142 : this.playerSpeed;
    if (
      GameVars.keys["d"] ||
      GameVars.keys["D"] ||
      GameVars.keys["ArrowRight"]
    ) {
      newRectX += distance;
    }
    if (
      GameVars.keys["a"] ||
      GameVars.keys["A"] ||
      GameVars.keys["ArrowLeft"]
    ) {
      newRectX -= distance;
    }
    if (GameVars.keys["w"] || GameVars.keys["W"] || GameVars.keys["ArrowUp"]) {
      newRectY -= distance;
    }
    if (
      GameVars.keys["s"] ||
      GameVars.keys["S"] ||
      GameVars.keys["ArrowDown"]
    ) {
      newRectY += distance;
    }

    this.validateMovement(this.collisionObj.x, newRectY);
    this.validateMovement(newRectX, this.collisionObj.y);
  }

  validateMovement(x, y, ignoreCollisions) {
    this.fakeMovCircle.x = x;
    this.fakeMovCircle.y = y;
    ignoreCollisions
      ? this.move(this.fakeMovCircle)
      : checkForCollisions(
          this.fakeMovCircle,
          GameVars.currentRoom.roomX,
          GameVars.currentRoom.roomY,
          (circle) => this.move(circle),
        );
  }

  move(circle) {
    this.collisionObj.x = circle.x;
    this.collisionObj.y = circle.y;
    this.div.style.translate =
      this.collisionObj.x -
      (knight[0].length * toPixelSize(2)) / 2 +
      "px " +
      (this.collisionObj.y - ((knight.length * toPixelSize(2)) / 4) * 3) +
      "px";
  }

  atk() {
    (GameVars.keys["v"] || GameVars.keys["V"]) &&
      this.playerRightWeapon.action();
    (GameVars.keys["b"] || GameVars.keys["B"]) &&
      this.playerLeftWeapon.action();
    this.playerRightWeapon.update();
    this.playerLeftWeapon.update();
  }

  draw() {
    genSmallBox(
      this.shadowCanv,
      0,
      0,
      6,
      5,
      toPixelSize(2),
      "#00000033",
      "#00000033",
    );
    drawSprite(this.playerCanv, knight, toPixelSize(2), 0, 0, {
      hd: "#cd9722",
      hl: "#ffff57",
      cm: "#9e6800",
    });

    genSmallBox(
      this.keyCanv,
      0,
      0,
      4,
      8,
      toPixelSize(2),
      "#00000066",
      "#100f0f66",
    );
    drawSprite(this.keyCanv, key, toPixelSize(2), 1, 1);

    let playerRect = this.playerCanv.getBoundingClientRect();
    this.div.style.width = playerRect.width + "px";
    this.div.style.height = playerRect.height + "px";
    this.div.style.transformOrigin = "70% 95%";
  }
}
