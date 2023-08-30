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
