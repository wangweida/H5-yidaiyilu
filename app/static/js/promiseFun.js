export function delayPromise(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

export function animationPromise(ele, type) {
    return new Promise(resolve => {
        ele.on(type, resolve);
    });
}
