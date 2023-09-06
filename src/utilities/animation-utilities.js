import { toPixelSize } from "../game-variables";

export const deadAnim = () => {
    return {
        rotate: ["0deg", "90deg"],
        easing: ["ease-in-out", "ease-in-out"],
        offset: [0, 1]
    };
};

export const walk = () => {
    return {
        translate: ["0px 0px", "0px " + toPixelSize(-3) + "px", "0px 0px"],
        rotate: ["0deg", toPixelSize(-3) + "deg", "0deg"],
        offset: [0, 0.5, 1]
    };
};

export const weaponWalkLeft = () => {
    return {
        translate: [toPixelSize(-2) + "px " + toPixelSize(-2) + "px", "0px 0px", toPixelSize(-2) + "px " + toPixelSize(-2) + "px"],
        rotate: [toPixelSize(-2) + "deg", "0deg", toPixelSize(-2) + "deg"],
        offset: [0, 0.5, 1]
    };
};

export const weaponWalkRight = () => {
    return {
        translate: [toPixelSize(2) + "px " + toPixelSize(-2) + "px", "0px 0px", toPixelSize(2) + "px " + toPixelSize(-2) + "px"],
        rotate: [toPixelSize(2) + "deg", "0deg", toPixelSize(2) + "deg"],
        offset: [0, 0.5, 1]
    };
};