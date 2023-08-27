import { GameVars } from "../game-variables";

export const BlockType = {
    WALL: 0,
    FLOOR: 1,
    DOOR_OPEN: 2,
    DOOR_CLOSE: 3
}

export const getBlockColors = () => {
    if (GameVars.gameLevel < 3) {
        return { lt: "#999a9e", md: "#686b7a", dk: "#3e3846" };
    } else if (GameVars.gameLevel < 6) {
        return { lt: "#703a33", md: "#38252e", dk: "#1b1116" };
    } else {
        return { lt: "#431313", md: "#2f1519", dk: "#100f0f" };
    }
};

export const getFloorColors = () => {
    if (GameVars.gameLevel < 3) {
        return { lt: "#52804d", md: "#41663d"};
    } else if (GameVars.gameLevel < 6) {
        return { lt: "#41663d", md: "#2f492c"};
    } else {
        return { lt: "#703a33", md: "#38252e"};
    }
};