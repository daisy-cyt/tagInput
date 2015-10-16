/**
 * @file 标签插件单测文件
 * @author chenyuting02(chenyuting02@baidu.com)
 */
$(function () {
    // 初始化tagInput对象
    var tagInput = $('#tag-value').tagInput({
        $view: $('#tag-area'),
        $button: $('#add-tag'),
        $error: $('#tag-error'),
        tagClass: 'tag-class',
        limit: 5
    });

    /**
     * 测试的描述。
     *
     * @param {string} partial 测试描述的细节部分。
     * @return {string} 返回整个测试描述。
     */
    function getDescribe(partial) {
        return 'tagInput Test - ' + partial + ': ';
    }

    // 测试数组操作
    describe(getDescribe('inner array'), function () {
        // 测试根据value值获取到其索引值
        it('can get index of value', function () {
            tagInput.tagList = ['a', 'b', 'c'];
            var exp = 0;
            expect(exp).toEqual(tagInput.indexOfValue(tagInput.tagList, 'a'));
        });
        // 测试移除数组中指定值
        it('can remove value', function () {
            var exp = ['b', 'c'];
            tagInput.removeValue(tagInput.tagList, 'a');
            expect(exp).toEqual(tagInput.tagList);
        });
    });

    // 测试tag相关操作
    describe(getDescribe('tags'), function () {
        // 测试设置初始的tag值
        it('can set initial tags', function () {
            tagInput.tagList = [];
            var exp = ['a', 'b', 'c'];
            tagInput.val(['a', 'b', 'c']);
            expect(exp).toEqual(tagInput.tagList);
        });
        // 测试获取已添加的tag数组
        it('can get all tags', function () {
            expect(tagInput.tagList).toEqual(tagInput.val());
        });
        // 测试添加tag
        it('can add tag', function () {
            tagInput.addTag('d');
            expect(tagInput.tagList).toContain('d');
        });
        // 测试不能添加重复的tag
        it('can not add repeated tag', function () {
            var expError = '该关键词已经存在';
            var expLength = tagInput.tagList.length;
            tagInput.addTag('b');
            expect(expError).toEqual(tagInput.settings.$error.html());
            expect(expLength).toEqual(tagInput.tagList.length);
        });
        // 测试不能添加超过所限制的tag个数
        it('can not add more than limit tag', function () {
            var expError = '您所能填写的关键词已超限';
            tagInput.tagList = ['a', 'b', 'c', 'd', 'e'];
            var expLength = tagInput.tagList.length;
            tagInput.addTag('f');
            expect(expError).toEqual(tagInput.settings.$error.html());
            expect(expLength).toEqual(tagInput.tagList.length);
        });
        // 测试移除tag
        it('can remove tag', function () {
            var exp = tagInput.tagList.length - 1;
            tagInput.removeTag('c');
            expect(exp).toEqual(tagInput.tagList.length);
        });
        // 测试清空所有tag
        it('can clean tags', function () {
            var exp = [];
            tagInput.clean();
            expect(exp).toEqual(tagInput.tagList);
            expect('').toEqual(tagInput.settings.$view.html());
        });
    });

    // 测试插件启用禁用操作
    describe(getDescribe('whole plugin'), function () {
        // 测试禁用插件
        it('can disable the plugin', function () {
            tagInput.disable();
            var exp = $._data(tagInput.settings.$button[0], 'events');
            expect(exp).toBeUndefined();
        });
        // 测试启用插件
        it('can reable the plugin', function () {
            tagInput.able();
            var exp = $._data(tagInput.settings.$button[0], 'events');
            expect(exp).toBeTruthy();
        });
    });
});

