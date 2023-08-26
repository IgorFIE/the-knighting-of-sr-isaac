import { WeaponType } from "../enums/weapon-type";

const nu = null;
const sk = "#e7c688"; // skin
const bl = "#000000"; // black
const wt = "#edeef7"; // white

const gl = "#999a9e"; // gray light
const gm = "#686b7a"; // gray middle
const gd = "#3e3846"; // gray dark

const yl = "#ffff57"; // yellow light
const ym = "#cd9722"; // yellow middle
const yd = "#9e6800"; // yellow dark

const grassLight = "#52804d";
const grass = "#41663d";

const hL = "hl"; // helmet light id
const hD = "hd"; // helmet dark id
const cM = "cm"; // chain mail id

const wc = "wc"; // weapon color id

const ho = "ho"; // heart outside
const hi = "hi"; // heart inside

const bf = "#38252e"; // ash
const bt = "bt"; // bonfire light
const bm = "bm"; // bonfire middle

export const enemyChainMailColors = ["#3c4f68", "#431313", "#2f492c", "#641f14"];

export const playerColors = { "hd": ym, "hl": yl, "cm": yd };

export const fullHeartColors = { "ho": wt, "hi": "#a80000" };
export const emptyHeartColors = { "ho": "#2f1519", "hi": "#100f0f" };

export const knight = [
    [hD, hL, hD],
    [hL, hL, hL],
    [bl, hL, bl],
    [sk, sk, sk],
    [cM, cM, cM],
    [cM, cM, cM],
    [cM, cM, cM],
    [bl, nu, bl]
];

export const heart = [
    [nu, ho, ho, nu, ho, ho, nu],
    [ho, hi, hi, ho, hi, hi, ho],
    [ho, hi, hi, hi, hi, hi, ho],
    [ho, hi, hi, hi, hi, hi, ho],
    [nu, ho, hi, hi, hi, ho, nu],
    [nu, nu, ho, hi, ho, nu, nu],
    [nu, nu, nu, ho, nu, nu, nu]
];

export const bonfire = [
    [nu, nu, nu, nu, bm, nu, nu],
    [nu, nu, nu, bm, nu, nu, nu],
    [nu, bf, bm, bm, bm, bf, nu],
    [bf, bm, bm, bm, bm, bm, bf],
    [bf, bm, bm, bt, bm, bm, bf],
    [bf, bm, bt, bt, bt, bm, bf],
    [bf, bf, bt, bt, bt, bf, bf],
    [nu, bf, bf, bf, bf, bf, nu],
];

// WEAPONS

export const fist = [
    [sk, sk],
    [sk, sk]
];

export const shortSword = [
    [nu, wt, nu],
    [nu, wt, nu],
    [nu, wt, nu],
    [nu, wt, nu],
    [gl, gl, gl],
    [nu, wc, nu],
    [nu, wc, nu]
];

export const morningStar = [
    [nu, wt, nu],
    [wt, wt, wt],
    [nu, wt, nu],
    [nu, gd, nu],
    [nu, gd, nu]
];

export const hammer = [
    [wt, wt, wt],
    [gl, gl, wt],
    [gl, gl, wt],
    [nu, gd, nu],
    [nu, gd, nu]
];

export const axe = [
    [nu, wt, wt],
    [wt, gl, wt],
    [nu, gl, wt],
    [nu, gd, nu],
    [nu, gd, nu]
];

export const shield = [
    [wc, wt, wc],
    [wt, wt, wt],
    [wc, wt, wc],
    [wc, wt, wc]
];

export const spear = [
    [wt],
    [wt],
    [gm],
    [gd],
    [gd],
    [gd],
    [gd],
    [gd],
    [gd],
    [gd],
    [gd],
    [gd],
    [gd],
    [gd]
];

export const greatsword = [
    [nu, nu, nu, wt, nu, nu, nu],
    [nu, nu, gl, gl, wt, nu, nu],
    [nu, nu, gl, gl, wt, nu, nu],
    [nu, nu, gl, gl, wt, nu, nu],
    [nu, nu, gl, gl, wt, nu, nu],
    [nu, nu, gl, gl, wt, nu, nu],
    [nu, nu, gl, gl, wt, nu, nu],
    [gd, gd, gd, gd, gd, gd, gd],
    [nu, nu, nu, wc, nu, nu, nu],
    [nu, nu, nu, wc, nu, nu, nu],
    [nu, nu, nu, wc, nu, nu, nu],
    [nu, nu, nu, gd, nu, nu, nu],
];

export const getWeaponSprite = (weaponType) => {
    switch (weaponType) {
        case WeaponType.SHIELD:
            return shield;
        case WeaponType.SWORD:
            return shortSword;
        case WeaponType.GREATSWORD:
            return greatsword;
        default:
            return fist;
    }
}

// ITEMS
export const key = [
    [wt, wt, wt],
    [wt, nu, wt],
    [wt, wt, wt],
    [nu, wt, nu],
    [wt, wt, nu],
    [nu, wt, nu],
    [wt, wt, nu]
];

export const getItemSprite = (itemType) => {
    switch (itemType) {
        default:
            return [];
    }
}
