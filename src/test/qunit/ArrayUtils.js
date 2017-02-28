/**
 * @description ArrayUtils
 * @namespace ArrayUtils
 * @author yongjin on 2014/6/18
 */
QUnit.module("【ArrayUtils】");


QUnit.test('bubbleSort', function(assert) {
  var list = [8, 5, 0, 23, 14, 53, 52, 12, 6, 3, 2, 62, 90, 6, 89, 48, 10, 37, 23, 64, 23, 74, 1, 23, 64, 22, 64, 71, 16];
  Est.bubbleSort(list);
  assert.deepEqual(list, [0, 1, 2, 3, 5, 6, 6, 8, 10, 12, 14, 16, 22, 23, 23, 23, 23, 37, 48, 52, 53, 62, 64, 64, 64, 71, 74, 89, 90 ], 'passed');
});


QUnit.test("each -> 1ms *1", function(assert) {
  var list1 = [
    { name: 1, sort: 1 },
    { name: 2, sort: 2 }
  ];
  var list2 = [
    { name: 1, sort: 2 },
    { name: 2, sort: 3 }
  ];
  Est.each(list1, function(item) {
    item.sort = item.sort + 1;
  });
  assert.deepEqual(list1, list2, "[{name:1, sort:1},{name:2, sort:2}] => [{name:1, sort:2},{name:2, sort:3}]");
});

QUnit.test("arrayExchange -> 1ms*1", function(assert) {
  var list1 = [
    { name: 1, sort: 1 },
    { name: 2, sort: 2 }
  ];
  var list2 = [
    { name: 2, sort: 1 },
    { name: 1, sort: 2 }
  ];
  Est.arrayExchange(list1, 0, 1, {
    column: 'sort',
    callback: function(thisNode, targetNode) {}
  });
  assert.deepEqual(list1, list2, '[{name:1, sort:1},{name:2, sort:2}] =>  [{name:2, sort:1},{name:1, sort:2}]');
});

QUnit.test("arrayInsert -> 1ms*1", function(assert) {
  var list1 = [
    { name: 1, sort: 1 },
    { name: 2, sort: 2 },
    { name: 3, sort: 3 },
    { name: 4, sort: 4 }
  ];
  var list2 = [
    { name: 1, sort: 1 },
    { name: 4, sort: 2 },
    { name: 2, sort: 3 },
    { name: 3, sort: 4 }
  ];
  Est.arrayInsert(list1, 3, 1, {
    column: 'sort',
    callback: function(list) {}
  });
  assert.deepEqual(list1, list2, "[{name:1, sort:1},{name:2, sort:2},{name:3, sort:3},{name:4, sort:4}] => [{name:1, sort:1},{name:4, sort:2},{name:2, sort:3},{name:3, sort:4}]");
});

QUnit.test("arrayToObject -> 0ms*1", function(assert) {
  var list1 = [
    { key: 'key1', value: 'value1' },
    { key: 'key2', value: 'value2' }
  ];
  var object1 = Est.arrayToObject(list1, 'key', 'value');
  var object2 = { "key1": "value1", "key2": "value2" };
  assert.deepEqual(object1, object2, "[{key:'key1',value:'value1'},{key:'key2',value:'value2'}] => {'key1': 'value1','key2': 'value2'}");
});

QUnit.test("arrayFromObject -> 0ms*1", function(assert) {
  var object1 = { key1: 'value1', key2: 'value2' };
  var list1 = Est.arrayFromObject(object1, 'key', 'value');
  var list2 = [
    { "key": "key1", "value": "value1" },
    { "key": "key2", "value": "value2" }
  ];
  assert.deepEqual(list1, list2, '{key1: "value1",key2: "value2"} => [ { "key": "key1", "value": "value1" }, { "key": "key2", "value": "value2" } ]');
});

QUnit.test("hasKey -> 0ms*1", function(assert) {
  var object1 = { name: 1, sort: 1 };
  var result = Est.hasKey(object1, 'name');
  assert.ok(result, 'Est.hasKey(object1, "name"); => true');
});

/*QUnit.test("Est.makeMap", function (assert) {
  var map = Est.makeMap("a,a,aa,a,ah,a");
  assert.deepEqual(map, { "a": true, "aa": true, "ah": true }, 'passed!');
});*/

QUnit.test("indexOf -> 1ms*1", function(assert) {
  var list = ['a', 'b'];
  var has = Est.indexOf(list, 'b');
  assert.equal(has, 1, "passed!");
});

/*QUnit.test("Est.arrayRemove", function (assert) {
  var list = ['a', 'b', 'b'];
  var result = Est.arrayRemove(list, 'b');
  assert.deepEqual(list, ['a', 'b'], 'passed!');
});
*/
QUnit.test("map -> 1ms*3", function(assert) {
  var list = [1, 2, 3];
  var result = Est.map(list, function(value, index, list) {
    return list[index] + 1;
  });
  assert.deepEqual(result, [2, 3, 4], 'passed!');
  var result2 = Est.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) {
    return num * 3;
  });
  assert.deepEqual(result2, [3, 6, 9], 'object passed!');
  var characters = [
    { 'name': 'barney', 'age': 36 },
    { 'name': 'fred', 'age': 40 }
  ];
  var result3 = Est.map(characters, 'name');
  assert.deepEqual(result3, ['barney', 'fred'], 'passed!');
});
QUnit.test("filter -> 2ms*3", function(assert) {
  var list = [
    { "name": "aa" },
    { "name": "bb" },
    { "name": "cc" },
    { "name": "bb", address: "zjut" }
  ];
  var result = Est.filter(list, function(item) {
    return item.name.indexOf('b') > -1;
  });
  assert.deepEqual(result, [
    { "name": "bb" },
    { "address": "zjut", "name": "bb" }
  ], 'passed!');
  var result2 = Est.filter(list, { "name": "bb", "address": "zjut" });
  assert.deepEqual(result2, [
    { "address": "zjut", "name": "bb" }
  ], "passed!");

  var list3 = [
    { album_id: "Album_00000000000000000000033002", name: "默认相册", add_time: null, update_time: "2014-06-18T02:49:01.762Z", parent_id: null },
    { album_id: "Album_00000000000000000000054391", name: "企业网站案例", add_time: "2013-08-19T08:35:06.850Z", update_time: "2014-06-18T02:49:01.762Z", parent_id: null },
    { album_id: "Album_00000000000000000000059126", name: "ssss", add_time: "2014-07-09T07:16:06.408Z", update_time: "2014-07-09T07:16:06.408Z", parent_id: null },
    { album_id: "Album_00000000000000000000059127", name: "fddgdfg", add_time: "2014-07-09T07:40:18.125Z", update_time: "2014-07-09T07:40:18.125Z", parent_id: null },
    { album_id: "Album_00000000000000000000059128", name: "sdfsdf", add_time: "2014-07-09T07:55:15.251Z", update_time: "2014-07-09T07:55:15.251Z", parent_id: null },
    { album_id: "Album_00000000000000000000059129", name: "sdfsdf", add_time: "2014-07-09T07:55:45.829Z", update_time: "2014-07-09T07:55:45.829Z", parent_id: null },
    { album_id: "Album_00000000000000000000059130", name: "sdfsdf", add_time: "2014-07-09T07:56:02.911Z", update_time: "2014-07-09T07:56:02.911Z", parent_id: null },
    { album_id: "Album_00000000000000000000059131", name: "sdfsdf", add_time: "2014-07-09T07:56:36.404Z", update_time: "2014-07-09T07:56:36.404Z", parent_id: null },
    { album_id: "Album_00000000000000000000059132", name: "wwww", add_time: "2014-07-09T07:59:32.410Z", update_time: "2014-07-09T07:59:32.410Z", parent_id: "Album_00000000000000000000033002" },
    { album_id: "Album_00000000000000000000059133", name: "fdgfdg", add_time: "2014-07-09T08:00:34.047Z", update_time: "2014-07-09T08:00:34.047Z", parent_id: "Album_00000000000000000000033002" },
    { album_id: "Album_00000000000000000000059134", name: "vvcb", add_time: "2014-07-09T08:21:59.718Z", update_time: "2014-07-09T08:21:59.718Z", parent_id: "Album_00000000000000000000033002" },
    { album_id: "Album_00000000000000000000059135", name: "sdfsf", add_time: "2014-07-09T08:38:29.574Z", update_time: "2014-07-09T08:38:29.574Z", parent_id: null },
    { album_id: "Album_00000000000000000000059136", name: "sdfdsf", add_time: "2014-07-09T08:39:53.980Z", update_time: "2014-07-09T08:39:53.980Z", parent_id: "Album_00000000000000000000033002" },
    { album_id: "Album_00000000000000000000059137", name: "dfff", add_time: "2014-07-09T08:39:59.668Z", update_time: "2014-07-09T08:39:59.668Z", parent_id: "Album_00000000000000000000033002" },
    { album_id: "Album_00000000000000000000059138", name: "dddd", add_time: "2014-07-09T08:57:35.417Z", update_time: "2014-07-09T08:57:35.417Z", parent_id: "Album_00000000000000000000059132" },
    { album_id: "Album_00000000000000000000059139", name: "企业网站案例", add_time: "2014-07-09T09:41:40.112Z", update_time: "2014-07-09T09:41:40.112Z", parent_id: null },
    { album_id: "Album_00000000000000000000059140", name: "uuu", add_time: "2014-07-09T09:57:57.177Z", update_time: "2014-07-09T09:57:57.177Z", parent_id: "Album_00000000000000000000033002" },
    { album_id: "Album_00000000000000000000059141", name: "eee", add_time: "2014-07-09T10:18:36.331Z", update_time: "2014-07-09T10:18:36.331Z", parent_id: "Album_00000000000000000000059133" },
    { album_id: "Album_00000000000000000000059142", name: "二级分类", add_time: "2014-07-09T14:41:19.940Z", update_time: "2014-07-09T14:41:19.940Z", parent_id: "Album_00000000000000000000033002" },
    { album_id: "Album_00000000000000000000059143", name: "三级分类", add_time: "2014-07-09T14:41:29.434Z", update_time: "2014-07-09T14:41:29.434Z", parent_id: "Album_00000000000000000000059142" },
    { album_id: "Album_00000000000000000000059144", name: "四级分类", add_time: "2014-07-09T14:41:37.539Z", update_time: "2014-07-09T14:41:37.539Z", parent_id: "Album_00000000000000000000059143" }
  ];
  var result3 = Est.filter(list3, { "album_id": 'Album_00000000000000000000059144' });
  assert.deepEqual(result3, [
    { "add_time": "2014-07-09T14:41:37.539Z", "album_id": "Album_00000000000000000000059144", "name": "四级分类", "parent_id": "Album_00000000000000000000059143", "update_time": "2014-07-09T14:41:37.539Z" }
  ], 'passed!');
});

QUnit.test("findIndex -> 1ms*3", function(assert) {
  var list = [
    { "name": "aa" },
    { "name": "bb" },
    { "name": "cc" },
    { "name": "bb", address: "zjut" }
  ];
  var index = Est.findIndex(list, { name: 'aa' });
  assert.equal(index, 0, 'test object : passed!');

  var index2 = Est.findIndex(list, function(item) {
    return item.name === 'aa';
  });
  assert.equal(index2, 0, 'test function: passed!');

  var index3 = Est.findIndex(list, { name: 'bb', address: 'zjut' });
  assert.equal(index3, 3, 'test multi params of  object : passed!');

  /*var list4 = ["Attach_0000000000000000000667698"];
   var index4 = Est.findIndex(list4, 'Attach_0000000000000000000667698');
   assert.equal(index4, 0, 'passed');*/
});

QUnit.test('sortBy -> 5ms*4', function(assert) {
  var result = Est.sortBy([1, 2, 3], function(num) {
    return Math.sin(num);
  });
  assert.deepEqual(result, [3, 1, 2], 'passed!');
  var characters = [
    { 'name': 'barney', 'age': 36 },
    { 'name': 'fred', 'age': 40 },
    { 'name': 'barney', 'age': 26 },
    { 'name': 'fred', 'age': 30 }
  ];
  var result2 = Est.sortBy(characters, 'age');
  assert.deepEqual(result2, [
    { "age": 26, "name": "barney" },
    { "age": 30, "name": "fred" },
    { "age": 36, "name": "barney" },
    { "age": 40, "name": "fred" }
  ], 'passed!');
  var result3 = Est.sortBy(characters, ['name', 'age']);
  assert.deepEqual(result3, [
    { "age": 26, "name": "barney" },
    { "age": 36, "name": "barney" },
    { "age": 30, "name": "fred" },
    { "age": 40, "name": "fred" }
  ], 'passed!');
  var result4 = Est.sortBy(characters, ['age', 'name']);
  assert.deepEqual(result4, [
    { "age": 26, "name": "barney" },
    { "age": 30, "name": "fred" },
    { "age": 36, "name": "barney" },
    { "age": 40, "name": "fred" }
  ], 'passed!');
});

QUnit.test('remove -> 2ms*8', function(assert) {
  var targetList = [
    { key: '11', value: '11' },
    { key: '22', value: '22' },
    { key: '33', value: '33' }
  ];

  var targetList2 = [1, 2, 3, 4, 5];
  var result = Est.remove(targetList2, 2);
  assert.deepEqual(result, [1, 3, 4, 5], 'remove number');

  var targetList3 = [1, '2', 3, 4, 5];
  var result = Est.remove(targetList3, '2');
  assert.deepEqual(result, [1, 3, 4, 5], 'remove string');

  var targetList4 = [{ key: '11', value: '11' }, { key: '11', value: '33' }, { key: '22', value: '22' }, { key: '33', value: '33' }];
  var result = Est.remove(targetList4, { key: '11' });
  assert.deepEqual(result, [{ key: '22', value: '22' }, { key: '33', value: '33' }], 'remove one item');

  var targetList5 = [{ key: '11', value: '11' }, { key: '11', value: '33' }, { key: '22', value: '22' }, { key: '33', value: '33' }];
  var result = Est.remove(targetList5, { key: '11', value: '33' });
  assert.deepEqual(result, [{ key: '11', value: '11' }, { key: '22', value: '22' }, { key: '33', value: '33' }], 'remove two item');




  var removeList = [{ key: '11' }];
  var result = Est.remove(targetList, removeList, function(targetItem, removeItem) {
    return targetItem.key === removeItem.key;
  });
  assert.deepEqual(result, [{ key: '22', value: '22' }, { key: '33', value: '33' }], 'remove list');

  var targetList = [];
  var removeList = [];
  var result = Est.remove(targetList, removeList, function(targetItem, removeItem) {
    return targetItem.key === removeItem.key;
  });
  assert.deepEqual(result, [], '原数组与待移除数组都为空时');

  var targetList = [];
  var removeList = [{ key: '11' }];
  var result = Est.remove(targetList, removeList, function(targetItem, removeItem) {
    return targetItem.key === removeItem.key;
  });
  assert.deepEqual(result, [], '原数组为空待移除数组不为空时');

  var targetList = [{ key: '11' }];
  var removeList = [];
  var result = Est.remove(targetList, removeList, function(targetItem, removeItem) {
    return targetItem.key === removeItem.key;
  });
  assert.deepEqual(result, [{ key: '11' }], '原数组不为空待移除数组为空时');

});
