/**
 * @file 封装标签插件
 * @author chenyuting02(chenyuting02@baidu.com)
 */

(function () {
    // 插件初始化方法
    function TagInput() {
        return this.init.apply(this, arguments);
    }
    TagInput.prototype = (function () {
        var defaults = {
            tagItemTpl: '<div class="tag-item <%= tagClass %>" data-value="<%= value %>">'
            + '<%= value %><span class="action-del"> X </span></div>'
        };
        return {
            /**
             * 初始设置对象
             *
             * @type {Object}
             * @private
             */
            settings: null,
            /**
             * 存储标签值的数组
             *
             * @type {Array}
             * @private
             */
            tagList: [],

            /**
             * 初始化函数
             *
             * @param {Object} options 初始化值
             * @param {Object} options.$view 显示添加后的标签的区域
             * @param {Object} options.$button 添加tag的按钮
             * @param {Object} options.$error 显示错误的元素
             * @param {string} options.tagClass 标签样式
             * @param {number} options.limit 限制标签个数
             * @return {Object} 返回当前jQuery对象
             * @private
             */
            init: function (options) {
                this.settings = $.extend({}, defaults, options);
                this.tagList = [];
                this.bindEvents();
                return this;
            },

            /**
             * 绑定事件
             *
             * @private
             */
            bindEvents: function () {
                var that = this;
                // 按下回车后将文本框中的内容加到标签显示区域中
                this.settings.$input.bind('keypress', function (e) {
                    // 按下回车
                    if (e.keyCode === 13) {
                        that.addTagEvent(e.target.value);
                    }
                });
                // 单击增加标签按钮后将文本框中的内容加到标签显示区域中
                this.settings.$button.bind('click', function (e) {
                    that.addTagEvent(that.settings.$input.val());
                });
                // 为显示的每个标签绑定删除事件
                this.settings.$view.delegate('.action-del', 'click', function (e) {
                    var value = $(this).parents('.tag-item').attr('data-value');
                    $(e.target).parent().remove();
                    that.removeTag(value);
                });
            },

            /**
             * 添加标签的事件
             *
             * @param {string} value 添加欲添加的值
             * @private
             */
            addTagEvent: function (value) {
                if ($.trim(value)) {
                    var tempValue = value.replace(/[；，;]/g, ',').split(',');
                    for (var i = 0; i < tempValue.length; i++) {
                        this.addTag(tempValue[i]);
                    }
                }
                else {
                    this.settings.$error.html('所输关键词不能为空');
                }
            },

            /**
             * 判断指定值是否在数组中
             *
             * @param {Array} tagList 存放tag的数组
             * @param {string} val 指定值
             * @return {number} 返回指定值在数组中的位置，没有则返回-1
             * @private
             */
            indexOfValue: function (tagList, val) {
                for (var i = 0; i < tagList.length; i++) {
                    if (tagList[i] === val) {
                        return i;
                    }
                }
                return -1;
            },

            /**
             * 移除数组中指定值
             *
             * @param {Array} tagList 存放tag的数组
             * @param {string} val 指定值
             * @private
             */
            removeValue: function (tagList, val) {
                var index = tagList.indexOf(val);
                if (index > -1) {
                    tagList.splice(index, 1);
                }
            },

            /**
             * 添加标签
             *
             * @param {string} value 欲添加标签的内容
             * @private
             */
            addTag: function (value) {
                this.settings.$error.html('');
                if (value) {
                    if (this.indexOfValue(this.tagList, value) === -1) {
                        if (this.tagList.length >= this.settings.limit) {
                            this.settings.$error.html('您所能填写的关键词已超限');
                        }
                        else {
                            this.settings.$input.val('');
                            this.tagList.push(value);
                            /* global CONFIG, __inline, _ */
                            var item = _.template(this.settings.tagItemTpl,
                                {
                                    value: value,
                                    tagClass: this.settings.tagClass
                                }
                            );
                            this.settings.$view.append(item);
                        }
                    }
                    else {
                        this.settings.$error.html('该关键词已经存在');
                    }
                }
            },

            /**
             * 移除标签
             *
             * @param {string} value 欲移除的标签内容
             * @private
             */
            removeTag: function (value) {
                this.removeValue(this.tagList, value);
            },

            /**
             * 设置插件默认显示的标签，参数为空时则获取所列出的标签为数组
             *
             * @param {Array} tagList 欲显示的标签的集合
             * @return {Array} 返回已添加的标签数组
             */
            val: function (tagList) {
                if (tagList === null || typeof (tagList) === 'undefined') {
                    return this.tagList;
                }
                for (var i = 0, len = tagList.length; i < len; ++i) {
                    this.addTag(tagList[i]);
                }
            },
            // 禁用插件
            disable: function () {
                $('.tag-item').css('color', '#E3E3E3');
                $('.tag-item span').removeClass('action-del');
                this.settings.$input.unbind('keypress');
                this.settings.$button.unbind('click');
            },
            // 启用插件
            able: function () {
                $('.tag-item').css('color', '#2F8CD5');
                $('.tag-item span').addClass('action-del');
                this.bindEvents();
            },
            // 全部清空
            clean: function () {
                this.tagList = [];
                this.settings.$input.val('');
                this.settings.$view.empty();
                this.settings.$error.html('');
            }
        };
    })();

    // 封装成jQuery插件
    $.fn.extend({
        tagInput: function (options) {
            var obj = $(this).data('tagInput');
            if (!obj) {
                options = $.extend(options, {
                    $input: $(this)
                });
                obj = new TagInput(options);
                $(this).data('tagInput', obj);
            }
            return obj;
        }
    });
})();
