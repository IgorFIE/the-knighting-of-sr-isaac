export const WeaponType = {
    FIST: 0,
    SHIELD: 1,
    AXE: 2,
    MORNING_STAR: 3,
    SPEAR: 4,
    HAMMER: 5,
    SWORD: 6,
    GREATSWORD: 7,
    CROSSBOW: 8
};

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