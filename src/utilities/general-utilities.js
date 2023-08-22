export const randomNumbOnRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const randomNumb = (max) => {
    return Math.floor(Math.random() * max);
}

export const createId = () => {
    return Math.random().toString(16).slice(2);
}