export const WeaponType = {
    FIST: 0, // down atk
    SHIELD: 1, // down/side atk
    MORNING_STAR: 2, // side atk
    HAMMER: 3, // top/side atk
    AXE: 4, // down/side atk
    SPEAR: 5, // range down atk
    HALBERD: 6, // range top atk
    SWORD: 7, // top/side/down atk
    GREATSWORD: 8, // rotation atk
    CROSSBOW: 9 // top/side atk
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
        case WeaponType.HALBERD:
            return halberd;
    }
    return fist;
}

const fist = [
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

const morningStar = [
    [null, "#edeef7", null],
    ["#edeef7", "#edeef7", "#edeef7"],
    [null, "#edeef7", null],
    [null, "wc", null]
];

const hammer = [
    ["#edeef7", "#edeef7", "#edeef7"],
    ["#999a9e", "#999a9e", "#edeef7"],
    ["#999a9e", "#999a9e", "#edeef7"],
    [null, "wc", null],
    [null, "wc", null]
];

const axe = [
    [null, "#edeef7", "#edeef7"],
    ["#edeef7", "#999a9e", "#edeef7"],
    [null, "#999a9e", "#edeef7"],
    [null, "wc", null],
    [null, "wc", null],
    [null, "wc", null]
];

const shield = [
    ["wc", "#edeef7", "wc"],
    ["#edeef7", "#edeef7", "#edeef7"],
    ["wc", "#edeef7", "wc"],
    ["wc", "#edeef7", "wc"]
];

const spear = [
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

const greatsword = [
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

const crossbow = [
    [null, null, null, "#edeef7", null, null, null],
    [null, null, null, "#edeef7", null, null, null],
    [null, "#999a9e", "#999a9e", "wc", "#999a9e", "#999a9e", null],
    [null, "#999a9e", null, "wc", null, "#999a9e", null],
    ["#999a9e", "#999a9e", null, "wc", null, "#999a9e", "#999a9e"],
    [null, null, "#3e3846", "wc", "#3e3846", null, null],
    [null, null, null, "wc", null, null, null],
    [null, null, null, "#edeef7", null, null, null]
];

const halberd = [
    [null, "#edeef7", null],
    [null, "#edeef7", null],
    [null, "#edeef7", "#edeef7"],
    ["#edeef7", "#999a9e", "#edeef7"],
    [null, "#999a9e", "#edeef7"],
    [null, "#686b7a", null],
    [null, "wc", null],
    [null, "wc", null],
    [null, "wc", null],
    [null, "wc", null],
    [null, "wc", null],
    [null, "wc", null],
    [null, "wc", null],
    [null, "wc", null]
];