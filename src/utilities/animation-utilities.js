export const deadAnim = (currentTransform) => {
    return {
        transform: [
            currentTransform + " rotate(0deg)",
            currentTransform + " rotate(90deg)"],
        easing: ["ease-in-out", "ease-in-out"],
        offset: [0, 1]
    };
};