/**
 * @description ObjectUtils
 * @namespace ObjectUtils
 * @author yongjin on 2014/6/18
 */
QUnit.module("【ObjectUtils】");

QUnit.test('compile', function(assert){
  var value = "{handle: @.todo@, draggable: @.todo@, name: @{{name}}@}";
  var compile = Est.compile(value);
  var result = compile({name: 'aaa'});

  assert.equal(result, '{handle: @.todo@, draggable: @.todo@, name: @aaa@}', 'passed');
  result = result.replace(/@/img, '"');
  var items = result.substring(1, result.length -1).split(',');
  var result1 = "{";
  Est.each(items, function(item, dx){
    var list = item.split(':');
    result1 += ((dx===0 ? '': ',') + '"' + Est.trim(list[0]) + '":' + list[1]);
  });
  result = result1 + '}';
 // result = result.replace(//img, '$1');

console.log(JSON.parse(result));
});

QUnit.test('equal -> 1ms*8', function(assert) {
  var obj1 = { name: 'aaa', age: 33 };
  var obj2 = { name: 'aaa', age: 33 };
  var result = Est.equal(obj1, obj2);
  assert.ok(result, 'passed');
  var result = Est.equal(0, -0);
  assert.ok(!result, 'passed');
  var result = Est.equal(null, undefined);
  assert.ok(!result, 'passed');

  var result = Est.equal(true, true);
  assert.ok(result, 'passed');

  var result = Est.equal(false, false);
  assert.ok(result, 'passed');

  var result = Est.equal(null, null);
  assert.ok(result, 'passed');

  var result = Est.equal(undefined, undefined);
  assert.ok(result, 'passed');

  var result = Est.equal('', '');
  assert.ok(result, 'passed');

});

QUnit.test('defaults -> 2ms*1', function(assert) {
  var result = Est.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
  assert.deepEqual(result, { 'user': 'barney', 'age': 36 }, 'passed')
});

/*QUnit.test('Est.objToPath', function (assert) {
  var obj = {
    level1: { level2: 'value2' },
    level3: { level4: 'value4', level5: { level6: 'value6' } }
  };
  var result = Est.objToPath(obj);
  assert.deepEqual(result, {
    "level1.level2": "value2",
    "level3.level4": "value4",
    "level3.level5.level6": "value6"
  }, 'passed!');
});*/
QUnit.test('getValue -> 2ms*2', function(assert) {
  var object = {
    item: {
      name: 'aaa'
    }
  }
  var object2 = {
    item: {
      name: 'aaa'
    }
  }
  var result = Est.getValue(object, 'item.name');
  assert.equal(result, 'aaa', 'passed');
  assert.deepEqual(object, object2, 'passed');
  var result2 = Est.getValue(object, 'item.ent');
  assert.equal(result2, undefined, 'passed');
});
QUnit.test('result -> 1ms*1', function(assert) {
  var object3 = {
    item: {
      name: 'aa',
      age: function() {
        return 22;
      }
    }
  };
  var result3 = Est.result(object3, 'item.age');
  assert.equal(result3, 22, 'passed');
});
QUnit.test('setValue -> 3ms*4', function(assert) {
  var object = {
    item: {
      name: 'aaa'
    },
    item2: {
      name: 'bbb'
    }
  }
  var object2 = {
    item: {
      name: 'bbb'
    },
    item2: {
      name: 'bbb'
    }
  }
  Est.setValue(object, 'item.name', 'bbb');
  assert.deepEqual(object, object2, 'passed');


  var object3 = {
    item: {}
  };
  Est.setValue(object3, 'item.name', 'bbb');
  assert.deepEqual(object3, {
    "item": {
      "name": "bbb"
    }
  }, 'passed');

  var object4 = {};
  Est.setValue(object4, 'item.name', 'bbb');
  assert.deepEqual(object4, {
    "item": {
      "name": "bbb"
    }
  }, 'passed');

  var object5 = null;

  Est.setValue(object5, 'item.name', 'bbb');
  assert.deepEqual(object5, null, 'passed');
});
QUnit.test("chain -> 3ms*2", function(assert) {
  var characters = [{
    'name': 'barney',
    'age': 36
  }, {
    'name': 'fred',
    'age': 40
  }, {
    'name': 'pebbles',
    'age': 1
  }];

  var youngest = Est.chain(characters)
    .sortBy('age').take(0)
    .pluck('age').value();
  // → 'pebbles is 1'
  assert.equal(youngest, 1, 'passed!');
  var youngesttwo = Est.chain(characters).sortBy('age').take().pluck('age').value();
  assert.equal(youngesttwo, 1, 'passed!');
});
QUnit.test("pick -> 1ms*1", function(assert) {
  var object1 = {
    name: 'a',
    sort: '1',
    sId: '000002'
  };
  var object2 = Est.pick(object1, ['name', 'sort']);
  var object3 = {
    name: 'a',
    sort: '1'
  };
  assert.deepEqual(object2, object3, "{name:'a', sort: '1', sId: '000002'} => {name:'a', sort:'1'}");
})
QUnit.test("typeOf -> 0ms*1", function(assert) {
  var results = [];
  var fn = Est.typeOf;
  results.push(fn({
    a: 4
  })); // "Object"
  results.push(fn([1, 2, 3])); // "Array"
  (function() {
    results.push(fn(arguments));
  }()); // "Object"
  results.push(fn(new ReferenceError())); // "ReferenceError"
  results.push(fn(new Date())); // "Date"
  results.push(fn(/a-z/)); // "RegExp"
  results.push(fn(Math)); // "Object"
  results.push(fn(JSON)); // "Object"
  results.push(fn(new Number(4))); // "Number"
  results.push(fn(new String("abc"))); // "String"
  results.push(fn(new Boolean(true))); // "Boolean"
  results.push(fn(null)); // "Null"
  results.push(fn(function() {})); // "Function"

  assert.deepEqual(results, ["object", "array", "object", "error", "date", "regexp", "object", "object", "object", "object", "object", 'null', 'function'], 'passed!');
});
/*QUnit.test("Est.getType", function (assert) {
  var results = [];
  var fn = Est.getType;

  results.push(fn({a: 4})); // "Object"
  results.push(fn([1, 2, 3])); // "Array"
  (function () {
    results.push(fn(arguments));
  }()); // "Arguments"
  results.push(fn(new ReferenceError())); // "Error"
  results.push(fn(new Date())); // "Date"
  results.push(fn(/a-z/)); // "RegExp"
  results.push(fn(Math)); // "Math"
  results.push(fn(JSON)); // "JSON"
  results.push(fn(new Number(4))); // "Number"
  results.push(fn(new String("abc"))); // "String"
  results.push(fn(new Boolean(true))); // "Boolean"
  results.push(fn(null)); // "null"
  results.push(fn(function () {
  })); // "Function"

  assert.deepEqual(results, [ "Object", "Array", "Object", "ReferenceError", "Date", "RegExp", "Object", "Object", "Number", "String", "Boolean", "null", "Function" ], "passed");
});*/
QUnit.test("hasKey -> 0ms*1", function(assert) {
  var obj = {
    name: 1
  };
  var has = Est.hasKey(obj, 'name');
  assert.equal(has, true, 'passed!');
});
QUnit.test("hashKey -> 0ms*1", function(assert) {
  var obj = {};
  var value = Est.hashKey(obj);
  assert.equal(value, 'object:003', "passed!");
});
QUnit.test("isEmpty -> 1ms*5", function(assert) {
  var obj = {};
  var result = Est.isEmpty(obj);
  assert.ok(result, "passed!");
  var list = [];
  var result2 = Est.isEmpty(list);
  assert.ok(result2, "passed!");
  var str = '';
  var result3 = Est.isEmpty(str);
  assert.ok(result3, "passed!");
  var fn = function() {}
  var result4 = Est.isEmpty(fn);
  assert.ok(result4, "passed!");
  var obj1 = {
    name: 1
  };
  var result5 = Est.isEmpty(obj1);
  assert.ok(!result5, "passed!");
});
QUnit.test('pluck -> 0ms*1', function(assert) {
  var characters = [{
    'name': 'barney',
    'age': 36
  }, {
    'name': 'fred',
    'age': 40
  }];
  var result = Est.pluck(characters, 'name');
  assert.deepEqual(result, ["barney", "fred"], 'passed!');
});
QUnit.test('cloneDeep -> 49ms*3', function(assert) {
  var object = {
    'name': 'barney',
    'age': 36,
    'info': {
      'array': ['1', '2']
    }
  };
  var object_r = Est.cloneDeep(object);
  assert.deepEqual(object_r, {
    "age": 36,
    "info": {
      "array": ["1", "2"]
    },
    "name": "barney"
  }, 'passed!');
  assert.ok(object_r.info.array !== object.info.array, 'passed!');

  var characters = [{
    'name': 'barney',
    'age': 36
  }, {
    'name': 'fred',
    'age': 40
  }];
  var clone = Est.clone(characters);
  assert.deepEqual(clone, [{
    "age": 36,
    "name": "barney"
  }, {
    "age": 40,
    "name": "fred"
  }], 'passed!');
  //assert.ok(clone[0] === characters[0], 'passed!');

  var cloneDeep = Est.cloneDeep(characters);
  assert.deepEqual(cloneDeep, [{
    "age": 36,
    "name": "barney"
  }, {
    "age": 40,
    "name": "fred"
  }], 'passed!');
  assert.ok(cloneDeep[0] !== characters[0], 'passed!');


  var list = [{
    product_id: 'Product_000000000000000000204345',
    name: '彩带',
    category: 'Category_00000000000000000249891',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2014/01/08/9954d1e9-be0f-4976-9947-90a8f497e497.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '111',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '7',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2014/01/08/9954d1e9-be0f-4976-9947-90a8f497e497_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2014/01/08/9954d1e9-be0f-4976-9947-90a8f497e497_5.jpg'
  }, {
    product_id: 'Product_000000000000000000204344',
    name: '长条灯',
    category: 'Category_00000000000000000249891',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2014/01/08/e45de0f5-f3ea-4377-9ec6-7a88e53882d4.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '110',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '16',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2014/01/08/e45de0f5-f3ea-4377-9ec6-7a88e53882d4_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2014/01/08/e45de0f5-f3ea-4377-9ec6-7a88e53882d4_5.jpg'
  }, {
    product_id: 'Product_000000000000000000204343',
    name: '红色头盔',
    category: 'Category_00000000000000000249891',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2014/01/08/a41a25c6-4798-410c-bebb-ccf2237348cc.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '109',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '3',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2014/01/08/a41a25c6-4798-410c-bebb-ccf2237348cc_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2014/01/08/a41a25c6-4798-410c-bebb-ccf2237348cc_5.jpg'
  }, {
    product_id: 'Product_000000000000000000204341',
    name: '蝴蝶护套蓝色',
    category: 'Category_00000000000000000249891',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2014/01/08/a2b5f8f3-95fd-433b-931a-d62e207bb8df.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '108',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '4',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2014/01/08/a2b5f8f3-95fd-433b-931a-d62e207bb8df_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2014/01/08/a2b5f8f3-95fd-433b-931a-d62e207bb8df_5.jpg'
  }, {
    product_id: 'Product_000000000000000000204340',
    name: '美羊羊风车',
    category: 'Category_00000000000000000249891',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2014/01/08/456d328d-36b5-4da4-a0ec-5b52414067ab.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '107',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '36',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2014/01/08/456d328d-36b5-4da4-a0ec-5b52414067ab_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2014/01/08/456d328d-36b5-4da4-a0ec-5b52414067ab_5.jpg'
  }, {
    product_id: 'Product_000000000000000000204337',
    name: '爆闪灯',
    category: 'Category_00000000000000000249891',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2014/01/08/f6383cc8-a73a-4f2f-b059-54b40366410e.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '106',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '15',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2014/01/08/f6383cc8-a73a-4f2f-b059-54b40366410e_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2014/01/08/f6383cc8-a73a-4f2f-b059-54b40366410e_5.jpg'
  }, {
    product_id: 'Product_000000000000000000150800',
    name: '酷溜漂移蛙式龙行车DB-8175',
    category: 'Category_00000000000000000024124',
    state: '01',
    prodtype: '8175-白粉',
    pic_path: 'upload/d/d1/dabao/picture/2014/03/17/33e918d4-5192-498e-a5c1-de4c89669036.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '104',
    type: 'NW',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '1030',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2014/03/17/33e918d4-5192-498e-a5c1-de4c89669036_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2014/03/17/33e918d4-5192-498e-a5c1-de4c89669036_5.jpg'
  }, {
    product_id: 'Product_000000000000000000150797',
    name: '酷溜漂移时尚龙蛙车DB-8068L',
    category: 'Category_00000000000000000024124',
    state: '01',
    prodtype: 'DB-8068L-白红',
    pic_path: 'upload/d/d1/dabao/picture/2013/05/30/36d92fc3-2977-4f0e-af3a-d09e2202defb.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '104',
    type: 'NW',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '962',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/30/36d92fc3-2977-4f0e-af3a-d09e2202defb_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/30/36d92fc3-2977-4f0e-af3a-d09e2202defb_5.jpg'
  }, {
    product_id: 'Product_000000000000000000150799',
    name: '酷溜漂移蛙式龙行车DB-8068M',
    category: 'Category_00000000000000000024124',
    state: '01',
    prodtype: 'DB-8068M-白蓝',
    pic_path: 'upload/d/d1/dabao/picture/2014/03/17/b1685a93-5c01-41d9-a03b-8ca1da4690b1.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '103',
    type: 'NW',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '507',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2014/03/17/b1685a93-5c01-41d9-a03b-8ca1da4690b1_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2014/03/17/b1685a93-5c01-41d9-a03b-8ca1da4690b1_5.jpg'
  }, {
    product_id: 'Product_000000000000000000150798',
    name: '酷溜漂移运动龙行车DB-8068S',
    category: 'Category_00000000000000000024124',
    state: '01',
    prodtype: 'DB-8068S-全蓝',
    pic_path: 'upload/d/d1/dabao/picture/2013/05/05/1daf601c-e75c-4eac-aa7c-205582bb69be.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '102',
    type: 'NW',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '422',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/05/1daf601c-e75c-4eac-aa7c-205582bb69be_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/05/1daf601c-e75c-4eac-aa7c-205582bb69be_5.jpg'
  }, {
    product_id: 'Product_000000000000000000202991',
    name: '成人蛙式滑板车黑黄',
    category: 'Category_00000000000000000024133',
    state: '01',
    prodtype: 'DB8039L',
    pic_path: 'upload/d/d1/dabao/picture/2013/12/30/b1454d00-0424-42dd-89bc-f4d95162b819.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '101',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '84',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/12/30/b1454d00-0424-42dd-89bc-f4d95162b819_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/12/30/b1454d00-0424-42dd-89bc-f4d95162b819_5.jpg'
  }, {
    product_id: 'Product_000000000000000000188195',
    name: '蛙式滑板车编织篮子',
    category: 'Category_00000000000000000249891',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/09/17/9788bbf4-5dc6-4867-9860-1f6ad0910595.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '100',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '16',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/09/17/9788bbf4-5dc6-4867-9860-1f6ad0910595_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/09/17/9788bbf4-5dc6-4867-9860-1f6ad0910595_5.jpg'
  }, {
    product_id: 'Product_000000000000000000202990',
    name: '成人蛙式滑板车白红',
    category: 'Category_00000000000000000024133',
    state: '01',
    prodtype: 'DB8039L',
    pic_path: 'upload/d/d1/dabao/picture/2013/12/30/1959651e-b476-4122-9c97-396441799deb.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '99',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '57',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/12/30/1959651e-b476-4122-9c97-396441799deb_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/12/30/1959651e-b476-4122-9c97-396441799deb_5.jpg'
  }, {
    product_id: 'Product_000000000000000000188196',
    name: '蛙式车配套赠品布篮子',
    category: 'Category_00000000000000000249891',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/09/17/2f634a2a-2168-4518-b98c-fd75e55d7bfd.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '97',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '21',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/09/17/2f634a2a-2168-4518-b98c-fd75e55d7bfd_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/09/17/2f634a2a-2168-4518-b98c-fd75e55d7bfd_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054935',
    name: '小号蛙式运动车-组合图',
    category: 'Category_00000000000000000024131',
    state: '01',
    prodtype: 'DB8039S',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/434c05d6-ee24-4fac-8824-437b5462af12.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '96',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '347',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/434c05d6-ee24-4fac-8824-437b5462af12_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/434c05d6-ee24-4fac-8824-437b5462af12_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054936',
    name: '小号蛙式运动车-粉红',
    category: 'Category_00000000000000000024131',
    state: '01',
    prodtype: 'DB8039S',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/bbfa8bdc-ad2a-4f29-86fe-47ecd4868025.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '95',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '219',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/bbfa8bdc-ad2a-4f29-86fe-47ecd4868025_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/bbfa8bdc-ad2a-4f29-86fe-47ecd4868025_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054938',
    name: '小号蛙式运动车-绿色',
    category: 'Category_00000000000000000024131',
    state: '01',
    prodtype: 'DB8039S',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/6d7f92b3-dcef-4765-b636-ce3c81266662.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '94',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '76',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/6d7f92b3-dcef-4765-b636-ce3c81266662_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/6d7f92b3-dcef-4765-b636-ce3c81266662_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054940',
    name: '小号蛙式运动车-粉红印花',
    category: 'Category_00000000000000000024131',
    state: '01',
    prodtype: 'DB8039S',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/a1ac0ee4-64c0-41b0-ba0b-5427f05bcdc5.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '93',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '166',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/a1ac0ee4-64c0-41b0-ba0b-5427f05bcdc5_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/a1ac0ee4-64c0-41b0-ba0b-5427f05bcdc5_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054941',
    name: '小号蛙式运动车-蓝色',
    category: 'Category_00000000000000000024131',
    state: '01',
    prodtype: 'DB8039S',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/ef1f5950-7d90-4524-9f2d-d5322cd719e5.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '92',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '172',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/ef1f5950-7d90-4524-9f2d-d5322cd719e5_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/ef1f5950-7d90-4524-9f2d-d5322cd719e5_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054942',
    name: '小号蛙式运动车-绿色脚管加长型',
    category: 'Category_00000000000000000024131',
    state: '01',
    prodtype: 'DB8039SM',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/d8602208-6cfe-4fda-b06d-39b338b618aa.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '91',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '81',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/d8602208-6cfe-4fda-b06d-39b338b618aa_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/d8602208-6cfe-4fda-b06d-39b338b618aa_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054943',
    name: '小号蛙式运动车-弯把脚管加长型',
    category: 'Category_00000000000000000024131',
    state: '01',
    prodtype: 'DB8039SM-W',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/888626a6-c4a3-4462-a1c6-5c626263c0c1.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '90',
    type: 'NM',
    ads: '1',
    broadcast: null,
    login_view: '0',
    viewsum: '238',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/888626a6-c4a3-4462-a1c6-5c626263c0c1_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/888626a6-c4a3-4462-a1c6-5c626263c0c1_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054944',
    name: '中号蛙式运动车-银灰杆红色',
    category: 'Category_00000000000000000024132',
    state: '01',
    prodtype: 'DB8039M',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/f7a591a9-1adb-4cf6-a10d-b8f4a23f4325.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '89',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '173',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/f7a591a9-1adb-4cf6-a10d-b8f4a23f4325_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/f7a591a9-1adb-4cf6-a10d-b8f4a23f4325_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054946',
    name: '中号蛙式运动车-绿色',
    category: 'Category_00000000000000000024132',
    state: '01',
    prodtype: 'DB8039M',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/95ed3c5e-6073-4d26-aa67-9ed2e9a868c1.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '88',
    type: 'NM',
    ads: '1',
    broadcast: null,
    login_view: '0',
    viewsum: '100',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/95ed3c5e-6073-4d26-aa67-9ed2e9a868c1_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/95ed3c5e-6073-4d26-aa67-9ed2e9a868c1_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054947',
    name: '中号蛙式运动车-蓝色印花',
    category: 'Category_00000000000000000024132',
    state: '01',
    prodtype: 'DB8039M',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/d3fee82a-2e94-45ab-84fc-3a9db4f1e128.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '87',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '72',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/d3fee82a-2e94-45ab-84fc-3a9db4f1e128_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/d3fee82a-2e94-45ab-84fc-3a9db4f1e128_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054948',
    name: '中号蛙式运动车-不升降不折叠小弯把',
    category: 'Category_00000000000000000024132',
    state: '01',
    prodtype: 'DB8039M-W-3',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/853c5d3e-789c-4433-9bfc-dfb2648ef5ce.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '86',
    type: 'NM',
    ads: '1',
    broadcast: null,
    login_view: '0',
    viewsum: '107',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/853c5d3e-789c-4433-9bfc-dfb2648ef5ce_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/853c5d3e-789c-4433-9bfc-dfb2648ef5ce_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054949',
    name: '中号蛙式运动车-蓝色',
    category: 'Category_00000000000000000024132',
    state: '01',
    prodtype: 'DB8039M',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/9ebe3202-6a19-497b-a175-98834f5cfdf4.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '85',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '54',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/9ebe3202-6a19-497b-a175-98834f5cfdf4_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/9ebe3202-6a19-497b-a175-98834f5cfdf4_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054950',
    name: '中号蛙式运动车-激光轮蓝色',
    category: 'Category_00000000000000000024132',
    state: '01',
    prodtype: 'DB8039M',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/88f2329f-3cbc-45c4-abb1-6b74b8acbaa7.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '84',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '63',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/88f2329f-3cbc-45c4-abb1-6b74b8acbaa7_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/88f2329f-3cbc-45c4-abb1-6b74b8acbaa7_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054951',
    name: '大号蛙式运动车-组合图',
    category: 'Category_00000000000000000024133',
    state: '01',
    prodtype: 'DB8039L',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/61369901-f4fc-4a93-9a3a-a02802e85e73.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '83',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '51',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/61369901-f4fc-4a93-9a3a-a02802e85e73_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/61369901-f4fc-4a93-9a3a-a02802e85e73_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054952',
    name: '大号蛙式运动车-粉红',
    category: 'Category_00000000000000000024133',
    state: '01',
    prodtype: 'DB8039L',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/e098d2a3-436c-44e1-85bd-d875b43c7b16.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '82',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '131',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/e098d2a3-436c-44e1-85bd-d875b43c7b16_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/e098d2a3-436c-44e1-85bd-d875b43c7b16_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054953',
    name: '大号蛙式运动车-红色',
    category: 'Category_00000000000000000024133',
    state: '01',
    prodtype: 'DB8039L ',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/c120a59e-7d5e-4e93-8895-15538881dd41.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '81',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '63',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/c120a59e-7d5e-4e93-8895-15538881dd41_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/c120a59e-7d5e-4e93-8895-15538881dd41_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054954',
    name: '大号蛙式运动车-蓝色弯把',
    category: 'Category_00000000000000000024133',
    state: '01',
    prodtype: 'DB8039L-W',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/251f1c15-3454-49e1-9061-28110a4f539f.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '80',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '107',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/251f1c15-3454-49e1-9061-28110a4f539f_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/251f1c15-3454-49e1-9061-28110a4f539f_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054955',
    name: '大号蛙式运动车-黑红',
    category: 'Category_00000000000000000024133',
    state: '01',
    prodtype: 'DB8039L',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/c0502caf-1a2d-4492-8e63-b4ed6564bc29.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '79',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '41',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/c0502caf-1a2d-4492-8e63-b4ed6564bc29_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/c0502caf-1a2d-4492-8e63-b4ed6564bc29_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054956',
    name: '大号蛙式运动车-黑色',
    category: 'Category_00000000000000000024133',
    state: '01',
    prodtype: 'DB8039L',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/cff8d0c8-9683-443d-bafe-9eafd63dd95c.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '78',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '75',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/cff8d0c8-9683-443d-bafe-9eafd63dd95c_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/cff8d0c8-9683-443d-bafe-9eafd63dd95c_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054957',
    name: '大号蛙式运动车-红色',
    category: 'Category_00000000000000000024133',
    state: '01',
    prodtype: 'DB8039L',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/af3fd7cc-241e-4301-8fab-751b4a00f079.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '77',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '27',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/af3fd7cc-241e-4301-8fab-751b4a00f079_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/af3fd7cc-241e-4301-8fab-751b4a00f079_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054958',
    name: '特大号蛙式运动车-红色',
    category: 'Category_00000000000000000024134',
    state: '01',
    prodtype: 'DB8039XL',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/52400965-7508-497b-b9cc-c2315b5c674d.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '76',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '111',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/52400965-7508-497b-b9cc-c2315b5c674d_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/52400965-7508-497b-b9cc-c2315b5c674d_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054959',
    name: '特大号蛙式运动车',
    category: 'Category_00000000000000000024134',
    state: '01',
    prodtype: 'DB8039XL',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/3ffcb235-3472-494c-99c3-7d84f78bcf07.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '75',
    type: 'NM',
    ads: '1',
    broadcast: null,
    login_view: '0',
    viewsum: '146',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/3ffcb235-3472-494c-99c3-7d84f78bcf07_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/3ffcb235-3472-494c-99c3-7d84f78bcf07_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054960',
    name: '新款迷你蛙车',
    category: 'Category_00000000000000000024135',
    state: '01',
    prodtype: 'DB8168M-W-F',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/a9df52f3-6e99-4890-b40a-ba21976ddf59.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '74',
    type: 'NM',
    ads: '1',
    broadcast: null,
    login_view: '0',
    viewsum: '173',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/a9df52f3-6e99-4890-b40a-ba21976ddf59_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/a9df52f3-6e99-4890-b40a-ba21976ddf59_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054962',
    name: '大号迷你蛙车-绿色',
    category: 'Category_00000000000000000024135',
    state: '01',
    prodtype: 'DB8168L',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/406a84f7-0183-4d5f-bc51-61e788e6d0d4.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '73',
    type: 'NM',
    ads: '1',
    broadcast: null,
    login_view: '0',
    viewsum: '110',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/406a84f7-0183-4d5f-bc51-61e788e6d0d4_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/406a84f7-0183-4d5f-bc51-61e788e6d0d4_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054963',
    name: '迷你蛙车-蓝色',
    category: 'Category_00000000000000000024135',
    state: '01',
    prodtype: 'DB8168 蓝',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/d632dc65-0b32-4c45-a6ea-fd8ad3448821.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '72',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '66',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/d632dc65-0b32-4c45-a6ea-fd8ad3448821_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/d632dc65-0b32-4c45-a6ea-fd8ad3448821_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054964',
    name: '迷你蛙车-绿色',
    category: 'Category_00000000000000000024135',
    state: '01',
    prodtype: 'DB8168 绿',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/36bc906c-5db8-4bbf-9ea3-d81311a03ae2.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '71',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '43',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/36bc906c-5db8-4bbf-9ea3-d81311a03ae2_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/36bc906c-5db8-4bbf-9ea3-d81311a03ae2_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054965',
    name: '迷你蛙车-银灰杆红色',
    category: 'Category_00000000000000000024135',
    state: '01',
    prodtype: 'DB8168 红',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/d466c31e-d63b-4c16-a8aa-9c29fece11c0.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '70',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '41',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/d466c31e-d63b-4c16-a8aa-9c29fece11c0_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/d466c31e-d63b-4c16-a8aa-9c29fece11c0_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054966',
    name: '大号迷你蛙车-红色',
    category: 'Category_00000000000000000024135',
    state: '01',
    prodtype: 'DB8168L',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/16ee6996-58bf-4324-893a-5559f3c90684.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '69',
    type: 'NM',
    ads: '1',
    broadcast: null,
    login_view: '0',
    viewsum: '83',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/16ee6996-58bf-4324-893a-5559f3c90684_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/16ee6996-58bf-4324-893a-5559f3c90684_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054967',
    name: '迷你蛙车-组合图',
    category: 'Category_00000000000000000024135',
    state: '01',
    prodtype: 'DB8168 ',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/ddd4c983-c439-41ad-a494-b14fb9c31387.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '68',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '49',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/ddd4c983-c439-41ad-a494-b14fb9c31387_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/ddd4c983-c439-41ad-a494-b14fb9c31387_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054968',
    name: '迷你蛙车-粉红',
    category: 'Category_00000000000000000024135',
    state: '01',
    prodtype: 'DB8168',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/9ca86998-4a89-4658-b3e3-90b299e016ed.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '67',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '53',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/9ca86998-4a89-4658-b3e3-90b299e016ed_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/9ca86998-4a89-4658-b3e3-90b299e016ed_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054969',
    name: '迷你蛙车',
    category: 'Category_00000000000000000024135',
    state: '01',
    prodtype: 'DB8168',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/236d7012-c3ca-4622-9be6-0eeb006118c2.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '66',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '55',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/236d7012-c3ca-4622-9be6-0eeb006118c2_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/236d7012-c3ca-4622-9be6-0eeb006118c2_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054973',
    name: '迷你蛙车',
    category: 'Category_00000000000000000024135',
    state: '01',
    prodtype: 'DB8168',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/acb0918d-28f3-4b9f-abca-9599c9ef5a8b.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '65',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '34',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/acb0918d-28f3-4b9f-abca-9599c9ef5a8b_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/acb0918d-28f3-4b9f-abca-9599c9ef5a8b_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054975',
    name: '活力蛙车-紫色',
    category: 'Category_00000000000000000024136',
    state: '01',
    prodtype: 'DB8178',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/8f5d7a5c-563a-4aa8-8798-1f7d096dbc50.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '64',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '73',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/8f5d7a5c-563a-4aa8-8798-1f7d096dbc50_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/8f5d7a5c-563a-4aa8-8798-1f7d096dbc50_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054977',
    name: '活力蛙车-红色',
    category: 'Category_00000000000000000024136',
    state: '01',
    prodtype: 'DB8178',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/ed744ad5-7c40-4313-9219-81b2a9f4b3fd.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '63',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '47',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/ed744ad5-7c40-4313-9219-81b2a9f4b3fd_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/ed744ad5-7c40-4313-9219-81b2a9f4b3fd_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054978',
    name: '活力蛙车-红色',
    category: 'Category_00000000000000000024136',
    state: '01',
    prodtype: 'DB8178',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/1c947fa4-4ad1-4e8d-8f64-4f2e5a2e9450.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '62',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '61',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/1c947fa4-4ad1-4e8d-8f64-4f2e5a2e9450_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/1c947fa4-4ad1-4e8d-8f64-4f2e5a2e9450_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054980',
    name: '活力板-组合图',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: '活力板-组合图',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/ca6263ed-9c4f-4a41-9907-98c5df5f65ff.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '61',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '59',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/ca6263ed-9c4f-4a41-9907-98c5df5f65ff_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/ca6263ed-9c4f-4a41-9907-98c5df5f65ff_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054983',
    name: '游龙活力板',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8111',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/0c8e9932-73bb-415e-9515-b71333bc18d1.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '60',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '68',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/0c8e9932-73bb-415e-9515-b71333bc18d1_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/0c8e9932-73bb-415e-9515-b71333bc18d1_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054986',
    name: '金刚活力板-组合图',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8117',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/c2ac938a-2c2a-47b5-8258-f88705892d23.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '59',
    type: 'NM',
    ads: '1',
    broadcast: null,
    login_view: '0',
    viewsum: '77',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/c2ac938a-2c2a-47b5-8258-f88705892d23_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/c2ac938a-2c2a-47b5-8258-f88705892d23_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054989',
    name: '蝙蝠活力板-蓝色',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8112',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/d4f59fcb-e0ea-4462-af3b-35ad69909421.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '58',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '28',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/d4f59fcb-e0ea-4462-af3b-35ad69909421_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/d4f59fcb-e0ea-4462-af3b-35ad69909421_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054991',
    name: '蝴蝶活力板',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8113',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/d830ad14-a4f8-4e0b-a43e-84ff62abd2a5.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '57',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '52',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/d830ad14-a4f8-4e0b-a43e-84ff62abd2a5_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/d830ad14-a4f8-4e0b-a43e-84ff62abd2a5_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054995',
    name: '火箭活力板',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8115',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/333c1309-c2af-41b0-9158-4c55041bf332.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '56',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '34',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/333c1309-c2af-41b0-9158-4c55041bf332_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/333c1309-c2af-41b0-9158-4c55041bf332_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054996',
    name: '太空活力板',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8116 ',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/e9c1b83a-8466-4ace-9bd4-f6360536bc5a.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '55',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '29',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/e9c1b83a-8466-4ace-9bd4-f6360536bc5a_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/e9c1b83a-8466-4ace-9bd4-f6360536bc5a_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054997',
    name: '火箭活力板',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8115',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/9177d464-aebf-4099-8153-3b4b998eed9a.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '54',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '24',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/9177d464-aebf-4099-8153-3b4b998eed9a_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/9177d464-aebf-4099-8153-3b4b998eed9a_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054998',
    name: '金刚活力板',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8117',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/04751e13-9c43-450d-b298-c238a403dfaf.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '53',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '8',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/04751e13-9c43-450d-b298-c238a403dfaf_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/04751e13-9c43-450d-b298-c238a403dfaf_5.jpg'
  }, {
    product_id: 'Product_000000000000000000054999',
    name: '赤壁活力板-组合图',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8118',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/66771b76-cb09-4758-8824-3b9d12ad2338.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '52',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '12',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/66771b76-cb09-4758-8824-3b9d12ad2338_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/66771b76-cb09-4758-8824-3b9d12ad2338_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055000',
    name: '赤壁活力板',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8118',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/5b43ab87-6f22-4752-8c7b-14118105a89d.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '51',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '9',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/5b43ab87-6f22-4752-8c7b-14118105a89d_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/5b43ab87-6f22-4752-8c7b-14118105a89d_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055001',
    name: '蝙蝠活力板',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8112',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/d4f59fcb-e0ea-4462-af3b-35ad69909421.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '50',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '9',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/d4f59fcb-e0ea-4462-af3b-35ad69909421_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/d4f59fcb-e0ea-4462-af3b-35ad69909421_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055002',
    name: '活力板',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8112 ',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/f797d35b-ab3f-4e4d-8096-77fcb3d32809.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '49',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '15',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/f797d35b-ab3f-4e4d-8096-77fcb3d32809_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/f797d35b-ab3f-4e4d-8096-77fcb3d32809_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055003',
    name: '游龙活力板-组合图',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8111',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/b0af717d-c385-45cc-aa75-a8e88045d14b.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '48',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '20',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/b0af717d-c385-45cc-aa75-a8e88045d14b_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/b0af717d-c385-45cc-aa75-a8e88045d14b_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055004',
    name: '赤壁活力板',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: 'DB8118',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/8f992414-874a-4075-b278-f074d826d46f.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '47',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '19',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/8f992414-874a-4075-b278-f074d826d46f_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/8f992414-874a-4075-b278-f074d826d46f_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055005',
    name: '铝合金活力板',
    category: 'Category_00000000000000000024125',
    state: '01',
    prodtype: '铝合金活力板背面',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/fda447e2-fd6c-4744-9b3b-894704fbb6b5.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '46',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '8',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/fda447e2-fd6c-4744-9b3b-894704fbb6b5_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/fda447e2-fd6c-4744-9b3b-894704fbb6b5_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055006',
    name: '溜溜车',
    category: 'Category_00000000000000000024126',
    state: '01',
    prodtype: 'DB8188',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/4758f62e-4ee6-4d64-9790-5a54fb8bc52c.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '45',
    type: 'NM',
    ads: '1',
    broadcast: null,
    login_view: '0',
    viewsum: '321',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/4758f62e-4ee6-4d64-9790-5a54fb8bc52c_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/4758f62e-4ee6-4d64-9790-5a54fb8bc52c_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055008',
    name: 'DB8185滑行车',
    category: 'Category_00000000000000000024127',
    state: '01',
    prodtype: 'DB8185',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/2f28c794-db09-405d-83cd-5a05ca4d9137.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '44',
    type: 'NM',
    ads: '1',
    broadcast: null,
    login_view: '0',
    viewsum: '166',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/2f28c794-db09-405d-83cd-5a05ca4d9137_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/2f28c794-db09-405d-83cd-5a05ca4d9137_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055010',
    name: 'DB8186滑行车',
    category: 'Category_00000000000000000024127',
    state: '01',
    prodtype: 'DB8186',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/6f92deb1-289b-4c00-ad21-8b343244691a.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '43',
    type: 'NM',
    ads: '1',
    broadcast: null,
    login_view: '0',
    viewsum: '103',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/6f92deb1-289b-4c00-ad21-8b343244691a_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/6f92deb1-289b-4c00-ad21-8b343244691a_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055011',
    name: 'DB8187滑行车',
    category: 'Category_00000000000000000024127',
    state: '01',
    prodtype: 'DB8187',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/6c368311-dcd9-4b7d-964c-f51a03445dee.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '42',
    type: 'NM',
    ads: '1',
    broadcast: null,
    login_view: '0',
    viewsum: '97',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/6c368311-dcd9-4b7d-964c-f51a03445dee_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/6c368311-dcd9-4b7d-964c-f51a03445dee_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055017',
    name: '小蛮腰活力车-塑料踏板带平安脚',
    category: 'Category_00000000000000000024128',
    state: '01',
    prodtype: 'DB8180-1紫',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/924c0b69-df40-4bb8-91e4-bf6e68a9ccc3.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '41',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '80',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/924c0b69-df40-4bb8-91e4-bf6e68a9ccc3_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/924c0b69-df40-4bb8-91e4-bf6e68a9ccc3_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055023',
    name: '小蛮腰活力车-塑料踏板带平安脚',
    category: 'Category_00000000000000000024128',
    state: '01',
    prodtype: 'DB8180 黄',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/cec7072c-5dfd-41e9-b3b5-91e6906ccace.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '40',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '66',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/cec7072c-5dfd-41e9-b3b5-91e6906ccace_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/cec7072c-5dfd-41e9-b3b5-91e6906ccace_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055027',
    name: '小蛮腰活力车-塑料踏板带平安脚',
    category: 'Category_00000000000000000024128',
    state: '01',
    prodtype: 'DB8180',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/e4f5c742-f223-4ea0-99aa-600a7b66709d.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '39',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '32',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/e4f5c742-f223-4ea0-99aa-600a7b66709d_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/e4f5c742-f223-4ea0-99aa-600a7b66709d_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055032',
    name: '蛮腰活力车-塑料踏板带平安脚',
    category: 'Category_00000000000000000024128',
    state: '01',
    prodtype: 'DB8180',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/f40ad976-020a-44b4-a426-fa7093b85427.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '38',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '52',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/f40ad976-020a-44b4-a426-fa7093b85427_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/f40ad976-020a-44b4-a426-fa7093b85427_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055037',
    name: '小蛮腰活力车-塑料踏板带平安脚',
    category: 'Category_00000000000000000024128',
    state: '01',
    prodtype: 'DB8180',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/ee8b5741-bde3-4c0f-87ae-804419a08ddb.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '37',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '52',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/ee8b5741-bde3-4c0f-87ae-804419a08ddb_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/ee8b5741-bde3-4c0f-87ae-804419a08ddb_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055042',
    name: '小蛮腰活力车-折叠图',
    category: 'Category_00000000000000000024128',
    state: '01',
    prodtype: 'DB8181-1',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/8fd979a3-96fa-4048-bb73-f8b90f6419e3.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '36',
    type: 'NM',
    ads: '1',
    broadcast: null,
    login_view: '0',
    viewsum: '66',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/8fd979a3-96fa-4048-bb73-f8b90f6419e3_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/8fd979a3-96fa-4048-bb73-f8b90f6419e3_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055047',
    name: '小蛮腰活力车-塑料踏板',
    category: 'Category_00000000000000000024128',
    state: '01',
    prodtype: 'DB8181',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/0957bfe8-9962-4bb3-9e09-afd33c1720df.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '35',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '43',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/0957bfe8-9962-4bb3-9e09-afd33c1720df_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/0957bfe8-9962-4bb3-9e09-afd33c1720df_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055052',
    name: '小蛮腰活力车',
    category: 'Category_00000000000000000024128',
    state: '01',
    prodtype: 'DB8182 ',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/3c129090-a05d-41c9-9840-e8f3e674f489.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '34',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '38',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/3c129090-a05d-41c9-9840-e8f3e674f489_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/3c129090-a05d-41c9-9840-e8f3e674f489_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055055',
    name: '小蛮腰活力车',
    category: 'Category_00000000000000000024128',
    state: '01',
    prodtype: 'DB8182',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/05775380-86d4-44c2-9ba8-84ef6f72442f.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '33',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '21',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/05775380-86d4-44c2-9ba8-84ef6f72442f_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/05775380-86d4-44c2-9ba8-84ef6f72442f_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055057',
    name: '小蛮腰活力车',
    category: 'Category_00000000000000000024128',
    state: '01',
    prodtype: 'DB8183',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/6a8605f3-214b-425a-bf9d-7b6218901853.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '32',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '15',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/6a8605f3-214b-425a-bf9d-7b6218901853_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/6a8605f3-214b-425a-bf9d-7b6218901853_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055062',
    name: '小蛮腰活力车',
    category: 'Category_00000000000000000024128',
    state: '01',
    prodtype: 'DB8183',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/dba05e80-d0bb-4f38-b0b1-286c8d14a618.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '31',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '14',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/dba05e80-d0bb-4f38-b0b1-286c8d14a618_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/dba05e80-d0bb-4f38-b0b1-286c8d14a618_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055067',
    name: '小蛮腰活力车',
    category: 'Category_00000000000000000024128',
    state: '01',
    prodtype: 'DB8180',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/a4680689-97fb-4bc6-b33c-457496548bce.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '30',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '14',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/a4680689-97fb-4bc6-b33c-457496548bce_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/a4680689-97fb-4bc6-b33c-457496548bce_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055070',
    name: '闪光摆摆乐独轮车',
    category: 'Category_00000000000000000024129',
    state: '01',
    prodtype: 'DB8190-1',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/d853beba-0290-45ba-b1df-2f3f772f9762.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '29',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '165',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/d853beba-0290-45ba-b1df-2f3f772f9762_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/d853beba-0290-45ba-b1df-2f3f772f9762_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055072',
    name: '闪光摆摆乐独轮车',
    category: 'Category_00000000000000000024129',
    state: '01',
    prodtype: 'DB8190-1',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/8c401cb6-6f54-4a8d-989c-94b37764dcb3.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '28',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '95',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/8c401cb6-6f54-4a8d-989c-94b37764dcb3_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/8c401cb6-6f54-4a8d-989c-94b37764dcb3_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055073',
    name: 'DB6131电脑桌',
    category: 'Category_00000000000000000024130',
    state: '01',
    prodtype: 'DB6131电脑桌',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/b0a08dd3-f228-4ec6-9485-655eac54aa2d.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '27',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '41',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/b0a08dd3-f228-4ec6-9485-655eac54aa2d_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/b0a08dd3-f228-4ec6-9485-655eac54aa2d_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055078',
    name: 'DB6011写字椅',
    category: 'Category_00000000000000000024130',
    state: '01',
    prodtype: 'DB6011写字椅',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/e5bd5b5b-2a2c-46c6-865f-bfe2b3659c37.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '26',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '45',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/e5bd5b5b-2a2c-46c6-865f-bfe2b3659c37_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/e5bd5b5b-2a2c-46c6-865f-bfe2b3659c37_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055082',
    name: 'DB6019写字椅',
    category: 'Category_00000000000000000024130',
    state: '01',
    prodtype: 'DB6019写字椅',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/db022db7-7609-43f2-aaf6-6a1028041245.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '25',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '51',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/db022db7-7609-43f2-aaf6-6a1028041245_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/db022db7-7609-43f2-aaf6-6a1028041245_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055084',
    name: 'DB6020写字椅',
    category: 'Category_00000000000000000024130',
    state: '01',
    prodtype: 'DB6020写字椅',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/420549b6-9931-4801-aeae-e06396a6f239.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '24',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '24',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/420549b6-9931-4801-aeae-e06396a6f239_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/420549b6-9931-4801-aeae-e06396a6f239_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055090',
    name: 'DB6022写字椅',
    category: 'Category_00000000000000000024130',
    state: '01',
    prodtype: 'DB6022写字椅',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/a7728226-1041-44d6-96dc-6f673d6a8cc9.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '23',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '60',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/a7728226-1041-44d6-96dc-6f673d6a8cc9_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/a7728226-1041-44d6-96dc-6f673d6a8cc9_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055093',
    name: 'DB6002S写字椅',
    category: 'Category_00000000000000000024130',
    state: '01',
    prodtype: 'DB6002S写字椅',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/2323afc1-49e0-49b1-8a52-c5e4c1e8ba4f.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '22',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '38',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/2323afc1-49e0-49b1-8a52-c5e4c1e8ba4f_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/2323afc1-49e0-49b1-8a52-c5e4c1e8ba4f_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055096',
    name: '可折叠写字椅',
    category: 'Category_00000000000000000024130',
    state: '01',
    prodtype: '可折叠写字椅',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/a8563048-dcfc-4fad-b824-f4c9de08f354.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '21',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '40',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/a8563048-dcfc-4fad-b824-f4c9de08f354_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/a8563048-dcfc-4fad-b824-f4c9de08f354_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151066',
    name: '食物垃圾处理器 - 需500点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/cc28af38-80a6-4b63-95d9-15cbdeb04b7b.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '20',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '12',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/cc28af38-80a6-4b63-95d9-15cbdeb04b7b_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/cc28af38-80a6-4b63-95d9-15cbdeb04b7b_5.jpg'
  }, {
    product_id: 'Product_000000000000000000055098',
    name: '课桌椅109款',
    category: 'Category_00000000000000000024130',
    state: '01',
    prodtype: '课桌椅109款',
    pic_path: 'upload/d/d1/dabao/picture/2011/10/28/f7eb52e4-01b4-4d2c-af56-6053ca637766.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '19',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '80',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2011/10/28/f7eb52e4-01b4-4d2c-af56-6053ca637766_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2011/10/28/f7eb52e4-01b4-4d2c-af56-6053ca637766_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151065',
    name: '福字挂历 - 需20点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/31b5a710-a51b-4c5a-9df4-9b10ce311268.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '18',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '6',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/31b5a710-a51b-4c5a-9df4-9b10ce311268_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/31b5a710-a51b-4c5a-9df4-9b10ce311268_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151064',
    name: '百元抵金券 - 需100点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/14cc39c1-0fa1-4e16-bf19-e199b6e9aa5d.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '17',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '9',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/14cc39c1-0fa1-4e16-bf19-e199b6e9aa5d_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/14cc39c1-0fa1-4e16-bf19-e199b6e9aa5d_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151063',
    name: '水宜生 - 需100点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/ece9cfed-0448-43e6-91ed-cbd6367d03b8.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '16',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '7',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/ece9cfed-0448-43e6-91ed-cbd6367d03b8_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/ece9cfed-0448-43e6-91ed-cbd6367d03b8_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151061',
    name: '干手器 - 需100点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/69158ef8-4d3e-4667-ab1b-02f3c72937ec.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '15',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '4',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/69158ef8-4d3e-4667-ab1b-02f3c72937ec_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/69158ef8-4d3e-4667-ab1b-02f3c72937ec_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151060',
    name: '美的酸奶机 - 需150点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/4069f2fe-9a8f-4d7a-a69b-ea7b1ba49a0c.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '14',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '5',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/4069f2fe-9a8f-4d7a-a69b-ea7b1ba49a0c_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/4069f2fe-9a8f-4d7a-a69b-ea7b1ba49a0c_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151062',
    name: '微电解养生壶 - 需150点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/c521bd3b-e47a-494a-86d4-a43fbeeb2e08.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '13',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '8',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/c521bd3b-e47a-494a-86d4-a43fbeeb2e08_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/c521bd3b-e47a-494a-86d4-a43fbeeb2e08_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151058',
    name: '美的煮蛋器 - 需200点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/9b66b9a8-1039-4404-a6bb-f4e40151102f.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '12',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '6',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/9b66b9a8-1039-4404-a6bb-f4e40151102f_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/9b66b9a8-1039-4404-a6bb-f4e40151102f_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151057',
    name: '足浴盆 - 需200点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/a430106b-e9b1-4e1b-a2c4-ee56984dea5d.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '11',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '6',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/a430106b-e9b1-4e1b-a2c4-ee56984dea5d_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/a430106b-e9b1-4e1b-a2c4-ee56984dea5d_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151056',
    name: '美的微波炉 - 需500点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/ea1fd772-5bc1-4cf7-8ba7-33651e712e4d.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '10',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '6',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/ea1fd772-5bc1-4cf7-8ba7-33651e712e4d_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/ea1fd772-5bc1-4cf7-8ba7-33651e712e4d_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151048',
    name: '黑色iphone4s - 需6000点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/20478043-555c-4b49-a647-f85d933c0f5a.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '9',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '19',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/20478043-555c-4b49-a647-f85d933c0f5a_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/20478043-555c-4b49-a647-f85d933c0f5a_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151055',
    name: '奥克斯电暖器 - 需400点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/e2ec2ef0-f818-4bfa-8f2f-a832d0d332f3.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '8',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '7',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/e2ec2ef0-f818-4bfa-8f2f-a832d0d332f3_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/e2ec2ef0-f818-4bfa-8f2f-a832d0d332f3_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151054',
    name: 'ipad平板电脑 - 需4000点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/7f62eda4-1018-4fb1-a2a5-4f641f348bbc.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '7',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '7',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/7f62eda4-1018-4fb1-a2a5-4f641f348bbc_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/7f62eda4-1018-4fb1-a2a5-4f641f348bbc_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151053',
    name: '九阳豆浆机 - 需300点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/99e79ef3-a668-4dec-8c79-6e500fafcf85.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '6',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '6',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/99e79ef3-a668-4dec-8c79-6e500fafcf85_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/99e79ef3-a668-4dec-8c79-6e500fafcf85_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151052',
    name: '第五套人民币 - 需800点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/4940f797-e24d-4ac7-84a8-85f8393491f8.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '5',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '6',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/4940f797-e24d-4ac7-84a8-85f8393491f8_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/4940f797-e24d-4ac7-84a8-85f8393491f8_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151050',
    name: '松下传真机 - 需1500点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/95f63f74-8ea4-42ac-aee0-3e5fceb106dc.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '4',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '4',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/95f63f74-8ea4-42ac-aee0-3e5fceb106dc_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/95f63f74-8ea4-42ac-aee0-3e5fceb106dc_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151051',
    name: '松下滚轴传真机 - 需1000点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/c742c257-e6c3-4060-8b67-916d5d034888.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '3',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '4',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/c742c257-e6c3-4060-8b67-916d5d034888_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/c742c257-e6c3-4060-8b67-916d5d034888_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151049',
    name: '三星数码相机 - 需1000点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/60211141-db9e-4d00-8294-9015b170cd0c.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '2',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '11',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/60211141-db9e-4d00-8294-9015b170cd0c_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/60211141-db9e-4d00-8294-9015b170cd0c_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151059',
    name: '美的迷你电煲 - 需200点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/66601a4e-c765-4e42-bb50-75122b9cad85.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '1',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '3',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/66601a4e-c765-4e42-bb50-75122b9cad85_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/66601a4e-c765-4e42-bb50-75122b9cad85_5.jpg'
  }, {
    product_id: 'Product_000000000000000000151047',
    name: '戴尔笔记本 - 需5000点',
    category: 'Category_00000000000000000148479',
    state: '01',
    prodtype: null,
    pic_path: 'upload/d/d1/dabao/picture/2013/05/07/4cb3818d-1ab9-411f-9ef1-92184f71fcf0.jpg',
    update_time: '2014-06-18T02:46:23.904Z',
    sort: '0',
    type: 'NM',
    ads: '0',
    broadcast: null,
    login_view: '0',
    viewsum: '5',
    price: null,
    mimic_path: 'upload/d/d1/dabao/picture/2013/05/07/4cb3818d-1ab9-411f-9ef1-92184f71fcf0_6.jpg',
    thumbnail_path: 'upload/d/d1/dabao/picture/2013/05/07/4cb3818d-1ab9-411f-9ef1-92184f71fcf0_5.jpg'
  }];

  var result5 = Est.cloneDeep(list);
  assert.deepEqual(result5, list, 'passed!');
});
