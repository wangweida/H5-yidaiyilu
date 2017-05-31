import Zepto from 'n-zepto';
import '../index.tmpl.html';

import '../static/css/reset.css';
import '../css/index.less';

import '../static/js/preLoad';
import { repeatAndShare, musicBtn } from '../static/js/reset';
import { animationPromise } from '../static/js/promiseFun';
import { removeSameClass, calcTransform } from '../static/js/util';
import personTxtArr from '../json/personTxt';
import sceneryTxtArr from '../json/sceneryTxt';

(function preload($) {
    const $oLoadingTxt = $('.loading-txt');
    const length = $('[data-src]').length;
    $.preLoad({
        eachFn(ele, url, count) {
            $(ele).css({ background: `url(${url}) no-repeat`, backgroundSize: '100% 100% !important' });
            $oLoadingTxt.html(Math.floor(count / length * 100) + '%');
        },
        allFn() {
            setTimeout(() => {
                $('.loading').css({ transform: 'translate3d(0, -100%, 0)' });
            }, 2000);
        },
        urlFn(ele) {
            /* eslint-disable global-require */
            const url = require(`../images/${ele.dataset.src}`);
            return url;
        },
        disorder: true,
    });
}(Zepto));

(function global($, personJson, sceneryJson) {
    /* eslint-disable global-require */
    const kadaUrl = require('../media/kada.mp3');

    const app = {
        eles: {
            $aPerson: $('.person'),
            $aPhotoSelectWrapper: $('.select-photo-wrapper'),
            $oScalePhotoWrapper: $('.scale-photo-wrapper'),
        },
        posObj: {
            startPosArr: [],
            endPos: {
                endX: Math.round($('.point').position().left),
                endY: Math.round($('.point').position().top),
            },
            getStartPosArr(startPosArr) {
                const eles = this.eles;

                eles.$aPerson.forEach((item) => {
                    const pos = {};
                    pos.startX = Math.round($(item).offset().left);
                    pos.startY = Math.round($(item).offset().top);
                    startPosArr.push(pos);
                    $(item).addClass('scale').css('transition', '.5s ease');
                });
            },
        },
        pageIndex: 0,
        selectIndex: 0,
        tempClick: null,
        flag: {
            moving: false,
            firstClickPhoto: true,
        },
        util: {
            $aTitle: $('.content-title'),
            $aAuthor: $('.aurthor'),
            personTxtArr: personJson,
            sceneryTxtArr: sceneryJson,
            toggleTxt(pageIndex, selectIndex) {
                if (pageIndex === 0) {
                    this.$aTitle.eq(pageIndex).html(this.personTxtArr[selectIndex].title);
                    this.$aAuthor.eq(pageIndex).html(this.personTxtArr[selectIndex].aurthor);
                } else {
                    this.$aTitle.eq(pageIndex).html(this.sceneryTxtArr[selectIndex].title);
                    this.$aAuthor.eq(pageIndex).html(this.sceneryTxtArr[selectIndex].aurthor);
                }
            },
            playMus(url) {
                $('#audio').attr('src', url);
            },
            toggleMus() {
                const onUrl = require('../images/music-on.png');
                const offUrl = require('../images/music-off.png');
                const $oBtn = $('.music-btn');
                musicBtn($oBtn, onUrl, offUrl, $('#audio')[0]);
            },
        },
        openingAnimation() {
            const $oLoading = $('.loading');
            const $oTrain = $('.train');
            const $oLongBg = $('.long-bg');
            const $oTitle = $('.title');
            const $oPhotoRecord = $('.photo-record');
            const $oPhotoRecordCopy = $('.photo-record-copy');
            const $oCoverArea = $('.cover-area');
            const $oLongWrapper = $('.long-page-wrapper');

            animationPromise($oLoading, 'transitionend')
            .then(() => {
                $oTrain.addClass('distance');
                $oLongBg.removeClass('distance');
            })
            .then(animationPromise.bind(null, $oLongBg, 'transitionend'))
            .then(() => {
                $oTitle.addClass('active');
                $oPhotoRecord.addClass('active');
            })
            .then(animationPromise.bind(null, $oPhotoRecordCopy, 'touchstart'))
            .then(() => {
                $('#kada').attr('src', kadaUrl)[0].play();
                $oCoverArea.addClass('flash-cover');
            })
            .then(animationPromise.bind(null, $oCoverArea, 'webkitAnimationEnd animationend'))
            .then(() => {
                $oLongWrapper.addClass('hide');
            })
            .then(animationPromise.bind(null, $oLongWrapper, 'webkitAnimationEnd animationend'))
            .then(() => {
                $oLongWrapper.hide();
                $oCoverArea.hide();
                removeSameClass(this.eles.$aPerson, 'scale');
            });
        },
        togglePicPage() {
            const $aBtn = $('.btn');
            const $aScenery = $('.scenery');
            let selected = 0;
            let firstSelectPhotoWrapper = true;

            const leftUrl = require('../images/left-btn.png');
            const leftActiveUrl = require('../images/left-btn-active.png');
            const rightUrl = require('../images/right-btn.png');
            const rightActiveUrl = require('../images/right-btn-active.png');

            const { $oScalePhotoWrapper, $aPhotoSelectWrapper } = this.eles;

            const context = this;

            function touchHandle() {
                context.pageIndex = $(this).index();

                if (selected === context.pageIndex) {
                    return;
                }

                if (context.pageIndex === 1) {
                    if (firstSelectPhotoWrapper) {
                        removeSameClass($aScenery, 'scale');
                        firstSelectPhotoWrapper = false;
                    }
                    $aBtn.eq(0).css('backgroundImage', `url(${leftUrl})`);
                    $(this).css('backgroundImage', `url(${rightActiveUrl})`);
                } else {
                    $aBtn.eq(1).css('backgroundImage', `url(${rightUrl})`);
                    $(this).css('backgroundImage', `url(${leftActiveUrl})`);
                }

                selected = context.pageIndex;

                $oScalePhotoWrapper.removeClass('selected');
                $aPhotoSelectWrapper.removeClass('selected').eq(selected).addClass('selected');
            }

            $aBtn.on('touchstart', touchHandle);
        },
        scalePhoto() {
            const flag = this.flag;
            const { startPosArr, endPos } = this.posObj;

            const util = this.util;

            const { $oScalePhotoWrapper, $aPhotoSelectWrapper } = this.eles;

            $aPhotoSelectWrapper.on('touchstart', '.item', (ev) => {
                if (flag.moving || !flag.firstClickPhoto) {
                    return;
                }
                flag.moving = true;
                flag.firstClickPhoto = false;

                this.tempClick = $(ev.target);
                this.selectIndex = this.tempClick.index();
                calcTransform(this.tempClick, startPosArr[this.selectIndex], endPos).calcFn();
                util.toggleTxt(this.pageIndex, this.selectIndex);

                this.tempClick.parent().addClass('need-index');
                $oScalePhotoWrapper.addClass('selected');

                this.tempClick.on('transitionend', () => {
                    flag.moving = false;
                });
            });
        },
        resetPhoto() {
            const flag = this.flag;
            const { startPosArr, endPos } = this.posObj;

            const { $oScalePhotoWrapper, $aPhotoSelectWrapper } = this.eles;

            $oScalePhotoWrapper.on('touchstart', () => {
                if (flag.moving) {
                    return;
                }
                flag.moving = true;
                flag.firstClickPhoto = true;

                calcTransform(this.tempClick, startPosArr[this.selectIndex], endPos).resetFn();

                $aPhotoSelectWrapper.removeClass('need-index');
                $oScalePhotoWrapper.removeClass('selected');
            });
        },
        clickEndBtn() {
            const $oEndBtn = $('.end');
            const $oPhotoWrapper = $('.photo-wrapper');

            animationPromise($oEndBtn, 'touchstart').then(() => {
                $oPhotoWrapper.addClass('hide');
            }).then(animationPromise.bind(null, $oPhotoWrapper, 'transitionend')).then(() => {
                $oPhotoWrapper.hide();
            });
        },
        repeatAndShare() {
            const $oRepeatBtn = $('.repeat');
            const $oShareBtn = $('.click-share');
            const $oSharePage = $('.share-page');

            repeatAndShare($oRepeatBtn, $oShareBtn, $oSharePage);
        },
        init() {
            this.util.playMus(require('../media/1.mp3'));
            this.util.toggleMus();

            const getStartPosArr = this.posObj.getStartPosArr.bind(this, this.posObj.startPosArr);
            getStartPosArr();

            this.openingAnimation();
            this.togglePicPage();
            this.scalePhoto();
            this.resetPhoto();
            this.clickEndBtn();
            this.repeatAndShare();
        },
    };

    app.init();
}(Zepto, personTxtArr, sceneryTxtArr));
