﻿//https: //developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function (callback, thisArg) {

        var T, k;

        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}


if (window.context) {
    $.context = context;
}

/**
* 数字运算扩展功能,解决浮点数运算不精确的问题
*/
// 获取将数字放大成整数所使用的因数
Number.prototype.getZoomToIntegerFactor = function () { var s = this.toString(); var i = s.indexOf("."); return i == -1 ? 1 : Math.pow(10, s.length - i - 1); }
// 将数字放大成整数
Number.prototype.zoomToInteger = function () { var s = this.toString(); var i = s.indexOf("."); return i == -1 ? this : new Number(s.substring(0, i) + s.substring(i + 1)); }
// 当对浮点数字进行加减乘除运算时，由于 javascript 自身的问题，可能会产生错误（不精确），所以必须使用以下 Math 对象的扩展方法进行运算
Math.add = function (x, y) {// 两个数相加
    if (!isNaN(x) && !isNaN(y)) {
        var xFactor = x.getZoomToIntegerFactor(), yFactor = y.getZoomToIntegerFactor();
        if (xFactor > yFactor) { return (x.zoomToInteger() + y.zoomToInteger() * (xFactor / yFactor)) / xFactor; }
        else if (xFactor == yFactor) { return (x.zoomToInteger() + y.zoomToInteger()) / xFactor; }
        else { return (x.zoomToInteger() * (yFactor / xFactor) + y.zoomToInteger()) / yFactor; }
    }
    return isNaN(x) ? (isNaN(y) ? Number.NaN : y) : x;
}
Math.sub = function (x, y) {// 两个数相减
    if (!isNaN(x) && !isNaN(y)) {
        var xFactor = x.getZoomToIntegerFactor(), yFactor = y.getZoomToIntegerFactor();
        if (xFactor > yFactor) { return (x.zoomToInteger() - y.zoomToInteger() * (xFactor / yFactor)) / xFactor; }
        else if (xFactor == yFactor) { return (x.zoomToInteger() - y.zoomToInteger()) / xFactor; }
        else { return (x.zoomToInteger() * (yFactor / xFactor) - y.zoomToInteger()) / yFactor; }
    }
    return isNaN(x) ? (isNaN(y) ? Number.NaN : -y) : x;
}
Math.mul = function (x, y) {// 两个数相乘
    if (!isNaN(x) && !isNaN(y)) {
        return (x.zoomToInteger() * y.zoomToInteger()) / (x.getZoomToIntegerFactor() * y.getZoomToIntegerFactor());
    }
    return Number.NaN;
}
Math.div = function (x, y) {// 两个数相除
    if (!isNaN(x) && !isNaN(y)) {
        var xFactor = x.getZoomToIntegerFactor(), yFactor = y.getZoomToIntegerFactor();
        if (xFactor > yFactor) { return (x.zoomToInteger() / (y.zoomToInteger() * (xFactor / yFactor))); }
        else if (xFactor == yFactor) { return (x.zoomToInteger() / y.zoomToInteger()); }
        else { return ((x.zoomToInteger() * (yFactor / xFactor)) / y.zoomToInteger()); }
    }
    return Number.NaN;
}

// 将百分比字符串解析为等效的浮点数字，比如："2.1%" => 0.021
Math._percentRegex = new RegExp("^([0-9.]+)%$");

function isPercent(value) {
    if (!value) {
        return false;
    }

    if (!Math._percentRegex.test(value)) {
        return false;
    }

    return true;
}

function parsePercent(value) {
    if (!isPercent(value)) {
        return Number.NaN;
    }

    return value.replace(Math._percentRegex, function (a, b) { return Math.div(parseFloat(b), 100); });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* 数组扩展 */
Array.prototype.indexOf = function (o) { for (var i = 0, len = this.length; i < len; i++) { if (this[i] == o) return i; } return -1; }
Array.prototype.remove = function (o) { var index = this.indexOf(o); if (index >= 0) { this.splice(index, 1); } }
Array.prototype.removeAt = function (index) { this.splice(index, 1); }

/**
* 时间对象的格式化
*   参数说明：
*       format: 格式 yyyy 代表年 MM 代表月 dd 代表日 HH 代表24进制小时数　hh 代表 12 进制小时数 m 代表分钟 s 代表秒　f 代表　毫秒数 q 代表季度
*   示例：
*       new Date().format("yyyy-MM-dd HH:mm:ss.fff")
*/
Date.prototype.format = function (format) {
    if (!Date._formatRegExps) {
        Date._formatRegExps = {
            "y": new RegExp("(y+)"),
            "M": new RegExp("(M+)"),
            "d": new RegExp("(d+)"),
            "H": new RegExp("(H+)"),
            "h": new RegExp("(h+)"),
            "m": new RegExp("(m+)"),
            "s": new RegExp("(s+)"),
            "q": new RegExp("(q+)"),
            "f": new RegExp("(f+)")
        }
    }
    // 先处理掉年的部分
    if (Date._formatRegExps["y"].test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    var o = {
        "M": this.getMonth() + 1,
        "d": this.getDate(),
        "H": this.getHours(),
        "h": this.getHours() > 12 ? this.getHours() - 12 : this.getHours(),
        "m": this.getMinutes(),
        "s": this.getSeconds(),
        "q": Math.floor((this.getMonth() + 3) / 3)
    }

    for (var k in o) {
        if (Date._formatRegExps[k].test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    // 处理毫秒部分
    if (Date._formatRegExps["f"].test(format)) {
        var ms = this.getMilliseconds();
        switch (RegExp.$1.length) {
            case 1:
                format = format.replace(RegExp.$1, Math.floor(ms / 100));
                break;
            case 2:
                ms = Math.floor(ms / 10);
                format = format.replace(RegExp.$1, ("00" + ms).substr(("" + ms).length));
                break;
            default:
                format = format.replace(RegExp.$1, ("000" + ms).substr(("" + ms).length));
                break;
        }
    }
    return format;
};

(function (jQuery) {
    if (jQuery.browser) return;

    jQuery.browser = {};
    jQuery.browser.mozilla = false;
    jQuery.browser.webkit = false;
    jQuery.browser.opera = false;
    jQuery.browser.msie = false;

    var nAgt = navigator.userAgent;
    jQuery.browser.name = navigator.appName;
    jQuery.browser.fullVersion = '' + parseFloat(navigator.appVersion);
    jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        jQuery.browser.opera = true;
        jQuery.browser.name = "Opera";
        jQuery.browser.fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            jQuery.browser.fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        jQuery.browser.msie = true;
        jQuery.browser.name = "Microsoft Internet Explorer";
        jQuery.browser.fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        jQuery.browser.webkit = true;
        jQuery.browser.name = "Chrome";
        jQuery.browser.fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        jQuery.browser.webkit = true;
        jQuery.browser.name = "Safari";
        jQuery.browser.fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            jQuery.browser.fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        jQuery.browser.mozilla = true;
        jQuery.browser.name = "Firefox";
        jQuery.browser.fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        jQuery.browser.name = nAgt.substring(nameOffset, verOffset);
        jQuery.browser.fullVersion = nAgt.substring(verOffset + 1);
        if (jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase()) {
            jQuery.browser.name = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = jQuery.browser.fullVersion.indexOf(";")) != -1)
        jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix);
    if ((ix = jQuery.browser.fullVersion.indexOf(" ")) != -1)
        jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix);

    jQuery.browser.majorVersion = parseInt('' + jQuery.browser.fullVersion, 10);
    if (isNaN(jQuery.browser.majorVersion)) {
        jQuery.browser.fullVersion = '' + parseFloat(navigator.appVersion);
        jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
    }
    jQuery.browser.version = jQuery.browser.majorVersion;
})(jQuery);

// jquery ajax 扩展以增强可靠性并定义前后端通信
(function ($) {
    var ajax = $.ajax;

    var _messageQueue = [];

    $.ajax = function (url, options) {
        // If url is an object, simulate pre-1.5 signature
        if (typeof url === "object") {
            options = url;
            url = undefined;
        }

        // Force options to be an object
        options = options || {};

        var oldSuccess = options.success;
        var oldError = options.error;
        options.success = function (data, textStatus) {
            if (options.showProgressbar) {
                $.messager.progress('bar').progressbar('setValue', 100);

                setTimeout(function () { $.messager.progress('close'); }, 200);
            }
            if (data && $.type(data.code) === "number") {
                if (data.message && $.type(data.message) === "string" && data.message.length > 0) {
                    if ($.messager) {
                        $.messager.alert($.messager.defaults.info, data.message, "info", function () {
                            if (oldSuccess) {
                                oldSuccess(data.value || data, textStatus);
                            }
                        }).data('isSystemMessage', true);
                        return;
                    } else {
                        alert(data.message);
                    }
                }
                if (oldSuccess) {
                    oldSuccess(data.value || data, textStatus);
                }
                return;
            }

            if (oldSuccess) {
                oldSuccess(data, textStatus);
            }
        };
        options.error = function (xhr, status, errMsg) {
            if (options.showProgressbar) {
                $.messager.progress('close');
            }

            var errorHeaderVal = xhr.getResponseHeader(options.errorHeader || "server-error");

            var serverError = null;

            if ($.type(errorHeaderVal) === "string") {
                try {
                    serverError = (window["eval"]("(" + $.base64.decode(errorHeaderVal, true) + ")"));
                }
                catch (e) {
                }
                if (serverError && serverError.code === 300) {
                    if (serverError.message && $.type(serverError.message) === "string" && serverError.message.length > 0) {
                        if ($.type(options.confirm) === "function") {
                            if ($.messager) {
                                $.messager.confirm($.messager.defaults.confirm, serverError.message, function (r) {
                                    if (r) {
                                        options.confirm();
                                    }
                                }).data('isSystemMessage', true);
                            } else {
                                if (confirm(serverError.message)) {
                                    options.confirm();
                                }
                            }
                            return;
                        }
                    }
                }
            }

            var errObj = serverError || { code: xhr.status, message: errMsg || status };
            if (errObj.message && $.type(errObj.message) === "string" && errObj.message.length > 0) {
                var flag = false;
                //检验是否已经存在错误消息
                $('.messager-body').each(function(i, msgBox){
                    if($(msgBox).data('isSystemMessage') === true){
                        flag = true;
                    }
                });
                if(flag){
                    //只保留业务异常，系统错误直接忽略
                    if(errObj.code !== 500){
                        _messageQueue.push(errObj);
                    }
                }
                else{
                    alertMessage(errObj);
                }
            }

            if (oldError) {
                oldError(xhr, status, errObj);
            }

            var _confirmShown = false;
            function alertMessage(errObj){
                if ($.messager) {
                    $.messager.alert($.messager.defaults.error, errObj.message, "error", function () {
                        if (oldError) {
                            oldError(xhr, status, errObj);
                        }

                        if(_messageQueue.length > 0){
                            if(_confirmShown){
                                alertMessage(_messageQueue.shift());
                            }
                            else{
                                $.messager.confirm($.messager.defaults.confirm, $.messager.defaults.errorMessageConfirm, function (r) {
                                    if (r) {
                                        _messageQueue = [];
                                        _confirmShown = false;
                                    }
                                    else{
                                        alertMessage(_messageQueue.shift());
                                        _confirmShown = true;
                                    }
                                });
                            }
                        }
                    }).data('isSystemMessage', true);
                    return;
                } else {
                    alert(errObj.message);
                }
            }
        };

        // 如果未指定 type 属性，强制 ajax 请求的 dataType 为 post， jquery 默认值为 get
        if (!options.type) {
            options.type = "post";
        }
        // 必须明确指定 async 属性为 true 时，才启用异步请求，jquery 该属性默认值为 true (异步模式)
        options.async = options.async === true;

        // 必须明确指定 async 属性为 true 时，才启用缓存，jquery 该属性默认值为 true
        options.cache = options.cache === true;

        if (options.showProgressbar) {
            $.messager.progress({ title: options.progressTitle || $.messager.defaults.progressTitle, msg: options.progressMsg, text: options.progressText || $.messager.defaults.progressText });
        };

        ajax(options.url || url, options);
    }

    $.extend({
        // 获取当前窗口所属的帧元素
        getParentTabContainer: function () {
            if (window.top == window.self) {
                return null;
            }

            var childWindow = window.self;
            while (window.top != childWindow) {
                if ($.type(childWindow.parent.openTab) === "function") {
                    break;
                } else {
                    childWindow = childWindow.parent;
                }
            }

            var currentFrame = null;

            var iframes = childWindow.parent.document.getElementsByTagName('iframe');

            if (iframes.length) {
                for (var i = 0; i < iframes.length; i++) {
                    var contentWindow = iframes[i].contentWindow;
                    if (!contentWindow) {
                        try {
                            var contentDocument = iframes[i].contentDocument;

                            if (contentDocument == childWindow.document) {
                                currentFrame = iframes[i];
                                break;
                            }
                        } catch (e) { }
                    } else {
                        if (contentWindow == childWindow) {
                            currentFrame = iframes[i];
                            break;
                        }
                    }
                }
            }

            if ($.type(childWindow.parent.openTab) === "function") {
                return { window: childWindow.parent, frame: currentFrame };
            } else {
                return null;
            }
        },
        ////////////////////////////////////////////////////////////////////////////////////////////////
        /// 在选项卡区域中或直接打开新窗口，如果当前页面在选项卡容器中，则打开选项卡，否则，直接调用 window.open 方法打开新窗口。
        //  参数说明：
        //      id      :   id
        //      options :   url
        //                  title 标题，该参数的值显示为选项卡的标题，未提供则显示 url，如果是在非选项卡容器中，则忽略该参数
        //                  features 如果是在选项卡容器中，则忽略该参数，否则，与标准的 window.open 方法的 features 参数意义相同
        //                  replace 如果是在选项卡容器中，则忽略该参数，否则，与标准的 window.open 方法的 replace 参数意义相同
        open: function (id, options) {
            // 兼容 sony 使用的接口，其第一个参数是 url
            //function (url, options) {
            if (options && !options.url) {
                options.url = id;
                id = options.id;
            }
            // end 兼容 sony

            var tabContainer = $.getParentTabContainer();
            if (tabContainer == null) {
                window.open(options.url, id, options.features, $.type(options.replace) == "undefined" ? true : options.replace);
            } else {
                tabContainer.window.openTab(tabContainer.frame, id, options);
            }
        },
        openMenu: function (id, rootId, options) {
            var tabContainer = $.getParentTabContainer();
            if (tabContainer == null) {
                window.open(options.url, id, options.features, $.type(options.replace) == "undefined" ? true : options.replace);
            } else {
                tabContainer.window.openMenuInTab(tabContainer.frame, id, rootId, options);
            }
        },
        ////////////////////////////////////////////////////////////////////////////////////////////////
        /// 关闭窗口，如果当前页面在选项卡容器中，则关闭选项卡，否则，直接调用 window.close 方法关闭当前窗口。
        close: function () {
            var tabContainer = $.getParentTabContainer();
            if (tabContainer == null) {
                window.top.opener = null;
                window.top.open("", "_self");
                window.top.close();
            } else {
                tabContainer.window.closeTab(tabContainer.frame);
            }
        },
        ////////////////////////////////////////////////////////////////////////////////////////////////
        /// 刷新打开当前窗口的父窗口，如果当前页面在选项卡容器中，则刷新打开该选项卡的选项卡，否则，刷新父窗口。
        /// 如果父窗口中定义了 doRefresh 方法，则在刷新时仅调用该方法，否则重新加载整个窗口。
        // selectTab 如果当前页面在选项卡容器中，指定是否选中父窗口所在的选项卡，否则，忽略此参数
        refreshOpener: function (selectTab) {
            var tabContainer = $.getParentTabContainer();
            if (tabContainer == null) {
                if (window.top.opener) {
                    if ($.type(window.top.opener.doRefresh) === "function") {
                        window.top.opener.doRefresh();
                    } else {
                        window.top.opener.location.reload();
                    }
                }
            } else {
                tabContainer.window.refreshOpener(tabContainer.frame, selectTab);
            }
        },
        ////////////////////////////////////////////////////////////////////////////////////////////////
        /// 关闭指定 id 的选项卡
        closeTab: function (id) {
            var tabContainer = $.getParentTabContainer();
            if (tabContainer) {
                // 否则如果未传递 id 参数，则认为其想关闭自身
                if (!id) {
                    tabContainer.window.closeTab(tabContainer.frame);
                } else {
                    tabContainer.window.closeTab(id);
                }
            }
        },
        ////////////////////////////////////////////////////////////////////////////////////////////////
        /// 刷新指定 id 的选项卡
        // selectTab 指定是否选中父窗口所在的选项卡
        refreshTab: function (id, selectTab) {
            var tabContainer = $.getParentTabContainer();
            if (tabContainer) {
                // 否则如果未传递 id 参数，则认为其想刷新自身
                if (!id) {
                    tabContainer.window.refreshTab(tabContainer.frame);
                } else {
                    tabContainer.window.refreshTab(id);
                }
            }
        },
        //获取当前dialog所属的帧元素
        getDialogContainer: function() {
            if (window.top == window.self) {
                //没有通过iframe引入dialog
                return null;
            }

            var currentFrame = null;
            var childWindow = window;
            var iframes = childWindow.parent.document.getElementsByTagName('iframe');
            if (iframes.length) {
                for (var i = 0; i < iframes.length; i++) {
                    var contentWindow = iframes[i].contentWindow;
                    if (!contentWindow) {
                        try {
                            var contentDocument = iframes[i].contentDocument;

                            if (contentDocument == childWindow.document) {
                                currentFrame = iframes[i];
                                break;
                            }
                        } catch (e) { }
                    } else {
                        if (contentWindow == childWindow) {
                            currentFrame = iframes[i];
                            break;
                        }
                    }
                }
            }
            if (currentFrame) {
                return { window: childWindow.parent, frame: currentFrame };
            } else {
                return null;
            }
        },
        ////////////////////////////////////////////////////////////////////////////////////////////////
        /// 关闭当前对话框
        // selectTab 指定是否选中父窗口所在的选项卡
        closeCurrentDialog: function(){
            var tabContainer = $.getDialogContainer();
            if (tabContainer && tabContainer.frame) {
                var iframe = tabContainer.frame;
                var target = tabContainer.window.$(iframe).parent();

                var state = target.data();
                if(state && state.dialog && state.dialog.close){
                    var options = target.dialog('options');
                    if(options.success){
                        options.success.call(target, options);
                    }
                    state.dialog.close();
                }
            }

        },
        stopPropagation: function () {
            new $.Event(event).stopPropagation();
        },
        preventDefault: function () {
            new $.Event(event).preventDefault();
        }
    });

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            var name = this['name'];

            var nameArray = name.split(".");
            if (nameArray.length == 1) {
                if (o[name]) {
                    o[name] = o[name] + "," + this['value'];
                } else {
                    o[name] = this['value'];
                }
            } else {
                name = nameArray[0];
                if (!o[name]) {
                    o[name] = {};
                }
                if (o[name][nameArray[1]]) {
                    o[name][nameArray[1]] = o[name][nameArray[1]] + "," + this['value'];
                } else {
                    o[name][nameArray[1]] = this['value'];
                }
            }
        });
        return o;
    };

    $.fn.serializeQueryObject = function () {
        var o = {};

        var manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
			rCRLF = /\r?\n/g,
			rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
			rsubmittable = /^(?:input|select|textarea|keygen)/i;

        var a = this.map(function () {
            // Can add propHook for "elements" to filter or add form elements
            var elements = jQuery.prop(this, "elements");
            return elements ? jQuery.makeArray(elements) : this;
        }).filter(function () {
            var type = this.type;
            // Use .is(":disabled") so that fieldset[disabled] works
            return this.name && !jQuery(this).is(":disabled") &&
				rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) &&
				(this.checked || !manipulation_rcheckableType.test(type));
        }).map(function (i, elem) {
            var val = jQuery(this).val();

            if (val == null || val.length == 0) return null;

            var me = jQuery(this);
            // easyui combobox 需要特殊处理才能取到我们定义的扩展特性
            if (me.hasClass("textbox-value")) {
                me = $("[comboname$='" + $(this)[0].name + "']");
            }

            var target = (me.attr('target') ? me.attr('target') : elem.name);

            if (target.toLowerCase() == 'ignore') {
                if (o[elem.name]) {
                    o[elem.name] = o[elem.name] + "," + (jQuery.isArray(val) ? val.join(',') : val);
                } else {
                    o[elem.name] = jQuery.isArray(val) ? val.join(',') : val;
                }
                return null;
            }

            if (jQuery.isArray(val)) {
                return target + "^in^" + val.replace(/(\^)/g, '^^').replace(/(\|)/g, '||').join(',');
            }
            else {
                var predicate = (me.attr('predicate') ? me.attr('predicate') : '=');
                switch (predicate.toLowerCase()) {
                    case "like":
                    case "not like":
                        return target + "^" + predicate + "^%" + val.replace(/(\^)/g, '^^').replace(/(\|)/g, '||').replace(rCRLF, "\r\n") + "%";
                    case "exists":
                    case "not exists":
                        return target + "^" + predicate + "^" + val.replace(/(\^)/g, '^^').replace(/(\|)/g, '||').replace(rCRLF, "\r\n")
						    + "^" + me.attr('subTable') + "^" + me.attr('subWhere');
                    default:
                        return target + "^" + predicate + "^" + val.replace(/(\^)/g, '^^').replace(/(\|)/g, '||').replace(rCRLF, "\r\n");
                }
            }
        }).get();

        o.predicates = a.join('|')

        return o;

    };

    $.fn.serializeComplexQueryObject = function () {
        var o = {};

        var manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
			rCRLF = /\r?\n/g,
			rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
			rsubmittable = /^(?:input|select|textarea|keygen)/i;

        var a = this.map(function () {
            // Can add propHook for "elements" to filter or add form elements
            var elements = jQuery.prop(this, "elements");
            return elements ? jQuery.makeArray(elements) : this;
        }).filter(function () {
            var type = this.type;
            // Use .is(":disabled") so that fieldset[disabled] works
            return this.name && !jQuery(this).is(":disabled") &&
				rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) &&
				(this.checked || !manipulation_rcheckableType.test(type));
        }).map(function (i, elem) {
            var val = jQuery(this).val();

            if (val == null || val.length == 0) return null;

            var me = jQuery(this);
            // easyui combobox 需要特殊处理才能取到我们定义的扩展特性
            if (me.hasClass("textbox-value")) {
                me = $("[comboname$='" + $(this)[0].name + "']");
            }

            var target = (me.attr('target') ? me.attr('target') : elem.name);

            if (target.toLowerCase() == 'ignore') {
                if (o[elem.name]) {
                    o[elem.name] = o[elem.name] + "," + (jQuery.isArray(val) ? val.join(',') : val);
                } else {
                    o[elem.name] = jQuery.isArray(val) ? val.join(',') : val;
                }
                return null;
            }

            if (jQuery.isArray(val)) {
                //return target + "^in^" + val.replace(/(\^)/g, '^^').replace(/(\|)/g, '||').join(',');
            }
            else {
                var predicate = (me.attr('predicate') ? me.attr('predicate') : '=');
                var valueType = me.attr("value-type") ? me.attr("value-type") : "number";

                switch(valueType.toLowerCase()){
                    case "string":
                        if(!/^'[\s|\S]*'$/.test(val)){
                            if(["like", "not like"].indexOf(predicate.toLowerCase()) === -1){
                                val = "'" + val.replace(/(\')/g, '\'\'') + "'";
                            }
                            else{
                                val = "'%" + val.replace(/(\')/g, '\'\'') + "%'";
                            }
                        }
                        break;
                    case "number":
                    default:
                        break;
                }
                switch (predicate.toLowerCase()) {
                    case "like":
                    case "not like":
                        return target + " " + predicate + " " + val.replace(rCRLF, "\r\n");
                    case "exists":
                    case "not exists":
                        return target + " " + predicate + " " + val.replace(rCRLF, "\r\n")
						    + " " + me.attr('subTable') + " " + me.attr('subWhere');
                    case "in":
                    case "not in":
                        return target + " " + predicate + " (" + val.replace(rCRLF, "\r\n") + ")";
                    default:
                        return target + " " + predicate + " " + val.replace(rCRLF, "\r\n");
                }
            }
        }).get();

        o.predicates = a.join(' AND ')

        return o;

    };

    $.fn.disable = function () {
        this.each(function () {
            var pattern = /easyui-(\w+)/i;
            var $me = $(this);
            [':text', 'select', 'textarea'].forEach(function (text, i) {
                $me.find(text).each(function () {
                    var $elem = $(this);
                    var classAttr = $elem.attr('class');
                    var match = pattern.exec(classAttr);
                    if (match != null) {
                        $elem[match[1]]('disable');
                    }
                    //easyui自动添加的隐藏域，不进行disable
                    else if ($elem.attr('name') && !$elem.attr('hidden')) {
                        $elem.attr('disabled', 'disabled');
                    }
                });
            });

            $(this).find(":radio").attr("disabled", 'disabled');
            $(this).find(":checkbox").attr("disabled", 'disabled');


            $(this).find(":button").attr("disabled", 'disabled');

            //            $(this).find(":text").attr("disabled", true);
            //			$(this).find(":radio").attr("disabled", true);
            //			$(this).find(":checkbox").attr("disabled", true);
            //			$(this).find("select").attr("disabled", true);
            //			$(this).find("textarea").attr("disabled", true);

            //			$(this).find(":button").attr("disabled", true);

            //			$(this)[0].disabled = true;
        });

        //        //禁用jquery easyui中的下拉选（使用input生成的combox）
        //        $("#" + formId + " input[class='combobox-f combo-f']").each(function () {
        //            if (this.id) {
        //                alert("input" + this.id);
        //                $("#" + this.id).combobox(attr);
        //            }
        //        });

        //        //禁用jquery easyui中的下拉选（使用select生成的combox）
        //        $("#" + formId + " select[class='combobox-f combo-f']").each(function () {
        //            if (this.id) {
        //                alert(this.id);
        //                $("#" + this.id).combobox(attr);
        //            }
        //        });

        //        //禁用jquery easyui中的日期组件dataBox
        //        $("#" + formId + " input[class='datebox-f combo-f']").each(function () {
        //            if (this.id) {
        //                alert(this.id)
        //                $("#" + this.id).datebox(attr);
        //            }
        //        });
    };
    $.fn.enable = function () {
        this.each(function () {

            var pattern = /easyui-(\w+)/i;
            var $me = $(this);
            [':text', 'select', 'textarea'].forEach(function (text, i) {
                $me.find(text).each(function () {
                    var $elem = $(this);
                    var classAttr = $elem.attr('class');
                    var match = pattern.exec(classAttr);
                    if (match != null) {
                        $elem[match[1]]('enable');
                    }
                    else if ($elem.attr('name') && !$elem.attr('hidden')) {
                        $elem.removeAttr('disabled');
                    }
                });
            });

            $(this).find(":radio").removeAttr('disabled');
            $(this).find(":checkbox").removeAttr('disabled');


            $(this).find(":button").removeAttr('disabled');

            //			$(this).find(":text").attr("disabled", false);
            //			$(this).find(":radio").attr("disabled", false);
            //			$(this).find(":checkbox").attr("disabled", false);
            //			$(this).find("select").attr("disabled", false);
            //			$(this).find("textarea").attr("disabled", false);

            //			$(this).find(":button").attr("disabled", false);

            //			$(this)[0].disabled = false;
        });
    };
    $.fn.readonly = function (param) {
        this.each(function () {
            var pattern = /easyui-(\w+)/i;
            var $me = $(this);
            if (param) {
                [':text', 'select', 'textarea'].forEach(function (text, i) {
                    $me.find(text).each(function () {
                        var $elem = $(this);
                        var classAttr = $elem.attr('class');
                        var match = pattern.exec(classAttr);
                        if (match != null) {
                            $elem[match[1]]('readonly', true);
                        }
                        //不改变easyui自动添加的readonly
                        else if ($elem.attr('name') && !$elem.attr('hidden')) {
                            if(classAttr && classAttr.indexOf('readonly') !== -1) return;
                            $elem.attr('readonly', 'readonly');
                        }
                    });
                });

                $(this).find(":radio").attr('readonly', 'readonly');
                $(this).find(":checkbox").attr('readonly', 'readonly');


                $(this).find(":button").attr('readonly', 'readonly');
            }
            else {
                [':text', 'select', 'textarea'].forEach(function (text, i) {
                    $me.find(text).each(function () {
                        var $elem = $(this);
                        var classAttr = $elem.attr('class');
                        var match = pattern.exec(classAttr);
                        if (match != null) {
                            $elem[match[1]]('readonly', false);
                        }
                        else if ($elem.attr('name') && !$elem.attr('hidden')) {
                            if(classAttr && classAttr.indexOf('readonly') !== -1) return;
                            $elem.removeAttr('readonly');
                        }
                    });
                });

                $(this).find(":radio").removeAttr('readonly');
                $(this).find(":checkbox").removeAttr('readonly');


                $(this).find(":button").removeAttr('readonly');
            }
        });
    };

    // 使指定对象相对父容器垂直水平居中
    $.fn.vhcenter = function () {
        return this.each(function () {
            $(this).css({ position: 'relative', display: 'inline-block', left: ($(this).parent().width() - $(this).outerWidth()) / 2, top: ($(this).parent().height() - $(this).outerHeight()) / 2 });
        });
    };
    // 使指定对象相对父容器水平居中
    $.fn.hcenter = function () {
        return this.each(function () {
            $(this).css({ position: 'relative', display: 'inline-block', left: ($(this).parent().width() - $(this).outerWidth()) / 2 });
        });
    };
    // 使指定对象相对父容器垂直居中
    $.fn.vcenter = function () {
        return this.each(function () {
            $(this).css({ position: 'relative', display: 'inline-block', top: ($(this).parent().height() - $(this).outerHeight()) / 2 });
        });
    };
})(jQuery);

/**
* 模态对话框、对话框扩展
*     实现窗口定位、参数传递通用功能。
* 示例：
在主页面中：
$.showModalDialog("@("~/home/aboutus".MapUrl())", {
data        :   {"a":1111, "b":"bbbbb"},
onLoad      :   function(target, options, win){
if(win){
win.doInit(target, options);
}
},
buttons     :   [{
text: 'OK',
iconCls: 'icon-ok',
handler: function(target, options, win){
if(win){
win.doOK(target, options);
}
if(options.returnValue){
target.close();
}
}
},{
text: 'Cancel',
iconCls: 'icon-cancel',
handler: function(target, options, win){
if(win){
win.doCancel(target, options);
}
target.close();
}
}
]});
}
在对话框中：
<script type="text/javascript">
function doInit(target, options) {
alert(options.data['a']);
}

function doOK(target, options) {
options.returnValue = 'aaaaaaaaaaaaaaa';
}

function doCancel(target, options) {
}
</script>

* 参数说明：
* @param url        如果设置，则在窗口中使用 iframe 打开 url 同时忽略 options.content 参数；如果不设置，则尝试在窗口中加载 options.content 定义的内容，
* @param options    选项
*                       data:       传入窗口的数据
*                       onload:     当窗体加载完成时发生
*                       buttons:    定义对话框中出现的按钮
*                       toobar:     定义对话框中出现的工具条
*                       content:    窗口中要现实的内容，如果设置了 url 参数，则忽略此属性。
*                       iconCls:    窗口图标样式，默认值 icon-window
*                       container:  窗口相对容器，用于定位窗口容器位置和大小，值可为 top、current、parent、offsetParent 或者 #id 形式的 html 元素之一, 默认值 top。
*                       width:      窗口宽度，默认值 "auto"
*                       height:     窗口高度，默认值 "auto",
*
* @return 返回当前窗体的引用
*/
(function ($) {
    $.extend({
        showModalDialog: function (url, options) {
            options = options || {};
            var opts = $.extend({}, {
                modal: true,
                minimizable: false,
                maximizable: true,
                resizable: true,
                collapsible: false
            }, options);

            return $.showWindow(url, opts);
        },
        showWindow: function (url, options) {
            var options = $.extend({}, {
                data: undefined,
                onload: function (target, options, win) { },
                buttons: undefined,
                toobar: undefined,
                content: undefined,
                iconCls: undefined,
                container: 'top',
                width: 'auto',
                height: 'auto',
                minimizable: true,
                maximizable: true,
                collapsible: true,
                resizable: true,
                onClose: function () { target.close(); }
            }, options || {});

            var iframe = null;
            var target = null;

            if (url && $.type(url) === "string") {
                iframe = $('<iframe>').attr('height', '100%').attr('width', '100%').attr('marginheight', 0).attr('marginwidth', 0).attr('frameborder', 0);

                setTimeout(function () {
                    iframe.bind('load', function () {
                        if (iframe[0].contentWindow) {
                            if (options.onLoad) {
                                options.onLoad.call(this, target, options, iframe[0].contentWindow);
                            }
                        }
                    });
                    iframe.attr('src', url);
                }, 10);
            }

            var container = getContainer(window, options);

            // 百分比宽度特殊处理
            if (isPercent(options.height)) {
                options.height = $(container).height() * parsePercent(options.height);
            }
            if (isPercent(options.width)) {
                options.width = $(container).width() * parsePercent(options.width);
            }

            // 窗口款高度自适应时强制为原始窗口的宽高比,并且以宽高较小的为准,系数为 0.9
            if ((!options.height || options.height == 'auto') && (!options.width || options.width == 'auto')) {
                var containerHeight = $(container).height();
                var containerWidth = $(container).width();
                if (containerHeight > containerWidth) {
                    options.width = Math.min(containerWidth * 0.9, 800);
                    options.height = Math.min(options.width * (containerHeight / containerWidth), 600);
                } else {
                    options.height = Math.min(containerHeight * 0.9, 600);
                    options.width = Math.min(options.height * (containerWidth / containerHeight), 800);
                }
            } else if (!options.height || options.height == 'auto') {
                options.height = options.width * (containerHeight / containerWidth);
            } else if (!options.width || options.width == 'auto') {
                options.width = options.height * (containerWidth / containerHeight);
            }

            var warpHandler = function (handler) {
                if (typeof handler == 'function') {
                    return function () {
                        handler(target, options, iframe ? iframe[0].contentWindow : null);
                    };
                }
                if (typeof handler == 'string' && iframe) {
                    return function () {
                        iframe[0].contentWindow[handler](target, options, iframe ? iframe[0].contentWindow : null);
                    }
                }
                if (typeof handler == 'string') {
                    return function () {
                        eval(container[handler])(target, options, iframe ? iframe[0].contentWindow : null);
                    }
                }
            }

            //包装toolbar中各对象的handler
            if (options.toolbar && $.isArray(options.toolbar)) {
                $.each(options.toolbar, function (i, button) {
                    button.handler = warpHandler(button.handler);
                });
            }
            //包装buttons中各对象的handler
            if (options.buttons && $.isArray(options.buttons)) {
                $.each(options.buttons, function (i, button) {
                    button.handler = warpHandler(button.handler);
                });
            }

            if (iframe) {
                if (container.$) {
                    target = container.$('<div>').css({ 'overflow': 'hidden' }).append(iframe).dialog(options);
                } else {
                    target = $('<div>').appendTo(container).css({ 'overflow': 'hidden' }).append(iframe).dialog(options);
                }
            } else {
                if (container.$) {
                    target = container.$('<div>').css({ 'overflow': 'hidden' }).append(options.content).dialog(options);
                } else {
                    target = $('<div>').appendTo(container).css({ 'overflow': 'hidden' }).append(options.content).dialog(options);
                }
            }

            target.close = function () {
                // 销毁对话框前先清理 ifrmae 内的内容，解决内存泄漏问题
                if (iframe) {
                    iframe[0].src = 'about:blank';
                    iframe[0].contentWindow.document.write('');
                    iframe[0].contentWindow.document.clear();
                }
                // 销毁对话框前先清空其内部的元素，解决 IE8 下对话框销毁后主窗口不能获得焦点的问题
                target.empty();
                // 销毁对话框
                target.dialog('destroy');
            }
            var state = target.data();
            if(state && state.dialog){
                state.dialog.close = target.close;
            }

            target.container = container;

            return target;
        },
        /* 参数说明：
        * @param url        如果设置，则在窗口中使用 iframe 打开 url 同时忽略 options.content 参数；如果不设置，则尝试在窗口中加载 options.content 定义的内容，
        * @param options    选项
        *                       data:       传入窗口的数据
        *                       buttons:    定义对话框中出现的按钮
        *                       toobar:     定义对话框中出现的工具条
        *                       //content:  窗口中要现实的内容，如果设置了 url 参数，则忽略此属性。 // 目前，直接加载窗口内容的方式交互性太差，比如内容出现的父级容器不好控制，不好通过脚本对其进行控制，禁止使用
        *                       iconCls:    窗口图标样式，默认值 icon-window
        *                       container:  窗口相对容器，用于定位窗口容器位置和大小，值可为 top、current、parent、offsetParent 或者 #id 形式的 html 元素之一, 默认值 top。
        *                       width:      窗口宽度，默认值 "auto"
        *                       height:     窗口高度，默认值 "auto",
        * 回调函数：
        *                       doCancel(dialog, opts, callback)    如果指定了 Url 则此函数应定义在 url 对应的页面中，否则应定义为 options 的属性。
        *                       doOK(dialog, opts, callback)        如果指定了 Url 则此函数应定义在 url 对应的页面中，否则应定义为 options 的属性。
        * 事件
        *                       onload:     当窗体加载完成时发生
        *                       success:  当窗体目标操作成功执行完成时发生
        *
        * @return 返回当前窗体的引用
        * 示例：
        $.showPopupForm('@Url.Action("Edit", "Employee")?id=' + row.id, {
        title: title + " > " + row.displayName,
        data: row,
        buttons : [ $.buttons.ok,
        $.extend({
        handler: function (dialog, opts, win) {
        if( win.doDelete) {
        win.doDelete(dialog, opts, function(){
        dialog.close();
        });
        } else {
        dialog.close();
        }

        // do other something
        }
        },$.buttons.remove),
        $.buttons.cancel
        ],
        success: function (options) {
        doRefresh();
        }
        });
        */
        showPopupForm: function (url, options) {
            var okHandler = function (dialog, opts, win) {
                if (win) {
                    if (win.doOK) {
                        win.doOK(dialog, opts, function () {
                            if (options.success) {
                                options.success.call(dialog, opts);
                            }

                            dialog.close();
                        });
                    }
                } else {
                    if (opts.doOK) {
                        opts.doOK(dialog, opts, function () {
                            if (options.success) {
                                options.success.call(dialog, opts);
                            }

                            dialog.close();
                        });
                    }
                }
            };
            var cancelHandler = function (dialog, opts, win) {
                if (win) {
                    if (win.doCancel) {
                        win.doCancel(dialog, opts, function () {
                            dialog.close();
                        });
                    } else {
                        dialog.close();
                    }
                } else {
                    if (opts.doCancel) {
                        opts.doCancel(dialog, opts, function () {
                            dialog.close();
                        });
                    } else {
                        dialog.close();
                    }
                }
            };

            if (options.buttons && $.isArray(options.buttons)) {
                for (var i = 0; i < options.buttons.length; i++) {
                    if (!options.buttons[i].handler && options.buttons[i] == $.buttons.ok) {
                        options.buttons[i] = $.extend({
                            handler: okHandler
                        }, options.buttons[i]);
                    } else if (!options.buttons[i].handler && options.buttons[i] == $.buttons.cancel) {
                        options.buttons[i] = $.extend({
                            handler: cancelHandler
                        }, options.buttons[i]);
                    }
                }
            }

            $.showModalDialog(url, $.extend({}, options || {}, {
                onLoad: function (dialog, opts, win) {
                    if (win) {
                        if (win.doInit) {
                            win.doInit(dialog, opts);
                        }
                    } else {
                        if (opts.doInit) {
                            opts.doInit(dialog, opts);
                        }
                    }
                },
                width: options.width,
                height: options.height,
                buttons: options.buttons ? options.buttons : [
                        $.extend({
                            handler: okHandler
                        }, $.buttons.ok), $.extend({
                            handler: cancelHandler
                        }, $.buttons.cancel)
                    ]
            })
            );
        }
    })

    // 获取要在其中打开窗口的目标容器窗口或对象
    //  from：从其中发出命令的窗口或对象
    function getContainer(from, options) {
        if (from) {
            if (!from.top || !from.top.document) {
                return from;
            }
            var fromIsWindow = from.top && from.top.document ? true : false;

            switch (options.container) {
                case "current":
                    return from;
                case "offsetParent":
                    return fromIsWindow ? from.parent : from.offsetParent;
                case "parent":
                    return fromIsWindow ? from.parent : window;
                default:
                    // 如果为 #id 形式，意味着我们想以特定的 html 元素打开窗口
                    if (/^#/.test(options.container)) {
                        return $(options.container);
                    }
                    return fromIsWindow ? from.top : window.top;
            }
        }
        return window.top;
    }
})(jQuery);


//$.fn.extend({
//    containerWidth: function () {
//        if (!this.length) {
//            return "auto";
//        }

//        var contentWidth = 0;
//        try { contentWidth = parseInt(this[0].style.width); } catch (e) { };
//        if (contentWidth) {
//            var marginLeft = 0, marginRight = 0, paddingLeft = 0, paddingRight = 0, borderLeft = 0, borderRight = 0;
//            try { marginLeft = parseInt(this.style.marginLeft); } catch (e) { };
//            try { marginRight = parseInt(this.style.marginRight); } catch (e) { };
//            try { paddingLeft = parseInt(this.style.paddingLeft); } catch (e) { };
//            try { paddingRight = parseInt(this.style.paddingRight); } catch (e) { };
//            try { borderLeft = parseInt(this.style.borderLeft); } catch (e) { };
//            try { borderRight = parseInt(this.style.borderRight); } catch (e) { };

//            return contentWidth + marginLeft + marginRight + paddingLeft + paddingRight + borderLeft + borderRight;
//        }
//        else {
//            return this.outerWidth();
//        }
//    },
//    containerHeight: function () {
//        if (!this.length) {
//            return "auto";
//        }

//        var contentHeight = 0;
//        try { contentHeight = parseInt(this[0].style.height); } catch (e) { };
//        if (contentHeight) {
//            var marginTop = 0, marginBottom = 0, paddingTop = 0, paddingBottom = 0, borderTop = 0, borderBottom = 0;
//            try { marginTop = parseInt(this.style.marginTop); } catch (e) { };
//            try { marginBottom = parseInt(this.style.marginBottom); } catch (e) { };
//            try { paddingTop = parseInt(this.style.paddingTop); } catch (e) { };
//            try { paddingBottom = parseInt(this.style.paddingBottom); } catch (e) { };
//            try { borderTop = parseInt(this.style.borderTopWidth); } catch (e) { };
//            try { borderBottom = parseInt(this.style.borderBottomWidth); } catch (e) { };

//            return contentHeight + marginTop + marginBottom + paddingTop + paddingBottom + borderTop + borderBottom;
//        }
//        else {
//            return this.outerHeight();
//        }
//    }
//});

$.context.yesNoFormatter = function (value) {
    // null 和 undefined 返回空
    if (value === null) {
        return '';
    } else if ($.type(value) === 'string') {
        switch (value.toLowerCase()) {
            // 未明确指定时返回空
            case 'undefined':
            case 'null':
            case '':
                return '';
                // 明确指定为 0 和 false 时，返回 no
            case '0':
            case 'false':
                return $.constants.no;
                // 其它情况返沪 yes
            default:
                return $.constants.yes;
        }
    } else {
        // 0、false 时返回 no，其它情况返回 yes
        return (!value) ? $.constants.no : $.constants.yes;
    }
}

$.context.sexFormatter = function (value) {
    if (value && value > 0) {
        if (value == 1) {
            return $.constants.male;
        }
        else {
            return $.constants.female;
        }

        return value;
    }
    return null;
}

$.context.dateFormatter = function (value) {
    if (value) {
        if ($.type(value) === "string") {
            try {
                return new Date(Date.parse(value)).format($.context.user.dateFormat);
            }
            catch (e) {
                return value;
            }
        }
        else if ($.type(value) === "date") {
            return value.format($.context.user.dateFormat);
        }

        return value;
    }
    return null;
}

$.context.dateTimeFormatter = function (value) {
    if (value) {
        if ($.type(value) === "string") {
            try {
                return new Date(Date.parse(value)).format($.context.user.dateTimeFormat);
            }
            catch (e) {
                return value;
            }
        }
        else if ($.type(value) === "date") {
            return value.format($.context.user.dateTimeFormat);
        }

        return value;
    }
    return null;
}

$.buttons = {
    add: {
        iconCls: 'icon-add'
    },
    edit: {
        iconCls: 'icon-edit'
    },
    remove: {
        iconCls: 'icon-remove'
    },
    save: {
        iconCls: 'icon-save'
    },
    cut: {
        iconCls: 'icon-cut'
    },
    ok: {
        iconCls: 'icon-ok'
    },
    cancel: {
        iconCls: 'icon-cancel'
    },
    search: {
        iconCls: 'icon-search'
    },
    print: {
        iconCls: 'icon-print'
    },
    help: {
        iconCls: 'icon-help'
    },
    undo: {
        iconCls: 'icon-undo'
    },
    redo: {
        iconCls: 'icon-redo'
    },
    back: {
        iconCls: 'icon-back'
    },

    // 扩展
    refresh: {
        iconCls: 'icon-refresh'
    },
    reset: {
        iconCls: 'icon-reset'
    },
    submit: {
        iconCls: 'icon-submit'
    }
}

$.validating = {
    validate: function (value, options, container) {
        if (!($.type(value) === "string")) {
            return false;
        }

        if (container && container.$ && container != window) {
            return container.$.validating.validate(value, options);
        }

        if (options) {
            if (options.minSelect) {
                if (value.length <= 0 || value.split(',').length < options.minSelect) {
                    $.messager.alert($.messager.defaults.warn,
                        $.validating.messages['minSelect'].replace("{title}", options.title).replace("{minSelect}", options.minSelect).replace("{objectName}", options.objectName),
                        "warn"
                    );
                    return false;
                }
            }
            if (options.maxSelect) {
                if (value.split(',').length > options.maxSelect) {
                    $.messager.alert($.messager.defaults.warn,
                        $.validating.messages['maxSelect'].replace("{title}", options.title).replace("{maxSelect}", options.maxSelect).replace("{objectName}", options.objectName),
                        "warn"
                    );
                    return false;
                }
            }
            if (options.required && value.length <= 0) {
                $.messager.alert($.messager.defaults.warn, $.validating.messages['required'].replace("{title}", options.title), "warn");
                return false;
            }
            if (options.minLength > 0 && value.length < options.minLength) {
                $.messager.alert($.messager.defaults.warn, $.validating.messages['minLength'].replace("{title}", options.title).replace("{minLength}", options.minLength), "warn");
                return false;
            }
            if (options.maxLength > 0 && value.length > options.maxLength) {
                $.messager.alert($.messager.defaults.warn, $.validating.messages['maxLength'].replace("{title}", options.title).replace("{maxLength}", options.maxLength), "warn");
                return false;
            }
            if (options.minValue) {
                try {
                    if (parseFloat(value) < parseFloat(options.minValue)) {
                        $.messager.alert($.messager.defaults.warn, $.validating.messages['minValue'].replace("{title}", options.title).replace("{minValue}", options.minValue), "warn");
                        return false;
                    }
                } catch (e) {
                    $.messager.alert($.messager.defaults.warn, $.validating.messages['minValue'].replace("{title}", options.title).replace("{minValue}", options.minValue), "warn");
                    return false;
                }
            }
            if (options.maxValue) {
                try {
                    if (parseFloat(value) > parseFloat(options.maxValue)) {
                        $.messager.alert($.messager.defaults.warn, $.validating.messages['maxValue'].replace("{title}", options.title).replace("{maxValue}", options.minValue), "warn");
                        return false;
                    }
                } catch (e) {
                    $.messager.alert($.messager.defaults.warn, $.validating.messages['maxValue'].replace("{title}", options.title).replace("{maxValue}", options.minValue), "warn");
                    return false;
                }
            }
        }
        return true;
    }
}
