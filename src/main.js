const { GameVars, toPixelSize } = require("./game-variables");
const { Game } = require("./game");
const { createElem } = require("./utilities/draw-utilities");
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("./utilities/text");
const { genLargeBox, genSmallBox } = require("./utilities/box-generator");
const { updateFps, createFpsElement } = require("./utilities/fps-utilities");

let mainDiv;

let mainMenuDiv;
let mainMenuCanv;
let mainMenuCtx;

let gameOverCanv;
let gameOverCtx

let fpsInterval = 1000 / GameVars.fps;
let then = Date.now();

let skipElapsedTime = 0;

function init() {
    GameVars.resetGameVars();

    mainDiv = document.getElementById("main");

    addKeyListenerEvents();

    createMainMenu();
    createGameDiv();
    createGameOverMenu();
    // GameVars.game = new Game();

    // createFpsElement(mainDiv);
    GameVars.initDebug();

    window.requestAnimationFrame(() => gameLoop());
}

function addKeyListenerEvents() {
    window.addEventListener('keydown', (e) => GameVars.keys[e.key] = true);
    window.addEventListener('keyup', (e) => GameVars.keys[e.key] = false);
}

function createMainMenu() {
    mainMenuDiv = createElem(mainDiv, "div", null, null, GameVars.gameW, GameVars.gameH);
    mainMenuCanv = createElem(mainMenuDiv, "canvas", "main-menu", null, GameVars.gameW, GameVars.gameH);

    let mainMenuBtn = createElem(mainMenuDiv, "canvas", null, null, toPixelSize(140), toPixelSize(60), null, () => startGame());
    mainMenuBtn.style.translate = ((GameVars.gameW / 2) - (mainMenuBtn.width / 2)) + "px " +
        ((GameVars.gameH / 2) - (mainMenuBtn.height / 2) + toPixelSize(40)) + "px";

    genSmallBox(mainMenuBtn, 0, 0, 69, 29, toPixelSize(2), "#000000aa", "#100f0f66");
    drawPixelTextInCanvas(convertTextToPixelArt("enter/click/touch"), mainMenuBtn, toPixelSize(1), 70, 24, "#edeef7", 1);
    drawPixelTextInCanvas(convertTextToPixelArt("to start game"), mainMenuBtn, toPixelSize(1), 70, 36, "#edeef7", 1);

    mainMenuCtx = mainMenuCanv.getContext("2d");
    drawMainMenu();
}

function drawMainMenu() {
    mainMenuCanv.getContext("2d").clearRect(0, 0, mainMenuCanv.width, mainMenuCanv.height);

    mainMenuCanv.getContext("2d").fillStyle = "rgba(255,255,255,0.9)";
    mainMenuCanv.getContext("2d").fillRect(0, 0, mainMenuCanv.width, mainMenuCanv.height);

    let halfScreenWidthAsPixels = GameVars.gameWdAsPixels / 2;

    drawPixelTextInCanvas(convertTextToPixelArt("the 13th"), mainMenuCanv, toPixelSize(1), halfScreenWidthAsPixels, GameVars.gameHgAsPixels / 14, "black", 4);
    drawPixelTextInCanvas(convertTextToPixelArt("century Knight"), mainMenuCanv, toPixelSize(1), halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 14) + 24, "black", 4);

    genSmallBox(mainMenuCanv, -1, Math.floor(mainMenuCanv.height / toPixelSize(2)) - 11, Math.floor(mainMenuCanv.width / toPixelSize(2)) + 2, 12, toPixelSize(2), "#000000aa", "#100f0f66");
    drawPixelTextInCanvas(convertTextToPixelArt("js13kgames 2023 - igor estevao"), mainMenuCanv, toPixelSize(1), halfScreenWidthAsPixels, GameVars.gameHgAsPixels - 12, "#edeef7", 1);
}

function createGameDiv() {
    GameVars.gameDiv = createElem(mainDiv, "div", "game", ["hidden"]);
}

function createGameOverMenu() {
    gameOverCanv = createElem(mainDiv, "canvas", "gameoverscreen", ["hidden", "ontop"], GameVars.gameW, GameVars.gameH, "rgba(255,75,75,0.9)", () => skipGameOver());
    gameOverCtx = gameOverCanv.getContext("2d");
}

function skipGameOver() {
    gameOverCanv.classList.add("hidden");
    mainMenuDiv.classList.remove("hidden");
    GameVars.gameDiv.innerHTML = "";
    GameVars.game = null;
}

function startGame() {
    mainMenuDiv.classList.add("hidden");
    GameVars.gameDiv.classList.remove("hidden");
    GameVars.resetGameVars();
    GameVars.game = new Game();
}

function gameLoop() {
    elapsed = Date.now() - then;
    if (elapsed > fpsInterval) {
        then = Date.now() - (elapsed % fpsInterval);
        GameVars.deltaTime = elapsed / 1000;

        // updateFps(then);
        if (GameVars.game) {
            if (!GameVars.isGameOver) {
                GameVars.game.update();
            } else {
                drawGameOver();
                gameOverCanv.classList.remove("hidden");
                if (GameVars.keys['Enter']) {
                    skipGameOver();
                }
            }
        } else {
            if (skipElapsedTime / 1 >= 1 && GameVars.keys['Enter']) {
                startGame();
                skipElapsedTime = 0;
            } else {
                skipElapsedTime += GameVars.deltaTime;
            }
        }
    }
    window.requestAnimationFrame(() => gameLoop());
}

function drawGameOver() {
    gameOverCtx.clearRect(0, 0, gameOverCanv.width, gameOverCanv.height);
    genLargeBox(gameOverCanv, -20, (GameVars.gameHgAsPixels / 2) - 85, GameVars.gameWdAsPixels + 40, 180, GameVars.pixelSize, "black", "white");
    drawPixelTextInCanvas(convertTextToPixelArt("Game over"), gameOverCanv, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels / 2, "black", 6);
}

init();