import { RoomType } from "./room-type";

export const DoorType = {
    NORMAL: 0,
    TREASURE: 1,
    BOSS: 2
};

export const getDoorBasedOnRoomType = (roomType) => {
    switch (roomType) {
        case RoomType.TREASURE:
            return DoorType.TREASURE;
        case RoomType.BOSS:
            return DoorType.BOSS;
        default:
            return DoorType.NORMAL;
    }
};

export const getDoorColors = (doorType) => {
    switch (doorType) {
        case DoorType.TREASURE:
            return { lt: "#ffff57", md: "#cd9722", dk: "#9e6800" };
        case DoorType.BOSS:
            return { lt: "#703a33", md: "#641f14", dk: "#431313" };
        default:
            return { lt: "#865433", md: "#843d0d", dk: "#2f1519" };
    }
};