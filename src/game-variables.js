const storeId = 'igorfie-the-knighting-of-sr-isaac';

let highScore = parseInt(localStorage.getItem(storeId)) || 0;

const isMobile = navigator.maxTouchPoints > 1;

let lastGameW;
let lastGameH;

let gameW;
let gameH;

const fps = 60;
let deltaTime;
// let debug;

let sound;

let pixelSize;

let gameWdAsPixels;
let gameHgAsPixels;

let gameDiv;

let game;
let gameBoardSize;

// let atkCanv;

let weaponIcons;
let movePad;

let keys = {};

let score;
let gameLevel;
let keyCaught;
let enemyKills;
let enemyBossKills;

let isGameOver;

let roomWidth = 33;
let roomHeight = 17;

let gameBoard;
let currentRoom;

let player;
let lastPlayerLife;
let lastPlayerRightWeaponType;
let lastPlayerLeftWeaponType;

let heartLifeVal = 6;

const resetGameVars = () => {
    GameVars.score = -1; // -1 so the score redraws

    GameVars.gameBoardSize = 5;
    GameVars.gameLevel = 1;

    GameVars.keyCaught = 0;
    GameVars.enemyKills = 0;
    GameVars.enemyBossKills = 0;

    GameVars.player = null;
    GameVars.lastPlayerLife = null;
    GameVars.lastPlayerRightWeaponType = null;
    GameVars.lastPlayerLeftWeaponType = null;
}

const updatePixelSize = (width, height) => {
    GameVars.lastGameW = GameVars.gameW;
    GameVars.lastGameH = GameVars.gameH;

    GameVars.gameW = width;
    GameVars.gameH = height;

    GameVars.pixelSize = (height < 500 || width < 500) ? 2 : pixelCal(1, 4);

    GameVars.gameWdAsPixels = width / GameVars.pixelSize;
    GameVars.gameHgAsPixels = height / GameVars.pixelSize;

    GameVars.roomWidth = GameVars.gameWdAsPixels / 16;
    GameVars.roomHeight = GameVars.gameHgAsPixels / 16;
}

// const initDebug = () => {
    //     GameVars.debug = document.createElement("div");
    //     GameVars.debug.style.fontSize = "50px";
    //     GameVars.debug.style.position = "absolute";
    //     document.getElementById("main").appendChild(GameVars.debug);
// }

const pixelCal = (min, max) => {
    let hgPixelSize = Math.round((GameVars.gameH - 270) * ((max - min) / (1100 - 270)) + min);
    let wdPixelSize = Math.round((GameVars.gameW - 480) * ((max - min) / (1000 - 480)) + min);
    return hgPixelSize < wdPixelSize ? hgPixelSize : wdPixelSize;
};

const calcResizePos = (x, y) => {
    let newX = (GameVars.gameW * x) / GameVars.lastGameW;
    let newY = (GameVars.gameH * y) / GameVars.lastGameH;
    return {
        x: newX < toPixelSize(48) ? toPixelSize(48) : newX > GameVars.gameW - toPixelSize(48) ? GameVars.gameW - toPixelSize(48) : newX,
        y: newY < toPixelSize(48) ? toPixelSize(48) : newY > GameVars.gameH - toPixelSize(48) ? GameVars.gameH - toPixelSize(48) : newY
    };
}

export const GameVars = {
    storeId,
    highScore,

    isMobile,

    lastGameW,
    lastGameH,

    gameW,
    gameH,

    fps,
    deltaTime,
    // debug,

    sound,

    pixelSize,
    gameWdAsPixels,
    gameHgAsPixels,

    gameDiv,

    game,
    gameBoardSize,
    gameLevel,

    // atkCanv,

    weaponIcons,
    movePad,

    keys,

    score,
    keyCaught,
    enemyKills,
    enemyBossKills,

    isGameOver,

    roomWidth,
    roomHeight,

    gameBoard,
    currentRoom,

    player,
    lastPlayerLife,
    lastPlayerRightWeaponType,
    lastPlayerLeftWeaponType,

    heartLifeVal,

    resetGameVars,
    updatePixelSize,
    calcResizePos
    // initDebug
}

export const toPixelSize = (value) => {
    return value * GameVars.pixelSize;
}