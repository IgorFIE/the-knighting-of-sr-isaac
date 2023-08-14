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
let mainMenuBtn;
let gameDiv;

let game;

let fpsInterval = 1000 / 60; // lock to 60fps
let then = Date.now();

function init() {
    mainDiv = document.getElementById("main");

    GameVars.resetGameVars();

    gameDiv = createElem(mainDiv, "div", "game", ["hidden"]);

    createMainMenu();

    createFpsElement(mainDiv);

    window.requestAnimationFrame(() => gameLoop());
}

function createMainMenu() {
    mainMenuDiv = createElem(mainDiv, "div", null, null, GameVars.gameW, GameVars.gameH);
    mainMenuCanv = createElem(mainMenuDiv, "canvas", "main-menu", null, GameVars.gameW, GameVars.gameH);

    mainMenuBtn = createElem(mainMenuDiv, "canvas", null, null, 140 * GameVars.pixelSize, 60 * GameVars.pixelSize, null, (e) => startGame());
    mainMenuBtn.style.translate = ((GameVars.gameW / 2) - (mainMenuBtn.width / 2)) + "px " +
        ((GameVars.gameH / 2) - (mainMenuBtn.height / 2) + (40 * GameVars.pixelSize)) + "px";

    genLargeBox(mainMenuBtn, 0, 0, 139, 59, GameVars.pixelSize, "black", "rgba(255, 255, 255, 0.9)");
    drawPixelTextInCanvas(convertTextToPixelArt("click/touch"), mainMenuBtn, GameVars.pixelSize, 70, 22, "black", 2);
    drawPixelTextInCanvas(convertTextToPixelArt("to start game"), mainMenuBtn, GameVars.pixelSize, 70, 38, "black", 2);

    mainMenuCtx = mainMenuCanv.getContext("2d");
    drawMainMenu();
}

function drawMainMenu() {
    mainMenuCtx.clearRect(0, 0, mainMenuCanv.width, mainMenuCanv.height);

    let halfScreenWidthAsPixels = GameVars.gameWdAsPixels / 2;

    drawPixelTextInCanvas(convertTextToPixelArt("the 13th"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, GameVars.gameHgAsPixels / 14, "black", 6);
    drawPixelTextInCanvas(convertTextToPixelArt("century Knight"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 14) + 36, "black", 6);

    genLargeBox(mainMenuCanv, -20, Math.round(((GameVars.gameHgAsPixels / 24) * 23) - 15), GameVars.gameWdAsPixels + 40, 30, GameVars.pixelSize, "black", "rgba(255,255,255,0.9)");
    drawPixelTextInCanvas(convertTextToPixelArt("js13kgames 2023 - igor estevao"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 24) * 23, "black", 2);
}

function startGame() {
    mainMenuDiv.classList.add("hidden");
    gameDiv.classList.remove("hidden");
    game = new Game(gameDiv);
}

function gameLoop() {
    elapsed = Date.now() - then;
    if (elapsed > fpsInterval) {
        then = Date.now() - (elapsed % fpsInterval);
        updateFps(then);

        if (game) {
            game.update();
        }
    }
    window.requestAnimationFrame(() => gameLoop());
}

init();