const storeId = 'igorfie-13th-century-knight';

const gameW = window.innerWidth;
const gameH = window.innerHeight;

let pixelSize;

let gameWdAsPixels;
let gameHgAsPixels;

let score;

const resetGameVars = () => {
    GameVars.score = 0;

    let hgPixelSize = Math.round((gameH - 270) * ((3 - 1) / (1100 - 270)) + 1);
    let wdPixelSize = Math.round((gameW - 480) * ((3 - 1) / (1000 - 480)) + 1);

    GameVars.pixelSize = hgPixelSize < wdPixelSize ? hgPixelSize : wdPixelSize;
    GameVars.gameWdAsPixels = GameVars.gameW / GameVars.pixelSize;
    GameVars.gameHgAsPixels = GameVars.gameH / GameVars.pixelSize;
}

export const GameVars = {
    storeId,

    gameW,
    gameH,

    pixelSize,
    gameWdAsPixels,
    gameHgAsPixels,

    score,

    resetGameVars
}