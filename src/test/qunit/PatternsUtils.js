/**
 * @description PatternsUtils
 * @namespace PatternsUtils
 * @author yongjin on 2014/6/18
 */
QUnit.module("【PatternsUtils】");
/*QUnit.test("Est.inherit", function (assert) {
  var target = {x: 'dont change me'};
  var newObject = Est.inherit(target);

  assert.equal(newObject.x, target.x, "newObject inherit from target!");
});*/
QUnit.asyncTest('promise -> 58ms*1', function(assert) {
  var str = '';
  var result = function() {
    return new Est.promise(function(resolve, reject) {
      setTimeout(function() {
        resolve('ok');
      }, 1);
    });
  };
  result().then(function(data) {
    str = data;
    assert.equal(str, 'ok', 'passed!');
    QUnit.start();
  });
});
QUnit.test("inject -> 5ms*1", function(assert) {
  var doTest = function(a) {
    return a;
  };

  function beforeTest(a) {
    a += 3;
    return new Est.setArguments(arguments);
  }

  function afterTest(a, result, isDenied) {
    return result + 5;
  }

  doTest = Est.inject(doTest, beforeTest, afterTest);
  var result = doTest(2);
  assert.equal(result, 10, "passed!");
});
/*QUnit.test("Est.define", function (assert) {
  var result = 2;
  Est.define('moduleA', [], function () {
    return {
      getData: function () {
        return 1;
      }
    }
  });
  Est.define('moduleB', ['moduleA'], function (moduleA) {
    result = moduleA.getData();
    return {
      getResult: function () {
        return result;
      }
    }
  });
  Est.define('moduleC', ['moduleB', 'Est'], function (mod, utils) {
    var result = utils.pad(mod.getResult(), 5, '0', false);
    console.log(result);
  });
  Est.use('moduleC');
  assert.equal(result, 1, 'passed!');
});*/
QUnit.asyncTest('on -> 215ms*2', function(assert) {
  var result = '';
  var result2 = '';
  var token1 = Est.on('event1', function(topic, data) {
    result = data;
  });
  var token2 = Est.on('event1', function(topic, data) {
    result2 = data;
  });
  Est.trigger('event1', 'aaa');
  setTimeout(function() {
    assert.equal(result, 'aaa', 'passed');
    assert.equal(result2, 'aaa', 'passed');
    Est.off('event1', token2);
    Est.trigger('event1', 'bbb');
    setTimeout(function() {
      assert.equal(result, 'bbb', 'passed');
      assert.equal(result2, 'aaa', 'passed');
      QUnit.start();
    }, 100);
  }, 100);
});
QUnit.test('proxy -> 0ms*1', function(assert) {
  var result = '';
  var result2 = '';
  var me = {
    type: "zombie",
    test: function(arg1) {
      result = this.type;
      result2 = arg1;
    }
  };

  var you = {
    type: "person",
    test: function(arg1) {
      result = this.type;
      result2 = arg1;
    }
  };

  Est.proxy(me.test, you, me.type)();
  assert.equal(result, 'person', 'me.test 成功代理到you.test');
  assert.equal(result2, 'zombie', '成功把me.type传递到you.type的参数列表中');
});
/*
QUnit.test('Est.interface', function (assert) {
  var test = new Est.interface('test', ['details', 'age']);
  var properties = {
    name: "Mark McDonnell",
    actions: {
      details: function () {
        return "I am " + this.age() + " years old.";
      },
      age: (function (birthdate) {
        var dob = new Date(birthdate),
          today = new Date(),
          ms = today.valueOf() - dob.valueOf(),
          minutes = ms / 1000 / 60,
          hours = minutes / 60,
          days = hours / 24,
          years = days / 365,
          age = Math.floor(years)
        return function () {
          return age;
        };
      })("1981 08 30")
    }
  };

  function Person(config) {
    Est.interface.implements(config.actions, test);
    this.name = config.name;
    this.methods = config.actions;
  }

  var me = new Person(properties);
  assert.equal(me.methods.age(), 33, 'passed');
  assert.equal(me.methods.details(), 'I am 33 years old.', 'passed');


  function Class() {

  }

  Class.prototype = {
    add: function () {
      return 'add';
    },
    remove: function () {
      return 'remove';
    },
    getChild: function () {
      return 'getChild';
    },
    save: function () {
      return 'save';
    }
  }

  //定义接口Composite，实现add,remove,getChild三种方法
  var Composite = new Est.interface('Composite', ['add', 'remove', 'getChild']);

//定义接口FormItem,实现save方法
  var FormItem = new Est.interface('FormItem', ['save']);

//判断对象是否实现了上述两个接口
  var object = new Class();
  Est.interface.implements(object, Composite, FormItem);

  assert.equal(object.add(), 'add', 'passed');

});*/
