const { GameVars } = require("./game-variables");
const { Game } = require("./game");
const { createElem } = require("./utilities/draw-utilities");
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("./utilities/text");
const { genLargeBox } = require("./utilities/box-generator");
const { updateFps, createFpsElement } = require("./utilities/fps-utilities");

let mainDiv;

let mainMenuDiv;
let mainMenuCanv;
let mainMenuCtx;

let game;

let fpsInterval = 1000 / GameVars.fps;
let then = Date.now();

function init() {
    GameVars.resetGameVars();

    mainDiv = document.getElementById("main");

    addKeyListenerEvents();

    // createMainMenu();
    createGameDiv();
    game = new Game();

    // createFpsElement(mainDiv);

    window.requestAnimationFrame(() => gameLoop());
}

function addKeyListenerEvents() {
    window.addEventListener('keydown', (e) => GameVars.keys[e.key] = true);
    window.addEventListener('keyup', (e) => GameVars.keys[e.key] = false);
}

function createMainMenu() {
    mainMenuDiv = createElem(mainDiv, "div", null, null, GameVars.gameW, GameVars.gameH);
    mainMenuCanv = createElem(mainMenuDiv, "canvas", "main-menu", null, GameVars.gameW, GameVars.gameH);

    let mainMenuBtn = createElem(mainMenuDiv, "canvas", null, null, 140 * GameVars.pixelSize, 60 * GameVars.pixelSize, null, (e) => startGame());
    mainMenuBtn.style.translate = ((GameVars.gameW / 2) - (mainMenuBtn.width / 2)) + "px " +
        ((GameVars.gameH / 2) - (mainMenuBtn.height / 2) + (40 * GameVars.pixelSize)) + "px";

    genLargeBox(mainMenuBtn, 0, 0, 139, 59, GameVars.pixelSize, "black", "rgba(255, 255, 255, 0.9)");
    drawPixelTextInCanvas(convertTextToPixelArt("click/touch"), mainMenuBtn, GameVars.pixelSize, 70, 22, "black", 2);
    drawPixelTextInCanvas(convertTextToPixelArt("to start game"), mainMenuBtn, GameVars.pixelSize, 70, 38, "black", 2);

    mainMenuCtx = mainMenuCanv.getContext("2d");
    drawMainMenu();
}

function drawMainMenu() {
    mainMenuCanv.getContext("2d").clearRect(0, 0, mainMenuCanv.width, mainMenuCanv.height);

    mainMenuCanv.getContext("2d").fillStyle = "rgba(255,255,255,0.9)";
    mainMenuCanv.getContext("2d").fillRect(0, 0, mainMenuCanv.width, mainMenuCanv.height);

    let halfScreenWidthAsPixels = GameVars.gameWdAsPixels / 2;

    drawPixelTextInCanvas(convertTextToPixelArt("the 13th"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, GameVars.gameHgAsPixels / 14, "black", 6);
    drawPixelTextInCanvas(convertTextToPixelArt("century Knight"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 14) + 36, "black", 6);

    genLargeBox(mainMenuCanv, -20, Math.round(((GameVars.gameHgAsPixels / 24) * 23) - 15), GameVars.gameWdAsPixels + 40, 30, GameVars.pixelSize, "black", "rgba(255,255,255,0.9)");
    drawPixelTextInCanvas(convertTextToPixelArt("js13kgames 2023 - igor estevao"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 24) * 23, "black", 2);
}

function createGameDiv() {
    GameVars.gameDiv = createElem(mainDiv, "div", "game", ["hidden"]);
}

function startGame() {
    mainMenuDiv.classList.add("hidden");
    GameVars.gameDiv.classList.remove("hidden");
    game = new Game();
}

function gameLoop() {
    elapsed = Date.now() - then;
    if (elapsed > fpsInterval) {
        then = Date.now() - (elapsed % fpsInterval);
        GameVars.deltaTime = elapsed / 1000;

        // updateFps(then);

        if (game) {
            game.update();
        }
    }
    window.requestAnimationFrame(() => gameLoop());
}

init();