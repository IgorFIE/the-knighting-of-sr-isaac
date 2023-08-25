import { Game } from "../game";
import { GameVars } from "../game-variables";

export const moveLevel = () => {
    GameVars.gameDiv.innerHTML = "";

    GameVars.lastPlayerLife = GameVars.player.lifeBar.life;
    GameVars.lastPlayerRightWeaponType = GameVars.player.playerRightWeapon.weaponType;
    GameVars.lastPlayerLeftWeaponType = GameVars.player.playerLeftWeapon.weaponType;

    GameVars.gameLevel++;
    GameVars.gameBoardSize += 2;

    GameVars.game = new Game();
}