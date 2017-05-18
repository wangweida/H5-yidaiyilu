(function($) {
    class PreLoad {
        constructor(opt) {
            let defaultOpt = {
                disorder: true,
                order: false
            };
            this.backgroundEle = $('[data-src]');
            this.count = 0;
            this.opt = opt;

            if (this.opt.disorder === true) {
                this.disorderLoad();
            }
        }

        disorderLoad() {
            let eachFn = this.opt.eachFn,
                allFn = this.opt.allFn,
                urlFn = this.opt.urlFn,
                backgroundEle = this.backgroundEle,
                count = this.count,
                totalCount = backgroundEle.length,
                img;

            backgroundEle.forEach((ele, index) => {
                let url = urlFn && urlFn(ele);

                img = new Image();
                img.src = url;
                img.onload = () => {
                    count++;
                    eachFn && eachFn(ele, url, count);

                    if(totalCount === count) {
                        allFn && allFn();
                    }
                };
            });
        }
    }

    $.preLoad = function(opt) {
        new PreLoad(opt);
    }
})(Zepto);
