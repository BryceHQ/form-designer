/*
* navbars
*/
(function ($) {
    function setScrollers(container) {
        var options = $.data(container, 'navbars').options;

        var cc = $(container);
        var navbarsWrap = cc.children('div.navbars-wrap');
        var navbars = navbarsWrap.children('ul.navbars');
        var sLeft = cc.children('div.navbars-scroller-left');
        var sRight = cc.children('div.navbars-scroller-right');

        var navbarsWrapHeight = navbarsWrap.outerHeight();
        if (options.plain) {
            navbarsWrapHeight = navbarsWrap.height();
        }
        var tHeight = options.navbarHeight;

        var navbarsWidth = 0;
        $('li.navbar', navbars).each(function () {
            navbarsWidth += $(this).outerWidth(true);
        });
        var cWidth = cc.width();

        //宽度自适应 不需要指定宽度
        if (navbarsWidth > cWidth) {
            sLeft.add(sRight).show()._outerHeight(tHeight).css("top", (navbarsWrapHeight - tHeight) / 2 + 1);
            navbarsWrap.css({
                marginLeft: sLeft.outerWidth(),
                marginRight: sRight._outerWidth()//,
                //width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
            });
        } else {
            sLeft.add(sRight).hide();
            navbarsWrap.css({
                marginLeft: 0,
                marginRight: 0//,
                //width: cWidth
            });
            var selected = getSelectedNavbar(container);
            if (selected) {
                scrollNavbarIntoView(container, selected);
            }
        }
    }

    function wrapNavbars(container) {
        var cc = $(container);
        cc.addClass('navbars-container');

        var navbarsWrap = $('<div class="navbars-wrap"></div>').insertBefore(cc);

        var navbars = cc.children('ul');
        if (navbars.length) {
            navbars.appendTo(navbarsWrap);
            navbars.addClass('navbars');
        }
        else {
            navbars = $('<ul class="navbars"></ul>').appendTo(navbarsWrap);
        }

        cc.empty();

        cc[0].appendChild(navbarsWrap[0]);

        $('<div class="navbars-scroller-left"></div><div class="navbars-scroller-right"></div>').prependTo(container);

        var firstSelected = null;

        navbars.children('li').each(function (i) {
            var options = $.extend({}, $.parser.parseOptions(this, ['title', 'selected', 'disabled']));
            if (options.disabled == 'true' || options.disabled == 'disabled') {
                options.disabled = true;
            } else {
                options.disabled = false;
            }
            // 只有第一个可被置为选中状态
            if (firstSelected == null) {
                if (options.disabled) {
                    options.selected = false;
                } else {
                    if (options.selected == 'true' || options.selected == 'selected') {
                        options.selected = true;
                        firstSelected = this;
                    } else {
                        options.selected = false;
                    }
                }
            } else {
                options.selected = false;
            }
            var navbar = $(this);
            $.data(container, 'navbars').navbars.push(navbar);
            createNavbar(container, navbar, options);
        });

        cc.find('.navbars-scroller-left, .navbars-scroller-right').hover(
				function () { if (!$(this).hasClass('navbars-scroller-disabled')) { $(this).addClass('navbars-scroller-over'); } },
				function () { if ($(this).hasClass('navbars-scroller-over')) { $(this).removeClass('navbars-scroller-over'); } }
		);

        cc.bind('_resize', function (e, force) {
            var options = $.data(container, 'navbars').options;
            if (options.fit == true || force) {
                setSize(container);
            }
            return false;
        });
    }

    function setProperties(container) {
        var options = $.data(container, 'navbars').options;
        var cc = $(container);

        if (options.plain == true) {
            cc.addClass('navbars-plain');
        } else {
            cc.removeClass('navbars-plain');
        }
        if (options.border == true) {
            cc.removeClass('navbars-noborder');
        } else {
            cc.addClass('navbars-noborder');
        }
    }

    function setSize(container) {
        var state = $.data(container, 'navbars');
        var options = state.options;
        var cc = $(container);

        options.fit ? $.extend(options, cc._size("fit")) : cc._size("unfit");
        cc.width(options.width).height(options.height);

        for (var i = 0; i < state.navbars.length; i++) {
            var p_options = state.navbars[i].options;
            var p_t = state.navbars[i].find('a.navbar-inner');
            var width = parseInt(p_options.navbarWidth || options.navbarWidth) || undefined;
            if (width) {
                p_t._outerWidth(width);
            } else {
                p_t.css('width', '');
            }
            p_t._outerHeight(options.navbarHeight);
            p_t.css('lineHeight', p_t.height() + 'px');
        }

        setScrollers(container);
    }

    function bindEvents(container) {
        var options = $.data(container, 'navbars').options;
        $(container).unbind('.navbars').bind('click.navbars', function (e) {
            if ($(e.target).hasClass('navbars-scroller-left')) {
                $(container).navbars('scrollBy', -options.scrollIncrement);
            } else if ($(e.target).hasClass('navbars-scroller-right')) {
                $(container).navbars('scrollBy', options.scrollIncrement);
            } else {
                var li = $(e.target).closest('li');
                if (li.hasClass('navbar')) {
                    selectNavbar(container, getNavbarIndex(li));
                }
            }
        }).bind('contextmenu.navbars', function (e) {
            var li = $(e.target).closest('li');
            if (li.hasClass('navbar-disabled')) { return; }
            if (li.hasClass('navbar')) {
                options.onContextMenu.call(container, e, li.find('a.navbar-inner div span.navbar-title').text(), getNavbarIndex(li));
            }
        });

        var TO = false;
        var resized = true;
        $(window).unbind(".navbars").bind("resize.navbars", function () {
            if (!resized) {
                return;
            }
            if (TO !== false) {
                clearTimeout(TO);
            }
            TO = setTimeout(function () {
                resized = false;
                $(container).triggerHandler('_resize', [false]);
                resized = true;
                TO = false;
            }, 400);
        });

        function getNavbarIndex(li) {
            var index = 0;
            li.parent().children('li').each(function (i) {
                if (li[0] == this) {
                    index = i;
                    return false;
                }
            });
            return index;
        }
    }

    function createNavbar(container, navbar, options) {
        navbar.addClass('navbar');

        navbar.append('<a href="javascript:void(0)" class="navbar-inner"></a>');

        var barInner = navbar.find("a.navbar-inner");

        options = options || {};

        navbar.options = $.extend({}, options, {
            iconCls: (options.icon ? options.icon : undefined)
        });

        if (navbar.options.iconCls) {
            barInner.html('<div><span class="navbar-icon ' + navbar.options.iconCls + '\"/><br/><span class="navbar-title">' + navbar.options.title + '</span></div>');
        }
        else {
            barInner.html('<div><span class="navbar-title">' + navbar.options.title + '</span></div>');
        }

        if (navbar.options.disabled) {
            navbar.addClass('navbar-disabled');
        } else if (navbar.options.selected) {
            navbar.addClass('navbar-selected');
        }

        setSize(container);
    }

    function addNavbar(container, options) {
        var opts = $.data(container, 'navbars').options;
        var navbars = $.data(container, 'navbars').navbars;

        if (options.selected == undefined) options.selected = true;

        var navbar = $('<li></li>').appendTo($(container).children('div.navbars-wrap').children('ul.navbars'));

        navbars.push(navbar);

        createNavbar(container, navbar, options);

        $.data(container, 'navbars').options.onAdd.call(container, options.title, navbars.length - 1);

        setSize(container);

        if (!options.disabled && options.selected) {
            selectNavbar(container, navbars.length - 1);
        }
    }

    function getNavbar(container, which, removeit) {
        var navbars = $.data(container, 'navbars').navbars;
        if (typeof which == 'number') {
            if (which < 0 || which >= navbars.length) {
                return null;
            } else {
                var navbar = navbars[which];
                if (removeit) {
                    navbars.splice(which, 1);
                }
                return navbar;
            }
        }
        for (var i = 0; i < navbars.length; i++) {
            var navbar = navbars[i];
            if (navbar.options.title == which) {
                if (removeit) {
                    navbars.splice(i, 1);
                }
                return navbar;
            }
        }
        return null;
    }

    function getNavbarIndex(container, navbar) {
        var navbars = $.data(container, 'navbars').navbars;
        for (var i = 0; i < navbars.length; i++) {
            if (navbars[i][0] == $(navbar)[0]) {
                return i;
            }
        }
        return -1;
    }

    function getSelectedNavbar(container) {
        var navbars = $.data(container, 'navbars').navbars;
        for (var i = 0; i < navbars.length; i++) {
            var navbar = navbars[i];
            if (!navbar.options.disabled && navbar.options.selected == true) {
                return navbar;
            }
        }
        return null;
    }

    function selectNavbar(container, which) {
        var navbars = $.data(container, 'navbars').navbars;

        if (navbars.length == 0) return;

        var navbar = getNavbar(container, which);
        if (!navbar) return;

        if (navbar.options.disabled) {
            scrollNavbarIntoView(container, navbar);
            return;
        }

        var selected = getSelectedNavbar(container);
        if (navbar != selected) {
            var index = getNavbarIndex(container, navbar);

            if ($.data(container, 'navbars').options.onBeforeSelect.call(container, title, index) == false) {
                return;
            }

            if (selected) {
                selected.removeClass('navbar-selected');
                selected.options.selected = false;
            }

            var title = navbar.options.title;

            navbar.addClass('navbar-selected');
            navbar.options.selected = true;

            scrollNavbarIntoView(container, navbar);

            $.data(container, 'navbars').options.onSelect.call(container, title, index);
        }
        else {
            scrollNavbarIntoView(container, navbar);
        }


    }

    function scrollNavbarIntoView(container, navbar) {
        var navbarsWrap = $(container).find('div.navbars-wrap');
        var wrapWidth = navbarsWrap.width();

        var navbars = $.data(container, 'navbars').navbars;

        var navbarWidth = navbar.outerWidth() || 1;
        var left = navbar.position().left;
        var right = left + navbarWidth;

        if (navbars && navbars.length * navbarWidth > wrapWidth) {
            if (left < 0) {
                $(container).navbars('scrollBy', -navbar.width() - 4);
            }
            else if (right > wrapWidth) {
                $(container).navbars('scrollBy', navbarWidth + 4);
            }
        }
        else {
            $(container).navbars('scrollBy', 0);
        }
    }

    function clearSelected(container) {
        var selected = getSelectedNavbar(container);
        if (selected) {
            selected.removeClass('navbar-selected');
            selected.options.selected = false;
        }
    }

    function exists(container, which) {
        return getNavbar(container, which) != null;
    }

    $.fn.navbars = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.navbars.methods[options](this, param);
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'navbars');
            var opts;
            if (state) {
                opts = $.extend(state.options, options);
                state.options = opts;
            } else {
                $.data(this, 'navbars', {
                    options: $.extend({}, $.fn.navbars.defaults, $.fn.navbars.parseOptions(this), options),
                    navbars: []
                });
                wrapNavbars(this);
            }

            setProperties(this);
            setSize(this);
            bindEvents(this);
        });
    };

    $.fn.navbars.methods = {
        options: function (jq) {
            return $.data(jq[0], 'navbars').options;
        },
        navbars: function (jq) {
            return $.data(jq[0], 'navbars').navbars;
        },
        resize: function (jq) {
            return jq.each(function () {
                setSize(this);
            });
        },
        add: function (jq, options) {
            return jq.each(function () {
                addNavbar(this, options);
            });
        },
        getNavbar: function (jq, which) {
            return getNavbar(jq[0], which);
        },
        getNavbarIndex: function (jq, navbar) {
            return getNavbarIndex(jq[0], navbar);
        },
        getSelected: function (jq) {
            return getSelectedNavbar(jq[0]);
        },
        getSelectedIndex: function (jq) {
            var navbar = getSelectedNavbar(jq[0]);
            if (navbar) {
                return getNavbarIndex(jq[0], navbar);
            }
            return -1;
        },
        select: function (jq, which) {
            return jq.each(function () {
                selectNavbar(this, which);
            });
        },
        clearSelected: function (jq) {
            return jq.each(function () {
                clearSelected(this);
            });
        },
        exists: function (jq, which) {
            return exists(jq[0], which);
        },
        enableNavbar: function (jq, which) {
            return jq.each(function () {
                var navbar = $(this).navbars('getNavbar', which);
                if (navbar) {
                    navbar.removeClass('navbar-disabled');
                    navbar.options.disabled = false;
                }
            });
        },
        disableNavbar: function (jq, which) {
            return jq.each(function () {
                var navbar = $(this).navbars('getNavbar', which);
                if (navbar) {
                    navbar.addClass('navbar-disabled');
                    navbar.options.disabled = true;
                }
            });
        },
        scrollBy: function (jq, deltaX) {
            return jq.each(function () {
                var options = $.data(this, 'navbars').options;
                var navbarsWrap = $(this).find('div.navbars-wrap');
                var maxScrollWidth = getMaxScrollWidth();
                //var pos = Math.min(navbarsWrap._scrollLeft() + deltaX, maxScrollWidth);
                var pos = navbarsWrap._scrollLeft() + deltaX;
                if (deltaX < 0) {
                    pos = Math.max(0, pos);
                }
                else {
                    pos = Math.min(maxScrollWidth, pos);
                }
                navbarsWrap.animate({ scrollLeft: pos }, options.scrollDuration);

                var sLeft = $(this).children('div.navbars-scroller-left');
                var sRight = $(this).children('div.navbars-scroller-right');

                sLeft.removeClass('navbars-scroller-disabled');
                sRight.removeClass('navbars-scroller-disabled');

                if (pos == 0) {
                    sLeft.addClass('navbars-scroller-disabled');
                } else if (pos == maxScrollWidth) {
                    sRight.addClass('navbars-scroller-disabled');
                }

                function getMaxScrollWidth() {
                    var w = 0;
                    var navbars = navbarsWrap.children('ul.navbars');
                    navbars.children('li').each(function () {
                        w += $(this).outerWidth(true);
                    });
                    return w - navbarsWrap.width() + (navbars.outerWidth() - navbars.width());
                }
            });
        }
    };

    $.fn.navbars.parseOptions = function (target) {
        return $.extend({}, $.parser.parseOptions(target, [
			'width', 'height',
			{ fit: 'boolean', border: 'boolean', plain: 'boolean', navbarWidth: 'number', navbarHeight: 'number' }
		]));
    };

    $.fn.navbars.defaults = {
        width: 'auto',
        height: 'auto',
        navbarWidth: 'auto', // the navbar width
        navbarHeight: 100,
        plain: false,
        fit: false,
        border: true,
        scrollIncrement: 200,
        scrollDuration: 200,
        onBeforeSelect: function (title, index) { },
        onSelect: function (title, index) { },
        onDisable: function (title, index) { },
        onEnable: function (title, index) { },
        onAdd: function (title, index) { },
        onContextMenu: function (e, title, index) { }
    };

    if ($.parser && $.parser.plugins) {
        $.parser.plugins.push('navbars');
    }
    if ($.parser && $.parser.wituiPlugins) {
        $.parser.wituiPlugins.push('navbars');
    }
})(jQuery);

﻿/*
* popupSelector
*/

(function ($) {
    function init(target) {
        var state = $.data(target, 'popupSelector');
        var opts = state.options;

        $(target).hide();

        var span = $('<span class="popupSelector textbox"></span>').insertAfter(target);

        var txtText = $('<input readonly="readonly" type="text" class="popupSelector-text textbox-text-readonly">').appendTo(span);
        var txtValue = $('<input type="hidden" class="popupSelector-value">').appendTo(span);
        var btns = ['<span class="textbox-addon textbox-addon-right">'];
        if (opts.clearable) {
            btns.push('<a href="javascript:void(0)" class="textbox-icon combo-clear" style="width: 18px; height: 20px;"></a>');
        }
        btns.push('<a href="javascript:void(0)" class="textbox-icon popupSelector-button" style="width: 18px; height: 20px;"></a>');
        btns.push('</span>');
        $(btns.join('')).appendTo(span);

        var name = $(target).attr('name');
        if (name) {
            txtValue.attr('name', name);
            //txtText.attr('name', name + '_text');
            $(target).removeAttr('name').attr('popupSelectorName', name);
        }

        return span;
    };

    function setSize(target, width) {
        var opts = $.data(target, 'popupSelector').options;
        var popupSelector = $.data(target, 'popupSelector').popupSelector;
        if (width) {
            opts.width = width;
        }

        popupSelector.appendTo('body');

        if (isNaN(opts.width)) {
            opts.width = popupSelector.outerWidth();
        }

        popupSelector._outerWidth(opts.width + 4)._outerHeight(opts.height);

        var buttonContainer = popupSelector.find("span.textbox-addon");
        var txtText = popupSelector.find("input.popupSelector-text");

        var height = popupSelector.height();

        txtText._outerWidth(popupSelector._outerWidth() - buttonContainer._outerWidth());
        txtText.css({
            height: height + "px",
            lineHeight: height + "px"
        });
        buttonContainer._outerHeight(height);
        buttonContainer.find('a').each(function (i, btn) {
            $(btn).css({ height: height + "px" });
        });
        popupSelector.insertAfter(target);
    };

    function bindEvents(target) {
        var state = $.data(target, 'popupSelector');
        var opts = state.options;
        var popupSelector = state.popupSelector;
        var txtText = popupSelector.find('input.popupSelector-text');
        var popupBtn = popupSelector.find('.popupSelector-button');
        var clearBtn = popupSelector.find('.combo-clear');
        //        txtText.unbind('.popupSelector')
        //            .bind('blur.popupSelector', function (e) {
        //                opts.value = $(this).val();
        //                if (opts.value == '') {
        //                    $(this).val(opts.prompt);
        //                    $(this).addClass('popupSelector-prompt');
        //                } else {
        //                    $(this).removeClass('popupSelector-prompt');
        //                }
        //            })
        //            .bind('focus.popupSelector', function (e) {
        //                if ($(this).val() != opts.value) {
        //                    $(this).val(opts.value);
        //                }
        //                $(this).removeClass('popupSelector-prompt');
        //            })
        //            .bind('keydown.popupSelector', function (e) {
        //                if (e.keyCode == 13) {
        //                    e.preventDefault();
        //                    opts.value = $(this).val();
        //                    opts.searcher.call(target, opts.value, txtText._propAttr("name"));
        //                    return false;
        //                }
        //            });

        popupBtn.unbind('.popupSelector')
            .bind('click.popupSelector', function () {
                popupDialog(target);
            })
            .bind('mouseenter.popupSelector', function () {
                $(this).addClass('popupSelector-button-hover');
            })
            .bind('mouseleave.popupSelector', function () {
                $(this).removeClass('popupSelector-button-hover');
            }
        );
        clearBtn.unbind('.popupSelector')
            .bind('click.popupSelector', function () {
                $(target).popupSelector('setValue', '').popupSelector('setText', '');
            });
    };

    function unbindEvents(target) {
        var state = $.data(target, 'popupSelector');
        var popupBtn = state.popupSelector.find('.popupSelector-button');
        var clearBtn = popupSelector.find('.combo-clear');
        popupBtn.unbind('click.popupSelector').unbind('mouseenter.popupSelector')
            .unbind('mouseleave.popupSelector');
        popupBtn.unbind('.popupSelector');
    }

    function popupDialog(target) {
        var state = $.data(target, 'popupSelector');
        var opts = state.options;

        var txtText = state.popupSelector.find('input.popupSelector-text');
        var txtValue = state.popupSelector.find('input.popupSelector-value');

        $.fn.popupSelector.show(target, $.extend({
            text: txtText.val(),
            onSelect: function (newValue, newText) {
                $(this).popupSelector('setValue', newValue);
                $(this).popupSelector('setText', newText);
            }
        }, opts),
            txtValue.val()
        );
    }

    function setDisabled(target, disabled) {
        var state = $.data(target, 'popupSelector');
        var txtText = state.popupSelector.find('input.popupSelector-text');
        var txtValue = state.popupSelector.find('input.popupSelector-value');
        var options = state.options;
        if (disabled) {
            options.disabled = true;
            unbindEvents(target);
            txtText.attr('disabled', 'disabled');
            txtValue.attr('disabled', 'disabled');
        }
        else {
            options.disabled = false;
            bindEvents(target);
            txtText.removeAttr('disabled');
            txtValue.removeAttr('disabled');
        }
    }

    function setReadonly(target, readonly) {
        var state = $.data(target, 'popupSelector');
        var txtText = state.popupSelector.find('input.popupSelector-text');
        var txtValue = state.popupSelector.find('input.popupSelector-value');
        var options = state.options;
        if (readonly) {
            options.readonly = true;
            unbindEvents(target);
            txtValue.attr('readonly', 'readonly');
        }
        else {
            options.readonly = false;
            bindEvents(target);
            txtValue.removeAttr('readonly');
        }
    }

    function initValue(target) {
        var state = $.data(target, 'popupSelector');
        var opts = state.options;
        var txtText = state.popupSelector.find('input.popupSelector-text');
        var txtValue = state.popupSelector.find('input.popupSelector-value');
        if (opts.value == '') {
            txtValue.val('');
            txtText.val(opts.prompt.replace('{title}', opts.title));
            txtText.addClass('popupSelector-prompt');
        } else {
            txtValue.val(opts.value);
            txtText.val(opts.text);
            txtText.removeClass('popupSelector-prompt');
        }
    };

    $.fn.popupSelector = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.popupSelector.methods[options](this, param);
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'popupSelector');
            if (state) {
                $.extend(state.options, options);
            } else {
                state = $.data(this, 'popupSelector', {
                    options: $.extend({}, $.fn.popupSelector.defaults, $.fn.popupSelector.parseOptions(this), options)
                });
                state.popupSelector = init(this);
            }
            initValue(this);
            bindEvents(this);
            setSize(this);
        });
    };

    $.fn.popupSelector.methods = {
        options: function (jq) {
            return $.data(jq[0], 'popupSelector').options;
        },
        valuebox: function (jq) {
            return $.data(jq[0], 'popupSelector').popupSelector.find('input.popupSelector-value');
        },
        textbox: function (jq) {
            return $.data(jq[0], 'popupSelector').popupSelector.find('input.popupSelector-text');
        },
        getValue: function (jq) {
            return $.data(jq[0], 'popupSelector').options.value;
        },
        getText: function (jq) {
            return $.data(jq[0], 'popupSelector').options.text;
        },
        setValue: function (jq, value) {
            return jq.each(function () {
                $(this).popupSelector('options').value = value;
                $(this).popupSelector('valuebox').val(value);
            });
        },
        setText: function (jq, value) {
            return jq.each(function () {
                var opts = $(this).popupSelector('options');
                opts.text = value;
                if (value && value.length > 0) {
                    $(this).popupSelector('textbox').val(value);
                    $(this).popupSelector('textbox').removeClass('popupSelector-prompt');
                } else {
                    $(this).popupSelector('textbox').val(opts.prompt.replace('{title}', opts.title));
                    $(this).popupSelector('textbox').addClass('popupSelector-prompt');
                }
            });
        },
        destroy: function (jq) {
            return jq.each(function () {
                $.data(this, 'popupSelector').popupSelector.remove();
                $(this).remove();
            });
        },
        resize: function (jq, width) {
            return jq.each(function () {
                setSize(this, width);
            });
        },
        disable: function (jq) {
            return jq.each(function () {
                setDisabled(this, true);
            });
        },
        enable: function (jq) {
            return jq.each(function () {
                setDisabled(this, false);
            });
        },
        readonly: function (jq, param) {
            return jq.each(function () {
                return jq.each(function () {
                    setReadonly(this, param);
                });
            });
        }
    };

    $.fn.popupSelector.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.parser.parseOptions(target, ["width", "height", "text"]),
            {
                value: t.val(),
                onValidate: (t.attr("onValidate") ? eval(t.attr("onValidate")) : undefined),
                onchanged: (t.attr("onChanged") ? eval(t.attr("onChanged")) : undefined)
            }
        );
    };

    $.fn.popupSelector.show = function (target, opts, currentValue) {
        var objData = [];

        opts = $.extend({}, $.fn.popupSelector.defaults, opts);

        if (currentValue && currentValue.length > 0) {
            var values = currentValue.split(',');
            if (values) {
                var texts = (opts.text && opts.text.length > 0) ? opts.text.split(',') : null;
                for (var i = 0; i < values.length; i++) {
                    objData.push({ value: values[i], text: texts ? texts[i] : null });
                }
            }
        }

        opts.data = objData;

        if (opts.onShow) {
            opts.onShow.call(target, opts);
        }

        $.showModalDialog(opts.url + (opts.url.indexOf('?') > 0 ? '&' : '?') + 'multiSelect=' + (opts.multiSelect ? 'true' : 'false') + (opts.mode && opts.mode.length ? '&mode=' + opts.mode : '') + (opts.filter && opts.filter.length ? '&filter=' + opts.filter : ''),
            $.extend(opts.dialogOptions || {}, {
                title: ((opts.dialogOptions && opts.dialogOptions.title) ? opts.dialogOptions.title : opts.dialogTitle).replace('{title}', opts.title),
                onLoad: function (dialog, options, win) {
                    if (win) {
                        win.doInit(dialog, opts);
                    }
                },
                buttons: [
                        $.extend({
                            handler: function (dialog, options, win) {
                                if (win) {
                                    if (win) {
                                        if (win.doOK) {
                                            win.doOK(dialog, opts, callback);
                                        }
                                    } else {
                                        if (options.doOK) {
                                            options.doOK(dialog, opts, callback);
                                        }
                                    }
                                }

                                function callback() {
                                    var text = '', value = '';
                                    if (opts.returnValue) {
                                        if (opts.multiSelect) {
                                            if (opts.returnValue.length) {
                                                for (var i = 0; i < opts.returnValue.length; i++) {
                                                    value = value + (value.length > 0 ? ',' : '') + opts.returnValue[i].value;
                                                    text = text + (text.length > 0 ? ',' : '') + opts.returnValue[i].text;
                                                }
                                            }
                                        } else {
                                            value = opts.returnValue.value.toString();
                                            text = opts.returnValue.text;
                                        }
                                        if (target) {
                                            $.data(target, 'popupSelector').options.params = opts.returnValue.params;
                                        }
                                    }

                                    if (value != currentValue) {
                                        var validateSuccess = true;

                                        if ($.validating.validate(value, opts, dialog.container) == false) {
                                            validateSuccess = false;
                                        }
                                        if (validateSuccess) {
                                            if (opts.onValidate) {
                                                if (opts.onValidate.call(target, value, text) == false) {
                                                    validateSuccess = false;
                                                }
                                            }
                                        }
                                        if (validateSuccess) {
                                            if (opts.onSelect) {
                                                opts.onSelect.call(target, value, text);
                                            }

                                            dialog.close();

                                            // 触发变化事件
                                            if (opts.onChanged) {
                                                opts.onChanged.call(target, value, text);
                                            }
                                        }
                                    } else {
                                        dialog.close();
                                    }
                                }
                            }
                        }, $.buttons.ok), $.extend({
                            handler: function (dialog, options, win) {
                                if (win) {
                                    if (win.doCancel) {
                                        win.doCancel(dialog, opts, function () {
                                            dialog.close();
                                        });
                                    } else {
                                        dialog.close();
                                    }
                                } else {
                                    if (options.doCancel) {
                                        options.doCancel(dialog, opts, function () {
                                            dialog.close();
                                        });
                                    } else {
                                        dialog.close();
                                    }
                                }
                            }
                        }, $.buttons.cancel)
                    ]
            })
        );
    };

    $.fn.popupSelector.defaults = {
        url: '',            // 弹出对话框中打开的选择页面 Url。
        title: '',          // 控件的标题
        multiSelect: false, // 是否多选，默认值为 false。
        mode: '',           // 选择模式，该参数被以查询参数的方式传递到目标 url　的页面中
        filter: '',         // 过滤规则，该参数被以查询参数的方式传递到目标 url　的页面中
        width: 'auto',
        height: 22,
        value: '',
        text: '',
        prompt: '',
        required: false,    // 是否必选，默认值为 false。
        clearable: true,    // 是否显示清空按钮，默认值为 true。
        minSelect: 0,       // 最小选择对象数，在 multiSelect 为 true 时有效，用于控制选择对象的最小个数，默认值 0（即忽略该参数）。
        maxSelect: 0,       // 最大选择对象数, 在 multiSelect 为 true 时有效，用于控制选择对象的最大个数，默认值 0（即忽略该参数）。
        maxLength: 0,       // 值的最小长度，用于控制值组成的字符串的存储长度超过该长度时将提示用户减少选择对象的数量，默认值 0（即忽略该参数）。
        onValidate: function (newValue, newText) { return true; }, // 在值发生变化前对值进行校验时发生，该方法如果返回 true，则校验成功，否则校验失败。
        onChanged: function (newValue, newText) { }, // 在值发生变化后发生
        dialogOptions: null    // 控件弹出对话框的控制选项（支持所有 easyUI 的标准属性，宽度和高度支持百分比）
    };

    if ($.parser && $.parser.plugins) {
        $.parser.plugins.push('popupSelector');
    };
    if ($.parser && $.parser.wituiPlugins) {
        $.parser.wituiPlugins.push('popupSelector');
    }
})(jQuery);
﻿/*
* accountSelector
*
* Dependencies:
* 	 popupSelector
*/
(function ($) {
    function create(target) {
        var state = $.data(target, 'accountSelector');
        $(target).popupSelector($.extend({}, state.options, {
            //            url : $.context.virtualPath  + '/controls/selector/account'
        }));
    }

    $.fn.accountSelector = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.accountSelector.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.popupSelector(options, param);
            }
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'accountSelector');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'accountSelector', {
                    options: $.extend({}, $.fn.popupSelector.defaults,
										$.fn.accountSelector.defaults,
										{ title: $.fn.accountSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/account' },
										$.fn.accountSelector.parseOptions(this), options
									)
                });
            }
            create(this);
        });
    };

    $.fn.accountSelector.methods = {
    };

    $.fn.accountSelector.parseOptions = function (target) {
        return $.extend({}, $.fn.popupSelector.parseOptions(target), $.parser.parseOptions(target));
    };

    $.fn.accountSelector.show = function (target, opts, currentValue) {
        $.fn.popupSelector.show(
		target,
		$.extend({}, $.fn.accountSelector.defaults,
			{ title: $.fn.accountSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/account' },
			opts
		),
		currentValue
	);
    };

    $.fn.accountSelector.defaults = {
    };

    if ($.parser && $.parser.plugins) {
        $.parser.plugins.push('accountSelector');
    };
    if ($.parser && $.parser.wituiPlugins) {
        $.parser.wituiPlugins.push('accountSelector');
    }
})(jQuery);

﻿/*
* departmentSelector
*
* Dependencies:
* 	 popupSelector
*/
(function ($) {
    function create(target) {
        var state = $.data(target, 'departmentSelector');
        $(target).popupSelector($.extend({}, state.options, {
            //            url : $.context.virtualPath  + '/controls/selector/department'
        }));
    }

    $.fn.departmentSelector = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.departmentSelector.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.popupSelector(options, param);
            }
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'departmentSelector');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'departmentSelector', {
                    options: $.extend({}, $.fn.popupSelector.defaults,
                                            $.fn.departmentSelector.defaults,
                                            { title: $.fn.departmentSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/department' },
                                            $.fn.departmentSelector.parseOptions(this), options
                                     )
                });
            }
            create(this);
        });
    };

    $.fn.departmentSelector.methods = {
    };

    $.fn.departmentSelector.parseOptions = function (target) {
        return $.extend({}, $.fn.popupSelector.parseOptions(target), $.parser.parseOptions(target));
    };

    $.fn.departmentSelector.defaults = {
        textTpe: "name"
    };

    $.fn.departmentSelector.show = function (target, opts, currentValue) {
        $.fn.popupSelector.show(
            target,
            $.extend({}, $.fn.departmentSelector.defaults,
                { title: $.fn.departmentSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/department' },
                opts
            ),
            currentValue
        );
    };

    if ($.parser && $.parser.plugins) {
        $.parser.plugins.push('departmentSelector');
    };
    if ($.parser && $.parser.wituiPlugins) {
        $.parser.wituiPlugins.push('departmentSelector');
    }
})(jQuery);

﻿/*
* employeeSelector
*
* Dependencies:
* 	 popupSelector
*/
(function ($) {
    function create(target) {
        var state = $.data(target, 'employeeSelector');
        $(target).popupSelector($.extend({}, state.options, {
            //            url : $.context.virtualPath  + '/controls/selector/employee'
        }));
    }

    $.fn.employeeSelector = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.employeeSelector.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.popupSelector(options, param);
            }
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'employeeSelector');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'employeeSelector', {
                    options: $.extend({}, $.fn.popupSelector.defaults,
                                            $.fn.employeeSelector.defaults,
                                            { title: $.fn.employeeSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/employee' },
                                            $.fn.employeeSelector.parseOptions(this), options
                                     )
                });
            }
            create(this);
        });
    };

    $.fn.employeeSelector.methods = {
    };

    $.fn.employeeSelector.parseOptions = function (target) {
        return $.extend({}, $.fn.popupSelector.parseOptions(target), $.parser.parseOptions(target));
    };

    $.fn.employeeSelector.show = function (target, opts, currentValue) {
        $.fn.popupSelector.show(
            target,
            $.extend({}, $.fn.employeeSelector.defaults,
                { title: $.fn.employeeSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/employee' },
                opts
            ),
            currentValue
        );
    };

    $.fn.employeeSelector.defaults = {
    };

    if ($.parser && $.parser.plugins) {
        $.parser.plugins.push('employeeSelector');
    };
    if ($.parser && $.parser.wituiPlugins) {
        $.parser.wituiPlugins.push('employeeSelector');
    }
})(jQuery);

﻿/*
* jobTitleSelector
*
* Dependencies:
* 	 popupSelector
*/
(function ($) {
    function create(target) {
        var state = $.data(target, 'jobTitleSelector');
        $(target).popupSelector($.extend({}, state.options, {
            //            url : $.context.virtualPath  + '/controls/selector/jobTitle'
        }));
    }

    $.fn.jobTitleSelector = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.jobTitleSelector.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.popupSelector(options, param);
            }
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'jobTitleSelector');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'jobTitleSelector', {
                    options: $.extend({}, $.fn.popupSelector.defaults,
									$.fn.jobTitleSelector.defaults,
									{ title: $.fn.jobTitleSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/jobTitle' },
									$.fn.jobTitleSelector.parseOptions(this), options
								)
                });
            }
            create(this);
        });
    };

    $.fn.jobTitleSelector.methods = {
    };

    $.fn.jobTitleSelector.parseOptions = function (target) {
        return $.extend({}, $.fn.popupSelector.parseOptions(target), $.parser.parseOptions(target));
    };

    $.fn.jobTitleSelector.show = function (target, opts, currentValue) {
        $.fn.popupSelector.show(
				target,
				$.extend({}, $.fn.jobTitleSelector.defaults,
					{ title: $.fn.jobTitleSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/jobTitle' },
					opts
				),
				currentValue
			);
    };

    $.fn.jobTitleSelector.defaults = {
    };

    if ($.parser && $.parser.plugins) {
        $.parser.plugins.push('jobTitleSelector');
    };
    if ($.parser && $.parser.wituiPlugins) {
        $.parser.wituiPlugins.push('jobTitleSelector');
    }
})(jQuery);

﻿/*
* menuSelector
*
* Dependencies:
* 	 menuSelector
*/
(function ($) {
    function create(target) {
        var state = $.data(target, 'menuSelector');
        $(target).popupSelector($.extend({}, state.options, {
            //            url : $.context.virtualPath  + '/controls/selector/menu'
        }));
    }

    $.fn.menuSelector = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.menuSelector.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.popupSelector(options, param);
            }
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'menuSelector');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'menuSelector', {
                    options: $.extend({}, $.fn.popupSelector.defaults,
                                            $.fn.menuSelector.defaults,
                                            { title: $.fn.menuSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/menu' },
                                            $.fn.menuSelector.parseOptions(this), options
                                     )
                });
            }
            create(this);
        });
    };

    $.fn.menuSelector.methods = {
    };

    $.fn.menuSelector.parseOptions = function (target) {
        return $.extend({}, $.fn.popupSelector.parseOptions(target), $.parser.parseOptions(target));
    };

    $.fn.menuSelector.defaults = {
        textTpe: "name"
    };

    $.fn.menuSelector.show = function (target, opts, currentValue) {
        $.fn.popupSelector.show(
            target,
            $.extend({}, $.fn.menuSelector.defaults,
                { title: $.fn.menuSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/menu' },
                opts
            ),
            currentValue
        );
    };

    if ($.parser && $.parser.plugins) {
        $.parser.plugins.push('menuSelector');
    };
    if ($.parser && $.parser.wituiPlugins) {
        $.parser.wituiPlugins.push('menuSelector');
    }
})(jQuery);

﻿/*
* resourceSelector
*
* Dependencies:
* 	 resourceSelector
*/
(function ($) {
    function create(target) {
        var state = $.data(target, 'resourceSelector');
        $(target).popupSelector($.extend({}, state.options, {
            //            url : $.context.virtualPath  + '/controls/selector/resource'
        }));
    }

    $.fn.resourceSelector = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.resourceSelector.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.popupSelector(options, param);
            }
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'resourceSelector');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'resourceSelector', {
                    options: $.extend({}, $.fn.popupSelector.defaults,
                                            $.fn.resourceSelector.defaults,
                                            { title: $.fn.resourceSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/resource' },
                                            $.fn.resourceSelector.parseOptions(this), options
                                     )
                });
            }
            create(this);
        });
    };

    $.fn.resourceSelector.methods = {
    };

    $.fn.resourceSelector.parseOptions = function (target) {
        return $.extend({}, $.fn.popupSelector.parseOptions(target), $.parser.parseOptions(target));
    };

    $.fn.resourceSelector.defaults = {
        textTpe: "name"
    };

    $.fn.resourceSelector.show = function (target, opts, currentValue) {
        $.fn.popupSelector.show(
            target,
            $.extend({}, $.fn.resourceSelector.defaults,
                { title: $.fn.resourceSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/resource' },
                opts
            ),
            currentValue
        );
    };

    if ($.parser && $.parser.plugins) {
        $.parser.plugins.push('resourceSelector');
    };
    if ($.parser && $.parser.wituiPlugins) {
        $.parser.wituiPlugins.push('resourceSelector');
    }
})(jQuery);

﻿/*
* roleSelector
*
* Dependencies:
* 	 popupSelector
*/
(function ($) {
    function create(target) {
        var state = $.data(target, 'roleSelector');
        $(target).popupSelector($.extend({}, state.options));
    }

    $.fn.roleSelector = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.roleSelector.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.popupSelector(options, param);
            }
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'roleSelector');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'roleSelector', {
                    options: $.extend({}, $.fn.popupSelector.defaults,
										$.fn.roleSelector.defaults,
										{ title: $.fn.roleSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/role' },
										$.fn.roleSelector.parseOptions(this), options
									)
                });
            }
            create(this);
        });
    };

    $.fn.roleSelector.methods = {
    };

    $.fn.roleSelector.parseOptions = function (target) {
        return $.extend({}, $.fn.popupSelector.parseOptions(target), $.parser.parseOptions(target));
    };

    $.fn.roleSelector.show = function (target, opts, currentValue) {
        $.fn.popupSelector.show(
		target,
		$.extend({}, $.fn.roleSelector.defaults,
			{ title: $.fn.roleSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/role' },
			opts
		),
		currentValue
	);
    };

    $.fn.roleSelector.defaults = {
    };

    if ($.parser && $.parser.plugins) {
        $.parser.plugins.push('roleSelector');
    };
    if ($.parser && $.parser.wituiPlugins) {
        $.parser.wituiPlugins.push('roleSelector');
    }
})(jQuery);

﻿/*
* positionSelector
*
* Dependencies:
* 	 popupSelector
*/
(function ($) {
    function create(target) {
        var state = $.data(target, 'positionSelector');
        $(target).popupSelector($.extend({}, state.options, {
            //            url : $.context.virtualPath  + '/controls/selector/position'
        }));
    }

    $.fn.positionSelector = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.positionSelector.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.popupSelector(options, param);
            }
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'positionSelector');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'positionSelector', {
                    options: $.extend({}, $.fn.popupSelector.defaults,
										$.fn.positionSelector.defaults,
										{ title: $.fn.positionSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/position' },
										$.fn.positionSelector.parseOptions(this), options
									)
                });
            }
            create(this);
        });
    };

    $.fn.positionSelector.methods = {
    };

    $.fn.positionSelector.parseOptions = function (target) {
        return $.extend({}, $.fn.popupSelector.parseOptions(target), $.parser.parseOptions(target));
    };

    $.fn.positionSelector.show = function (target, opts, currentValue) {
        $.fn.popupSelector.show(
		target,
		$.extend({}, $.fn.positionSelector.defaults,
			{ title: $.fn.positionSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/position' },
			opts
		),
		currentValue
	);
    };

    $.fn.positionSelector.defaults = {
    };

    if ($.parser && $.parser.plugins) {
        $.parser.plugins.push('positionSelector');
    };
    if ($.parser && $.parser.wituiPlugins) {
        $.parser.wituiPlugins.push('positionSelector');
    }
})(jQuery);

﻿/*
* groupSelector
*
* Dependencies:
* 	 popupSelector
*/
(function ($) {
    function create(target) {
        var state = $.data(target, 'groupSelector');
        $(target).popupSelector($.extend({}, state.options));
    }

    $.fn.groupSelector = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.groupSelector.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.popupSelector(options, param);
            }
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'groupSelector');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'groupSelector', {
                    options: $.extend({}, $.fn.popupSelector.defaults,
										$.fn.groupSelector.defaults,
										{ title: $.fn.groupSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/group' },
										$.fn.groupSelector.parseOptions(this), options
									)
                });
            }
            create(this);
        });
    };

    $.fn.groupSelector.methods = {
    };

    $.fn.groupSelector.parseOptions = function (target) {
        return $.extend({}, $.fn.popupSelector.parseOptions(target), $.parser.parseOptions(target));
    };

    $.fn.groupSelector.show = function (target, opts, currentValue) {
        $.fn.popupSelector.show(
		target,
		$.extend({}, $.fn.groupSelector.defaults,
			{ title: $.fn.groupSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/group' },
			opts
		),
		currentValue
	);
    };

    $.fn.groupSelector.defaults = {
    };

    if ($.parser && $.parser.plugins) {
        $.parser.plugins.push('groupSelector');
    };
    if ($.parser && $.parser.wituiPlugins) {
        $.parser.wituiPlugins.push('groupSelector');
    }
})(jQuery);

﻿/*
* departmentTypeSelector
*
* Dependencies:
* 	 popupSelector
*/
(function ($) {
    function create(target) {
        var state = $.data(target, 'departmentTypeSelector');
        $(target).popupSelector($.extend({}, state.options));
    }

    $.fn.departmentTypeSelector = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.departmentTypeSelector.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.popupSelector(options, param);
            }
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'departmentTypeSelector');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'departmentTypeSelector', {
                    options: $.extend({}, $.fn.popupSelector.defaults,
										$.fn.departmentTypeSelector.defaults,
										{ title: $.fn.departmentTypeSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/departmentType' },
										$.fn.departmentTypeSelector.parseOptions(this), options
									)
                });
            }
            create(this);
        });
    };

    $.fn.departmentTypeSelector.methods = {
    };

    $.fn.departmentTypeSelector.parseOptions = function (target) {
        return $.extend({}, $.fn.popupSelector.parseOptions(target), $.parser.parseOptions(target));
    };

    $.fn.departmentTypeSelector.show = function (target, opts, currentValue) {
        $.fn.popupSelector.show(
		target,
		$.extend({}, $.fn.departmentTypeSelector.defaults,
			{ title: $.fn.departmentTypeSelector.defaults.title, url: $.context.virtualPath + 'controls/selector/departmentType' },
			opts
		),
		currentValue
	);
    };

    $.fn.departmentTypeSelector.defaults = {
    };

    if ($.parser && $.parser.plugins) {
        $.parser.plugins.push('departmentTypeSelector');
    };
    if ($.parser && $.parser.wituiPlugins) {
        $.parser.wituiPlugins.push('departmentTypeSelector');
    }
})(jQuery);

﻿(function ($) {
    //一些辅助方法
    function flashChecker() {
        var hasFlash = false; //是否安装了flash
        try {
            if (document.all) {
                var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                if (swf) {
                    hasFlash = true;
                    VSwf = swf.GetVariable("$version");
                    flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
                }
            } else {
                if (navigator.plugins && navigator.plugins.length > 0) {
                    var swf = navigator.plugins["Shockwave Flash"];
                    if (swf) {
                        hasFlash = true;
                        var words = swf.description.split(" ");
                        for (var i = 0; i < words.length; ++i) {
                            if (isNaN(parseInt(words[i]))) continue;
                            flashVersion = parseInt(words[i]);
                        }
                    }
                }
            }
        }
        catch (e) {
            hasFlash = false;
        }
        return hasFlash;
    }
    //return bool 
    function fileTypeChecker(name, types) {
        if (types) {
            var len = types.length;
            var nameExtention = name.substring(name.lastIndexOf('.'));
            for (var i = 0; i < len; i++) {
                var type = types[i]
                if (type === '.*' || type === nameExtention) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }
    //size string  end with GB,MB,KB
    //return int  以kb为单位
    function parseMaxSize(size) {
        size = size.replace(/\s/g, '');
        size = size.toUpperCase();
        var index = size.indexOf('B') - 1;
        var ex = size.substring(index);
        var count = size.substring(0, index);
        switch (ex) {
            case 'KB':
                count *= 1024;
                break;
            case 'MB':
                count *= 1024 * 1024;
                break;
            case 'GB':
                count *= 1024 * 1024 * 1024;
        }
        return count;
    }
    function parseSize(size) {
        var count = 0, extend = ['KB', 'MB', 'GB'];
        while ((size /= 1024) > 1024) {
            if (count > 2) break;
            count++;
        }
        return size.toFixed(2) + extend[count];
    }
    /**
    * @method setTemplate
    * @for $.uploadifyHelper.helper
    * @grammar setTemplate() => {{string},{object}}
    * @description 用一组值对一个template进行替换，返回一组替换后的template。
    * @param  {string} 对一个template进行替换。其中${name}表示变量
    * @param  {object} {name : ['Jack','Jerry']}
    * @return  {Array}
    * @example
    *
    * ```js
    * var templates=setTemplate('name:${name}, age:${age}', {name : ['Jack','Jerry'],age:[17,22]})
    * templates-> ['name:Jack,age:17','name:Jerry,age:22']
    * var templates=setTemplate('name:${name}, description:${description}', {name : 'Jack,Jerry',description:{value:'Jack is a good person.,Jerry is goodlooking,but he is a shitty person.',length:25}})
    * templates-> ['name:Jack,description:Jack is a good person.','name:Jerry,description:Jerry is goodlooking,but he...']
    * ```
    */
    function setTemplate(template, options) {
        var items = [];
        if ($.type(options) === 'object') {
            for (var name in options) {
                var value = options[name];
                if (typeof value === 'string') {
                    if (value.indexOf(',') === -1) {
                        value = [value];
                    }
                    else {
                        value = value.split(',');
                    }
                }
                else if ($.type(value) === 'object') {
                    var temp = value.value;
                    if (temp.indexOf(',') === -1) {
                        temp = [temp];
                    }
                    else {
                        temp = temp.split(',');
                    }
                    for (var i = 0, l = temp.length; i < l; i++) {
                        var str = temp[i];
                        temp[i] = str.length > value.length ? str.substr(0, value.length) + '...' : str;
                    }
                    value = temp;
                }
                for (var i = 0, l = value.length; i < l; i++) {
                    //第一次调用
                    if (items.length < l) {
                        items[i] = template.replace(new RegExp('\\$\\{' + name + '\\}', 'g'), value[i]);
                    }
                    else {
                        items[i] = items[i].replace(new RegExp('\\$\\{' + name + '\\}', 'g'), value[i])
                    }
                }
            }
        }
        else {
            //array
            var items = [];
            for (var i = 0, l = options.length; i < l; i++) {
                var value = options[i],
                    pattern = /\${(\w+)}/g,
                    item = template,
                    match,name;
                while ((match = pattern.exec(template)) != null) {
                    name = match[1];
                    item = item.replace(new RegExp('\\$\\{' + name + '\\}', 'g'), value[name]);
                }
                items.push(item);
            }
        }
        return items;
    }
    function isTrue(arg) {
        if (arg === true || arg === 'true') {
            return true;
        }
        else {
            return false;
        }
    }
    $.uploadifyHelper = {
        flashChecker: flashChecker,
        fileTypeChecker: fileTypeChecker,
        parseMaxSize: parseMaxSize,
        parseSize: parseSize,
        setTemplate: setTemplate,
        isTrue: isTrue
    };
})(jQuery);

﻿
(function ($) {
  var _helper = $.uploadifyHelper;

  function FilePanel() {
    var _id = 0, //对input的id进行赋值
      // 不允许修改的属性值
      _readOnlyOptions = {
        auto: true,
        multi: true,
        method: 'post',
        debug: false,
        requeueErrors: false,
        removeTimeout: 0,
        removeCompleted: true,
        buttonClass: 'witui-filepanel',
        overrideEvents: ['onDialogClose', 'onSelectError', 'onUploadError',
          'onUploadComplete'
        ],
        swf: $.context.virtualPath + 'Scripts/third-party/uploadify.swf',
        itemTemplate: '<div id="${fileID}_item" class="uploadify-uploadingItem">   <div class="uploadify-fileName">    <span class="uploadify-attachmentIcon"></span>  <span class="uploadify-attachmentName">${fileName}(${fileSize}) </span>    <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#${instanceID}\').trigger(\'_delete.uploadifyItem\',\'${fileID}_item\')" style="display:none">X</a>   </div>   <div id="${fileID}" class="uploadify-queue-item">     <span class="data uploadify-dataComplete"></span>    <div class="uploadify-progress">      <div class="uploadify-progress-bar"></div>     </div>    <div class="uploadify-cancel">      <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')">X</a>     </div>   </div> </div> '
      };
    //对事件进行一层包装，在事件中的首先执行默认的代码，然后才会调用外界定义的handler。
    var _overrideEventHandlers = {
        //屏蔽uploadify的原生事件
        onDisable: function () {},
        onEnable: function () {},
        onDestroy: function () {},
        //
        onSWFReady: function () {
          var settings = this.settings,
            $realTarget = $('#' + settings.id),
            opts = $realTarget.data('filepanel').options;
          if (opts.disabled || opts.readonly) {
            setDisabled($realTarget[0], opts.disabled, opts.readonly);
          }
        },
        onCancel: function (file) {
          //取消upload的时候删除文件名
          $('#' + file.id).parent().remove();

          var settings = this.settings,
            $realTarget = $('#' + settings.id),
            opts = $realTarget.data('filepanel').options;
          opts.onCancel.call($realTarget, file, opts);
        },
        onSelect: function (file) {
          var settings = this.settings,
            $realTarget = $('#' + settings.id),
            opts = $realTarget.data('filepanel').options;
          opts.onSelect.call($realTarget, file, opts);
        },
        onSelectError: function (file, errorCode, errorMsg) {
          var settings = this.settings,
            $realTarget = $('#' + settings.id),
            opts = $realTarget.data('filepanel').options,
            errorMsgs = opts.errorMsgs,
            msg = errorMsgs.addFileFailed;
          switch (errorCode) {
            case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
              msg = S(errorMsgs.queueSizeExceeded).template({
                queueSize: settings.queueSizeLimit
              }).s
              break;
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
              msg = S(errorMsgs.tooLarge).template({
                name: file.name,
                sizeLimit: settings.fileSizeLimit
              }).s
              break;
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
              msg = S(errorMsgs.cannotBeEempty).template({
                name: file.name
              }).s
              break;
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
              msg = S(errorMsgs.fileTypeInvalid).template({
                name: file.name,
                fileTypeDesc: settings.fileTypeDesc
              }).s
              break;
          }
          this.queueData.errorMsg = msg;

          $.messager.alert($.messager.defaults.info, msg, 'error', function () {
            opts.onSelectError.call($realTarget, file, opts, msg);
          });
        },
        onDialogClose: function (queueData) {
          var settings = this.settings,
            $realTarget = $('#' + settings.id),
            opts = $realTarget.data('filepanel').options;
          if (queueData.filesErrored > 0) {

          }
          opts.onDialogClose.call($realTarget, queueData);
        },
        onUploadStart: function (file) {
          var settings = this.settings,
            $realTarget = $('#' + settings.id),
            opts = $realTarget.data('filepanel').options;
          opts.onUploadStart.call($realTarget, file, opts);
        },
        onUploadSuccess: function (file, data, response) {
          var settings = this.settings,
            $realTarget = $('#' + settings.id),
            opts = $realTarget.data('filepanel').options;
          if (typeof data === 'string' && /^{/.test(data)) {
            try {
              data = $.parseJSON(data);
            } catch (e) {
              data = {
                errorMessage: e.Message
              }
            }
          } else {
            data = {
              errorMessage: opts.errorMsgs.failed
            }
          }
          this.data = data;
        },
        onUploadError: function (file, errorCode, errorMsg, errorString) {
          var settings = this.settings,
            $realTarget = $('#' + settings.id),
            opts = $realTarget.data('filepanel').options,
            errorMsgs = opts.errorMsgs,
            msg = errorMsgs.failed;
          switch (errorCode) {
            case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
              msg = errorMsgs.httpError;
              break;
            case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
              msg = errorMsgs.cannotFoundUrl;
              break;
            case SWFUpload.UPLOAD_ERROR.IO_ERROR:
              msg = errorMsgs.IOError;
              break;
            case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
              msg = errorMsgs.securityError;
              break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
              msg = errorMsgs.exceedLimit;
              break;
            case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
              break;
            case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
              msg = errorMsgs.validationError;
              break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
              msg = errorMsgs.stopped;
              break;
          }
          this.data = {
            errorMessage: msg
          };
        },
        onUploadComplete: function (file) {
          var settings = this.settings,
            swfuploadify = this,
            data = this.data,
            me = this,
            $realTarget = $('#' + settings.id),
            opts = $realTarget.data('filepanel').options;

          delete this.data;

          var func = function () {
            swfuploadify.queueData.queueSize -= file.size;
            swfuploadify.queueData.queueLength -= 1;

            delete swfuploadify.queueData.files[file.id];

            var $item = $('#' + file.id + '_item');
            if (data.errorMessage) {
              //上传失败
              var errorMessage = data.errorMessage;
              $.messager.alert($.messager.defaults.info, errorMessage,
                'error',
                function () {
                  opts.onUploadError.call($realTarget, file, opts,
                    errorMessage);
                  opts.onUploadComplete.call($realTarget, file, opts,
                    data);
                });
              //
              $item.remove();
            } else {
              //上传成功
              //绑定upload返回的数据到dom中
              $item.children('#' + file.id).remove();
              $item.removeClass('uploadify-uploadingItem').addClass(
                'uploadify-uploadedItem-' + opts.layout);

              //默认的绑定
              if (data && data.id) {
                $item.attr('_attachmentId', data.id);
              }
              var map = opts.map;
              if (typeof map === 'function') {
                map($item, data);
              } else {
                for (var p in map) {
                  $item.attr(p, data[map[p]]);
                }
              }
              //上传成功显示删除按钮
              $item.find('a').css({
                display: 'inline'
              });

              $realTarget.trigger('_update.uploadifyItem');

              opts.onUploadSuccess.call($realTarget, file, opts, data);
              opts.onUploadComplete.call($realTarget, file, opts, data);
            }
          }
          if (settings.removeCompleted) {
            switch (file.filestatus) {
              case SWFUpload.FILE_STATUS.COMPLETE:
                setTimeout(function () {
                  if ($('#' + file.id)) {
                    func();
                  }
                }, settings.removeTimeout * 1000);
                break;
              case SWFUpload.FILE_STATUS.ERROR:
                if (!settings.requeueErrors) {
                  setTimeout(function () {
                    if ($('#' + file.id)) {
                      swfuploadify.queueData.queueSize -= file.size;
                      swfuploadify.queueData.queueLength -= 1;
                      delete swfuploadify.queueData.files[file.id];
                      $('#' + file.id).remove();
                      func();
                    }
                  }, settings.removeTimeout * 1000);
                }
                break;
            }
          } else {
            file.uploaded = true;
          }
        }
      }
      //全文中 target指原始的input file对象
      // parent指包含input和input file的div
      // realTarget指获得了原始input id的div
      //$realTarget=$parent.parent()=$target.parent().parent()

    //调用uploadify
    function create(target, options) {
      preOptions(options);
      ensureOptions(target, options);

      $target = $(target);
      $target.wrap('<div class="witui-filepanel"></div>')

      var settings = $.extend({}, options, _overrideEventHandlers);
      $target.uploadify(settings);
    };
    //在调用完uploadify的初始化方法后调用
    function init($realTarget, options) {
      //添加队列区域
      var itemsStr = '',
        uploadedItemTemplate;

      if (options.downloadUrl === false) {
        //不绑定下载URL
        uploadedItemTemplate = '<div id="' + options.id +
          '_${_attachmentId}_item" class="uploadify-uploadedItem-' + options.layout +
          '" _attachmentid="${_attachmentId}"> <div class="uploadify-fileName">  <span class="uploadify-attachmentIcon"></span><span class="uploadify-attachmentName">${fileName}</span> <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#' +
          options.id + '\').trigger(\'_delete.uploadifyItem\',\'' + options.id +
          '_${_attachmentId}_item\')">X</a>  </div> </div> ';
      } else {
        uploadedItemTemplate = '<div id="' + options.id +
          '_${_attachmentId}_item" class="uploadify-uploadedItem-' + options.layout +
          '" _attachmentid="${_attachmentId}"> <div class="uploadify-fileName">  <span class="uploadify-attachmentIcon"></span><span class="uploadify-attachmentName"><a class="uploadify-attachmentUrl" href="' +
          options.downloadUrl +
          '?id=${_attachmentId}">${fileName}</a></span> <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#' +
          options.id + '\').trigger(\'_delete.uploadifyItem\',\'' + options.id +
          '_${_attachmentId}_item\')">X</a>  </div> </div> ';
      }
      //添加隐藏的input以维护Id
      if (options.name) {
        $hiddenInput = $('<input name="' + options.name + '" type="hidden"/>')
          .appendTo($realTarget);
      }
      //初始化queueArea中的已上传文件
      if (options.value) {
        var names = options.text,
          ids = options.value;
        itemsStr = _helper.setTemplate(uploadedItemTemplate, {
          _attachmentId: ids,
          fileName: {
            value: names,
            length: options.maxFileNameLength
          }
        }).join('');
        if (options.name) {
          $hiddenInput.val(options.value);
        }
      }
      if (options.addQueueArea) {
        $realTarget.after('<div id="' + options.queueID +
          '" class="uploadify-queue">' + itemsStr + '<div>');
      } else {
        var $queueArea = $('#' + options.queueID);
        if (!$queueArea.attr('class')) {
          $queueArea.addClass('uploadify-queue');
        }
        $queueArea.html(itemsStr);
      }

      //添加事件
      $realTarget.on('_delete.uploadifyItem', function (event, itemId) {
        var $realTarget = $(event.currentTarget),
          opts = $realTarget.data('filepanel').options;

        $('#' + itemId).remove();

        $realTarget.trigger('_update.uploadifyItem');
        opts.onDeleteFile.call($realTarget, opts);
      });
      $realTarget.on('_update.uploadifyItem', function (event) {
        var $realTarget = $(event.currentTarget),
          attachments = [],
          opts = $realTarget.data('filepanel').options;

        getQueueArea($realTarget[0]).children().each(function () {
          attachments.push($(this).attr('_attachmentId'));
        });
        //隐藏的input维护返回的id
        $realTarget.children(':last-child').val(attachments.join(','));
      });
    }
    //对options的检验，只执行一次
    function ensureOptions(target, options) {
      var $target = $(target);
      //uploadify要求其承载的input必须有ID
      if (!options.id) {
        ++_id;
        options.id = 'witui_filepanel_' + _id;
      }
      $target.attr('id', options.id);

      if (options.name) {
        $target.attr('name', options.name + '_Original');
      }
      if (!options.queueID) {
        options.queueID = target.id + '_queue_area';
        //是否自动添加QueueArea。
        options.addQueueArea = true;
      }
    }
    //对options的预处理，在SetOptions中需要复用的
    function preOptions(options) {
      if (options.url) {
        options.uploader = options.url;
      }
      if (options.readonly === true) {
        options.hidden = true;
      }
    }

    function setOptions(realTarget, options) {
      preOptions(options);
      if (options.disabled !== undefined || options.readonly !== undefined) {
        setDisabled(realTarget, options.disabled, options.readonly);
      }
      if (options.hidden != undefined) {
        setHidden(realTarget, options.hidden);
      }
      var settings = $.extend({}, options, _overrideEventHandlers),
        $realTarget = $(realTarget);
      for (var name in settings) {
        $realTarget.uploadify('settings', name, settings[name]);
      }
    }

    function getQueueArea(realTarget) {
      var state = $(realTarget).data('filepanel');
      if (!state.queueArea) {
        return state.queueArea = $('#' + state.options.queueID);
      }
      return state.queueArea;
    }
    /**
     * @method setDisabled
     * @for witui.filepanel
     * @grammar setDisabled() => {{DOM},{string},{bool}}
     * @description 对控件进行disable和readonly，需要对隐藏域进行特殊处理以保证在form提交中正确传递参数,同时需要把已上传完成的删除按钮隐藏或显示。
     *           uploadify只有disable，没有readonly，所以在disable和readonly的时候都调用disable方法。
     * @param  {DOM}
     * @param  {bool}
     * @param  {bool}
     * @return  {bool}
     */
    function setDisabled(realTarget, disabled, readonly) {
      var $realTarget = $(realTarget),
        opts = $realTarget.data('filepanel').options;

      if (disabled === undefined) {
        readonly = opts.readonly = _helper.isTrue(readonly);
        disable(readonly);
      } else if (readonly === undefined) {
        disabled = opts.disabled = _helper.isTrue(disabled);
        disable(disabled);
        triggleDisableEvent(disabled);
      } else {
        disabled = opts.disabled = _helper.isTrue(disabled);
        readonly = opts.readonly = _helper.isTrue(readonly);
        disable(disabled || readonly);
        triggleDisableEvent(disabled);
      }

      function disable(arg) {
        if (arg) {
          $realTarget.uploadify('disable', true);
          //$realTarget.find('.uploadify-button-text').addClass('disabled');
          getQueueArea($realTarget[0]).find('.uploadify-btn-delete').css({
            display: 'none'
          });
        } else {
          $realTarget.uploadify('disable', false);
          //$realTarget.find('.uploadify-button-text').removeClass('disabled');
          getQueueArea($realTarget[0]).find('.uploadify-btn-delete').css({
            display: 'inline'
          });
        }

      }

      function triggleDisableEvent(arg) {
        if (arg) {
          $realTarget.children('input').attr('disabled', 'disabled');
          opts.onDisable.call($realTarget);
        } else {
          $realTarget.children('input').removeAttr('disabled');
          opts.onEnable.call($realTarget);
        }
      }
    };

    function setHidden(realTarget, hidden) {
      var $realTarget = $(realTarget),
        opts = $realTarget.data('filepanel').options;
      if (hidden) {
        opts.hidden = true;
        if (opts.addQueueArea) {
          //对swfObject不能设置display:none，否则不能调用swfObject的方法
          $realTarget.css({
            position: 'absolute',
            top: -1000,
            left: -1000
          });
        } else {
          $realTarget.parent().css({
            position: 'absolute',
            top: -1000,
            left: -1000
          });
        }
      } else {
        opts.hidden = false;
        if (opts.addQueueArea) {
          $realTarget.css({
            position: 'relative',
            top: 0,
            left: 0
          });
        } else {
          $realTarget.parent().css({
            position: 'relative',
            top: 0,
            left: 0
          });
        }
      }
    }

    function destroy(realTarget, forceDestroy) {
      var $realTarget = $(realTarget),
        opts = $realTarget.data('filepanel').options;
      if (forceDestroy != true) {
        if (opts.onBeforeDestroy.call($realTarget) == false) {
          return;
        }
      }
      $realTarget.parent().remove();
      if (opts.addQueueArea) {
        getQueueArea(realTarget).remove();
      }
      opts.onDestroy.call($realTarget);
    };

    FilePanel.prototype.init = function (options, param) {
      if (typeof options == 'string') {
        return FilePanel.prototype.methods[options](this, param);
      }
      options = options || {};
      var me = this;
      //setTimeout解决chrome下崩溃的问题
      return setTimeout(function () {
        me.each(function () {
          var state = $.data(this, 'filepanel'),
            opts;
          if (state) {
            opts = $.extend(state.options, options,
              _readOnlyOptions);
            setOptions(this, opts);
          } else {
            //在一开始时存在的input标签（也就是这里的this）,最终会在uploadify中被替换为div。那么这些保存在$.data中的数据也就再无法获得了。
            //$.data保存到拥有了原始input标签id的div中
            opts = $.extend({}, $.fn.filepanel.defaults, $.fn.filepanel
              .parseOptions(this), options, _readOnlyOptions);
            var $target = $('<input type="file" />');
            $(this).replaceWith($target);
            target = $target[0];
            create(target, opts);
            var $realTarget = $('#' + opts.id);
            state = $realTarget.data('filepanel', {
              options: opts,
              filepanel: $realTarget
            });
            init($realTarget, opts);
            //设置初始状态的hidden
            if (opts.hidden) {
              setHidden($realTarget[0], true);
            }
            //初始状态的disabled和readonly在onSWFReady事件中设置，因为uploadify的disable方法必须在SWF加载完成之后才能执行。
            // setDisabled(newThis, opts.disabled);
          }
        });
      }, 10);
    };
    FilePanel.prototype.parseOptions = function (target) {
      var $target = $(target);
      return $.extend({}, $.parser.parseOptions(target, ['id', 'name',
        'value', 'text'
      ]), {
        readonly: $target.attr('readonly') ? true : undefined,
        disabled: $target.attr('disabled') ? true : undefined,
        hidden: $target.attr('hidden') ? true : undefined
      });
    };
    FilePanel.prototype.methods = {
      options: function (jq) {
        return $.data(jq[0], "filepanel").options;
      },
      filepanel: function (jq) {
        return $.data(jq[0], "filepanel").filepanel;
      },
      setFormData: function (jq, param) {
        return jq.each(function () {
          $.data(this, 'filepanel').options.formData = param;
        });
      },
      readonly: function (jq, param) {
        return jq.each(function () {
          setDisabled(this, undefined, param);
        });
      },
      disable: function (jq) {
        return jq.each(function () {
          setDisabled(this, true);
        })
      },
      enable: function (jq) {
        return jq.each(function () {
          setDisabled(this, false);
        });
      },
      hiddenButton: function (jq, hidden) {
        return jq.each(function () {
          setHidden(this, hidden);
        });
      },
      destroy: function (jq, param) {
        return jq.each(function () {
          destroy(this, param);
        });
      }
    };
  }

  function FilePanelAjax() {
    //ajax上传附件
    var _id = 0,
      _$iframe = {}, //用来保存每次提交请求的iframe，取消的时候会用到
      _readOnlyOptions = {
        itemTemplate: '<div id="${fileID}_item" class="uploadify-uploadingItem">   <div class="uploadify-fileName">    <span class="uploadify-attachmentIcon"></span>  <span class="uploadify-attachmentName">${fileName}(${fileSize}) </span>    <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#${instanceID}\').trigger(\'_delete.uploadifyItem\',\'${fileID}_item\')" style="display:none">X</a>   </div>   <div id="${fileID}" class="uploadify-queue-item">     <span class="data uploadify-dataComplete"></span>    <div class="uploadify-loading">      <div class="uploadify-progress-bar"></div>     </div>    <div class="uploadify-cancel">      <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#${instanceID}\').trigger(\'_cancel.uploadifyItem\',\'${fileID}\')">X</a>     </div>   </div> </div> ',
        //低版本的ie（比如ie8）获取不到文件的大小。
        itemTemplateWithoutFileSize: '<div id="${fileID}_item" class="uploadify-uploadingItem">   <div class="uploadify-fileName">    <span class="uploadify-attachmentIcon"></span>  <span class="uploadify-attachmentName">${fileName} </span>    <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#${instanceID}\').trigger(\'_delete.uploadifyItem\',\'${fileID}_item\')" style="display:none">X</a>   </div>   <div id="${fileID}" class="uploadify-queue-item">     <span class="data uploadify-dataComplete"></span>    <div class="uploadify-loading">      <div class="uploadify-progress-bar"></div>     </div>    <div class="uploadify-cancel">      <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#${instanceID}\').trigger(\'_cancel.uploadifyItem\',\'${fileID}\')">X</a>     </div>   </div> </div> '
      },
      _errorCode = {
        fileTypeInvalid: 100,
        fileSizeExceed: 101,
        emptyFile: 102
      };
    //包装事件，有一些效果是添加在uploadify的事件中的。
    var _eventHandlers = {
        //return bool true则上传，false则不会上传。
        onSelect: function (file, opts) {
          //对文件进行检验
          var errorCode,
            errorMsgs = opts.errorMsgs,
            msg = errorMsgs.addFileFailed;
          if (!_helper.fileTypeChecker(file.name, opts.fileTypes)) {
            errorCode = _errorCode.fileTypeInvalid;
            msg = S(errorMsgs.fileTypeInvalid).template({
              name: file.name,
              fileTypeDesc: opts.fileTypeDesc
            }).s
          }
          if (file.size > opts.fileSizeLimitKB) {
            errorCode = _errorCode.fileSizeExceed;
            msg = S(errorMsgs.tooLarge).template({
              name: file.name,
              sizeLimit: opts.fileSizeLimit
            }).s;
          }
          if (file.size === 0) {
            errorCode = _errorCode.emptyFile;
            msg = S(errorMsgs.cannotBeEempty).template({
              name: file.name
            }).s;
          }
          if (errorCode) {
            _eventHandlers.onSelectError.call(this, file, opts, errorCode,
              msg);
            return false;
          }
          if (opts.onSelect.call(this, file, opts) === false) {
            return false;
          }
          return true;
        },
        onSelectError: function (file, opts, errorCode, errorMsg) {
          var me = this;
          $.messager.alert($.messager.defaults.info, errorMsg, 'error',
            function () {
              opts.onSelectError.call(me, file, opts, errorMsg);
            });
        },
        onUploadError: function (file, opts, xhr, status, e) {
          var msg = opts.errorMsgs.failed;
          if (e && e.message !== '500') {
            msg = e.message;
          }
          _eventHandlers.onUploadComplete.call(this, file, opts, {
            errorMessage: msg
          });
        },
        //不论成功还是失败都会调用
        //status有两个值。error success(是http请求的success和error),是ajaxfileupload进行的赋值
        onUploadComplete: function (file, opts, data) {
          if (data.errorMessage) { //error
            var errorMessage = data.errorMessage,
              me = this;
            $.messager.alert($.messager.defaults.info, errorMessage,
              'error',
              function () {
                opts.onUploadError.call(me, file, opts, errorMessage);
                opts.onUploadComplete.call(me, file, opts, data);
              });
            this.trigger('_delete.uploadifyItem', file.itemData.itemID);
          } else { //success
            var $queueArea = this.data('filepanel').queueArea,
              $item = $queueArea.children('.uploadify-uploadingItem');
            $item.removeClass('uploadify-uploadingItem').addClass(
              'uploadify-uploadedItem-' + opts.layout);
            $item.children(':last-child').remove();
            $item.find('a').css({
              display: 'inline'
            });

            //默认的绑定
            if (data && data.id) {
              $item.attr('_attachmentId', data.id);
            }
            var map = opts.map;
            if (typeof map === 'function') {
              map($item, data);
            } else {
              for (var p in map) {
                $item.attr(p, data[map[p]]);
              }
            }

            this.trigger('_update.uploadifyItem');

            opts.onUploadSuccess.call(this, file, opts, data);
            opts.onUploadComplete.call(this, file, opts, data);
          }
          //删除为取消而保存的iframe的引用
          delete _$iframe[file.itemData.fileID];
        }
      }
      //全文中 target指原始的input file对象
      // parent指包含input和input file的div
      // realTarget指获得了原始input id的div
      //$realTarget=$parent.parent()=$target.parent().parent()
    function init(target, options) {
      preOptions(options);
      ensureOptions(target, options);

      //包装dom
      $target = $(target);
      $target.wrap('<div class="witui-filepanel"></div>').wrap('<div id="' +
        options.id + '" class="uploadify"></div>').wrap(
        '<div style="float:left;height:' + options.height + 'px;width:' +
        options.width + 'px;"></div>');
      $target.css({
        opacity: 0,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1,
        height: options.height,
        width: options.width,
        padding: '0px 0px',
        margin: '0px 0px',
        border: '0px 0px'
      });

      var $parent = $target.parent();
      $parent.append(
        '<div class="uploadify-button witui-filepanel" style="height:' +
        options.height + 'px;width:' + options.width +
        'px;line-height: 15px;"><span class="uploadify-button-text">' +
        options.buttonText + '</span></div>');
      var $realTarget = $parent.parent();
      //添加队列区域
      var itemsStr = '',
        uploadedItemTemplate;
      if (options.downloadUrl === false) {
        //不绑定下载URL
        uploadedItemTemplate = '<div id="' + options.id +
          '_${_attachmentId}_item" class="uploadify-uploadedItem-' + options.layout +
          '" _attachmentid="${_attachmentId}"> <div class="uploadify-fileName">  <span class="uploadify-attachmentIcon"></span><span class="uploadify-attachmentName">${fileName}</span> <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#' +
          options.id + '\').trigger(\'_delete.uploadifyItem\',\'' + options.id +
          '_${_attachmentId}_item\')">X</a>  </div> </div> ';
      } else {
        uploadedItemTemplate = '<div id="' + options.id +
          '_${_attachmentId}_item" class="uploadify-uploadedItem-' + options.layout +
          '" _attachmentid="${_attachmentId}"> <div class="uploadify-fileName">  <span class="uploadify-attachmentIcon"></span><span class="uploadify-attachmentName"><a class="uploadify-attachmentUrl" href="' +
          options.downloadUrl +
          '?id=${_attachmentId}">${fileName}</a></span> <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#' +
          options.id + '\').trigger(\'_delete.uploadifyItem\',\'' + options.id +
          '_${_attachmentId}_item\')">X</a>  </div> </div> ';
      }
      //添加隐藏的input以维护Id
      if (options.name) {
        $hiddenInput = $('<input name="' + options.name + '" type="hidden"/>')
          .appendTo($realTarget);
      }
      //初始化queueArea中的已上传文件
      if (options.value) {
        var names = options.text,
          ids = options.value;
        itemsStr = _helper.setTemplate(uploadedItemTemplate, {
          _attachmentId: ids,
          fileName: {
            value: names,
            length: options.maxFileNameLength
          }
        }).join('');
        if (options.name) {
          $hiddenInput.val(options.value);
        }
      }
      if (options.queueID) {
        var $queueArea = $('#' + options.queueID);
        if (!$queueArea.attr('class')) {
          $queueArea.addClass('uploadify-queue');
        }
        $queueArea.html(itemsStr);
      } else {
        $realTarget.after('<div id="' + options.id +
          '_queue_area" class="uploadify-queue">' + itemsStr + '</div>');
      }

      //绑定事件
      //delegate可以绑定事件到已经存在或者未来将被添加到dom树中的element
      $parent.delegate('input', 'change', function (event) {
        var $target = $(event.currentTarget),
          files = $target[0].files,
          $realTarget = $target.parent().parent(),
          opts = $realTarget.data('filepanel').options;
        opts.itemId++;
        var fileId = opts.id + '_' + opts.itemId;
        if (files) {
          //input file不支持多选
          var file = files[0];
          if (file) {
            var maxFileNameLength = opts.maxFileNameLength,
              fileName = file.name;

            if (file.name.indexOf())
              file.itemData = {
                fileID: fileId,
                itemID: fileId + '_item',
                instanceID: $realTarget.attr('id'),
                fileName: fileName.length > maxFileNameLength ? fileName.substr(
                  0, maxFileNameLength) + '...' : fileName,
                fileSize: _helper.parseSize(file.size)
              }
          }
        } else { //低版本的ie没有files属性
          var value = $target.val(),
            maxFileNameLength = opts.maxFileNameLength,
            file = {
              ployfill: true //file是否通过ployfill添加进当前环境的
            },
            fileName = file.name = value.substr(value.lastIndexOf('\\') +
              1);
          file.itemData = {
            fileID: fileId,
            itemID: fileId + '_item',
            instanceID: $realTarget.attr('id'),
            fileName: fileName.length > maxFileNameLength ? fileName.substr(
              0, maxFileNameLength) + '...' : fileName
          };
        }

        //js检验文件
        if (_eventHandlers.onSelect.call($realTarget, file, opts)) {
          upload($realTarget, file, opts);
        }
      });
      $realTarget.on('_add.uploadifyItem', function (event, file) {
        var $realTarget = $(event.currentTarget),
          itemData = file.itemData,
          itemTemplate = file.ployfill ? _readOnlyOptions.itemTemplateWithoutFileSize :
          _readOnlyOptions.itemTemplate;
        for (var d in itemData) {
          itemTemplate = itemTemplate.replace(new RegExp('\\$\\{' + d +
            '\\}', 'g'), itemData[d]);
        }

        $realTarget.data('filepanel').queueArea.append(itemTemplate);
      });
      $realTarget.on('_delete.uploadifyItem', function (event, itemId) {
        var $realTarget = $(event.currentTarget),
          opts = $realTarget.data('filepanel').options;
        $('#' + itemId).remove();

        $realTarget.trigger('_update.uploadifyItem');
        opts.onDeleteFile.call($realTarget, opts);
      });
      $realTarget.on('_cancel.uploadifyItem', function (event, fileId) {
        var $realTarget = $(event.currentTarget),
          opts = $realTarget.data('filepanel').options;

        $realTarget.trigger('_delete.uploadifyItem', fileId + '_item');

        //上传是异步的，可能同时有几个任务在上传
        var $iframe = _$iframe[fileId].jq,
          file = _$iframe[fileId].file;
        delete _$iframe[fileId];
        if ($iframe) {
          //必须解绑load事件，才会取消ajax请求。否则光remove，ajax请求仍在继续。
          $iframe.unbind("load");
          $iframe.remove();
          opts.onCancel.call($realTarget, file, opts);
        }
      });
      $realTarget.on('_update.uploadifyItem', function (event) {
        var $realTarget = $(event.currentTarget),
          attachments = [],
          state = $realTarget.data('filepanel'),
          opts = state.options;

        state.queueArea.children().each(function () {
          attachments.push($(this).attr('_attachmentId'));
        });
        //隐藏的input维护返回的id
        $realTarget.children(':last-child').val(attachments.join(','));
      });
      return $realTarget[0];
    }

    function upload($realTarget, file, options) {
      $realTarget.trigger('_add.uploadifyItem', file);
      options.onUploadStart.call($realTarget, file, options);
      var iframeObj = $.ajaxFileUpload({
        url: options.url,
        secureuri: false, //是否需要安全协议一般设置为false
        fileElementId: options.inputId,
        data: $.extend({}, options.formData, {
          //ie下响应设置为 text/plain，
          _mimeType: file.ployfill || $.browser && $.browser.msie  || "ActiveXObject" in window ? 'text/plain' : '',
          _encodeContent: file.ployfill ? true : false
        }),
        dataType: 'json',
        success: function (data, status) {
          _eventHandlers.onUploadComplete.call($realTarget, file,
            options, data, status);
        },
        error: function (xhr, status, e) {
          _eventHandlers.onUploadError.call($realTarget, file, options,
            xhr, status, e);
        }
      });
      _$iframe[file.itemData.fileID] = {
        jq: iframeObj,
        file: file
      };
    }

    function ensureOptions(target, options) {
      var $target = $(target);
      //ajaxfileupload要求input file 必须有ID,name
      if (!options.id) {
        ++_id;
        options.id = 'witui_filepanel_' + _id;
      }
      options.inputId = options.id + '_file';
      options.itemId = 0;
      $target.attr('id', options.inputId);
      if (!options.name) {
        $target.attr('name', options.id + '_Original');
      } else {
        $target.attr('name', options.name + '_Original');
      }
      if (options.fileTypes)
        $target.attr('accept', options.fileTypes);
    }
    //对options进行预处理
    function preOptions(options) {
      if (options.fileSizeLimit)
        options.fileSizeLimitKB = _helper.parseMaxSize(options.fileSizeLimit);
      if (!options.fileTypes && options.fileTypeExts) {
        //接受的以uploadify标准'*.txt;*.js',要转化为'.txt,.js'
        var fileTypes = options.fileTypeExts;
        if (fileTypes) {
          var types = fileTypes.split(';');
          for (var i = 0; i < types.length; i++) {
            var type = types[i];
            types[i] = type.substring(type.lastIndexOf('.'));
          }
          options.fileTypeExts = types.join(',');
          options.fileTypes = types;
        }
      }
      if (options.readonly === true) {
        options.hidden = true;
      }
    }

    function setOptions(realTarget, options) {
      preOptions(options);
      if (options.disabled !== undefined || options.readonly !== undefined) {
        setDisabled(realTarget, options.disabled, options.readonly);
      }
      if (options.hidden !== undefined) {
        setHidden(realTarget, options.hidden);
      }
      var $realTarget = $(realTarget);
      if (options.buttonText) {
        $realTarget.find('.uploadify-button-text').html(options.buttonText);
      }
      $.extend($realTarget.data('filepanel').options, options);
    }

    function setDisabled(realTarget, disabled, readonly) {
      var $realTarget = $(realTarget),
        state = $realTarget.data('filepanel'),
        opts = state.options;

      if (disabled === undefined) {
        readonly = opts.readonly = _helper.isTrue(readonly);
        disable(readonly);
      } else if (readonly === undefined) {
        disabled = opts.disabled = _helper.isTrue(disabled);
        disable(disabled);
        triggleDisableEvent(disabled);
      } else {
        disabled = opts.disabled = _helper.isTrue(disabled);
        readonly = opts.readonly = _helper.isTrue(readonly);
        disable(disabled || readonly);
        triggleDisableEvent(disabled);
      }

      function disable(arg) {
        if (arg) {
          $realTarget.find('#' + opts.inputId).attr('disabled', 'disabled');
          $realTarget.find('.uploadify-button').addClass('disabled');
          state.queueArea.find('.uploadify-btn-delete').css({
            display: 'none'
          });
        } else {
          $realTarget.find('#' + opts.inputId).removeAttr('disabled');
          $realTarget.find('.uploadify-button').removeClass('disabled');
          state.queueArea.find('.uploadify-btn-delete').css({
            display: 'inline'
          });
        }
      }

      function triggleDisableEvent(arg) {
        if (arg) {
          $realTarget.children('input').attr('disabled', 'disabled');
          opts.onDisable.call($realTarget);
        } else {
          $realTarget.children('input').removeAttr('disabled');
          opts.onEnable.call($realTarget);
        }
      }
    };

    function setHidden(realTarget, hidden) {
      var $realTarget = $(realTarget),
        opts = $realTarget.data('filepanel').options;
      if (hidden) {
        opts.hidden = true;
        if (opts.queueID) {
          $realTarget.parent().css({
            display: 'none'
          });
        } else {
          $realTarget.css({
            display: 'none'
          });
        }
      } else {
        opts.hidden = false;
        if (opts.queueID) {
          $realTarget.parent().css({
            display: 'block'
          });
        } else {
          $realTarget.css({
            display: 'block'
          });
        }
      }
    }

    function destroy(realTarget, forceDestroy) {
      var $realTarget = $(realTarget),
        state = $realTarget.data("filepanel"),
        opts = state.options;
      if (forceDestroy != true) {
        if (opts.onBeforeDestroy.call($realTarget) == false) {
          return;
        }
      }
      $realTarget.parent().remove();
      if (opts.queueID) {
        state.queueArea.remove();
      }
      opts.onDestroy.call($realTarget);
    };
    FilePanelAjax.prototype.init = function (options, param) {
      if (typeof options == "string") {
        return FilePanelAjax.prototype.methods[options](this, param);
      }
      options = options || {};
      return this.each(function () {
        var state = $.data(this, "filepanel"),
          opts;
        if (state) {
          opts = $.extend(state.options, options, _readOnlyOptions);
          setOptions(this, opts);
        } else {
          opts = $.extend({}, $.fn.filepanel.defaults, $.fn.filepanel.parseOptions(
            this), options, _readOnlyOptions);
          var $target = $('<input type="file" />');
          $(this).replaceWith($target);
          target = $target[0];

          var newThis = init(target, opts);
          state = $.data(newThis, "filepanel", {
            options: opts,
            filepanel: $(newThis),
            queueArea: opts.queueID ? $('#' + opts.queueID) : $(
              newThis).next()
          });
          setDisabled(newThis, opts.disabled, opts.readonly);
          if (opts.hidden) {
            setHidden(newThis, true);
          }
        }
      });
    };
    FilePanelAjax.prototype.parseOptions = function (target) {
      var $target = $(target),
        opts = $.extend({}, $.parser.parseOptions(target, ['id', 'name',
          'value', 'text'
        ]), {
          readonly: $target.attr('readonly') ? true : undefined,
          disabled: $target.attr('disabled') ? true : undefined,
          hidden: $target.attr('hidden') ? true : undefined
        }),
        type = $(target).attr('accept');
      if (type) {
        opts.fileTypeExts = type;
        opts.fileTypes = type.split(',')
      }
      return opts;
    };
    FilePanelAjax.prototype.methods = {
      options: function (jq) {
        return $.data(jq[0], "filepanel").options;
      },
      filepanel: function (jq) {
        return $.data(jq[0], "filepanel").filepanel;
      },
      setFormData: function (jq, param) {
        return jq.each(function () {
          $.data(this, 'filepanel').options.formData = param;
        });
      },
      readonly: function (jq, param) {
        return jq.each(function () {
          setDisabled(this, undefined, param);
        });
      },
      disable: function (jq) {
        return jq.each(function () {
          setDisabled(this, true);
        })
      },
      enable: function (jq) {
        return jq.each(function () {
          setDisabled(this, false);
        });
      },
      hiddenButton: function (jq, hidden) {
        return jq.each(function () {
          setHidden(this, hidden);
        });
      },
      destroy: function (jq, param) {
        return jq.each(function () {
          destroy(this, param);
        });
      }
    };
  }

  //根据当前浏览器选择合适的插件实现
  var uploader;

  $.fn.filepanel = function () {
    if (!uploader) {
      if (_helper.flashChecker()) {
        uploader = new FilePanel();
      } else {
        uploader = new FilePanelAjax();
      }
      $.fn.filepanel.methods = uploader.methods;
    }
    return uploader.init.apply(this, arguments);
  };
  $.fn.filepanel.parseOptions = function () {
    if (!uploader) {
      if (_helper.flashChecker()) {
        uploader = new FilePanel();
      } else {
        uploader = new FilePanelAjax();
      }
      $.fn.filepanel.methods = uploader.methods;
    }
    return uploader.parseOptions.apply(this, arguments);
  };

  $.fn.filepanel.defaults = {
    id: null,
    name: null,
    value: null,
    text: null,
    width: '70',
    height: '15',
    queueID: null,
    disabled: undefined,
    readonly: undefined,
    hidden: undefined,
    url: $.context.virtualPath + 'controls/attachment/upload',
    downloadUrl: $.context.virtualPath + 'controls/attachment/download', //如果传false，则将已上传文件显示为纯文本。
    buttonText: 'SELECT FILES',
    maxFileNameLength: 25,
    queueSizeLimit: 10,
    fileSizeLimit: '10MB',
    fileTypeDesc: 'All Files',
    fileTypeExts: '*.*',
    layout: 'horizontal', //上传完成的项在div的布局方式，支持horizontal和vertical
    formData: {},
    map: {},
    onCancel: function () {},
    onBeforeDestroy: function () {},
    onDestroy: function () {},
    onDisable: function () {},
    onEnable: function () {},
    onSelect: function () {},
    onSelectError: function () {},
    onUploadStart: function () {},
    onUploadError: function () {},
    onUploadSuccess: function () {},
    onUploadComplete: function () {},
    onDialogClose: function () {},
    onDeleteFile: function () {}
  };

  if ($.parser && $.parser.wituiPlugins) {
    $.parser.wituiPlugins.push('filepanel');
  }
})(jQuery);
﻿
(function ($) {
  var _helper = $.uploadifyHelper;

  function FileBox() {
    var _id = 0,
      _readOnlyOptions = {
        auto: true,
        multi: false,
        method: 'post',
        debug: false,
        requeueErrors: false,
        removeTimeout: 0,
        removeCompleted: true,
        buttonClass: 'witui-filebox',
        overrideEvents: ['onSelectError', 'onDialogClose', 'onUploadError',
          'onUploadComplete'
        ],
        swf: $.context.virtualPath + 'Scripts/third-party/uploadify.swf',
        itemTemplate: '<div id="${fileID}_item" class="uploadify-uploadingItem"><div class="uploadify-fileName" style="display:none">    <span class="uploadify-attachmentIcon"></span><span class="uploadify-attachmentName">${fileName}(${fileSize})</span><a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#${instanceID}\').trigger(\'_delete.uploadifyItem\',\'${fileID}_item\')" >X</a>   </div> <div id="${fileID}" class="uploadify-queue-item"> <span class="data uploadify-dataComplete"></span> <div class="uploadify-progress"> <div class="uploadify-progress-bar"></div> </div> <div class="uploadify-cancel"> <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')">X</a> </div> </div> </div> '
      };
    //包装事件，有一些效果是添加在uploadify的事件中的。
    var _overrideEventHandlers = {
      //屏蔽uploadify的原生事件
      onDisable: function () {},
      onEnable: function () {},
      onDestroy: function () {},
      //
      onSWFReady: function () {
        var settings = this.settings,
          $realTarget = $('#' + settings.id),
          opts = $realTarget.data('filebox').options;
        if (opts.disabled || opts.readonly) {
          setDisabled($realTarget[0], opts.disabled, opts.readonly);
        }
      },
      //
      onCancel: function (file) {
        //取消upload的时候删除文件名
        $('#' + file.id).parent().remove();

        var settings = this.settings,
          $realTarget = $('#' + settings.id),
          opts = $realTarget.data('filebox').options;
        //还原上传按钮
        $realTarget.trigger('_delete.uploadifyItem');
        opts.onCancel.call($realTarget, file, opts);
      },
      onSelect: function (file) {
        var settings = this.settings,
          $realTarget = $('#' + settings.id),
          opts = $realTarget.data('filebox').options;
        opts.onSelect.call($realTarget, file, opts);
      },
      onSelectError: function (file, errorCode, errorMsg) {
        var settings = this.settings,
          $realTarget = $('#' + settings.id),
          opts = $realTarget.data('filebox').options,
          errorMsgs = opts.errorMsgs,
          msg = errorMsgs.addFileFailed;
        switch (errorCode) {
          case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
            msg = S(errorMsgs.tooLarge).template({
              name: file.name,
              sizeLimit: settings.fileSizeLimit
            }).s;
            break;
          case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
            msg = S(errorMsgs.cannotBeEempty).template({
              name: file.name
            }).s;
            break;
          case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
            msg = S(errorMsgs.fileTypeInvalid).template({
              name: file.name,
              fileTypeDesc: settings.fileTypeDesc
            }).s;
            break;
        }
        this.queueData.errorMsg = msg;

        $.messager.alert($.messager.defaults.info, msg, 'error', function () {
          opts.onSelectError.call($realTarget, file, opts, msg);
        });
      },
      onDialogClose: function (queueData) {
        var settings = this.settings,
          $realTarget = $('#' + settings.id),
          opts = $realTarget.data('filebox').options;
        //隐藏上传文件控件
        if (queueData.queueLength > 0) {
          //这里不能直接把swfobject的display：none，这样会无法上传
          //目前是把该div的绝对位置设置到-1000,-1000.
          $realTarget.css({
            position: 'absolute',
            top: -1000,
            left: -1000
          });
          $realTarget.prev().css({
            display: 'none'
          });
        }
        opts.onDialogClose.call($realTarget, queueData);
      },
      onUploadStart: function (file) {
        var settings = this.settings,
          $realTarget = $('#' + settings.id),
          opts = $realTarget.data('filebox').options;
        opts.onUploadStart.call($realTarget, file, opts);
      },
      onUploadSuccess: function (file, data, response) {
        var settings = this.settings,
          $realTarget = $('#' + settings.id),
          opts = $realTarget.data('filebox').options;
        if (typeof data === 'string' && /^{/.test(data)) {
          try {
            data = $.parseJSON(data);
          } catch (e) {
            data = {
              errorMessage: e.Message
            }
          }
        } else {
          data = {
            errorMessage: opts.errorMsgs.failed
          }
        }
        this.data = data;
      },
      onUploadError: function (file, errorCode, errorMsg, errorString) {
        var settings = this.settings,
          $realTarget = $('#' + settings.id),
          opts = $realTarget.data('filebox').options,
          errorMsgs = opts.errorMsgs,
          msg = errorMsgs.failed;
        switch (errorCode) {
          case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
            msg = errorMsgs.httpError;
            break;
          case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
            msg = errorMsgs.cannotFoundUrl;
            break;
          case SWFUpload.UPLOAD_ERROR.IO_ERROR:
            msg = errorMsgs.IOError;
            break;
          case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
            msg = errorMsgs.securityError;
            break;
          case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
            msg = errorMsgs.exceedLimit;
            break;
          case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
            break;
          case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
            msg = errorMsgs.validationError;
            break;
          case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
            msg = errorMsgs.stopped;
            break;
        }
        this.data = {
          errorMessage: msg
        }
      },
      onUploadComplete: function (file) {
        var settings = this.settings,
          swfuploadify = this,
          data = this.data,
          me = this,
          $realTarget = $('#' + settings.id),
          opts = $realTarget.data('filebox').options;

        delete this.data;

        var func = function () {
          swfuploadify.queueData.queueSize -= file.size;
          swfuploadify.queueData.queueLength -= 1;

          delete swfuploadify.queueData.files[file.id];

          $('#' + file.id).remove();

          if (data.errorMessage) {
            var errorMessage = data.errorMessage;
            $.messager.alert($.messager.defaults.info, errorMessage,
              'error',
              function () {
                opts.onUploadError.call($realTarget, file, opts,
                  errorMessage);
                opts.onUploadComplete.call($realTarget, file, opts,
                  data);
              });
            //还原上传按钮
            $realTarget.trigger('_delete.uploadifyItem');
          } else {
            //绑定upload返回的数据到dom中
            var $item = $('#' + file.id + '_item')
            $item.removeClass('uploadingItem').addClass('uploadedItem');
            //默认的绑定
            if (data && data.id) {
              $item.attr('_attachmentId', data.id);
            }

            var map = opts.map;
            if (typeof map === 'function') {
              map($item, data);
            } else {
              for (var p in map) {
                $item.attr(p, data[map[p]]);
              }
            }
            //更新隐藏input的值
            $realTarget.trigger('_update.uploadifyItem');

            //上传成功显示删除按钮
            $item.children().css({
              display: 'inline'
            });

            opts.onUploadSuccess.call($realTarget, file, opts, data);
            opts.onUploadComplete.call($realTarget, file, opts, data);
          }
        }
        if (settings.removeCompleted) {
          switch (file.filestatus) {
            case SWFUpload.FILE_STATUS.COMPLETE:
              setTimeout(function () {
                if ($('#' + file.id)) {
                  func();
                }
              }, settings.removeTimeout * 1000);
              break;
            case SWFUpload.FILE_STATUS.ERROR:
              if (!settings.requeueErrors) {
                setTimeout(function () {
                  if ($('#' + file.id)) {
                    func();
                  }
                }, settings.removeTimeout * 1000);
              }
              break;
          }
        } else {
          file.uploaded = true;
        }
      }
    }

    //全文中 target指原始的input file对象
    // parent指包含input和input file的div
    // realTarget指获得了原始input id的div,也就是uploadify生成的最外层的div.可以直接对其调用uploadify的方法
    //$realTarget=$parent.parent()=$target.parent().parent()

    //调用uploadify
    function create(target, options) {
      preOptions(options);
      ensureOptions(target, options);

      var $target = $(target);
      $target.wrap('<div class="witui-filebox"></div>');
      //options中事件记录的是用户指定的事件，而settings中事件是在此插件中包装过的事件
      var settings = getSettings(options);
      $(target).uploadify(settings);
    };
    //
    function init($realTarget, options) {
      //添加队列区域
      var queueArea = '<div id="' + options.queueID +
        '" class="uploadify-queue">',
        uploadedItemTemplate;
      if (options.downloadUrl === false) {
        //不绑定下载URL
        uploadedItemTemplate = '<div id="' + options.id +
          '_${_attachmentId}_item" class="uploadify-uploadedItem" _attachmentid="${_attachmentId}"><div class="uploadify-fileName">  <span class="uploadify-attachmentIcon"></span><span class="uploadify-attachmentName">${fileName}</span><a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#' +
          options.id + '\').trigger(\'_delete.uploadifyItem\',\'' + options.id +
          '_${_attachmentId}_item\')" >X</a> </div></div> ';
      } else {
        uploadedItemTemplate = '<div id="' + options.id +
          '_${_attachmentId}_item" class="uploadify-uploadedItem" _attachmentid="${_attachmentId}"><div class="uploadify-fileName">  <span class="uploadify-attachmentIcon"></span><span class="uploadify-attachmentName"><a class="uploadify-attachmentUrl" href="' +
          options.downloadUrl +
          '?id=${_attachmentId}">${fileName}</a></span><a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#' +
          options.id + '\').trigger(\'_delete.uploadifyItem\',\'' + options.id +
          '_${_attachmentId}_item\')" >X</a> </div></div> ';
      }
      //添加隐藏的input以维护Id
      if (options.name) {
        $hiddenInput = $('<input name="' + options.name + '" type="hidden"/>')
          .appendTo($realTarget);
      }
      //添加上传按钮前面的input
      if (options.inputWidth && options.inputHeight) {
        if (options.required) {
          $realTarget.before(
            '<div style="float:left;"><input type="text" style="width:' +
            options.inputWidth + 'px;height:' + options.inputHeight +
            'px;" class="uploadify-fakeFileName validatebox-invalid" readonly="readonly"></div>'
          );
        } else {
          $realTarget.before(
            '<div style="float:left;"><input type="text" style="width:' +
            options.inputWidth + 'px;height:' + options.inputHeight +
            'px;" class="uploadify-fakeFileName" readonly="readonly"></div>'
          );
        }
      }
      //初始化queueArea中的已上传文件
      if (options.value) {
        //隐藏上传按钮
        $realTarget.css({
          position: 'absolute',
          top: -1000,
          left: -1000
        });
        $realTarget.prev().css({
          display: 'none'
        });

        var names = options.text,
          ids = options.value,
          maxFileNameLength = options.maxFileNameLength;
        queueArea += _helper.setTemplate(uploadedItemTemplate, {
          _attachmentId: ids,
          fileName: {
            value: names,
            length: maxFileNameLength
          }
        }).join('') + '</div>';
        if (options.name) {
          $hiddenInput.val(options.value);
        }
      }
      $realTarget.after(queueArea);


      //绑定事件
      $realTarget.on('_delete.uploadifyItem', function (event, itemId) {
        var $realTarget = $(event.currentTarget),
          opts = $realTarget.data('filebox').options;
        $('#' + itemId).remove();
        $realTarget.css({
          position: 'relative',
          top: 0,
          left: 0
        });
        $realTarget.prev().css({
          display: 'block'
        });

        $realTarget.trigger('_update.uploadifyItem');
        opts.onDeleteFile.call($realTarget, opts);
      });
      $realTarget.on('_update.uploadifyItem', function (event) {
        var $realTarget = $(event.currentTarget),
          attachments = [],
          opts = $realTarget.data('filebox').options;
        $realTarget.next().children().each(function () {
          attachments.push($(this).attr('_attachmentId'));
        });
        //隐藏的input维护返回的id
        $realTarget.children(':last-child').val(attachments.join(','));
      });
    }
    //对options的检验，只执行一次
    function ensureOptions(target, options) {
      var $target = $(target);
      //uploadify要求其承载的input必须有ID
      if (!options.id) {
        ++_id;
        options.id = 'witui_filebox_' + _id;
      }
      $target.attr('id', options.id);

      if (options.name) {
        $target.attr('name', options.name + '_Original');
      }
      if (!options.queueID) options.queueID = target.id + '_queue_area';
    }
    //对options的预处理，在SetOptions中需要复用
    function preOptions(options) {
      if (options.url) {
        options.uploader = options.url;
      }
    }

    function getSettings(options) {
      var settings = $.extend({}, options, _overrideEventHandlers);
      settings.width = options.buttonWidth;
      settings.height = options.buttonHeight;
      return settings;
    }

    function setOptions(realTarget, options) {
      preOptions(options);

      if (options.disabled !== undefined || options.readonly !== undefined) {
        setDisabled(realTarget, options.disabled, options.readonly);
      }
      var $realTarget = $(realTarget);
      if (options.required !== undefined) {
        if (options.required) {
          $realTarget.prev().children('.uploadify-fakeFileName').addClass(
            'validatebox-invalid');
        } else {
          $realTarget.prev().children('.uploadify-fakeFileName').removeClass(
            'validatebox-invalid');
        }
      }
      if (options.inputWidth) {
        $realTarget.prev().children('.uploadify-fakeFileName').css({
          width: options.inputWidth
        });
      }
      if (options.inputHeight) {
        $realTarget.prev().children('.uploadify-fakeFileName').css({
          height: options.inputHeight
        });
      }
      if (options.buttonWidth) {
        $realTarget.find('.uploadify-button').css({
          width: options.buttonWidth
        });
      }
      if (options.buttonHeight) {
        $realTarget.find('.uploadify-button').css({
          height: options.buttonHeight
        });
      }
      var settings = getSettings(options);
      for (var name in settings) {
        $realTarget.uploadify('settings', name, settings[name]);
      }
    }

    function setDisabled(realTarget, disabled, readonly) {
      var $realTarget = $(realTarget),
        opts = $realTarget.data('filebox').options;
      if (disabled === undefined) {
        readonly = opts.readonly = _helper.isTrue(readonly);
        disable(readonly);
      } else if (readonly === undefined) {
        disabled = opts.disabled = _helper.isTrue(disabled);
        disable(disabled);
        triggleDisableEvent(disabled);
      } else {
        disabled = opts.disabled = _helper.isTrue(disabled);
        readonly = opts.readonly = _helper.isTrue(readonly);
        disable(disabled || readonly);
        triggleDisableEvent(disabled);
      }

      function disable(arg) {
        if (arg) {
          $realTarget.uploadify('disable', true);
          //$realTarget.find('.uploadify-button-text').addClass('disabled');
          $realTarget.next().find('.uploadify-btn-delete').css({
            display: 'none'
          });
        } else {
          $realTarget.uploadify('disable', false);
          //$realTarget.find('.uploadify-button-text').removeClass('disabled');
          $realTarget.next().find('.uploadify-btn-delete').css({
            display: 'inline'
          });
        }

      }

      function triggleDisableEvent(arg) {
        if (arg) {
          $realTarget.children('input').attr('disabled', 'disabled');
          opts.onDisable.call($realTarget);
        } else {
          $realTarget.children('input').removeAttr('disabled');
          opts.onEnable.call($realTarget);
        }
      }
    };

    function destroy(realTarget, forceDestroy) {
      var opts = $.data(realTarget, "filebox").options,
        $realTarget = $(realTarget);
      if (forceDestroy != true) {
        if (opts.onBeforeDestroy.call($realTarget) == false) {
          return;
        }
      }
      $realTarget.parent().remove();
      opts.onDestroy.call($realTarget);
    };

    FileBox.prototype.init = function (options, param) {
      if (typeof options == "string") {
        return FileBox.prototype.methods[options](this, param);
      }
      options = options || {};
      //setTimeout解决chrome下崩溃的问题
      var me = this;
      return setTimeout(function () {
        me.each(function () {
          var state = $.data(this, "filebox");
          var opts;
          if (state) {
            opts = $.extend(state.options, options,
              _readOnlyOptions);
            setOptions(this, opts);
          } else {
            //最终在一开始时存在的input标签（也就是这里的this），会在uploadify中被替换为div。那么这些保存在$.data中的数据也就再无法获得了。
            //替换this指针,指向uploadify替换过的div，$.data保存到这里面去
            opts = $.extend({}, $.fn.filebox.defaults, $.fn.filebox
              .parseOptions(this), options, _readOnlyOptions);
            var $target = $('<input type="file" />');
            $(this).replaceWith($target);
            target = $target[0];

            create(target, opts);
            var $realTarget = $('#' + opts.id);
            state = $realTarget.data("filebox", {
              options: opts,
              filebox: $realTarget
            });
            init($realTarget, opts);
            //初始状态的disabled和readonly在onSWFReady中设置。因为uploadify的disable方法必须在SWF加载完成之后才能执行。
            // setDisabled(newThis, opts.disabled);
          }
        });
      }, 10);
    }
    FileBox.prototype.parseOptions = function (target) {
      var $target = $(target);
      return $.extend({}, $.parser.parseOptions(target, ['id', 'name',
        'value', 'text'
      ]), {
        readonly: $target.attr('readonly') ? true : undefined,
        disabled: $target.attr('disabled') ? true : undefined
      });
    }
    FileBox.prototype.methods = {
      options: function (jq) {
        return $.data(jq[0], "filebox").options;
      },
      filebox: function (jq) {
        return $.data(jq[0], "filebox").filebox;
      },
      setFormData: function (jq, param) {
        return jq.each(function () {
          $.data(this, 'filebox').options.formData = param;
        });
      },
      disable: function (jq) {
        return jq.each(function () {
          setDisabled(this, true);
        })
      },
      enable: function (jq) {
        return jq.each(function () {
          setDisabled(this, false);
        });
      },
      destroy: function (jq, param) {
        return jq.each(function () {
          destroy(this, param);
        });
      }
    }
  }

  function FileBoxAjax() {
    //ajax上传附件
    var _id = 0,
      _$iframe = {}, //用来保存每次提交请求的iframe，取消的时候会用到
      _readOnlyOptions = {
        itemTemplate: '<div id="${fileID}_item" class="uploadify-uploadingItem"><div class="uploadify-fileName">    <span class="uploadify-attachmentIcon"></span>    <span class="uploadify-attachmentName">${fileName}(${fileSize})</span>    <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#${instanceID}\').trigger(\'_delete.uploadifyItem\',\'${fileID}_item\')" style="display:none">X</a>   </div>   <div id="${fileID}" class="uploadify-queue-item">     <span class="uploadify-loading"></span>    <div class="uploadify-cancel">      <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#${instanceID}\').trigger(\'_cancel.uploadifyItem\',\'${fileID}\')">X</a>     </div>   </div>  </div>    ',
        itemTemplateWithoutFileSize: '<div id="${fileID}_item" class="uploadify-uploadingItem"><div class="uploadify-fileName">    <span class="uploadify-attachmentIcon"></span>    <span class="uploadify-attachmentName">${fileName}</span>    <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#${instanceID}\').trigger(\'_delete.uploadifyItem\',\'${fileID}_item\')" style="display:none">X</a>   </div>   <div id="${fileID}" class="uploadify-queue-item">     <span class="uploadify-loading"></span>    <div class="uploadify-cancel">      <a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#${instanceID}\').trigger(\'_cancel.uploadifyItem\',\'${fileID}\')">X</a>     </div>   </div>  </div>    '
      },
      _errorCode = {
        fileTypeInvalid: 100,
        fileSizeExceed: 101,
        emptyFile: 102
      };
    //包装事件，有一些效果是添加在uploadify的事件中的。
    var _eventHandlers = {
        //return bool true则上传，false则不会上传。
        onSelect: function (file, opts) {
          //对文件进行检验
          var errorCode,
            errorMsgs = opts.errorMsgs,
            msg = errorMsgs.addFileFailed;
          if (!_helper.fileTypeChecker(file.name, opts.fileTypes)) {
            errorCode = _errorCode.fileTypeInvalid;
            msg = S(errorMsgs.fileTypeInvalid).template({
              name: file.name,
              fileTypeDesc: opts.fileTypeDesc
            }).s;
          }
          //不是浏览器自身实现的,无法检查size
          if (!file.ployfill) {
            if (file.size > opts.fileSizeLimitKB) {
              errorCode = _errorCode.fileSizeExceed;
              msg = S(errorMsgs.tooLarge).template({
                name: file.name,
                sizeLimit: opts.fileSizeLimit
              }).s;
            }
            if (file.size === 0) {
              errorCode = _errorCode.emptyFile;
              msg = S(errorMsgs.cannotBeEempty).template({
                name: file.name
              }).s;
            }
          }
          if (errorCode) {
            _eventHandlers.onSelectError.call(this, file, opts, errorCode,
              msg);
            return false;
          }
          if (opts.onSelect.call(this, file, opts) === false) {
            return false;
          }
          return true;
        },
        onSelectError: function (file, opts, errorCode, errorMsg) {
          var me = this;
          $.messager.alert($.messager.defaults.info, errorMsg, 'error',
            function () {
              opts.onSelectError.call(me, file, opts, errorMsg);
            });
        },
        onUploadError: function (file, opts, xhr, status, e) {
          var msg = opts.errorMsgs.failed;
          if (e && e.message !== '500') {
            msg = e.message;
          }
          _eventHandlers.onUploadComplete.call(this, file, opts, {
            errorMessage: msg
          });
        },
        //不论成功还是失败都会调用
        //status有两个值 error success(是http请求的success和error),是ajaxfileupload进行的赋值
        onUploadComplete: function (file, opts, data) {
          if (data.errorMessage) { //error
            var errorMessage = data.errorMessage,
              me = this;
            $.messager.alert($.messager.defaults.info, errorMessage,
              'error',
              function () {
                opts.onUploadError.call(me, file, opts, errorMessage);
                opts.onUploadComplete.call(me, file, opts, data);
              });
            this.trigger('_delete.uploadifyItem', file.itemData.fileID +
              '_item');
          } else { //success
            var $queueArea = this.next(),
              $item = $queueArea.children('.uploadify-uploadingItem');
            $item.removeClass('uploadify-uploadingItem').addClass(
              'uploadify-uploadedItem');
            $item.children(':last-child').remove();
            $item.find('a').css({
              display: 'inline'
            });

            //默认的绑定
            if (data && data.id) {
              $item.attr('_attachmentId', data.id);
            }
            var map = opts.map;
            if (typeof map === 'function') {
              map($item, data);
            } else {
              for (var p in map) {
                $item.attr(p, data[map[p]]);
              }
            }

            this.trigger('_update.uploadifyItem');

            opts.onUploadSuccess.call(this, file, opts, data);
            opts.onUploadComplete.call(this, file, opts, data);
          }

          //上传完成则删除为取消保存的iframe的引用
          delete _$iframe[file.itemData.fileID];
        }
      }
      //全文中 target指原始的input file对象
      // parent指包含input和input file的div
      // realTarget指获得了原始input id的div
      //$realTarget=$parent.parent()=$target.parent().parent()
    function init(target, options) {
      preOptions(options);
      ensureOptions(target, options);

      //包装dom
      var $target = $(target);
      $target.wrap('<div class="witui-filebox"></div>').wrap('<div id="' +
        options.id + '" class="uploadify"></div>').wrap(
        '<div style="float:left"></div>');
      var $parent = $target.parent();
      $parent.append(
        '<div class="uploadify-button witui-filebox" style="height:' +
        options.buttonHeight + 'px;width:' + options.buttonWidth +
        'px;"><span class="uploadify-button-text">' + options.buttonText +
        '</span></div>');
      var $realTarget = $parent.parent();

      //添加队列区域
      var queueArea = '<div id="' + options.id +
        '_queue_area" class="uploadify-queue">',
        uploadedItemTemplate;
      if (options.downloadUrl === false) {
        //不绑定下载URL
        uploadedItemTemplate = '<div id="' + options.id +
          '_${_attachmentId}_item" class="uploadify-uploadedItem" _attachmentid="${_attachmentId}"><div class="uploadify-fileName">  <span class="uploadify-attachmentIcon"></span><span class="uploadify-attachmentName">${fileName}</span><a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#' +
          options.id + '\').trigger(\'_delete.uploadifyItem\',\'' + options.id +
          '_${_attachmentId}_item\')" >X</a> </div></div> ';
      } else {
        uploadedItemTemplate = '<div id="' + options.id +
          '_${_attachmentId}_item" class="uploadify-uploadedItem" _attachmentid="${_attachmentId}"><div class="uploadify-fileName">  <span class="uploadify-attachmentIcon"></span><span class="uploadify-attachmentName"><a class="uploadify-attachmentUrl" href="' +
          options.downloadUrl +
          '?id=${_attachmentId}">${fileName}</a></span><a class="uploadify-btn-delete" href="javascript:void(0)" onclick="$(\'#' +
          options.id + '\').trigger(\'_delete.uploadifyItem\',\'' + options.id +
          '_${_attachmentId}_item\')" >X</a> </div></div> ';
      }
      //添加隐藏的input以维护Id
      if (options.name) {
        $hiddenInput = $('<input name="' + options.name + '" type="hidden"/>')
          .appendTo($realTarget);
      }
      //添加上传按钮前面的input
      if (options.inputWidth && options.inputHeight) {
        if (options.required) {
          $parent.before(
            '<div style="float:left;"><input type="text" style="width:' +
            options.inputWidth + 'px;height:' + options.inputHeight +
            'px;" class="uploadify-fakeFileName validatebox-invalid" readonly="readonly"></div>'
          );
        } else {
          $parent.before(
            '<div style="float:left;"><input type="text" style="width:' +
            options.inputWidth + 'px;height:' + options.inputHeight +
            'px;" class="uploadify-fakeFileName" readonly="readonly"></div>'
          );
        }
      }
      //初始化queueArea中的已上传文件
      if (options.value) {
        //隐藏上传按钮
        $realTarget.css({
          display: 'none'
        });

        var names = options.text,
          ids = options.value,
          maxFileNameLength = options.maxFileNameLength;
        queueArea += _helper.setTemplate(uploadedItemTemplate, {
          _attachmentId: ids,
          fileName: {
            value: names,
            length: maxFileNameLength
          }
        }).join('') + '</div>';
        if (options.name) {
          $hiddenInput.val(options.value);
        }
      }
      $realTarget.after(queueArea);
      $target.css({
        opacity: 0,
        position: 'absolute',
        zIndex: 1,
        height: options.buttonHeight,
        width: options.buttonWidth
      });

      //绑定事件
      //delegate可以绑定事件到已经存在或者未来将被添加到dom树中的element
      $parent.delegate('input', 'change', function (event) {
        var $target = $(event.currentTarget),
          files = $target[0].files,
          $realTarget = $target.parent().parent(),
          opts = $realTarget.data('filebox').options;
        opts.itemId++;
        var fileId = opts.id + '_' + opts.itemId;
        if (files) {
          //input file不支持多选
          var file = files[0],
            maxFileNameLength = opts.maxFileNameLength;
          if (file) {
            file.itemData = {
              fileID: fileId,
              itemID: fileId + '_item',
              instanceID: $realTarget.attr('id'),
              fileName: file.name.length > maxFileNameLength ? file.name
                .substr(0, maxFileNameLength) + '...' : file.name,
              fileSize: _helper.parseSize(file.size)
            }
          }
        } else { //低版本的ie(比如ie8)没有files属性
          var value = $target.val(),
            maxFileNameLength = opts.maxFileNameLength,
            file = {
              ployfill: true //file是否通过ployfill添加进当前环境的
            },
            fileName = file.name = value.substr(value.lastIndexOf('\\') +
              1);
          file.itemData = {
            fileID: fileId,
            itemID: fileId + '_item',
            instanceID: $realTarget.attr('id'),
            fileName: fileName.length > maxFileNameLength ? fileName.substr(
              0, maxFileNameLength) + '...' : fileName
          };
        }

        //js检验文件
        if (_eventHandlers.onSelect.call($realTarget, file, opts)) {
          upload($realTarget, file, opts);
        }
      });
      $realTarget.on('_add.uploadifyItem', function (event, file) {
        var $realTarget = $(event.currentTarget),
          itemData = file.itemData,
          itemTemplate = file.ployfill ? _readOnlyOptions.itemTemplateWithoutFileSize :
          _readOnlyOptions.itemTemplate;
        $realTarget.css({
          display: 'none'
        }); //.prev().css({display:'none'});
        for (var d in itemData) {
          itemTemplate = itemTemplate.replace(new RegExp('\\$\\{' + d +
            '\\}', 'g'), itemData[d]);
        }

        $realTarget.next().append(itemTemplate);
      });
      $realTarget.on('_delete.uploadifyItem', function (event, itemId) {
        var $realTarget = $(event.currentTarget),
          opts = $realTarget.data('filebox').options;

        $('#' + itemId).remove();
        $realTarget.css({
          display: 'block'
        });

        $realTarget.trigger('_update.uploadifyItem');
        opts.onDeleteFile.call($realTarget, opts);
      });
      $realTarget.on('_cancel.uploadifyItem', function (event, fileId) {
        var $realTarget = $(event.currentTarget),
          opts = $realTarget.data('filebox').options;

        $realTarget.trigger('_delete.uploadifyItem', fileId + '_item');
        //异步的，可能同时有几个任务在上传
        var $iframe = _$iframe[fileId].jq,
          file = _$iframe[fileId].file;
        delete _$iframe[fileId];
        if ($iframe) {
          //必须解绑load事件，才会取消ajax请求。否则光remove，ajax请求仍在继续。
          $iframe.unbind("load");
          $iframe.remove();
          opts.onCancel.call($realTarget, file, opts);
        }
      });
      $realTarget.on('_update.uploadifyItem', function (event) {
        var $realTarget = $(event.currentTarget),
          attachments = [],
          opts = $realTarget.data('filebox').options;
        $realTarget.next().children().each(function () {
          attachments.push($(this).attr('_attachmentId'));
        });
        //隐藏的input维护返回的id
        $realTarget.children(':last-child').val(attachments.join(','));
      });
      return $realTarget[0];
    }

    function upload($realTarget, file, options) {
      $realTarget.trigger('_add.uploadifyItem', file);
      options.onUploadStart.call($realTarget, file, options);
      var iframeObj = $.ajaxFileUpload({
        url: options.url,
        secureuri: false, //是否需要安全协议一般设置为false
        fileElementId: options.inputId,
        data: $.extend({}, options.formData, {
          _mimeType: file.ployfill || $.browser && $.browser.msie  || "ActiveXObject" in window ? 'text/plain' : '',
          _encodeContent: file.ployfill ? true : false
        }),
        dataType: 'json',
        success: function (data, status) {
          _eventHandlers.onUploadComplete.call($realTarget, file,
            options, data, status);
        },
        error: function (xhr, status, e) {
          _eventHandlers.onUploadError.call($realTarget, file, options,
            xhr, status, e);
        }
      });
      _$iframe[file.itemData.fileID] = {
        jq: iframeObj,
        file: file
      };
    }

    function ensureOptions(target, options) {
      var $target = $(target);
      //ajaxfileupload要求input file 必须有ID,name
      if (!options.id) {
        ++_id;
        options.id = 'witui_filebox_' + _id;
      }
      options.inputId = options.id + '_file';
      options.itemId = 0;
      $target.attr('id', options.inputId);
      if (!options.name) {
        $target.attr('name', options.id + '_Original');
      } else {
        $target.attr('name', options.name + '_Original');
      }
      if (options.fileTypes)
        $target.attr('accept', options.fileTypes);
    }

    function preOptions(options) {
      if (options.fileSizeLimit)
        options.fileSizeLimitKB = _helper.parseMaxSize(options.fileSizeLimit);
      if (!options.fileTypes && options.fileTypeExts) {
        //接受的以uploadify标准'*.txt;*.js',要转化为'.txt,.js'
        var fileTypes = options.fileTypeExts;
        if (fileTypes) {
          var types = fileTypes.split(';');
          for (var i = 0; i < types.length; i++) {
            var type = types[i];
            types[i] = type.substring(type.lastIndexOf('.'));
          }
          options.fileTypeExts = types.join(',');
          options.fileTypes = types;
        }
      }
    }

    function setOptions(realTarget, options) {
      preOptions(options);
      if (options.disabled !== undefined || options.readonly !== undefined) {
        setDisabled(realTarget, options.disabled, options.readonly);
      }
      var $realTarget = $(realTarget);
      if (options.buttonText) {
        $realTarget.find('.uploadify-button-text').html(options.buttonText);
      }
      if (options.required !== undefined) {
        if (options.required) {
          $realTarget.find('.uploadify-fakeFileName').addClass(
            'validatebox-invalid');
        } else {
          $realTarget.find('.uploadify-fakeFileName').removeClass(
            'validatebox-invalid');
        }
      }
      if (options.inputWidth) {
        $realTarget.prev().find('.uploadify-fakeFileName').css({
          width: options.inputWidth
        });
      }
      if (options.inputHeight) {
        $realTarget.prev().find('.uploadify-fakeFileName').css({
          height: options.inputHeight
        });
      }
      if (options.buttonWidth) {
        $button = $realTarget.find('.uploadify-button');
        $button.css({
          width: options.buttonWidth
        }).prev().css({
          width: options.buttonWidth
        });
      }
      if (options.buttonHeight) {
        $button = $realTarget.find('.uploadify-button');
        $button.css({
          height: options.buttonHeight
        }).prev().css({
          height: options.buttonHeight
        });
      }
      $.extend($realTarget.data('filebox').options, options);
    }

    function setDisabled(realTarget, disabled, readonly) {
      var $realTarget = $(realTarget),
        opts = $realTarget.data("filebox").options;
      if (disabled === undefined) {
        readonly = opts.readonly = _helper.isTrue(readonly);
        disable(readonly);
      } else if (readonly === undefined) {
        disabled = opts.disabled = _helper.isTrue(disabled);
        disable(disabled);
        triggleDisableEvent(disabled);
      } else {
        disabled = opts.disabled = _helper.isTrue(disabled);
        readonly = opts.readonly = _helper.isTrue(readonly);
        disable(disabled || readonly);
        triggleDisableEvent(disabled);
      }

      function disable(arg) {
        if (arg) {
          $realTarget.find('#' + opts.inputId).attr('disabled', 'disabled');
          $realTarget.find('.uploadify-button-text').addClass('disabled');
          $realTarget.next().find('.uploadify-btn-delete').css({
            display: 'none'
          });
        } else {
          $realTarget.find('#' + opts.inputId).removeAttr('disabled');
          $realTarget.find('.uploadify-button-text').removeClass('disabled');
          $realTarget.next().find('.uploadify-btn-delete').css({
            display: 'inline'
          });
        }

      }

      function triggleDisableEvent(arg) {
        if (arg) {
          $realTarget.children('input').attr('disabled', 'disabled');
          opts.onDisable.call($realTarget);
        } else {
          $realTarget.children('input').removeAttr('disabled');
          opts.onEnable.call($realTarget);
        }
      }
    };

    function destroy(realTarget, forceDestroy) {
      var $realTarget = $(realTarget),
        opts = $realTarget.data("filebox").options;
      if (forceDestroy != true) {
        if (opts.onBeforeDestroy.call($realTarget) == false) {
          return;
        }
      }
      $realTarget.parent().remove();
      opts.onDestroy.call($realTarget);
    };
    FileBoxAjax.prototype.init = function (options, param) {
      if (typeof options == "string") {
        return FileBoxAjax.prototype.methods[options](this, param);
      }
      options = options || {};
      return this.each(function () {
        var state = $.data(this, "filebox");
        var opts;
        if (state) {
          opts = $.extend(state.options, options, _readOnlyOptions);
          setOptions(this, opts);
        } else {
          opts = $.extend({}, $.fn.filebox.defaults, $.fn.filebox.parseOptions(
            this), options, _readOnlyOptions);
          var $target = $('<input type="file" />');
          $(this).replaceWith($target);
          target = $target[0];

          var newThis = init(target, opts);
          state = $.data(newThis, "filebox", {
            options: opts,
            filebox: $(newThis)
          });
          setDisabled(newThis, opts.disabled, opts.readonly);
        }
      });
    };
    //从dom中提取options
    FileBoxAjax.prototype.parseOptions = function (target) {
      var $target = $(target),
        opts = $.extend({}, $.parser.parseOptions(target, ['id', 'name',
          'value', 'text'
        ]), {
          readonly: $target.attr('readonly') ? true : undefined,
          disabled: $target.attr('disabled') ? true : undefined
        }),
        type = $(target).attr('accept');
      if (type) {
        opts.fileTypeExts = type;
        opts.fileTypes = type.split(',')
      }
      return opts;
    };
    FileBoxAjax.prototype.methods = {
      options: function (jq) {
        return $.data(jq[0], "filebox").options;
      },
      filebox: function (jq) {
        return $.data(jq[0], "filebox").filebox;
      },
      setFormData: function (jq, param) {
        return jq.each(function () {
          $.data(this, 'filebox').options.formData = param;
        });
      },
      disable: function (jq) {
        return jq.each(function () {
          setDisabled(this, true);
        })
      },
      enable: function (jq) {
        return jq.each(function () {
          setDisabled(this, false);
        });
      },
      destroy: function (jq, param) {
        return jq.each(function () {
          destroy(this, param);
        });
      }
    };
  }
  //根据当前浏览器选择合适的插件实现
  var uploader;

  $.fn.filebox = function () {
    if (!uploader) {
      if (_helper.flashChecker()) {
        uploader = new FileBox();
      } else {
        uploader = new FileBoxAjax();
      }
      $.fn.filebox.methods = uploader.methods;
    }
    return uploader.init.apply(this, arguments);
  };
  $.fn.filebox.parseOptions = function () {
    if (!uploader) {
      if (_helper.flashChecker()) {
        uploader = new FileBox();
      } else {
        uploader = new FileBoxAjax();
      }
      $.fn.filebox.methods = uploader.methods;
    }
    return uploader.parseOptions.apply(this, arguments);
  };

  $.fn.filebox.defaults = {
    id: null,
    name: null,
    value: null,
    text: null,
    disabled: false,
    readonly: false,
    url: $.context.virtualPath + 'controls/attachment/upload',
    downloadUrl: $.context.virtualPath + 'controls/attachment/download', //如果传false，则将已上传文件显示为纯文本。
    required: false,
    inputWidth: '97',
    inputHeight: '15',
    buttonWidth: '66',
    buttonHeight: '15',
    buttonText: 'SELECT FILES',
    maxFileNameLength: 25,
    fileSizeLimit: '10MB',
    fileTypeDesc: 'All files',
    fileTypeExts: '*.*',
    formData: {},
    map: {},
    onCancel: function () {},
    onBeforeDestroy: function () {},
    onDestroy: function () {},
    onDisable: function () {},
    onEnable: function () {},
    onSelect: function () {},
    onSelectError: function () {},
    onUploadStart: function () {},
    onUploadError: function () {},
    onUploadSuccess: function () {},
    onUploadComplete: function () {},
    onDialogClose: function () {},
    onDeleteFile: function () {}
  };

  if ($.parser && $.parser.wituiPlugins) {
    $.parser.wituiPlugins.push('filebox');
  }
})(jQuery);
