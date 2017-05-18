export function randomNumTool(numArr) {
    let min = Math.min(...numArr);
    let max = Math.max(...numArr);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function removeSameClass(ele, className) {
    let index = 0;
    let length = ele.length;

    let timer = setInterval(() => {
        ele.eq(index).removeClass(className);
        index++;
        if (index === length) {
            clearInterval(timer);
        }
    }, 300);
}

export function calcTransform(ele, startPos, endPos) {
    let {startX, startY} = startPos,
        {endX, endY} = endPos;

    return {
        calcFn() {
            ele.css({
                'transform': `translate3d(${endX}px, ${endY}px, 0) scale(1) rotate(0)`,
                'z-index': '50'
            });
        },
        resetFn() {
            ele.css({
                'transform': `translate3d(${startX}px, ${startY}px, 0) scale(.3076923076923077) rotate(${randomNumTool([-15, 15])}deg)`,
                'z-index': 'auto'
            });
        }
    };
}
