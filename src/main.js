const { GameVars, toPixelSize } = require("./game-variables");
const { Game } = require("./game");
const { createElem, drawSprite } = require("./utilities/draw-utilities");
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("./utilities/text");
const { genLargeBox, genSmallBox } = require("./utilities/box-generator");
const { updateFps, createFpsElement } = require("./utilities/fps-utilities");
const { playSong, Sound } = require("./sound/sound");
const { speaker, audio } = require("./entities/sprites");

let mainDiv;

let mainMenuDiv;
let mainMenuCanv;
let mainMenuCtx;

let gameOverCanv;
let gameOverCtx;

let soundBtnCanv;
let soundBtnCtx;

let fpsInterval = 1000 / GameVars.fps;
let then = Date.now();

let skipElapsedTime = 0;

function init() {
    GameVars.resetGameVars();

    mainDiv = document.getElementById("main");

    addKeyListenerEvents();

    createGameDiv();
    createMainMenu();
    createGameOverMenu();
    createMuteBtn();
    // GameVars.game = new Game();

    // createFpsElement(mainDiv);
    GameVars.initDebug();

    window.requestAnimationFrame(() => gameLoop());
}

function addKeyListenerEvents() {
    window.addEventListener('keydown', (e) => {
        GameVars.keys[e.key] = true;
        initAudio();
    });
    window.addEventListener('keyup', (e) => GameVars.keys[e.key] = false);
    window.addEventListener("click", (e) => initAudio());
}

function createMainMenu() {
    mainMenuDiv = createElem(mainDiv, "div", null, null, GameVars.gameW, GameVars.gameH);
    mainMenuCanv = createElem(mainMenuDiv, "canvas", "main-menu", null, GameVars.gameW, GameVars.gameH);

    let mainMenuBtn = createElem(mainMenuDiv, "canvas", null, null, toPixelSize(70), toPixelSize(30), null, () => startGame());
    mainMenuBtn.style.translate = ((GameVars.gameW / 2) - (mainMenuBtn.width / 2)) + "px " +
        ((GameVars.gameH / 2) - (mainMenuBtn.height / 2) + toPixelSize(50)) + "px";

    genSmallBox(mainMenuBtn, 0, 0, 34, 14, toPixelSize(2), "#060606", "#060606");
    drawPixelTextInCanvas(convertTextToPixelArt("enter/click/touch"), mainMenuBtn, toPixelSize(1), 35, 10, "#edeef7", 1);
    drawPixelTextInCanvas(convertTextToPixelArt("to start game"), mainMenuBtn, toPixelSize(1), 35, 20, "#edeef7", 1);

    mainMenuCtx = mainMenuCanv.getContext("2d");
    drawMainMenu();
}

function drawMainMenu() {
    mainMenuCanv.getContext("2d").clearRect(0, 0, mainMenuCanv.width, mainMenuCanv.height);

    mainMenuCanv.getContext("2d").fillStyle = "#ffffff44";
    mainMenuCanv.getContext("2d").fillRect(0, 0, mainMenuCanv.width, mainMenuCanv.height);

    let halfScreenWidthAsPixels = GameVars.gameWdAsPixels / 2;

    drawPixelTextInCanvas(convertTextToPixelArt("13th century"), mainMenuCanv, toPixelSize(1), halfScreenWidthAsPixels, GameVars.gameHgAsPixels / 14, "black", 1);
    drawPixelTextInCanvas(convertTextToPixelArt("knight"), mainMenuCanv, toPixelSize(1), halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 14) + 24, "black", 1);

    genSmallBox(mainMenuCanv, -1, Math.floor(mainMenuCanv.height / toPixelSize(2)) - 11, Math.floor(mainMenuCanv.width / toPixelSize(2)) + 2, 12, toPixelSize(2), "#060606", "#060606");
    drawPixelTextInCanvas(convertTextToPixelArt("js13kgames 2023 - igor estevao"), mainMenuCanv, toPixelSize(1), halfScreenWidthAsPixels, GameVars.gameHgAsPixels - 12, "#edeef7", 1);
}

function createGameDiv() {
    GameVars.gameDiv = createElem(mainDiv, "div", "game", ["hidden"]);
}

function createGameOverMenu() {
    gameOverCanv = createElem(mainDiv, "canvas", "gameoverscreen", ["hidden"], GameVars.gameW, GameVars.gameH, "rgba(255,75,75,0.9)", () => skipGameOver());
    gameOverCtx = gameOverCanv.getContext("2d");
}

function createMuteBtn() {
    soundBtnCanv = createElem(mainDiv, "canvas", "soundbtn", null, toPixelSize(23), toPixelSize(12), null,
        () => {
            if (GameVars.sound) {
                GameVars.sound.muteMusic();
            } else {
                GameVars.sound = new Sound();
                GameVars.sound.initSound();
            }
        });
    soundBtnCanv.style.translate = GameVars.gameW - soundBtnCanv.width + "px";
    soundBtnCtx = soundBtnCanv.getContext("2d");
    drawSoundBtn();
}

function drawSoundBtn() {
    soundBtnCtx.clearRect(0, 0, soundBtnCanv.width, soundBtnCanv.height);
    let isSoundOn = GameVars.sound && GameVars.sound.isSoundOn;
    genSmallBox(soundBtnCanv, 0, 0, 22, 11, toPixelSize(1), isSoundOn ? "#ffffffaa" : "#00000066", isSoundOn ? "#ffffff66" : "#100f0f66");
    drawSprite(soundBtnCanv, speaker, toPixelSize(1), 10, 3);
    drawPixelTextInCanvas(convertTextToPixelArt("m"), soundBtnCanv, toPixelSize(1), 6, 6, "#edeef7", 1);
    if (GameVars.sound && GameVars.sound.isSoundOn) {
        drawSprite(soundBtnCanv, audio, toPixelSize(1), 15, 1);
    }
}

function skipGameOver() {
    GameVars.sound.clickSound();
    gameOverCanv.classList.add("hidden");
    mainMenuDiv.classList.remove("hidden");
    GameVars.gameDiv.innerHTML = "";
    GameVars.game = null;
}

function startGame() {
    initAudio();
    GameVars.sound.clickSound();
    mainMenuDiv.classList.add("hidden");
    GameVars.gameDiv.classList.remove("hidden");
    GameVars.resetGameVars();
    skipElapsedTime = 0;
    GameVars.game = new Game();
}

function initAudio() {
    if (!GameVars.sound) {
        GameVars.sound = new Sound();
        GameVars.sound.initSound();
    }
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
            if (skipElapsedTime / 0.5 >= 1 && GameVars.keys['Enter']) {
                startGame();
                skipElapsedTime = 0;
            } else {
                skipElapsedTime += GameVars.deltaTime;
            }
        }
        handleMuteInput();
        drawSoundBtn();
        if (GameVars.sound) {
            GameVars.sound.playMusic();
        }
    }
    window.requestAnimationFrame(() => gameLoop());
}

function handleMuteInput() {
    if (GameVars.keys['m'] || GameVars.keys['M']) {
        GameVars.keys['m'] = false;
        GameVars.keys['M'] = false;
        GameVars.sound.muteMusic();
    }
}

function drawGameOver() {
    gameOverCtx.clearRect(0, 0, gameOverCanv.width, gameOverCanv.height);
    genLargeBox(gameOverCanv, -20, (GameVars.gameHgAsPixels / 2) - 85, GameVars.gameWdAsPixels + 40, 180, GameVars.pixelSize, "black", "white");
    drawPixelTextInCanvas(convertTextToPixelArt("Game over"), gameOverCanv, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels / 2, "black", 6);
}

init();