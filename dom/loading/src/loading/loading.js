/**
 * Created by zhangnn on 2018/10/12.
 *
 * loading遮罩
 * 参数
 * promise:Object/String
 *      Object:jQuery的Deferred()对象，或者es6的Promise对象;
 *      String:传入插件原型链上的方法名，可执行该方法；插件暴露的方法有 show hidden
 * options:Object,其它配置参数，目前只支持一个参数
 *      {
 *          type: String loading的类型 default progress 默认default
 *          size: String loading的大小 default large small 默认default
 *          text: String 显示的文本
 *          progress:Number 进度，总值为100，number/100,
 *          horizontal: Boolean 文字和loading图标是在一行还是两行 true:一行  默认true
 *          content: Element 自定义loading内容 type和loading同事存在时content优先 默认null
 *      }
 * $("select").loading(promise, options);
 * $("select").loading("show", options);
 * $("select").loading("hidden", options);
 */
(function ($) {
    // 当前文件路径
    var BASE_PATH = "";
    var CSS_PATH = "";

    function Loading(promise, element, options) {
        var self = this;

        self.option = $.extend(true, {}, options);
        self.$ele = $(element);
        self.promise = promise;

        self.show();

    }

    Loading.DEFAULT = {
        type: "default",
        size: "default",
        text: "数据加载中，请稍后...",
        progress: 0,
        horizontal: true,
        content: '<div class="znn-jq-loading {{type}} {{size}} {{horizontal}}">' +
        '               <div class="znn-jq-loading-content">' +
        '                   <div class="znn-jq-loading-inner">' +
        '                       {{content}}' +
        '                       <div class="znn-jq-loading-text">{{text}}</div>' +
        '                   </div>' +
        '               </div>' +
        '           </div>',
    };
    Loading.prototype.show = function () {
        var self = this;
        var content = _createContent(self.option);
        //移除掉已存在的loading
        self.$ele.children('.znn-jq-loading').remove();
        // self.$ele.css("position", "");

        self.$ele.append(content);
        if (self.$ele[0].tagName === "BODY") {
            self.$ele.children(".znn-jq-loading").addClass("znn-jq-loading-fixed");
        } else {
            // self.$ele.css("position", "relative");
        }
        if (self.$ele.height() > 100) {
            self.$ele.children(".znn-jq-loading").find(".znn-jq-loading-content").css("padding-top", self.$ele.height() / 2 - 30);
        }
        if (self.option.type === "progress") {
            self.progress();
        }

        if (self.promise.done) {
            //jqury的promise
            self.promise.then(
                function () {
                    self.hidden();
                }
            ).done(function () {
                self.hidden();
            })
                .fail(function () {
                    self.hidden();
                });
        } else if (self.promise.catch) {
            //es6的Promise
            self.promise.then(function () {
                self.hidden();
            }).catch(function () {
                self.hidden();
            })
        }
    };
    Loading.prototype.hidden = function () {
        var self = this;
        clearInterval(self.setProgressInterval);
        self.$ele.children('.znn-jq-loading').remove();
        // self.$ele.css("position", "");
    };
    Loading.prototype.progress = function (progress) {
        var self = this;
        self.$ele.children(".znn-jq-loading").find(".znn-jq-loading-progress-label").css({width: 0});
        if (progress) {
            self.$ele.children(".znn-jq-loading").find(".znn-jq-loading-progress-label").css({width: progress + "%"});
        } else {
            var option = self.option;
            if (option.progress) {
                self.$ele.children(".znn-jq-loading").find(".znn-jq-loading-progress-label").css({width: option.progress + "%"});
            } else {
                self.setProgressInterval = setInterval(function () {
                    if (self.option.progress <= 95) {
                        self.option.progress++
                    }
                    self.$ele.children(".znn-jq-loading").find(".znn-jq-loading-progress-label").css({width: self.option.progress + "%"});
                }.bind(self), 15);
            }
        }
    };

    function Plugin(promise, options) {
        var option = $.extend({}, Loading.DEFAULT, typeof options == "object" ? options : {});
        return this.each(function () {
            var $this = $(this);
            var data = $(this).data("znn.jq.loading");
            var options = option;

            $this.data("znn.jq.loading", (data = new Loading(promise, this, options)));
            if (typeof promise == "string" && typeof data[promise] == "function") {
                data[promise]();
            }
        });
    }

    function _createContent(options) {
        var content = options.content;
        //type
        content = content.replace("{{type}}", "znn-jq-loading-" + options.type);
        //size
        content = content.replace("{{size}}", "znn-jq-loading-" + options.size);
        //text
        content = content.replace("{{text}}", options.text);
        //horizontal
        content = content.replace("{{horizontal}}", options.horizontal ? (" znn-jq-loading-horizontal") : "");
        //progress
        var contentStr = '<div class="znn-jq-loading-circle"></div>';
        if (options.type === "progress") {
            contentStr = '<div class="znn-jq-loading-content-progress">' +
                '               <div class="znn-jq-loading-progress-label" style="width: {{progress}}"></div>' +
                '           </div>';
            contentStr = contentStr.replace("{{progress}}", options.progress + "%");
        }
        content = content.replace("{{content}}", contentStr);
        return content;
    }

    function _addStyle() {
        var style = document.createElement('link'); //创建一个style元素
        var head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
        style.rel = 'stylesheet'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
        style.setAttribute("href", CSS_PATH);
        head.appendChild(style); //把创建的style元素插入到head中
    }

    function _getCssPath() {
        $(document.scripts).each(function (index, el) {
            if (el.src.indexOf("loading.js") > -1) {
                BASE_PATH = el.src;
                CSS_PATH = el.src.replace("loading.js", "loading.css");
            }
        });
    }

    function _init() {
        _getCssPath();
        _addStyle();
    }

    _init();

    var old = $.fn.loading;

    jQuery.loading = $.fn.loading = Plugin;

    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.loading.noConflict = function () {
        $.fn.loading = old;
        return this;
    }
})(jQuery);
