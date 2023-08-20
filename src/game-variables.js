const storeId = 'igorfie-13th-century-knight';

const isMobile = !!navigator.userAgent.toLowerCase().match(/\b(?:mobile|tablet|android|iphone|ipad)\b/g);

const gameW = window.innerWidth;
const gameH = window.innerHeight;

const fps = 90;
let deltaTime;

let pixelSize;

let gameWdAsPixels;
let gameHgAsPixels;

let gameDiv;
let gameCanv;
let gameCtx;

let weaponIcons;
let movePad;

let keys = {};

let score;

let roomWidth = 33;
let roomHeight = 17;

let gameBoard;
let currentRoom;

let player;

const resetGameVars = () => {

    GameVars.score = 0;

    GameVars.pixelSize = pixelCal(1.5, 4.5);
    GameVars.gameWdAsPixels = GameVars.gameW / GameVars.pixelSize;
    GameVars.gameHgAsPixels = GameVars.gameH / GameVars.pixelSize;

    GameVars.roomWidth = GameVars.gameWdAsPixels / 16;
    GameVars.roomHeight = GameVars.gameHgAsPixels / 16;
}

const pixelCal = (min, max) => {
    let hgPixelSize = Math.round((gameH - 270) * ((max - min) / (1100 - 270)) + min);
    let wdPixelSize = Math.round((gameW - 480) * ((max - min) / (1000 - 480)) + min);
    return hgPixelSize < wdPixelSize ? hgPixelSize : wdPixelSize;
};

export const GameVars = {
    storeId,

    isMobile,

    gameW,
    gameH,

    fps,
    deltaTime,

    pixelSize,
    gameWdAsPixels,
    gameHgAsPixels,

    gameDiv,
    gameCanv,
    gameCtx,

    weaponIcons,
    movePad,

    keys,

    score,

    roomWidth,
    roomHeight,

    gameBoard,
    currentRoom,
    player,

    resetGameVars
}

export const toPixelSize = (value) => {
    return value * GameVars.pixelSize;
}