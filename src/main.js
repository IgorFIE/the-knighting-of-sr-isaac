const { GameVars, toPixelSize } = require("./game-variables");
const { Game } = require("./game");
const { createElem, drawSprite, setElemSize } = require("./utilities/draw-utilities");
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("./utilities/text");
const { genSmallBox } = require("./utilities/box-generator");
const { Sound } = require("./sound/sound");
const { knight } = require("./entities/sprites");
const { createWallBlock, createFloorBlock } = require("./entities/blocks/block");
const { getWeaponSprite } = require("./enums/weapon-type");
const { randomNumbOnRange } = require("./utilities/general-utilities");

const speaker = [
    [null, null, null, "#edeef7", null],
    [null, "#edeef7", "#edeef7", "#edeef7", null],
    ["#edeef7", "#edeef7", "#edeef7", "#edeef7", "#edeef7"],
    ["#edeef7", "#edeef7", "#edeef7", "#edeef7", "#edeef7"],
    [null, "#edeef7", "#edeef7", "#edeef7", null],
    [null, null, null, "#edeef7", null]
];

const audio = [
    [null, null, null, null],
    [null, null, "#edeef7", null],
    ["#edeef7", null, null, "#edeef7"],
    [null, "#edeef7", null, "#edeef7"],
    [null, "#edeef7", null, "#edeef7"],
    [null, "#edeef7", null, "#edeef7"],
    [null, "#edeef7", null, "#edeef7"],
    ["#edeef7", null, null, "#edeef7"],
    [null, null, "#edeef7", null],
    [null, null, null, null]
];

let mainMenuDiv;
let mainMenuCanv;

let leftMenuBtn;
let rightMenuBtn;

let gameOverCanv;
let scoreCanv;
let soundBtnCanv;

let leftWeapon;
let rightWeapon;

let lastScore;
let lastSoundState = true; // so we draw it at the start

let fpsInterval = 1000 / GameVars.fps;
let then = Date.now();

let skipElapsedTime = 0;

const init = () => {
    GameVars.updatePixelSize(window.innerWidth, window.innerHeight);
    GameVars.resetGameVars();

    leftWeapon = randomNumbOnRange(1, 3);
    rightWeapon = randomNumbOnRange(1, 3);

    addKeyListenerEvents();
    setResize();

    createGameElements();
    draw();

    window.requestAnimationFrame(() => gameLoop());
}

const addKeyListenerEvents = () => {
    window.addEventListener('keydown', (e) => updateKeys(e.key, true));
    window.addEventListener('keyup', (e) => updateKeys(e.key, false));
    window.addEventListener("click", (e) => initAudio());
}

const updateKeys = (key, isDown) => {
    GameVars.keys[key] = isDown;
    (key === 'v' || key === 'V' || key === 'b' || key === 'B') && GameVars.weaponIcons?.update();
    initAudio();
}

const setResize = () => {
    window.addEventListener("resize", () => {
        GameVars.updatePixelSize(window.innerWidth, window.innerHeight);
        draw(true);
        GameVars.game && GameVars.game.resize();
    });
}

const initAudio = () => {
    if (!GameVars.sound) {
        GameVars.sound = new Sound();
        GameVars.sound.initSound();
    }
}

const createGameElements = () => {
    let mainDiv = document.getElementById("main");
    mainDiv.addEventListener("animationend", () => mainDiv.style.animation = "");

    GameVars.gameDiv = createElem(mainDiv, "div", "game", ["hidden"]);

    mainMenuDiv = createElem(mainDiv, "div");
    mainMenuCanv = createElem(mainMenuDiv, "canvas", "main-menu");
    leftMenuBtn = createElem(mainMenuDiv, "canvas", null, null, null, null, GameVars.isMobile, null, () => startGame(leftWeapon, -1));
    rightMenuBtn = createElem(mainMenuDiv, "canvas", null, null, null, null, GameVars.isMobile, null, () => startGame(rightWeapon, 1));

    scoreCanv = createElem(mainDiv, "canvas", "score");
    soundBtnCanv = createElem(mainDiv, "canvas", "soundbtn", null, null, null, GameVars.isMobile, null,
        () => {
            if (GameVars.sound) {
                GameVars.sound.muteMusic();
            } else {
                GameVars.sound = new Sound();
                GameVars.sound.initSound();
            }
        });

    gameOverCanv = createElem(mainDiv, "canvas", "gameoverscreen", ["hidden"], GameVars.gameW, GameVars.gameH, GameVars.isMobile, "#ff4b4be6", () => skipElapsedTime / 1 >= 1 && skipGameOver());

    // createFpsElement(mainDiv);
    // GameVars.initDebug();
}

const draw = (isResize) => {
    setElemSize(mainMenuDiv, GameVars.gameW, GameVars.gameH);
    setElemSize(mainMenuCanv, GameVars.gameW, GameVars.gameH);
    drawMainMenu();

    setElemSize(leftMenuBtn, toPixelSize(66), toPixelSize(30));
    drawBtn(leftMenuBtn, -toPixelSize(30 * 2.6), (GameVars.isMobile ? "" : "v to "), "with l weapon");

    setElemSize(rightMenuBtn, toPixelSize(66), toPixelSize(30));
    drawBtn(rightMenuBtn, toPixelSize(30 * 0.4), (GameVars.isMobile ? "" : "b to "), "with r weapon");

    setElemSize(scoreCanv, toPixelSize(23), toPixelSize(12));
    drawScore(isResize);

    setElemSize(soundBtnCanv, toPixelSize(23), toPixelSize(12));
    drawSoundBtn(isResize);

    setElemSize(gameOverCanv, GameVars.gameW, GameVars.gameH);
}

const drawMainMenu = () => {
    for (let y = 0; y < GameVars.gameH; y += toPixelSize(16)) {
        for (let x = 0; x < GameVars.gameW; x += toPixelSize(16)) {
            y < GameVars.gameH / 2 && createWallBlock(mainMenuCanv.getContext("2d"), x, y) || createFloorBlock(mainMenuCanv, x, y);
        }
    }
    let wKnightCenter = ((GameVars.gameW % 2 === 0 ? GameVars.gameW : GameVars.gameW + 1) / toPixelSize(10)) / 2;
    let hKnightCenter = ((GameVars.gameH % 2 === 0 ? GameVars.gameH : GameVars.gameH + 1) / toPixelSize(10)) / 2;

    genSmallBox(mainMenuCanv, wKnightCenter - 3.5, hKnightCenter + 1, 6, 5, toPixelSize(10), "#00000033", "#00000033");
    drawSprite(mainMenuCanv, knight, toPixelSize(10), wKnightCenter - 1.5, hKnightCenter - 3.5, { "hd": "#cd9722", "hl": "#ffff57", "cm": "#9e6800" });

    drawSprite(mainMenuCanv, getWeaponSprite(leftWeapon), toPixelSize(10), wKnightCenter - 5.5, hKnightCenter - 1.5, { "wc": "#cd9722" });
    drawSprite(mainMenuCanv, getWeaponSprite(rightWeapon), toPixelSize(10), wKnightCenter + 2.5, hKnightCenter - 1.5, { "wc": "#cd9722" });

    genSmallBox(mainMenuCanv, -1, -1, Math.floor(mainMenuCanv.width / toPixelSize(2)) + 2, 32, toPixelSize(2), "#060606", "#060606");
    drawPixelTextInCanvas(convertTextToPixelArt("the knighting of"), mainMenuCanv, toPixelSize(3), Math.round(GameVars.gameW / 2 / toPixelSize(3)), 11, "#edeef7", 1);
    drawPixelTextInCanvas(convertTextToPixelArt("sr isaac"), mainMenuCanv, toPixelSize(2), Math.round(GameVars.gameW / 2 / toPixelSize(2)), 25, "#edeef7", 1);

    genSmallBox(mainMenuCanv, -1, Math.floor(mainMenuCanv.height / toPixelSize(2)) - 16, Math.floor(mainMenuCanv.width / toPixelSize(2)) + 2, 17, toPixelSize(2), "#060606", "#060606");
    drawPixelTextInCanvas(convertTextToPixelArt("each weapon has a different atk pattern"), mainMenuCanv, toPixelSize(1), GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels - 24, "#edeef7", 1);
    drawPixelTextInCanvas(convertTextToPixelArt("js13kgames 2023 - igor estevao"), mainMenuCanv, toPixelSize(1), GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels - 8, "#edeef7", 1);
}

const drawBtn = (btn, xPos, topText, bottomText) => {
    btn.style.translate = ((GameVars.gameW / 2) + xPos) + 'px ' + (mainMenuCanv.height - toPixelSize(36) - btn.height) + 'px';
    genSmallBox(btn, 0, 0, 32, 14, toPixelSize(2), "#060606", "#060606");
    drawPixelTextInCanvas(convertTextToPixelArt(topText + "start game"), btn, toPixelSize(1), 35, 10, "#edeef7", 1);
    drawPixelTextInCanvas(convertTextToPixelArt(bottomText), btn, toPixelSize(1), 33, 20, "#edeef7", 1);
}

const drawSoundBtn = (isResize) => {
    soundBtnCanv.style.translate = (GameVars.gameW - soundBtnCanv.width - toPixelSize(24)) + 'px ' + toPixelSize(10) + 'px';
    let isSoundOn = GameVars.sound && GameVars.sound.isSoundOn;
    if (lastSoundState !== isSoundOn || isResize) {
        lastSoundState = isSoundOn;
        soundBtnCanv.getContext("2d").clearRect(0, 0, soundBtnCanv.width, soundBtnCanv.height);
        genSmallBox(soundBtnCanv, 0, 0, 22, 11, toPixelSize(1), isSoundOn ? "#00000066" : "#ffffffaa", isSoundOn ? "#100f0f66" : "#ffffff66");
        drawSprite(soundBtnCanv, speaker, toPixelSize(1), 10, 3);
        drawPixelTextInCanvas(convertTextToPixelArt("m"), soundBtnCanv, toPixelSize(1), 6, 6, "#edeef7", 1);
        isSoundOn && drawSprite(soundBtnCanv, audio, toPixelSize(1), 15, 1);
    }
}

const drawScore = (isResize) => {
    scoreCanv.style.translate = toPixelSize(12) + 'px ' + toPixelSize(10) + 'px';
    if (lastScore != GameVars.score || isResize) {
        let text;
        !GameVars.game && (text = "top score - " + GameVars.highScore) || (text = "Score - " + GameVars.score);
        const textArray = convertTextToPixelArt(text);
        const textLength = textArray[0].length * toPixelSize(1);
        scoreCanv.width = textLength + toPixelSize(4);
        genSmallBox(scoreCanv, 0, 0, (textArray[0].length + 3), 11, toPixelSize(1), "#00000066", "#100f0f66");
        drawPixelTextInCanvas(textArray, scoreCanv, toPixelSize(1), (textArray[0].length + 4) / 2, 6, "#edeef7", 1);
    }
}

const drawGameOver = () => {
    gameOverCanv.getContext("2d").clearRect(0, 0, gameOverCanv.width, gameOverCanv.height);
    genSmallBox(gameOverCanv, -20, (GameVars.gameHgAsPixels / 2) - 85, GameVars.gameWdAsPixels + 40, 180, GameVars.pixelSize, "black", "white");
    drawPixelTextInCanvas(convertTextToPixelArt("Game over"), gameOverCanv, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 40, "black", 5);
    drawScoreCalc(gameOverCanv);
}

const drawScoreCalc = (canvas) => {
    drawPixelTextInCanvas(convertTextToPixelArt("score"), canvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 10, "black", 4);
    drawPixelTextInCanvas(convertTextToPixelArt("enemies killed - " + GameVars.enemyKills * 10), canvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 15, "black", 2);
    drawPixelTextInCanvas(convertTextToPixelArt("boss enemies killed - " + GameVars.enemyBossKills * 100), canvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 30, "black", 2);
    drawPixelTextInCanvas(convertTextToPixelArt("keys caught - " + GameVars.keyCaught * 50), canvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 45, "black", 2);
    drawPixelTextInCanvas(convertTextToPixelArt("level - " + (GameVars.gameLevel - 1) * 500), canvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 60, "black", 2);
    drawPixelTextInCanvas(convertTextToPixelArt((GameVars.score > GameVars.highScore ? "new record!" : "total") + " - " + GameVars.score), canvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 75, "black", 2);
}

const startGame = (weaponType, handir) => {
    initAudio();
    GameVars.sound.clickSound();
    mainMenuDiv.classList.add("hidden");
    GameVars.gameDiv.classList.remove("hidden");
    GameVars.resetGameVars();
    skipElapsedTime = 0;
    handir < 0 && (GameVars.lastPlayerRightWeaponType = weaponType) || (GameVars.lastPlayerLeftWeaponType = weaponType);
    GameVars.game = new Game();
}

const skipGameOver = () => {
    GameVars.sound.clickSound();
    gameOverCanv.classList.add("hidden");
    mainMenuDiv.classList.remove("hidden");
    GameVars.gameDiv.innerHTML = "";
    GameVars.game = null;
    updateHighScore();
    lastScore = 0;
    drawScore();
    leftWeapon = randomNumbOnRange(1, 3);
    rightWeapon = randomNumbOnRange(1, 3);
    drawMainMenu();
}

const gameLoop = () => {
    elapsed = Date.now() - then;
    if (elapsed > fpsInterval) {
        then = Date.now() - (elapsed % fpsInterval);
        GameVars.deltaTime = elapsed / 1000;
        // updateFps(then);
        if (GameVars.game) {
            updateScore();
            drawScore();
            if (!GameVars.isGameOver) {
                GameVars.game.update();
            } else {
                drawGameOver();
                gameOverCanv.classList.remove("hidden");
                if (skipElapsedTime / 1 >= 1) {
                    if (GameVars.keys['Enter'] ||
                        GameVars.keys['v'] || GameVars.keys['V'] ||
                        GameVars.keys['b'] || GameVars.keys['B']) {
                        skipGameOver();
                        skipElapsedTime = 0;
                    }
                } else {
                    skipElapsedTime += GameVars.deltaTime;
                }
            }
        } else {
            if (skipElapsedTime / 1 >= 1) {
                if (GameVars.keys['v'] || GameVars.keys['V']) {
                    startGame(leftWeapon, -1);
                } else if (GameVars.keys['b'] || GameVars.keys['B']) {
                    startGame(rightWeapon, 1);
                }
            } else {
                skipElapsedTime += GameVars.deltaTime;
            }
        }
        handleMuteInput();
        drawSoundBtn();
        GameVars.sound && GameVars.sound.playMusic();
    }
    window.requestAnimationFrame(() => gameLoop());
}

const handleMuteInput = () => {
    if (GameVars.keys['m'] || GameVars.keys['M']) {
        GameVars.keys['m'] = false;
        GameVars.keys['M'] = false;
        GameVars.sound.muteMusic();
    }
}

const updateScore = () => {
    lastScore = GameVars.score;
    GameVars.score = (GameVars.enemyKills * 10) + (GameVars.keyCaught * 50) + (GameVars.enemyBossKills * 100) + ((GameVars.gameLevel - 1) * 500);
}

const updateHighScore = () => {
    if (GameVars.highScore < GameVars.score) {
        GameVars.highScore = GameVars.score;
        localStorage.setItem(GameVars.storeId, GameVars.highScore);
    }
}

init();