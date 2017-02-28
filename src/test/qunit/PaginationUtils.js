/**
 * @description ArrayUtils
 * @namespace ArrayUtils
 * @author yongjin on 2014/6/18
 */
QUnit.module( "【PaginationUtils】" );

QUnit.test("getMaxPage -> 1ms*1", function(assert){
    var pageList = [{page:1}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}];
    var page = 2;
    var pageSize = 5;
    var num = Est.getMaxPage(parseInt(48), parseInt(7));
    assert.equal(num, 7, 'passed!');
});

QUnit.test("getListByPage -> 1ms*1", function(assert){
    var pageList = [{page:1}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}, {page:2}];
    var page = 2;
    var pageSize = 5;
    var list = Est.getListByPage(pageList, page, pageSize);
    var result = [ { "page": 2 }, { "page": 2 }, { "page": 2 }, { "page": 2 }, { "page": 2 } ];
    assert.deepEqual(list, result, 'passed!');
});

QUnit.test("getPaginationNumber -> 1ms*3", function(assert){
    var list = Est.getPaginationNumber(parseInt(1), parseInt(50), 9);
    var list2 = Est.getPaginationNumber(parseInt(44), parseInt(50), 9);
    var result = [ 1, 2, 3, 4, 5, 6, 7 ];
    var result2 = [ 41, 42, 43, 44, 45, 46, 47];
    assert.deepEqual(list, result, 'passed!');
    assert.deepEqual(list2, result2, 'passed!');
    var list3 = Est.getPaginationNumber(1, 1, 9);
    assert.deepEqual(list3, [1], 'passed!');
});