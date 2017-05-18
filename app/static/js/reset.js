//清除touchmove
document.addEventListener('touchmove', (ev) => {
    ev.preventDefault();
});

export function repeatAndShare(repeatBtn, shareBtn, sharePage) {
    repeatBtn.on('touchstart', () => {
        window.location = window.location.href + '?' + new Date().getTime();
    });

    shareBtn.on('touchstart', () => {
        sharePage.show();
    });

    sharePage.on('touchstart', () => {
        sharePage.hide();
    });
}

export function musicBtn(musicBtn, onUrl, offUrl, audio) {
    let playFlag = true;

    musicBtn.on('touchstart', () => {
        if (playFlag) {
            musicBtn.css('backgroundImage', `url(${offUrl})`);
            audio.pause();
            playFlag = false;
            return;
        }

        musicBtn.css('backgroundImage', `url(${onUrl})`);
        audio.play();
        playFlag = true;
    });
}
