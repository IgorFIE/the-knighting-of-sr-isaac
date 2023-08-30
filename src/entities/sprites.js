import { WeaponType } from "../enums/weapon-type";

export const playerColors = { "hd": "#cd9722", "hl": "#ffff57", "cm": "#9e6800" };

export const fullHeartColors = { "ho": "#edeef7", "hi": "#a80000" };
export const heart = [
    [null, "ho", "ho", null, "ho", "ho", null],
    ["ho", "hi", "hi", "ho", "hi", "hi", "ho"],
    ["ho", "hi", "hi", "hi", "hi", "hi", "ho"],
    ["ho", "hi", "hi", "hi", "hi", "hi", "ho"],
    [null, "ho", "hi", "hi", "hi", "ho", null],
    [null, null, "ho", "hi", "ho", null, null],
    [null, null, null, "ho", null, null, null]
];

export const knight = [
    ["hd", "hl", "hd"],
    ["hl", "hl", "hl"],
    ["#000000", "hl", "#000000"],
    ["#e7c688", "#e7c688", "#e7c688"],
    ["cm", "cm", "cm"],
    ["cm", "cm", "cm"],
    ["cm", "cm", "cm"],
    ["#000000", null, "#000000"]
];

// WEAPONS
export const fist = [
    ["#e7c688", "#e7c688"],
    ["#e7c688", "#e7c688"]
];

export const shortSword = [
    [null, "#edeef7", null],
    [null, "#edeef7", null],
    [null, "#edeef7", null],
    [null, "#edeef7", null],
    [null, "#edeef7", null],
    ["#999a9e", "#999a9e", "#999a9e"],
    [null, "wc", null],
    [null, "wc", null]
];

export const morningStar = [
    [null, "#edeef7", null],
    ["#edeef7", "#edeef7", "#edeef7"],
    [null, "#edeef7", null],
    [null, "wc", null]
];

export const hammer = [
    ["#edeef7", "#edeef7", "#edeef7"],
    ["#999a9e", "#999a9e", "#edeef7"],
    ["#999a9e", "#999a9e", "#edeef7"],
    [null, "wc", null],
    [null, "wc", null]
];

export const axe = [
    [null, "#edeef7", "#edeef7"],
    ["#edeef7", "#999a9e", "#edeef7"],
    [null, "#999a9e", "#edeef7"],
    [null, "wc", null],
    [null, "wc", null],
    [null, "wc", null]
];

export const shield = [
    ["wc", "#edeef7", "wc"],
    ["#edeef7", "#edeef7", "#edeef7"],
    ["wc", "#edeef7", "wc"],
    ["wc", "#edeef7", "wc"]
];

export const spear = [
    ["wc"],
    ["wc"],
    ["wc"],
    ["wc"],
    ["wc"],
    ["wc"],
    ["wc"],
    ["wc"],
    ["wc"],
    ["wc"],
    ["wc"],
    ["#686b7a"],
    ["#edeef7"],
    ["#edeef7"]
];

export const greatsword = [
    [null, null, null, "#edeef7", null, null, null],
    [null, null, "#999a9e", "#999a9e", "#edeef7", null, null],
    [null, null, "#999a9e", "#999a9e", "#edeef7", null, null],
    [null, null, "#999a9e", "#999a9e", "#edeef7", null, null],
    [null, null, "#999a9e", "#999a9e", "#edeef7", null, null],
    [null, null, "#999a9e", "#999a9e", "#edeef7", null, null],
    [null, null, "#999a9e", "#999a9e", "#edeef7", null, null],
    ["#3e3846", "#3e3846", "#3e3846", "#3e3846", "#3e3846", "#3e3846", "#3e3846"],
    [null, null, null, "wc", null, null, null],
    [null, null, null, "wc", null, null, null],
    [null, null, null, "wc", null, null, null],
    [null, null, null, "#3e3846", null, null, null],
];

export const crossbow = [
    [null, null, null, "#edeef7", null, null, null],
    [null, null, null, "#edeef7", null, null, null],
    [null, "#999a9e", "#999a9e", "wc", "#999a9e", "#999a9e", null],
    [null, "#999a9e", null, "wc", null, "#999a9e", null],
    ["#999a9e", "#999a9e", null, "wc", null, "#999a9e", "#999a9e"],
    [null, null, "#3e3846", "wc", "#3e3846", null, null],
    [null, null, null, "wc", null, null, null],
    [null, null, null, "#edeef7", null, null, null]
];

export const getWeaponSprite = (weaponType) => {
    switch (weaponType) {
        case WeaponType.SHIELD:
            return shield;
        case WeaponType.SWORD:
            return shortSword;
        case WeaponType.GREATSWORD:
            return greatsword;
        case WeaponType.SPEAR:
            return spear;
        case WeaponType.HAMMER:
            return hammer;
        case WeaponType.AXE:
            return axe;
        case WeaponType.MORNING_STAR:
            return morningStar;
        case WeaponType.CROSSBOW:
            return crossbow;
        default:
            return fist;
    }
}

// ITEMS
export const key = [
    ["#edeef7", "#edeef7", "#edeef7"],
    ["#edeef7", null, "#edeef7"],
    ["#edeef7", "#edeef7", "#edeef7"],
    [null, "#edeef7", null],
    ["#edeef7", "#edeef7", null],
    [null, "#edeef7", null],
    ["#edeef7", "#edeef7", null]
];

// AUDIO
export const speaker = [
    [null, null, null, "#edeef7", null],
    [null, "#edeef7", "#edeef7", "#edeef7", null],
    ["#edeef7", "#edeef7", "#edeef7", "#edeef7", "#edeef7"],
    ["#edeef7", "#edeef7", "#edeef7", "#edeef7", "#edeef7"],
    [null, "#edeef7", "#edeef7", "#edeef7", null],
    [null, null, null, "#edeef7", null]
];

export const audio = [
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
