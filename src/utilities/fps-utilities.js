let frameCount = 0;
let startTime = Date.now();
let fps;

export const createFpsElement = (mainDiv) => {
    fps = document.createElement("div");
    fps.style.fontSize = "50px";
    fps.style.position = "absolute";
    mainDiv.appendChild(fps);
}

export const updateFps = () => {
    var sinceStart = Date.now() - startTime;
    var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
    fps.innerHTML = currentFps;
}