import { toPixelSize } from "../game-variables";

export const deadAnim = (currentTransform) => {
    return {
        transform: [
            currentTransform + " rotate(0deg)",
            currentTransform + " rotate(90deg)"],
        easing: ["ease-in-out", "ease-in-out"],
        offset: [0, 1]
    };
};

export const walk = () => {
    return {
        transform: [
            "translateY(0px) rotate(0deg)",
            "translateY(" + toPixelSize(-3) + "px) rotate(" + toPixelSize(-3) + "deg)",
            "translateY(0px) rotate(0deg)"
        ],
        offset: [0, 0.5, 1]
    };
};

export const weaponWalkLeft = () => {
    return {
        transform: [
            "translateX(" + toPixelSize(-2) + "px) translateY(" + toPixelSize(-2) + "px) rotate(" + toPixelSize(-2) + "deg)",
            "translateX(0px) translateY(0px) rotate(0deg)",
            "translateX(" + toPixelSize(-2) + "px) translateY(" + toPixelSize(-2) + "px) rotate(" + toPixelSize(-2) + "deg)"
        ],
        offset: [0, 0.5, 1]
    };
};

export const weaponWalkRight = () => {
    return {
        transform: [
            "translateX(" + toPixelSize(2) + "px) translateY(" + toPixelSize(-2) + "px) rotate(" + toPixelSize(2) + "deg)",
            "translateX(0px) translateY(0px) rotate(0deg)",
            "translateX(" + toPixelSize(2) + "px) translateY(" + toPixelSize(-2) + "px) rotate(" + toPixelSize(2) + "deg)"
        ],
        offset: [0, 0.5, 1]
    };
};