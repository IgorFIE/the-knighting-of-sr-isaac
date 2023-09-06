import { toPixelSize } from "../game-variables";

export const deadAnim = () => {
    return {
        rotate: [0, 90 + "deg"],
        easing: ["ease-in-out", "ease-in-out"],
        offset: [0, 1]
    };
};

export const walk = () => {
    return {
        translate: [0, "0 " + toPixelSize(-3) + "px", 0],
        rotate: [0, toPixelSize(-3) + "deg", 0],
        offset: [0, 0.5, 1]
    };
};

export const weaponWalkLeft = () => {
    return {
        translate: [toPixelSize(-2) + "px " + toPixelSize(-2) + "px", 0, toPixelSize(-2) + "px " + toPixelSize(-2) + "px"],
        rotate: [toPixelSize(-2) + "deg", 0, toPixelSize(-2) + "deg"],
        offset: [0, 0.5, 1]
    };
};

export const weaponWalkRight = () => {
    return {
        translate: [toPixelSize(2) + "px " + toPixelSize(-2) + "px", 0, toPixelSize(2) + "px " + toPixelSize(-2) + "px"],
        rotate: [toPixelSize(2) + "deg", 0, toPixelSize(2) + "deg"],
        offset: [0, 0.5, 1]
    };
};