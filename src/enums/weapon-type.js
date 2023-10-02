export const WeaponType = {
  FIST: 0, // down atk
  SHIELD: 1, // down/side atk
  MORNING_STAR: 2, // side atk
  TROWING_KNIVE: 3, // down/side atk
  HAMMER: 4, // top/side atk
  AXE: 5, // down/side atk
  TROWING_AXE: 6, // side atk
  SPEAR: 7, // range down atk
  HALBERD: 8, // range top atk
  CROSSBOW: 9, // top/side atk
  SWORD: 10, // top/side/down atk
  GREATSWORD: 11, // rotation atk
};

export const ProjectileType = {
  ARROW: 0,
  KNIVE: 1,
  AXE: 2,
};

export const getProjectileType = (weaponType) => {
  switch (weaponType) {
    case WeaponType.TROWING_KNIVE:
      return ProjectileType.KNIVE;
    case WeaponType.TROWING_AXE:
      return ProjectileType.AXE;
  }
  return ProjectileType.ARROW;
};

export const getWeaponSprite = (weaponType) => {
  switch (weaponType) {
    case WeaponType.SHIELD:
      return shield;
    case WeaponType.SWORD:
      return shortSword;
    case WeaponType.TROWING_KNIVE:
      return tKnive;
    case WeaponType.TROWING_AXE:
      return tAxe;
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
};

export const getProjectileSprite = (projectileType) => {
  switch (projectileType) {
    case ProjectileType.KNIVE:
      return tKnive;
    case ProjectileType.AXE:
      return tAxe;
  }
  return arrow;
};

export const isProjectileWeapon = (weaponType) => {
  switch (weaponType) {
    case WeaponType.TROWING_KNIVE:
    case WeaponType.TROWING_AXE:
    case WeaponType.CROSSBOW:
      return true;
  }
  return false;
};

const fist = [
  ["#e7c688", "#e7c688"],
  ["#e7c688", "#e7c688"],
];

export const shortSword = [
  [null, "#edeef7", null],
  [null, "#edeef7", null],
  [null, "#edeef7", null],
  [null, "#edeef7", null],
  [null, "#edeef7", null],
  ["#999a9e", "#999a9e", "#999a9e"],
  [null, "wc", null],
  [null, "wc", null],
];

const morningStar = [
  [null, "#edeef7", null],
  ["#edeef7", "#edeef7", "#edeef7"],
  [null, "#edeef7", null],
  [null, "wc", null],
];

const hammer = [
  ["#edeef7", "#edeef7", "#edeef7"],
  ["#999a9e", "#999a9e", "#edeef7"],
  ["#999a9e", "#999a9e", "#edeef7"],
  [null, "wc", null],
  [null, "wc", null],
];

const axe = [
  [null, "#edeef7", "#edeef7"],
  ["#edeef7", "#999a9e", "#edeef7"],
  [null, "#999a9e", "#edeef7"],
  [null, "wc", null],
  [null, "wc", null],
  [null, "wc", null],
];

const shield = [
  ["wc", "#edeef7", "wc"],
  ["#edeef7", "#edeef7", "#edeef7"],
  ["wc", "#edeef7", "wc"],
  ["wc", "#edeef7", "wc"],
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
  ["#edeef7"],
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
  [null, null, null, "#edeef7", null, null, null],
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
  [null, "wc", null],
];

const arrow = [
  ["#edeef7"],
  ["#edeef7"],
  ["wc"],
  ["wc"],
  ["wc"],
  ["wc"],
  ["wc"],
  ["#edeef7"],
];

const tKnive = [["wc"], ["#edeef7"], ["#edeef7"]];

const tAxe = [
  ["#edeef7", "#999a9e"],
  ["#edeef7", "wc"],
  [null, "wc"],
  [null, "wc"],
];
