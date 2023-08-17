const storeId = 'igorfie-13th-century-knight';

const gameW = window.innerWidth;
const gameH = window.innerHeight;

const fps = 60;

let pixelSize;

let gameWdAsPixels;
let gameHgAsPixels;

let gameDiv;
let gameCanv;
let gameCtx;

let keys = [];

let score;

let roomWidth = 33;
let roomHeight = 17;

let gameBoard;
let player;

const resetGameVars = () => {
    GameVars.score = 0;

    let hgPixelSize = Math.round((gameH - 270) * ((3 - 1) / (1100 - 270)) + 1);
    let wdPixelSize = Math.round((gameW - 480) * ((3 - 1) / (1000 - 480)) + 1);

    GameVars.pixelSize = hgPixelSize < wdPixelSize ? hgPixelSize : wdPixelSize;
    GameVars.gameWdAsPixels = GameVars.gameW / GameVars.pixelSize;
    GameVars.gameHgAsPixels = GameVars.gameH / GameVars.pixelSize;

    GameVars.roomWidth = GameVars.gameWdAsPixels / 16;
    GameVars.roomHeight = GameVars.gameHgAsPixels / 16;
}

export const GameVars = {
    storeId,

    gameW,
    gameH,

    fps,

    pixelSize,
    gameWdAsPixels,
    gameHgAsPixels,

    gameDiv,
    gameCanv,
    gameCtx,

    keys,

    score,

    roomWidth,
    roomHeight,

    gameBoard,
    player,

    resetGameVars
}

export const toPixelSize = (value) => {
    return value * GameVars.pixelSize;
}