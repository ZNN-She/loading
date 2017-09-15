/**
 * Created by SNAKE on 2017/9/15.
 */
(function($) {
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
        maskEle: '<div id="snake-loading" class="snake-loading">' + '<div class="sk-fading-circle">' + '<div class="sk-circle1 sk-circle"></div>' + '<div class="sk-circle2 sk-circle"></div>' + '<div class="sk-circle3 sk-circle"></div>' + '<div class="sk-circle4 sk-circle"></div>' + '<div class="sk-circle5 sk-circle"></div>' + '<div class="sk-circle6 sk-circle"></div>' + '<div class="sk-circle7 sk-circle"></div>' + '<div class="sk-circle8 sk-circle"></div>' + '<div class="sk-circle9 sk-circle"></div>' + '<div class="sk-circle10 sk-circle"></div>' + '<div class="sk-circle11 sk-circle"></div>' + '<div class="sk-circle12 sk-circle"></div>' + '</div>' + '</div>'
    };
    Loading.prototype.show = function() {
        var self = this;

        self.$ele.append(self.option.maskEle);
        self.$ele.css("position", "relative");

        $.when(self.promise).then(
            function() {
                self.hide();
            }
        ).done(function() {
            self.hide();
        })
            .fail(function() {
                self.hide();
            });
    };
    Loading.prototype.hide = function(element) {
        var self = this;
        if (element) {
            $(element).children('#snake-loading').remove();
            element.css("position", "");
        } else {
            self.$ele.children('#snake-loading').remove();
            self.$ele.css("position", "");
        }
    };

    function Plugin(promise, options) {
        var option = $.extend({}, $.extend(Loading.DEFAULT), typeof options == "object" && options);
        if (this.height() < window.screen.availHeight) {
            option.maskEle = option.maskEle.replace("sk-fading-circle", ("sk-fading-circle center"));
        }
        if (this[0].tagName == "BODY") {
            option.maskEle = option.maskEle.replace('class="snake-loading"', ('class="snake-loading fixed"'));
        }
        return this.each(function() {
            var $this = $(this);
            var data = $(this).data("snake.loading");
            var options = option;

            $this.data("snake.loading", (data = new Loading(promise, this, options)))
            if (typeof promise == "hide") {
                data.hide(option);
            }
        });
    }

    _addStyle = function() {
        var style = document.createElement('link'); //创建一个style元素
        var head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
        style.rel = 'stylesheet'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
        style.setAttribute("href", CSS_PATH);
        head.appendChild(style); //把创建的style元素插入到head中
    };

    function _getCssPath() {
        $(document.scripts).each(function(index, el) {
            if (el.src.indexOf("loading-0.1.0.js") > -1) {
                BASE_PATH = el.src;
                CSS_PATH = el.src.replace("loading-0.1.0.js", "loading.css");
            }else if (el.src.indexOf("loading.js") > -1) {
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

    $.fn.loading.noConflict = function() {
        $.fn.loading = old;
        return this
    }
})(jQuery);
