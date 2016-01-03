/**
 * 检查运行环境
 * 使用方法
 *
 *  $.os.android
 *  $.os.version
 */
(function ($, window) {

    function detect(ua) {
        this.os = {};
        var lowua = ua.toLowerCase();
        var funcs = [

            function () {//检查是否移动端和PC端
                this.os.mobile = !!ua.match(/AppleWebKit.*Mobile.*/);
                return false;
            },

            /**
             * 检查浏览器的语言
             */
                function () {
                this.os.language = (navigator.browserLanguage || navigator.language).toLowerCase();
            },

            /**
             * 检查内核版本
             */
                function () {
                //IE内核
                this.os.trident = ua.indexOf('Trident') > -1;
                //opera内核
                this.os.presto = ua.indexOf('Presto') > -1;
                //苹果、谷歌内核
                this.os.webKit = ua.indexOf('AppleWebKit') > -1;
                //火狐内核
                this.os.gecko = ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1;

                //ios终端
                this.os.ios = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                //android终端或者uc浏览器
                this.os.android = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1;
                //是否为iPhone或者QQHD浏览器
                this.os.iPhone = ua.indexOf('iPhone') > -1 || ua.indexOf('Mac') > -1;
                //是否iPad
                this.os.iPad = ua.indexOf('iPad') > -1;
                //是否web应该程序，没有头部与底部
                this.os.webApp = ua.indexOf('Safari') == -1;
            },

            /**
             * 检查微信环境
             */
                function () { //wechat
                var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
                if (wechat) { //wechat
                    this.os.wechat = {
                        version: wechat[2].replace(/_/g, '.')
                    };
                }
            },

            /**
             * 检查android文件
             */
                function () { //android
                var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
                if (android) {
                    this.os.android = true;
                    this.os.version = android[2];

                    this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
                }
                return this.os.android === true;
            },

            /**
             * 检查iOS
             */
                function () { //ios
                var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
                if (iphone) { //iphone
                    this.os.ios = this.os.iphone = true;
                    this.os.version = iphone[2].replace(/_/g, '.');
                } else {
                    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
                    if (ipad) { //ipad
                        this.os.ios = this.os.ipad = true;
                        this.os.version = ipad[2].replace(/_/g, '.');
                    }
                }
                return this.os.ios === true;
            },

            /**
             * 检查火狐
             * @returns {boolean}
             */
                function () { //火狐
                var firefox = lowua.match(/firefox\/([\d.]+)/);
                if (firefox) {
                    this.os.firefox = true;
                    this.os.version = firefox[1];
                }
                return this.os.firefox === true;

            },

            /**
             * 检查IE
             * @returns {boolean}
             */
                function () { //IE
                var ie = lowua.match(/msie ([\d.]+)/);
                if (ie) {
                    this.os.ie = true;
                    this.os.version = ie[1];
                }
                return this.os.ie === true;

            },

            /**
             * 检查谷歌
             * @returns {boolean}
             */
                function () { //chrome
                var chrome = lowua.match(/chrome\/([\d.]+)/);
                if (chrome) {
                    this.os.chrome = true;
                    this.os.version = chrome[1];
                }
                return this.os.chrome === true;

            },

            /**
             * 检查Safari
             * @returns {boolean}
             */
                function () { //safari
                var safari = lowua.match(/version\/([\d.]+).*safari/);
                if (safari) {
                    this.os.safari = true;
                    this.os.version = safari[1];
                }
                return this.os.safari === true;

            }


        ];
        [].every.call(funcs, function (func) {
            return !func.call($);
        });
    }

    detect.call($, navigator.userAgent);

}(jQuery, window));

