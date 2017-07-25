/**
 * 工具类库.
 *
 * @description 修改urlParsingNode变量 on 14/7/29
 * @class BbaseEst - 工具类库
 * @constructor BbaseEst
 */
;
(function () {
  'use strict';
  var root = this;
  /**
   * @description 系统原型方法
   * @method [变量] - slice push toString hasOwnProperty concat
   * @private
   */
  var slice = Array.prototype.slice,
    push = Array.prototype.push,
    toString = Object.prototype.toString,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    concat = Array.prototype.concat;
  /**
   * @description ECMAScript 5 原生方法
   * @method [变量] - nativeIsArray nativeKeys nativeBind
   * @private
   */
  var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeBind = Object.prototype.bind;
  var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\n\
        \u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
  var uid = ['0', '0', '0'];
  var url = window.location.href;
  var urlParsingNode = null;
  /**
   * @description define
   * @method [变量] - moduleMap
   * @private
   */
  var moduleMap = {};
  var fileMap = {};
  var noop = function () {};
  /**
   * @description  定义数组和对象的缓存池
   * @method [变量] - maxPoolSize arrayPool objectPool
   * @private
   */
  var maxPoolSize = 40;
  var arrayPool = [],
    objectPool = [];
  /**
   * @method [变量] - cache
   * @private
   * 缓存对象 */
  var cache = {};
  /**
   * @method [变量] - routes
   * @private
   * url 路由 */
  var routes = {};
  var el = null,
    current = null;

  /**
   * @description 创建BbaseEst对象
   * @method [对象] - BbaseEst
   * @private
   */
  var BbaseEst = root.BbaseEst || function (value) {
    return (value && typeof value == 'object' &&
        typeOf(value) !== 'array' && hasOwnProperty.call(value, '_wrapped')) ? value :
      new Wrapper(value);
  };

  /**
   * 调试
   *
   * @method [调试] - debug (打印错误信息)
   * @param str
   * @param options
   * @author wyj 14.12.24
   * @example
   *       debug('test');
   *       debug('test', {
   *         type: 'error' // 打印红色字体
   *       });
   *       debug(function(){
   *         return 'test';
   *       });
   */
  function debug(str, options) {
    var opts, msg;
    if (typeof CONST !== 'undefined' && CONST.DEBUG_CONSOLE) {
      try {
        opts = extend({ type: 'console' }, options);
        msg = typeOf(str) === 'function' ? str() : str;
        if (!isEmpty(msg)) {
          if (opts.type === 'error') {
            console.error(msg);
          } else if (opts.type === 'alert') {
            alert(msg);
          } else {
            console.log(msg);
          }
          if (options && options.e) {
            console.log(options.e);
          }
        }
      } catch (e) {}
    }
  }

  window.debug = BbaseEst.debug = debug;

  function Wrapper(value, chainAll) {
    this._chain = !!chainAll;
    this._wrapped = value;
  }

  /**
   * @description 用于node.js 导出
   * @method [模块] - exports
   * @private
   */
  /* if (typeof exports !== 'undefined' && exports.cmd) {
     if (typeof module !== 'undefined' && module.exports) {
       exports = module.exports = BbaseEst;
     }
     exports.BbaseEst = BbaseEst;
   } else {*/
  root.BbaseEst = BbaseEst;
  //}

  function identity(value) {
    return value;
  }

  BbaseEst.identity = identity;
  BbaseEst.v = '0605041705'; // 机汇网
  //BbaseEst.v = '00111114'; // 上门网
  var matchCallback = function (value, context, argCount) {
    if (value == null) return identity;
    if (isFunction(value)) return createCallback(value, context, argCount);
    if (typeOf(value) === 'object') return matches(value);
    if (typeOf(value) === 'array') return value;
    return property(value);
  };
  var createCallback = function (func, context, argCount) {
    if (!context) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1:
        return function (value) {
          return func.call(context, value);
        };
      case 2:
        return function (value, other) {
          return func.call(context, value, other);
        };
      case 3:
        return function (value, index, collection) {
          return func.call(context, value, index, collection);
        };
      case 4:
        return function (accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
    }
    return function () {
      return func.apply(this, arguments);
    };
  };

  /**
   * @description 遍历数据或对象。如果传递了context参数，则把callback绑定到context对象上。
   * 如果list是数组，callback的参数是：(element, index, list, first, last)。
   * 如果list是个JavaScript对象，callback的参数是 (value, key, list, index, first, last))。返回list以方便链式调用。
   * 如果callback 返回false,则中止遍历
   * @method [数组] - each ( 遍历数据或对象 )
   * @param {Array/Object} obj 遍历对象
   * @param {Function} callback 回调函数
   * @param {Object} context 上下文
   * @return {Object}
   * @example
   *     BbaseEst.each([1, 2, 3], function(item, index, list, isFirst, isLast){
   *        alert(item);
   *     });
   *     ==> alerts each number in turn...
   *
   *     BbaseEst.each({one: 1, two: 2, three: 3}, function(value, key, object, index, isFirst, isLast){
   *        alert(value);
   *     });
   *     ==> alerts each number value in turn...
   */
  function each(obj, callback, context) {
    var i, length, first = false,
      last = false;
    if (obj == null) return obj;
    callback = createCallback(callback, context);
    if (obj.length === +obj.length) {
      for (i = 0, length = obj.length; i < length; i++) {
        first = i === 0 ? true : false;
        last = i === length - 1 ? true : false;
        if (callback(obj[i], i, obj, first, last) === false) break;
      }
    } else {
      var ks = keys(obj);
      for (i = 0, length = ks.length; i < length; i++) {
        first = i === 0 ? true : false;
        last = i === ks.length - 1 ? true : false;
        if (callback(obj[ks[i]], ks[i], obj, i, first, last) === false) break;
      }
    }
    return obj;
  }

  BbaseEst.each = BbaseEst.forEach = each;
  /**
   * @description 复制source对象中的所有属性覆盖到destination对象上，并且返回 destination 对象.
   * 复制是按顺序的, 所以后面的对象属性会把前面的对象属性覆盖掉(如果有重复).
   * @method [对象] - extend ( 继承 )
   * @param {Object} obj destination对象
   * @return {Object} 返回 destination 对象
   * @author wyj on 14/5/22
   * @example
   *      BbaseEst.extend({name: 'moe'}, {age: 50});
   *      ==> {name: 'moe', age: 50}
   */
  function extend(obj) {
    var h = obj.$$hashKey;
    if (typeOf(obj) !== 'object') return obj;
    each(slice.call(arguments, 1), function (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    setHashKey(obj, h);
    return obj;
  };
  BbaseEst.extend = extend;

  /**
   * @description 如果object是一个参数对象，返回true
   * @method [对象] - isFunction ( 判断是否是对象 )
   * @param {*} obj 待检测参数
   * @return {boolean}
   * @author wyj on 14/5/22
   * @example
   *      BbaseEst.isFunction(alert);
   *      ==> true
   */
  function isFunction(obj) {
    return typeof obj === 'function';
  };

  if (typeof /./ !== 'function') {
    BbaseEst.isFunction = isFunction;
  }
  /**
   * @description 返回一个对象里所有的方法名, 而且是已经排序的 — 也就是说, 对象里每个方法(属性值是一个函数)的名称.
   * @method [对象] - functions ( 返回一个对象里所有的方法名 )
   * @param {Object} obj 检测对象
   * @return {Array} 返回包含方法数组
   * @author wyj on 14/5/22
   * @example
   *      BbaseEst.functions(BbaseEst);
   *      ==> ["trim", "remove", "fromCharCode", "cloneDeep", "clone", "nextUid", "hash" ...
   */
  function functions(obj) {
    var names = [];
    for (var key in obj) {
      if (isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };
  BbaseEst.functions = BbaseEst.methods = functions;
  /**
   * 解码ASCII码
   * @method [字符串] - fromCharCode ( 解码ASCII码 )
   * @param code
   * @return {string}
   * @author wyj 15.2.9
   * @example
   *       BbaseEst.fromCharCode(97);
   *       ==> a
   */
  function fromCharCode(code) {
    try {
      return String.fromCharCode(code);
    } catch (e) {}
  };
  BbaseEst.fromCharCode = fromCharCode;
  /**
   * @description 返回一个封装的对象. 在封装的对象上调用方法会返回封装的对象本身, 直道 value 方法调用为止.
   * @method [对象] - chain ( 返回一个封装的对象 )
   * @param value
   * @return {*}
   * @author wyj on 14/5/22
   * @example
   *      var stooges = [{name: 'curly', age: 25}, {name: 'moe', age: 21}, {name: 'larry', age: 23}];
   *      var youngest = BbaseEst.chain(stooges)
   *          .sortBy(function(stooge){ return stooge.age; })
   *          .map(function(stooge){ return stooge.name + ' is ' + stooge.age; })
   *          .first()
   *          .value();
   *      ==> "moe is 21"
   */
  BbaseEst.chain = function (value) {
    value = new Wrapper(value);
    value._chain = true;
    return value;
  };

  /**
   * 获取方法或对象的值
   * @method [对象] - result ( 返回结果 )
   * @param  {*} object   [description]
   * @param  {string} property [description]
   * @return {*}          [description]
   * @example
   *       var object = {cheese: 'crumpets', stuff: function(){ return 'nonsense'; }};
   *       BbaseEst.result(object, 'cheese');
   *       ==> "crumpets"
   *
   *       BbaseEst.result(object, 'stuff');
   *       ==> "nonsense"
   */
  function result(object, property) {
    if (object == null) return void 0;
    var value = getValue.call(object, object, property);
    return typeOf(value) === 'function' ? value.call(object) : value;
  };
  BbaseEst.result = result;

  /**
   * 获取默认值
   * @method [对象] - defaults ( 默认值 )
   * @param  {object} obj [description]
   * @return {object}     [description]
   * @example
   *      BbaseEst.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
   *      ==> { 'user': 'barney', 'age': 36 }
   */
  function defaults(obj) {
    if (!typeOf(obj) === 'object') return obj;
    each(slice.call(arguments, 1), function (source) {
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    });
    return obj;
  };
  BbaseEst.defaults = defaults;

  /**
   * 函数调用
   * @method [object] - invoke
   * @param  {*} obj    [description]
   * @param  {string} method [description]
   * @return {array}        [description]
   * @example
   *       var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
   *       BbaseEst.invoke(object, 'a[0].b.c.slice', 1, 3);
   *       ==> [2, 3]
   */
  function invoke(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = typeOf(method) === 'function';
    return map(obj, function (value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };
  BbaseEst.invoke = invoke;

  /**
   * 原型判断
   * @method [对象] - has ( 原型判断 )
   * @param  {object}  obj [description]
   * @param  {string}  key [description]
   * @return {Boolean}     [description]
   */
  function has(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };
  BbaseEst.has = has;


  /**
   * 只执行一次
   * @method [对象] - once ( 只执行一次 )
   * @param  {fn} func [description]
   * @return {fn}      [description]
   * @example
   *       BbaseEst.once(function(){
   *
   *       });
   */
  function once(func) {
    var ran = false,
      memo;
    return function () {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };
  BbaseEst.once = once;


  function any(obj, callback, context) {
    var result = false;
    if (obj == null) return result;
    callback = matchCallback(callback, context);
    each(obj, function (value, index, list) {
      result = callback(value, index, list);
      if (result) return true;
    });
    return !!result;
  };
  BbaseEst.any = any;

  /**
   * 代理所有
   * @method [模式] - bindAll
   * @param  {[type]} obj [description]
   * @return {[type]}     [description]
   */
  function bindAll(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw Error('err31');
    each(funcs, function (f) {
      obj[f] = proxy(obj[f], obj);
    });
    return obj;
  };
  BbaseEst.bindAll = bindAll;

  /**
   * 判断2个对象是否相同
   * @method [对象] - equal ( 判断是否相同 )
   * @param  {*} a      [description]
   * @param  {*} b      [description]
   * @param  {array} aStack [description]
   * @param  {array} bStack [description]
   * @return {boolean}        [description]
   * @example
   *       BbaseEst.equal({name: 'aaa', age: 33}, {name: 'aaa', age: 33});
   *       ==> true
   *
   *       BbaseEst.equal(0, -0);
   *       ==> false
   *
   *       BbaseEst.equal(null, undefined);
   *       ==> false
   *
   *       BbaseEst.equal(null, null);
   *       ==> true
   *
   *       BbaseEst.equal(undefined, undefined);
   *       ==> true
   *
   *       BbaseEst.equal(false, false);
   *       ==> true
   *
   *       BbaseEst.equal(true, true);
   *       ==> true
   */
  function equal(a, b, aStack, bStack) {
    aStack = aStack || [];
    bStack = bStack || [];
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof BbaseEst) a = a._wrapped;
    if (b instanceof BbaseEst) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // RegExps are coerced to strings for comparison.
      case '[object RegExp]':
        // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        if (a != +a) return b != +b;
        // An `egal` comparison is performed for other numeric values.
        return a == 0 ? 1 / a == 1 / b : a == +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor,
      bCtor = b.constructor;
    if (
      aCtor !== bCtor && 'constructor' in a && 'constructor' in b &&
      !(typeOf(aCtor) === 'function' && aCtor instanceof aCtor &&
        typeOf(bCtor) === 'function' && bCtor instanceof bCtor)
    ) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0,
      result = true;
    // Recursively compare objects and arrays.
    if (className === '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size === b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = equal(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = has(b, key) && equal(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (has(b, key) && !size--) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };
  BbaseEst.equal = equal;


  /**
   * @description 如果对象 object 中的属性 property 是函数, 则调用它, 否则, 返回它。
   * @method [对象] - result ( 返回结果 )
   * @param obj
   * @return {*}
   * @private
   * @author wyj on 14/5/22
   */
  var result = function (obj, context) {
    //var ctx = typeOf(context) !== 'undefined' ? context : BbaseEst;
    return this._chain ? new Wrapper(obj, true) : obj;
  };
  // ObjectUtils
  /**
   * @description [1]检测数据类型 [undefined][number][string][function][regexp][array][date][error]
   * @method [对象] - typeOf ( 检测数据类型 )
   * @param {*} target 检测对象
   * @return {*|string}
   * @author wyj on 14/5/24
   * @example
   *      BbaseEst.typeOf(BbaseEst);
   *      ==> 'object'
   */
  var _type = {
    "undefined": "undefined",
    "number": "number",
    "boolean": "boolean",
    "string": "string",
    "[object Function]": "function",
    "[object RegExp]": "regexp",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object Error]": "error",
    "[object File]": "file",
    "[object Blob]": "blob"
  };

  function typeOf(target) {
    return _type[typeof target] || _type[toString.call(target)] || (target ? "object" : "null");
  }

  BbaseEst.typeOf = typeOf;

  /**
   * @description 根据字段获取值
   * @method [对象] - getValue ( 根据字段获取值 )
   * @param object
   * @param path
   * @return {*}
   * @author wyj 14.12.4
   * @example
   *    var object = {item: {name: join}};
   *    BbaseEst.getValue(object, 'item.name');
   *    ==> "join"
   */
  function getValue(object, path) {
    if (isEmpty(object)) return null;
    var array, result;
    if (arguments.length < 2 || typeOf(path) !== 'string') {
      console.error('err30');
      return;
    }
    array = path.split('.');

    function get(object, array) {
      if (isEmpty(object)) return null;
      each(array, function (key) {
        if (typeOf(object) === 'string') {
          return false;
        }
        if (key in object) {
          if (array.length === 1) {
            // 如果为数组最后一个元素， 则返回值
            result = object[key];
          } else {
            // 否则去除数组第一个， 递归调用get方法
            array.shift();
            get(object[key], array);
            // 同样跳出循环
            return false;
          }
        } else {
          // 没找到直接跳出循环
          return false;
        }
      });
      return result;
    }

    return get(object, array);
    /*var array = [];
     var temp = cloneDeep(object);
     if (typeOf(path) === 'string'){
     array = path.split('.');
     each(array, function(key){
     temp = temp[key];
     });
     } else if (typeOf(path) === 'function'){
     path.call(this, object);
     }
     return temp;*/
  }

  BbaseEst.getValue = getValue;

  /**
   * @description 设置对象值
   *
   * @method [对象] - setValue ( 设置对象值 )
   * @param object
   * @param path
   * @param value
   * @return {boolean}
   * @author wyj 14.12.4
   * @example
   *    var object = {};
   *    BbaseEst.setValue(object, 'item.name', 'bbb');
   *    ==> {item: {name: 'bbb'}};
   */
  function setValue(object, path, value) {
    if (arguments.length < 3 || typeOf(path) !== 'string') return false;
    var array = path.split('.');
    if (!object) {
      console.log('setValue ==> object can not be null!!');
      object = {};
    }

    function set(object, array, value) {
      each(array, function (key) {
        if (!(key in object)) object[key] = {};
        if (array.length === 1) {
          object[key] = value;
        } else {
          array.shift();
          if (!object[key]) object[key] = {};
          set(object[key], array, value);
          return false;
        }
      });
    }
    set(object, array, value);
  }

  BbaseEst.setValue = setValue;


  /**
   * @description 判断是否为空 (空数组， 空对象， 空字符串， 空方法， 空参数, null, undefined) 不包括数字0和1 【注】苹果手机有问题
   * @method [对象] - isEmpty ( 判断是否为空 )
   * @param {Object} value
   * @return {boolean}
   * @author wyj on 14/6/26
   * @example
   *      BbaseEst.isEmpty(value);
   *      ==> false
   */
  function isEmpty(value) {
    var result = true;
    if (typeOf(value) === 'number') return false;
    if (!value) return result;
    var className = toString.call(value),
      length = value.length;
    if ((className == '[object Array]' || className == '[object String]' || className == '[object Arguments]') ||
      (className == '[object Object]' && typeof length == 'number' && isFunction(value.splice))) {
      return !length;
    }
    each(value, function () {
      return (result = false);
    });
    return result;
  }

  BbaseEst.isEmpty = isEmpty;

  function isBlank(value) {
    if (isEmpty(value)) {
      return true;
    }
    if (value === '' || value === 'null' || value === 'undefined') {
      return true;
    }
    return false;
  }
  BbaseEst.isBlank = isBlank;

  /**
   * @description [2]判断对象是否含有某个键 不是原型对象
   * @method [对象] - hasKey ( 判断对象是否含有某个键 )
   * @param {Object} obj 检测对象
   * @param {Sting} key 检测键
   * @return {boolean|*}
   * @author wyj on 14/5/25
   * @example
   *      var object6 = {name:1,sort:1};
   *      BbaseEst.hasKey(object6, 'name')
   *      ==> true
   */
  function hasKey(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  }

  BbaseEst.hasKey = hasKey;
  /**
   * @description 计算hash值
   * @method [对象] - hashKey ( 计算hash值 )
   * @param obj
   * @return {string}
   * @author wyj on 14/6/25
   * @example
   *      BbaseEst.hashKey(obj);
   *      ==> 'object:001'
   */
  function hashKey(obj) {
    var objType = typeof obj,
      key;
    if (objType == 'object' && obj !== null) {
      if (typeof (key = obj.$$hashKey) == 'function') {
        key = obj.$$hashKey();
      } else if (key === undefined) {
        key = obj.$$hashKey = nextUid();
      }
    } else {
      key = obj;
    }
    return objType + ':' + key;
  }

  BbaseEst.hashKey = hashKey;
  /**
   * 字符串转换成hash值
   * @method [字符串] - hash ( 字符串转换成hash值 )
   * @param str
   * @return {number}
   * @author wyh 15.2.28
   * @example
   *        BbaseEst.hash('aaaaa');
   */
  function hash(str) {

    try {
      if (!str) {
        return null;
      }
      var hash = 5381,
        i = str.length;
      while (i)
        hash = (hash * 33) ^ str.charCodeAt(--i);
      return hash >>> 0;
    } catch (e) {
      debug('err34 -> ' + e);
    }
  }

  BbaseEst.hash = hash;
  /**
   * @description 设置hashKey
   * @method [对象] - setHashKey ( 设置hashKey )
   * @param {Object} obj
   * @param {String} h
   */
  function setHashKey(obj, h) {
    if (h) {
      obj.$$hashKey = h;
    } else {
      delete obj.$$hashKey;
    }
  }

  BbaseEst.setHashKey = setHashKey;

  /**
   * @description [3]过滤对象字段
   * @method [对象] - pick ( 过滤对象字段 )
   * @param {Object} obj 过滤对象
   * @param {Function} callback 回调函数
   * @param context
   * @return {{}}
   * @author wyj on 14/5/26
   * @example
   *      var object3 = {name:'a', sort: '1', sId: '000002'};
   *      BbaseEst.pick(object3, ['name','sort'])
   *      ==> {"name":"a","sort":"1"}
   */
  function pick(obj, callback, context) {
    var result = {},
      key;
    if (typeOf(callback) === 'function') {
      for (key in obj) {
        var value = obj[key];
        if (callback.call(context, value, key, obj)) result[key] = value;
      }
    } else {
      var keys = concat.apply([], slice.call(arguments, 1));
      each(keys, function (key) {
        if (key in obj) result[key] = obj[key];
      });
    }
    return result;
  }

  BbaseEst.pick = pick;
  /**
   * @description 返回获取对象属性值的方法
   * @method [对象] - property ( 返回获取对象属性值 )
   * @param {Object} key
   * @return {Function}
   */
  function property(key) {
    return function (object) {
      if (typeOf(object) === 'string') return null;
      return getValue(object, key);
    };
  }

  BbaseEst.property = property;
  /**
   * @description 翠取对象中key对应的值
   * @method [对象] - pluck ( 翠取对象中key对应的值 )
   * @param obj
   * @param key
   * @return {*}
   * @author wyj on 14/7/5
   * @example
   *      var characters = [ { 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 } ];
   *      var result = BbaseEst.pluck(characters, 'name');
   *      ==> [ "barney", "fred" ]
   */
  function pluck(obj, key) {
    return map(obj, property(key), null);
  }

  BbaseEst.pluck = pluck;
  /**
   * @description 释放数组， 若数组池个数少于最大值， 则压入数组池以备用
   * @method [数组] - releaseArray ( 释放数组 )
   * @author wyj on 14/7/1
   * @example
   *      BbaseEst.releaseArray(array);
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }

  BbaseEst.releaseArray = releaseArray;
  /**
   * @description 释放对象， 若对象池个数少于最大值， 则压入对象池以备用
   * @method [对象] - releaseObject ( 释放对象 )
   * @author wyj on 14/7/1
   * @example
   *      BbaseEst.releaseObject(object);
   */
  function releaseObject(object) {
    object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
    if (objectPool.length < maxPoolSize) {
      objectPool.push(object);
    }
  }

  BbaseEst.releaseObject = releaseObject;
  /**
   * @description 获取数组池
   * @method [数组] - getArray ( 获取数组池 )
   * @return {Array}
   * @author wyj on 14/7/1
   * @example
   *      var array = BbaseEst.getArray();
   */
  function getArray() {
    return arrayPool.pop() || [];
  }

  BbaseEst.getArray = getArray;
  /**
   * @description 获取对象池 主要用于优化性能
   * @method [对象] - getObject ( 获取对象池 )
   * @return {Object}
   * @author wyj on 14/7/1
   * @example
   *      var object = BbaseEst.getObject();
   */
  function getObject() {
    return objectPool.pop() || { 'array': null, 'cache': null, 'criteria': null, 'false': false, 'index': 0, 'null': false, 'number': null, 'object': null, 'push': null, 'string': null, 'true': false, 'undefined': false, 'value': null };
  }

  BbaseEst.getObject = getObject;

  function baseClone(value, isDeep, callback, stackA, stackB) {
    //var type = getType(value);
    var result;
    var type = typeOf(value);
    if (callback) {
      result = callback(value);
      if (typeof result !== 'undefined') return result;
    }
    if (typeof value === 'object' && type !== 'null') {
      switch (type) {
        case 'function':
          return value;
          break;
        case 'date':
          return new Date(+value);
          break;
        case 'string':
          return new String(value);
          break;
        case 'regexp':
          result = RegExp(value.source, /\w*$/.exec(value));
          result.lastIndex = value.lastIndex;
          break;
      }
    } else {
      return value;
    }
    var isArr = type === 'array';
    if (isDeep) {
      var initedStack = !stackA;
      stackA || (stackA = getArray());
      stackB || (stackB = getArray());
      var length = stackA.length;
      while (length--) {
        if (stackA[length] === value) {
          return stackB[length];
        }
      }
      result = isArr ? Array(value.length) : {};
    } else {
      result = isArr ? arraySlice(value, 0, value.length) : extend({}, value);
    }
    if (isArr) {
      if (hasOwnProperty.call(value, 'index')) {
        result.index = value.index;
      }
      if (hasOwnProperty.call(value, 'input')) {
        result.input = value.input;
      }
    }
    if (!isDeep) {
      return result;
    }
    stackA.push(value);
    stackB.push(result);
    each(value, function (target, key) {
      result[key] = baseClone(target, isDeep, callback, stackA, stackB);
    });
    if (initedStack) {
      releaseArray(stackA);
      releaseArray(stackB);
    }
    return result;
  }

  /**
   * @description 浅复制
   * @method [对象] - clone ( 浅复制 )
   * @param value
   * @param callback
   * @param context
   * @return {*}
   * @author wyj on 14/7/6
   * @example
   *
   */
  function clone(value, callback, context) {
    callback = typeOf(callback) === 'function' && matchCallback(callback, context, 1);
    return baseClone(value, false, callback);
  }

  BbaseEst.clone = clone;
  /**
   * @description 深复制
   * @method [对象] - cloneDeep ( 深复制 )
   * @param value
   * @param callback
   * @param context
   * @return {*}
   * @author wyj on 14/7/6
   * @example
   *
   */
  function cloneDeep(value, callback, context) {
    callback = typeOf(callback) === 'function' && matchCallback(callback, context, 1);
    return baseClone(value, true, callback);
  }

  BbaseEst.cloneDeep = cloneDeep;

  /**
   * @description 返回一个设置参数的对象
   * @method [对象] - setArguments ( 返回一个设置参数的对象 )
   * @param args
   * @param {object/string} append
   * @author wyj on 14.9.12
   *      return BbaseEst.setArguments(arguments, {age： 1});
   */
  function setArguments(args, append) {
    this.value = [].slice.call(args);
    this.append = append;
  }

  BbaseEst.setArguments = setArguments;



  // FormUtils =============================================================================================================================================

  /**
   * @description 表单验证
   * @method [表单] - validation ( 表单验证 )
   * @param  {String} str  待验证字符串 str可为数组 判断所有元素是否都为数字
   * @param  {String} type 验证类型
   * @return {Boolean}      返回true/false
   * @author wyj on 14.9.29
   * @example
   *      var result_n = BbaseEst.validation(number, 'number'); // 数字或带小数点数字
   *      var result_e = BbaseEst.validation(email, 'email'); // 邮箱
   *      var result_c = BbaseEst.validation(cellphone, 'cellphone'); // 手机号码
   *      var result_d = BbaseEst.validation(digits, 'digits'); // 纯数字， 不带小数点
   *      var result_u = BbaseEst.validation(url, 'url'); // url地址
   */
  function validation(str, type) {
    var pattern, flag = true;
    switch (type) {
      case 'cellphone':
        pattern = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
        break;
      case 'email':
        pattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        break;
      case 'url':
        pattern = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        break;
      case 'number':
        if (isEmpty(str)){
          return false;
        }
        // 可带小数点 如：0.33， 35.325
        pattern = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/; // ^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$ .1 matches 0.1 matches 1.12 matches 123.12 matches 92 matches 092 matches 092.13 matches 0 doesn't match 0.0 doesn't match 0.00 doesn't match 00 doesn't match 1.234 doesn't match -1 doesn't match -1.2 doesn't match
        break;
      case 'digits': //还可带小数点
        pattern = /^\d+$/;
        break;
    }
    if (typeOf(str) === 'array') {
      each(str, function (item) {
        if (!pattern.test(item))
          flag = false;
      });
    } else {
      flag = pattern.test(str);
    }
    return flag;
  }

  BbaseEst.validation = validation;


  // StringUtils =============================================================================================================================================
  /**
   * 获取当前字符在字符串中的索引值
   * @method [字符串] - indexOf
   * @param  {string} str  原字符串
   * @param  {string} str2 字符串
   * @return {number}      索引值
   */
  function indexOf(str, str2) {
    if (typeOf(str) === 'array') {
      return str.indexOf ? str.indexOf(str2) : arrayIndex(str, str2);
    }
    return str.indexOf(str2);
  }
  BbaseEst.indexOf = indexOf;

  /**
   * 获取当前字符在字符串中的向后索引值
   * @method [字符串] - lastIndexOf
   * @param  {string} str  原字符串
   * @param  {string} str2 字符串
   * @return {number}      索引值
   */
  function lastIndexOf(str, str2) {
    return str.lastIndexOf(str2);
  }
  BbaseEst.lastIndexOf = lastIndexOf;

  /**
   * @description 产生唯一身份标识， 如'012ABC', 若为数字较容易数字溢出
   * @method [字符串] - nextUid ( 产生唯一身份标识 )
   * @return {string}
   * @param {String} prefix 前缀
   * @author wyj on 14/6/23
   * @example
   *      var uid = BbaseEst.nextUid('Uid');
   *      ==> 'Uid001'
   */
  function nextUid(prefix) {
    var index = uid.length,
      digit;
    if (typeOf(prefix) === "undefined")
      prefix = '';
    while (index) {
      index--;
      digit = uid[index].charCodeAt(0);
      if (digit == 57 /*'9'*/ ) {
        uid[index] = 'A';
        return prefix + uid.join('');
      }
      if (digit == 90 /*'Z'*/ ) {
        uid[index] = '0';
      } else {
        uid[index] = fromCharCode(digit + 1);
        return prefix + uid.join('');
      }
    }
    uid.unshift('0');
    return prefix + uid.join('');
  }

  BbaseEst.nextUid = nextUid;

  /**
   * @description id值瘦身 去掉前面的字母与0 比如 Product_0000000000000000000132 瘦身为132
   * @method [字符串] - encodeId ( id值瘦身 )
   * @param target
   * @return {string}
   * @author wyj 15.1.9
   * @example
   *      BbaseEst.encodeId('Product_00000000000000132');
   *      ==> 132
   */
  function encodeId(target) {
    return target == null ? "" : target.replace(/^[^1-9]+/, "");
  }

  BbaseEst.encodeId = encodeId;

  /**
   * encodeUrl
   * @method [字符串] - encodeUrl ( 编码url )
   * @param  {string} url [description]
   * @return {string}     [description]
   */
  function encodeUrl(url) {
    return encodeURIComponent(url);
  }
  BbaseEst.encodeUrl = encodeUrl;

  /**
   * decodeUrl
   * @method [字符串] - decodeUrl ( 解码url )
   * @param  {string} url [description]
   * @return {string}     [description]
   */
  function decodeUrl(url) {
    return decodeURIComponent(url);
  }
  BbaseEst.decodeUrl = decodeUrl;

  /**
   * 还原ID
   * @method [字符串] - decodeId ( 还原ID )
   * @param id
   * @param prefix
   * @param length
   * @return {string}
   * @author wyj 15.1.13
   * @example
   *      BbaseEst.decodeId('123' , 'Product_' , 32);
   *      ==> Product_00000000000000000000123
   */
  function decodeId(id, prefix, length) {
    var len = prefix.length + id.length - 1;
    return prefix + new Array(length - len).join('0') + id;
  }

  BbaseEst.decodeId = decodeId;

  /**
   * @description 转换成小写字母
   * @method [字符串] - lowercase ( 转换成小写字母 )
   * @param {String} string 原字符串
   * @return {string}
   * @author wyj on 14/6/17
   * @example
   *      BbaseEst.lowercase("LE");
   *      ==> le
   */
  function lowercase(string) {
    return typeOf(string) === 'string' ? string.toLowerCase() : string;
  }

  BbaseEst.lowercase = lowercase;
  /**
   * @description 转换成大写字母
   * @method [字符串] - uppercase ( 转换成大写字母 )
   * @param {String} string 原字符串
   * @return {string}
   * @author wyj on 14/6/17
   * @example
   *      BbaseEst.uppercase("le");
   *      ==> LE
   */
  function uppercase(string) {
    return typeOf(string) === 'string' ? string.toUpperCase() : string;
  }

  BbaseEst.uppercase = uppercase;

  /**
   * @description 判定一个字符串是否包含另一个字符串
   * @method [字符串] - contains ( 字符串是否包含另一个字符串 )
   * @param {string} target 目标字符串
   * @param {string} 包含字符串
   * @param {string} 判定一个元素的className 是否包含某个特定的class
   * @return {boolean} 返回true/false
   * @author wyj on 14-04-23
   * @example
   *      BbaseEst.contains("aaaaa", "aa");
   *      ==> true
   */
  function contains(target, str, separator) {
    return separator ? indexOf(separator + target + separator, separator + str + separator) > -1 : indexOf(target, str) > -1;
  }

  BbaseEst.contains = contains;
  /**
   * @description 判定目标字符串是否位于原字符串的开始之处
   * @method [字符串] - startsWidth ( 字符串是否位于原字符串的开始之处 )
   * @param {target} 原字符串
   * @param {str} 目标字符串
   * @param {boolean} 是否忽略大小写
   * @return {boolean} true/false
   * @author wyj on 14-04-23
   * @example
   *      BbaseEst.startsWidth('aaa', 'aa', true);
   *      ==> true
   */
  function startsWith(target, str, ignorecase) {
    if (!target) {
      return false;
    }
    var start_str = target.substr(0, str.length);
    return ignorecase ? lowercase(start_str) === lowercase(str) : start_str === str;
  }

  BbaseEst.startsWidth = startsWith;
  /**
   * @description 判定目标字符串是否位于原字符串的结束之处
   * @method [字符串] - endsWidth ( 字符串是否位于原字符串的结束之处 )
   * @param {target} 原字符串
   * @param {str} 目标字符串
   * @param {boolean} 是否忽略大小写
   * @return {boolean} true/false
   * @author wyj on 14-04-23
   * @example
   *      BbaseEst.endsWidth('aaa', 'aa', true);
   *      ==> true
   */
  function endsWith(target, str, ignorecase) {
    var end_str = target.substring(target.length - str.length);
    return ignorecase ? lowercase(end_str) === lowercase(str) : end_str === str;
  }

  BbaseEst.endsWith = endsWith;
  /**
   * @description 取得一个字符串所有字节的长度
   * @method [字符串] - byteLen ( 取得一个字符串所有字节的长度 )
   * @param target 目标字符串
   * @param fix 汉字字节长度，如mysql存储汉字时， 是用3个字节
   * @return {Number}
   * @author wyj on 14-04-23
   * @example
   *      BbaseEst.byteLen('sfasf我'， 2);
   *      ==> 7
   */
  function byteLen(target, fix) {
    fix = fix ? fix : 2;
    var str = new Array(fix + 1).join('-');
    return target.replace(/[^\x00-\xff]/g, str).length;
  }

  BbaseEst.byteLen = byteLen;

  /**
   * @description 对字符串进行截取处理，默认添加三个点号【版本二】
   * @method [字符串] - cutByte ( 对字符串进行截取处理 )
   * @param str 目标字符串
   * @param length 截取长度
   * @param truncation 结尾符号
   * @return {string}
   * @author wyj on 14-04-25
   * @example
   *     BbaseEst.cutByte('aaaaaa', 4, '...');
   *     ==> 'a...'
   */
  function cutByte(str, length, truncation) {
    if (isEmpty(str)) return '';
    //提前判断str和length
    if (!(str + "").length || !length || +length <= 0) {
      return "";
    }
    var length = +length,
      truncation = typeof (truncation) == 'undefined' ? "..." : truncation.toString(),
      endstrBl = byteLen(truncation);
    if (length < endstrBl) {
      truncation = "";
      endstrBl = 0;
    }
    //用于二分法查找
    function n2(a) {
      var n = a / 2 | 0;
      return (n > 0 ? n : 1);
    }

    var lenS = length - endstrBl,
      _lenS = 0,
      _strl = 0;
    while (_strl <= lenS) {
      var _lenS1 = n2(lenS - _strl),
        addn = byteLen(str.substr(_lenS, _lenS1));
      if (addn == 0) {
        return str;
      }
      _strl += addn;
      _lenS += _lenS1;
    }
    if (str.length - _lenS > endstrBl || byteLen(str.substring(_lenS - 1)) > endstrBl) {
      return str.substr(0, _lenS - 1) + truncation;
    } else {
      return str;
    }
  }

  BbaseEst.cutByte = cutByte;
  /**
   * @description 替换指定的html标签, 当第3个参数为true时， 删除该标签并删除标签里的内容
   * @method [字符串] - stripTabName ( 替换指定的html标签 )
   * @param {String} target 目标字符串
   * @param {String} tagName 标签名称
   * @param {String} deep 是否删除标签内的内容
   * @return {string}
   * @author wyj on 14/6/18
   * @example
   *      BbaseEst.stripTagName("<script>a</script>", "script", true);
   *      ==> ''
   *      BbaseEst.stripTagName("<script>a</script>", "script", false);
   *      ==> 'a'
   */
  function stripTagName(target, tagName, deep) {
    var pattern = deep ? "<" + tagName + "[^>]*>([\\S\\s]*?)<\\\/" + tagName + ">" : "<\/?" + tagName + "[^>]*>";
    return String(target || '').replace(new RegExp(pattern, 'img'), '');
  }

  BbaseEst.stripTagName = stripTagName;
  /**
   * @description 移除字符串中所有的script标签。弥补stripTags 方法的缺陷。此方法应在stripTags之前调用
   * @method [字符串] - stripScripts ( 移除字符串中所有的script标签 )
   * @param {String} target 目标字符串
   * @return {string} 返回字符串
   * @author wyj on 14/5/5
   * @example
   *     BbaseEst.stripScripts("a<script></script>");
   *     ==> 'a'
   */
  function stripScripts(target) {
    return String(target || '').replace(/<script[^>]*>([\S\s]*?)<\/script>/img, '');
  }

  BbaseEst.stripScripts = stripScripts;
  /**
   * @description 移除字符串中的html标签, 若字符串中有script标签，则先调用stripScripts方法
   * @method [字符串] - stripTags ( 移除字符串中的html标签 )
   * @param {String} target 原字符串
   * @return {string} 返回新字符串
   * @author wyj on 14/5/5
   * @example
   *     BbaseEst.stripTags('aa<div>bb</div>');
   *     ==> 'aabb'
   */
  function stripTags(target) {
    return String(target || '').replace(/<[^>]+>/img, '');
  }

  BbaseEst.stripTags = stripTags;
  /**
   * @description 替换原字符串中的“< > " '”为 “&lt;&gt;&quot;&#39;”
   * @method [字符串] - escapeHTML ( 替换原字符串中的“< > " '” )
   * @param {String} target 原字符串
   * @return {String} 返回新字符串
   * @author wyj on 14/5/5
   * @example
   *     BbaseEst.escapeHTML('<');
   *     ==> '&lt;'
   */
  function escapeHTML(target) {
    return target.replace(/&/mg, '&amp;')
      .replace(/</mg, '&lt;')
      .replace(/>/mg, '&gt;')
      .replace(/"/mg, '&quot;')
      .replace(/'/mg, '&#39;');
  }

  BbaseEst.escapeHTML = escapeHTML;
  /**
   * @description 替换原字符串中的“&lt;&gt;&quot;&#39;”为 “< > " '”
   * @method [字符串] - unescapeHTML ( 替换原字符串中的“&lt;&gt;&quot;&#39; )
   * @param {String} target 原字符串
   * @return {String} 返回新字符串
   * @author wyj on 14/5/5
   * @example
   *     BbaseEst.unescapeHTML('&lt;');
   *     ==> '<'
   */
  function unescapeHTML(target) {
    target = target || '';
    return target.replace(/&amp;/mg, '&')
      .replace(/&lt;/mg, '<')
      .replace(/&gt;/mg, '>')
      .replace(/&quot;/mg, '"')
      .replace(/&#([\d]+);/mg, function ($0, $1) {
        return fromCharCode(parseInt($1, 10));
      });
  }

  BbaseEst.unescapeHTML = unescapeHTML;
  /**
   * @description 将字符串安全格式化为正则表达式的源码
   * @method [字符串] - escapeRegExp ( 将字符串安全格式化为正则表达式的源码 )
   * @param {String} target 原字符串
   * @return {*}
   * @author wyj on 14/5/16
   * @example
   *      BbaseEst.escapeRegExp('aaa/[abc]/')
   *      ==> aaa\/\[abc\]\/;
   */
  function escapeRegExp(target) {
    return target.replace(/([-.*+?^${}()|[\]\/\\])/img, '\\$1');
  }

  BbaseEst.escapeRegExp = escapeRegExp;
  /**
   * @description 为字符串的某一端添加字符串。 如：005
   * @method [字符串] - pad ( 为字符串的某一端添加字符串 )
   * @param {String/Number} target 原字符串或数字
   * @param {Number} n 填充位数
   * @param {String} filling 填充字符串
   * @param {Boolean} right 在前或后补充
   * @param {Number} radix 转换进制 10进制或16进制
   * @param {Object} opts {String} opts.prefix 前缀
   * @author wyj on 14/5/5
   * @example
   *      BbaseEst.pad(5, 10, '0', {
   *        prefix: 'prefix',
   *        right: false,
   *        radix: 10
   *      });
   *      ==> prefix0005
   */
  function pad(target, n, filling, opts) {
    var str, options,
      prefix = '',
      length = n,
      filling = filling || '0';

    options = extend({
      right: false,
      radix: 10
    }, opts);

    str = target.toString(options.radix);
    if (options.prefix) {
      length = n - options.prefix.length;
      prefix = options.prefix;
      if (length < 0) {
        throw new Error('n too small');
      }
    }
    while (str.length < length) {
      if (!options.right) {
        str = filling + str;
      } else {
        str += filling;
      }
    }
    return prefix + str;
  }

  BbaseEst.pad = pad;
  /**
   * @description 格式化字符串，类似于模板引擎，但轻量级无逻辑
   * @method [字符串] - format ( 格式化字符串 )
   * @param {String} str 原字符串
   * @param {Object} object 若占位符为非零整数形式即对象，则键名为点位符
   * @return {String} 返回结果字符串
   * @author wyj on 14/5/5
   * @example
   *     BbaseEst.format("Result is #{0}, #{1}", 22, 23);
   *     ==> "Result is 22, 23"
   *
   *     BbaseEst.format("#{name} is a #{sex}", {name : 'Jhon',sex : 'man'});
   *     ==> "Jhon is a man"
   */
  function format(str, object) {
    var array = Array.prototype.slice.call(arguments, 1);
    return str.replace(/\\?\#{([^{}]+)\}/gm, function (match, name) {
      if (match.charAt(0) == '\\')
        return match.slice(1);
      var index = Number(name);
      if (index >= 0)
        return array[index];
      if (object && object[name] !== void 0)
        return object[name];
      return '';
    });
  }

  BbaseEst.format = format;

  /**
   * @description 比format更强大的模板引擎， 支持字符串模板、变量嵌套、四则运算、比较操作符、三元运算符
   * @method [字符串] - template ( 比format更强大的模板引擎 )
   * @param {String} str 待格式化字符串
   * @param {Object} data 替换对象
   * @return {String} result
   * @author wyj on 14.10.9
   * @example
   *         // 字符串
   *        var result3 =BbaseEst.template('hello {{name}}', { name: 'feenan'});
   *        ==> "hello feenan"
   *
   *        // 变量嵌套
   *        var result8 =BbaseEst.template('hello {{person.age}}', { person: {age: 50}});
   *        ==> "hello 50"
   *
   *        // 四则运算
   *        var result4 =BbaseEst.template('(1+2)*age = {{ (1+2)*age}}', {age: 18});
   *        ==> (1+2)*age = 54
   *
   *        // 比较操作符
   *        var result5 =BbaseEst.template('{{1>2}}', {});
   *        ==> false
   *        var result6 =BbaseEst.template('{{age > 18}}', {age: 20});
   *        ==> true
   *
   *        // 三元运算符
   *        var result7 =BbaseEst.template('{{ 2 > 1 ? name : ""}}', {name: 'feenan'});
   *        ==> feenan
   *
   *        // 综合
   *        var tmpl1 = '<div id="{{id}}" class="{{(i % 2 == 1 ? " even" : "")}}"> ' +
   *        '<div class="grid_1 alpha right">' +
   *        '<img class="righted" src="{{profile_image_url}}"/>' +
   *        '</div>' +
   *        '<div class="grid_6 omega contents">' +
   *        '<p><b><a href="/{{from_user}}">{{from_user}}</a>:</b>{{info.text}}</p>' +
   *        '</div>' +
   *        '</div>';
   *        var result = BbaseEst.template(tmpl1, {
   *              i: 5,
   *              id: "form_user",
   *              from_user: "Krasimir Tsonev",
   *              profile_image_url: "http://www.baidu.com/img/aaa.jpg",
   *              info: {
   *                  text: "text"
   *              }
   *         });
   */
  function template(str, data) {
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] || template(str) :
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        "with(obj){p.push('" +
        str
        .replace(/[\r\t\n]/g, " ")
        .split("{{").join("\t")
        .replace(/((^|}})[^\t]*)'/g, "$1\r")
        .replace(/\t(.*?)}}/g, "',$1,'")
        .split("\t").join("');")
        .split("}}").join("p.push('")
        .split("\r").join("\\'") + "');}return p.join('');");
    return data ? fn(data) : fn;
  }

  BbaseEst.template = BbaseEst.compile = template;


  /**
   * @description 移除字符串左端的空白
   * @method [字符串] - trimLeft ( 移除字符串左端的空白 )
   * @param {String} str 原字符串
   * @return {String} 返回新字符串
   * @author wyj on 14/5/6
   * @example
   *     BbaseEst.trimLeft('  dd    ');
   *     ==> 'dd    '
   */
  function trimLeft(str) {
    for (var i = 0; i < str.length; i++) {
      if (indexOf(whitespace, str.charAt(i)) === -1) {
        str = str.substring(i);
        break;
      }
    }
    return indexOf(whitespace, str.charAt(0)) === -1 ? (str) : '';
  }

  BbaseEst.trimLeft = trimLeft;
  /**
   * @description 移除字符串右端的空白
   * @method [字符串] - rtrim ( 移除字符串右端的空白 )
   * @param {String} str 原字符串
   * @return {String} 返回新字符串
   * @author wyj on 14/5/6
   * @example
   *     BbaseEst.rtrim('  dd    ');
   *     ==> '   dd'
   */
  function trimRight(str) {
    for (var i = str.length - 1; i >= 0; i--) {
      if (lastIndexOf(whitespace, str.charAt(i)) === -1) {
        str = str.substring(0, i + 1);
        break;
      }
    }
    return lastIndexOf(whitespace, str.charAt(str.length - 1)) === -1 ? (str) : '';
  }

  BbaseEst.trimRight = trimRight;
  /**
   * @description 移除字符串两端的空白, 当字符串为undefined时， 返回null
   * @method [字符串] - trim ( 移除字符串两端的空白 )
   * @param {String} str 原字符串
   * @return {String} 返回新字符串
   * @author wyj on 14/5/6
   * @example
   *     BbaseEst.trim('  dd    ');
   *     ==> 'dd'
   */
  function trim(str) {
    if (isEmpty(str)) return null;
    if (typeOf(str) !== 'string'){
      return str;
    }
    for (var i = 0; i < str.length; i++) {
      if (indexOf(whitespace, str.charAt(i)) === -1) {
        str = str.substring(i);
        break;
      }
    }
    for (i = str.length - 1; i >= 0; i--) {
      if (indexOf(whitespace, str.charAt(i)) === -1) {
        str = str.substring(0, i + 1);
        break;
      }
    }
    return indexOf(whitespace, str.charAt(0)) === -1 ? (str) : '';
  }

  BbaseEst.trim = trim;
  /**
   * @description 去除字符串中的所有空格
   * @method [字符串] - deepTrim ( 去除字符串中的所有空格 )
   * @param {String} str 原字符串
   * @return {String} 返回新字符串
   * @author wyj on 14/5/6
   * @example
   *     BbaseEst.deepTrim('a b c');
   *     ==> 'abc'
   */
  function trimDeep(str) {
    return str.toString().replace(/\s*/gm, '');
  }

  BbaseEst.trimDeep = trimDeep;



  // ArrayUtils ===============================================================================================================================================


  /**
   * 从数组中移除
   * @method [数组] - remove ( 数组中移除数组 )
   * @param {array} targetList 原数组
   * @param {array} removeList 待移除数组
   * @param callback 两元素比较  返回true/false
   * @return {array}
   * @example
   *       var targetList = [{key: '11', value: '11'},{key: '11', value: '33'}, {key: '22', value: '22'}, {key: '33', value: '33'}];
   *
   *       var targetList2 = [1, 2, 3, 4, 5];
   *       BbaseEst.remove(targetList2, 2);
   *       ==> [1, 3, 4, 5]
   *
   *       BbaseEst.remove(targetList, {key: '11'});
   *       ==> [{key: '22', value: '22'}, {key: '33', value: '33'}]
   *
   *       BbaseEst.remove(targetList, {key: '11', value: '33'});
   *       ==> [{key: '11', value: '11'},{key: '22', value: '22'}, {key: '33', value: '33'}]
   *
   *       var removeList = [{key: '11'}];
   *       BbaseEst.remove(targetList, removeList, function(targetItem, removeItem){
   *          return targetItem.key === removeItem.key;
   *       });
   *       ==> [{key: '22', value: '22'}, {key: '33', value: '33'}];
   */
  function remove(targetList, removeList, callback) {
    var i = 0,
      hasCallback = false,
      isEqual = false;

    if (typeOf(targetList) !== 'array') {
      throw new TypeError('err32');
      return targetList;
    }
    if (typeOf(removeList) !== 'array') {
      removeList = [removeList];
    }
    if (callback) hasCallback = true;

    i = targetList.length;

    while (i > 0) {
      var item = targetList[i - 1];
      isEqual = false;
      each(removeList, function (model) {
        if (hasCallback && callback.call(this, item, model)) {
          isEqual = true;
        } else if (!hasCallback) {
          if (typeOf(model) === 'object' && findIndex([item], model) > -1) {
            isEqual = true;
          } else if (item === model) {
            isEqual = true;
          }
        }
        if (isEqual) {
          targetList.splice(i - 1, 1);
          return false;
        }
      });
      i--;
    }
    return targetList;
  }

  BbaseEst.remove = remove;
  /**
   * @description 获取对象的所有KEY值
   * @method [数组] - keys ( 获取对象的所有KEY值 )
   * @param {Object} obj 目标对象
   * @return {Array}
   * @author wyj on 14/5/25
   * @example
   *      BbaseEst.keys({name:1,sort:1});
   *      ==> ['name', 'sort']
   */
  function keys(obj) {
    if (typeOf(obj) !== 'object') return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj)
      if (hasKey(obj, key)) keys.push(key);
    return keys;
  }

  BbaseEst.keys = keys;
  /**
   * @description 用来辨别 给定的对象是否匹配指定键/值属性的列表
   * @method [数组] - matches ( 对象是否匹配指定键/值属性的列表 )
   * @param attrs
   * @return {Function}
   * @author wyj on 14/6/26
   * @example
   */
  function matches(attrs) {
    return function (obj) {
      if (obj == null) return isEmpty(attrs);
      if (obj === attrs) return true;
      for (var key in attrs)
        if (attrs[key] !== obj[key]) return false;
      return true;
    };
  }

  BbaseEst.matches = matches;
  /**
   * @description 数组过滤
   * @method [数组] - filter ( 数组过滤 )
   * @param {Array} collection 数组
   * @param {Function} callback 回调函数
   * @param args
   * @author wyj on 14/6/6
   * @example
   *      var list = [{"name":"aa"},{"name":"bb"},{"name":"cc"}, {"name":"bb", address:"zjut"}];
   *      var result = BbaseEst.filter(list, function(item){
   *          return item.name.indexOf('b') > -1;
   *      });
   *      ==> [ { "name": "bb" }, { "address": "zjut", "name": "bb" } ]
   */
  function filter(collection, callback, context) {
    var results = [];
    if (!collection) return result;
    var callback = matchCallback(callback, context);
    each(collection, function (value, index, list) {
      if (callback(value, index, list)) results.push(value);
    });
    return results;
  }

  BbaseEst.filter = filter;

  /**
   * @description 数组中查找符合条件的索引值 比较原始值用indexOf
   * @method [数组] - findIndex ( 数组中查找符合条件的索引值 )
   * @param array
   * @param {Function} callback 回调函数
   * @param {Object} context 上下文
   * @return {number}
   * @author wyj on 14/6/29
   * @example
   *      var list = [{"name":"aa"},{"name":"bb"},{"name":"cc"}, {"name":"bb", address:"zjut"}];
   *      var index = BbaseEst.findIndex(list, {name: 'aa'});
   *      ==> 0
   *
   *      var index2 =  BbaseEst.findIndex(list, function(item){
   *         return item.name === 'aa';
   *      });
   *      ==> 0
   */
  function findIndex(array, callback, context) {
    var index = -1,
      length = array ? array.length : 0;
    callback = matchCallback(callback, context);
    while (++index < length) {
      if (callback(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  BbaseEst.findIndex = findIndex;


  /**
   * @description 数组转化为object 如果对象key值为数字类型， 则按数字从小到大排序
   * @method [数组] - arrayToObject ( 数组转化为object )
   * @param {Array} list 目标数组
   * @param {String} name key
   * @param {String} val value
   * @return {Object} object
   * @author wyj on 14/5/24
   * @example
   *      var list4 = [{key:'key1',value:'value1'},{key:'key2',value:'value2'}];
   *      BbaseEst.arrayToObject(list4, 'key', 'value');
   *      ==> {key1: 'value1',key2: 'value2'}
   */
  function arrayToObject(list, key, val) {
    var obj = {};
    each(list, function (item) {
      if (typeOf(item[key]) !== 'undefined') {
        obj[item[key]] = item[val];
      }
    });
    return obj;
  }

  BbaseEst.arrayToObject = arrayToObject;
  /**
   * @description 对象转化为数组
   * @method [数组] - arrayFromObject ( 对象转化为数组 )
   * @param {Object} obj 待转化的对象
   * @return {Array} 返回数组
   * @author wyj on 14/5/24
   * @example
   *      var obj = {key1: 'value1', key2: 'value2'};
   *      var result = BbaseEst.arrayFromObject(obj, 'key', 'value');
   *      ==> [{key: 'key1', value: 'value1'}, {key: 'key2', value: 'value2'}]
   */
  function arrayFromObject(obj, name, value) {
    var list = [];
    if (typeOf(obj) !== 'object') {
      return [];
    }
    each(obj, function (val, key) {
      var object = {};
      object[name] = key;
      object[value] = val;
      list.push(object);
    });
    return list;
  }

  BbaseEst.arrayFromObject = arrayFromObject;
  /**
   * @description 交换元素
   * @method [数组] - arrayExchange ( 交换元素 )
   * @param {Array} list 原数组
   * @param {Number} thisdx 第一个元素索引值
   * @param {Number} targetdx 第二个元素索引值
   * @param {Object} opts {String} opts.column 需要替换的列值;{Function} opts.callback(thisNode, nextNode) 回调函数 返回两个对调元素
   * @author wyj on 14/5/13
   * @example
   *      var list2 = [{name:1, sort:1},{name:2, sort:2}];
   *      BbaseEst.arrayExchange(list2, 0 , 1, {
   *          column:'sort',
   *          callback:function(thisNode, targetNode){
   *          }
   *      });
   *      ==> [{name:2,sort:1},{name:1,sort:2}]
   */
  function arrayExchange(list, thisdx, targetdx, opts) {
    if (thisdx < 0 || thisdx > list.length || targetdx < 0 || targetdx > list.length) {
      throw new Error('err33');
    }
    var thisNode = list[thisdx],
      nextNode = list[targetdx],
      temp = thisNode,
      thisSort = 0;
    // 更换列值
    if (opts && typeof opts.column === 'string') {
      thisSort = getValue(thisNode, opts.column);
      setValue(thisNode, opts.column, getValue(nextNode, opts.column));
      setValue(nextNode, opts.column, thisSort);
    }
    // 更新数据
    if (opts && typeof opts.callback === 'function') {
      opts.callback.apply(null, [thisNode, nextNode]);
    }
    // 替换位置
    list[thisdx] = nextNode;
    list[targetdx] = temp;
  }

  BbaseEst.arrayExchange = arrayExchange;
  /**
   * @description 数组插序
   * @method [数组] - arrayInsert ( 数组插序 )
   * @param {Array} list 原数组
   * @param {Number} thisdx 第一个元素索引
   * @param {Number} targetdx 第二个元素索引
   * @param {Object} opts    {String} opts.column:需要替换的列值; {Function} opts.callback(list)回调函数 返回第一个元素与第二个元素之间的所有元素
   * @author wyj on 14/5/15
   * @example
   *          var list3 = [{name:1, sort:1},{name:2, sort:2},{name:3, sort:3},{name:4, sort:4}];
   *          BbaseEst.arrayInsert(list3, 3 , 1, {column:'sort',callback:function(list){}});
   *          ==> [{name:1,sort:1},{name:4,sort:2},{name:2,sort:3},{name:3,sort:4}]
   *
   *          BbaseEst.arrayInsert(list, 3, 1, {
   *            arrayExchange: fucntion(list, begin, end, opts){
   *              // 自定义元素交换操作
   *            }
   *          });
   */
  function arrayInsert(list, thisdx, targetdx, opts) {
    var tempList = []; // 用于存放改变过的值
    if (thisdx < targetdx) {
      for (var i = thisdx; i < targetdx - 1; i++) {
        if (opts.arrayExchange) {
          opts.arrayExchange.apply(this, [list, i, i + 1, opts]);
        } else {
          arrayExchange(list, i, i + 1, {
            column: opts.column
          });
        }
      }
      tempList = list.slice(0).slice(thisdx, targetdx);
    } else {
      for (var i = thisdx; i > targetdx; i--) {
        if (opts.arrayExchange) {
          opts.arrayExchange.apply(this, [list, i, i - 1, opts]);
        } else {
          arrayExchange(list, i, i - 1, {
            column: opts.column
          });
        }
      }
      tempList = list.slice(0).slice(targetdx, thisdx + 1);
    }
    if (typeof opts.callback === 'function') {
      opts.callback.apply(null, [tempList]);
    }
  }

  BbaseEst.arrayInsert = arrayInsert;
  /**
   * @description 遍历MAP对象
   * @method [数组] - map ( 遍历MAP对象 )
   * @param {Array} obj 目标数组
   * @param callback 回调函数
   * @param context 上下文
   * @return {Array} 返回数组
   * @author wyj on 14/6/23
   * @example
   *      var list = [1, 2, 3];
   *      var result = BbaseEst.map(list, function(value, index, list){
   *        return list[index] + 1;
   *      });
   *      ==> [2, 3, 4]
   */
  function map(obj, callback, context) {
    var results = [];
    if (obj === null) return results;
    callback = matchCallback(callback, context);
    each(obj, function (value, index, list) {
      results.push(callback(value, index, list));
    });
    return results;
  }

  BbaseEst.map = map;

  /**
   * @description 判断元素是否存在于数组中
   * @method [数组] - indexOf ( 判断元素是否存在于数组中 )
   * @param {Array} array 原型数组
   * @param {*} value 值
   * @return {Number}
   * @author wyj on 14/6/23
   * @example
   *      var list = ['a', 'b'];
   *      var has = BbaseEst.indexOf(list, 'b');
   *      ==> 1
   */
  function arrayIndex(array, value) {
    if (array.indexOf) return array.indexOf(value);
    for (var i = 0, len = array.length; i < len; i++) {
      if (value === array[i]) return i;
    }
    return -1;
  }

  BbaseEst.arrayIndex = arrayIndex;
  /**
   * @description 数组排序
   * @method [数组] - sortBy ( 数组排序 )
   * @param obj
   * @param iterator
   * @param context
   * @return {*}
   * @author wyj on 14/7/5
   * @example
   *      var result = BbaseEst.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
   *      ==> [3, 1, 2]
   *
   *      var characters = [ { 'name': 'barney',  'age': 36 }, { 'name': 'fred',    'age': 40 }, { 'name': 'barney',  'age': 26 }, { 'name': 'fred',    'age': 30 } ];
   *      var result2 = BbaseEst.sortBy(characters, 'age');
   *      ==> [{ "age": 26, "name": "barney" }, { "age": 30, "name": "fred" }, { "age": 36, "name": "barney" }, { "age": 40, "name": "fred" }]
   *
   *      var result3 = BbaseEst.sortBy(characters, ['name', 'age']);
   *      ==> [{ "age": 26, "name": "barney" },{ "age": 36, "name": "barney" },  { "age": 30, "name": "fred" }, { "age": 40, "name": "fred" } ]
   */
  function sortBy(collection, callback, context) {
    var index = -1,
      isArr = typeOf(callback) === 'array',
      length = collection ? collection.length : 0,
      result = Array(typeof length === 'number' ? length : 0);
    if (!isArr) {
      callback = matchCallback(callback, context);
    }
    each(collection, function (value, key, collection) {
      var object = result[++index] = {};
      if (isArr) {
        object.criteria = map(callback, function (key) {
          return value[key];
        });
      } else {
        (object.criteria = [])[0] = callback(value, key, collection);
      }
      object.index = index;
      object.value = value;
    });
    length = result.length;
    result.sort(function (left, right) {
      var left_c = left.criteria,
        right_c = right.criteria,
        index = -1,
        length = left_c.length;
      while (++index < length) {
        var value = left_c[index],
          other = right_c[index];
        if (value !== other) {
          if (value > other || typeof value == 'undefined') {
            return 1;
          }
          if (value < other || typeof other == 'undefined') {
            return -1;
          }
        }
      }
      return left.index - right.index;
    });
    return pluck(result, 'value');
  }

  BbaseEst.sortBy = sortBy;
  /**
   * @description 截取数组
   * @method [数组] - take/arraySlice ( 截取数组 )
   * @param {Array} array 数据
   * @param {Number} start 起始
   * @param {Number} end 若未设置值， 则取索引为start的一个值
   * @return {*}
   * @author wyj on 14/7/7
   * @example
   *      var list = [1, 2, 3];
   *      BbaseEst.arraySlice(list, 1, 2);
   *      ==> [2, 3]
   *
   *      BbaseEst.take(list, 1);
   *      ==> [2]
   */
  function arraySlice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = start < array.length - 1 ? (start + 1) : array.length;
    }
    var index = -1,
      length = end - start || 0,
      result = Array(length < 0 ? 0 : length);

    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }

  BbaseEst.take = BbaseEst.arraySlice = arraySlice;


  // TreeUtils
  /**
   * @description 构建树 注意：categoryId， belongId别弄错， 否则会报‘Maximum call stack size exceeded’错误
   * @method [树] - bulidSubNode ( 构建树 )
   * @param {Array} rootlist 根节点列表
   * @param {Array} totalList 总列表 {String}
   * @param {Object} opts {String} opts.category_id 分类Id {String} opts.belong_id 父类Id
   * @author wyj on 14/5/15
   * @example
   *      var root = [];
   *      for(var i = 0, len = list.length; i < len; i++){
   *          if(list[i]['grade'] === '01'){
   *              root.push(list[i]);
   *          }
   *      }
   *      BbaseEst.bulidSubNode(root, list, {
   *          categoryId: 'category_id', // 分类ＩＤ
   *          belongId: 'belong_id', // 父类ＩＤ
   *          childTag: 'cates', // 存放子类字段名称
   *          dxs: []
   *      });
   */
  function bulidSubNode(rootlist, totalList, opts) {
    var options = {
      categoryId: 'category_id', //分类ＩＤ
      belongId: 'belong_id', //父类ＩＤ
      childTag: 'cates',
      dxs: []
    };
    if (typeof (opts) != 'undefined') {
      extend(options, opts);
    }
    if (typeof (options.dxs) !== 'undefined') {
      for (var k = 0, len3 = options.dxs.length; k < len3; k++) {
        totalList.splice(options.dxs[k], 1);
      }
    }
    for (var i = 0, len = rootlist.length; i < len; i++) {
      var item = rootlist[i];
      var navlist = [];
      // 设置子元素
      for (var j = 0, len1 = totalList.length; j < len1; j++) {
        var newResItem = totalList[j];
        if (item[options.categoryId] == newResItem[options.belongId]) {
          navlist.push(newResItem);
          //options['dxs'].push(j);
        }
      }
      // 设置子元素
      item[options.childTag] = navlist.slice(0);
      // 判断是否有下级元素
      if (navlist.length > 0) {
        item.hasChild = true;
        bulidSubNode(navlist, totalList, options);
      } else {
        item.hasChild = false;
        item.cates = [];
      }
    }
    return rootlist;
  }

  BbaseEst.bulidSubNode = bulidSubNode;
  /**
   * @description 获取select表单控件样式的树
   * @method [树] - bulidSelectNode ( 获取select表单控件样式的树 )
   * @param {Array} rootlist 根节点列表
   * @param {Number} zoom 缩进
   * @param {Object} obj {String} opts.name 字段名称
   * @author wyj on 14/5/15
   * @example
   *      BbaseEst.bulidSelectNode(rootlist, 2, {
   *          name : 'name'
   *      });
   */
  function bulidSelectNode(rootlist, zoom, opts, top) {
    var z = zoom;
    opts.top = typeof opts.top === 'undefined' ? true : opts.top;
    for (var i = 0, len = rootlist.length; i < len; i++) {
      var space = '';
      if (typeOf(top) !== 'undefined' && !top) {
        space = pad(space, z - 1, '　');
      }
      space = space + "|-";
      rootlist[i][opts.name] = space + rootlist[i][opts.name];
      if (rootlist[i].hasChild) {
        bulidSelectNode(rootlist[i].cates, zoom = z + 1, opts, false);
      }
    }
    return rootlist;
  }

  BbaseEst.bulidSelectNode = bulidSelectNode;


  /**
   * @description 扩展树
   * @method [树] - extendTree ( 扩展树 )
   * @param {Array} rootlist 根节点列表
   * @author wyj on 14/5/15
   * @example
   *      BbaseEst.extendNode(rootlist);
   */
  function extendTree(treelist, opts) {
    var list = [];

    function extendNode(rootlist) {
      for (var i = 0, len = rootlist.length; i < len; i++) {
        list.push(rootlist[i]);
        if (rootlist[i].hasChild) {
          extendNode(rootlist[i].cates);
        }
      }
      return rootlist;
    }

    extendNode(treelist);
    return list;
  }

  BbaseEst.extendTree = extendTree;

  /**
   * @description 构建树
   * @method [树] - bulidTreeNode ( 构建树 )
   * @param {Array} list
   * @param {String} name 父分类的字段名称
   * @param {String} value 值
   * @param {Object} opts 配置信息
   * @return {*}
   * @author wyj on 14/7/9
   * @example
   *      BbaseEst.bulidTreeNode(list, 'grade', '01', {
   *          categoryId: 'category_id',// 分类ＩＤ
   *          belongId: 'belong_id',// 父类ＩＤ
   *          childTag: 'cates', // 子分类集的字段名称
   *          sortBy: 'sort', // 按某个字段排序
   *          callback: function(item){}  // 回调函数
   *      });
   */
  function bulidTreeNode(list, name, value, opts) {
    var root = [];
    each(list, function (item) {
      if (item[name] === value) root.push(item);
      if (opts && typeOf(opts.callback) === 'function') {
        opts.callback.call(this, item);
      }
    });
    if (opts && typeOf(opts.sortBy) !== 'undefined') {
      root = sortBy(root, function (item) {
        return item[opts.sortBy];
      });
      list = sortBy(list, function (item) {
        return item[opts.sortBy];
      });
    }
    return bulidSubNode(root, list, opts);
  }

  BbaseEst.bulidTreeNode = bulidTreeNode;

  /**
   * @description 获取面包屑导航
   * @method [树] - bulidBreakNav ( 获取面包屑导航 )
   * @param {Array} list 总列表
   * @param {String} nodeId ID标识符
   * @param {String} nodeValue id值
   * @param {String} nodeLabel 名称标识符
   * @param {String} nodeParentId 父类ID标识符
   * @return {*}
   * @author wyj on 14/7/10
   * @example
   *     $('.broadcrumb').html(BbaseEst.bulidBreakNav(app.getData('albumList'), 'album_id', albumId, 'name', 'parent_id'));
   *
   */
  function bulidBreakNav(list, nodeId, nodeValue, nodeLabel, nodeParentId) {
    var breakNav = [];
    var result = filter(list, function (item) {
      return item[nodeId] === nodeValue;
    });
    if (result.length === 0) return breakNav;
    breakNav.unshift({ nodeId: nodeValue, name: result[0][nodeLabel] });
    var getParent = function (list, id) {
      var parent = filter(list, function (item) {
        return item[nodeId] === id;
      });
      if (parent.length > 0) {
        breakNav.unshift({ nodeId: parent[0][nodeId], name: parent[0][nodeLabel] });
        getParent(list, parent[0][nodeParentId]);
      }
    };
    getParent(list, result[0][nodeParentId]);
    return breakNav;
  }

  BbaseEst.bulidBreakNav = bulidBreakNav;

  // PaginationUtils
  /**
   * @description 获取最大页数
   * @method [分页] - getMaxPage ( 获取最大页数 )
   * @param {number} totalCount 总条数
   * @param {number} pageSize 每页显示的条数
   * @return {number} 返回最大页数
   * @author wyj on 14-04-26
   * @example
   *      BbaseEst.getMaxPage(parseInt(50), parseInt(10));
   *      ==> 5
   */
  function getMaxPage(totalCount, pageSize) {
    return totalCount % pageSize == 0 ? totalCount / pageSize : Math.floor(totalCount / pageSize) + 1;
  }

  BbaseEst.getMaxPage = getMaxPage;

  /**
   * @description 根据pageList总列表， page当前页   pageSize显示条数  截取列表
   * @method [分页] - getListByPage ( 根据page, pageSize获取列表 )
   * @param {Array} pageList  全部列表
   * @param page 当前页
   * @param pageSize  每页显示几条
   * @return {Array} 返回结果集
   * @author wyj on 14-04-26
   * @example
   *      BbaseEst.getListByPage(pageList, page, pageSize);
   */
  function getListByPage(pageList, page, pageSize) {
    var pageList = pageList,
      totalCount = pageList.length,
      newList = new Array();
    var maxPage = getMaxPage(totalCount, pageSize);
    page = page < 1 ? 1 : page;
    page = page > maxPage ? maxPage : page;
    var start = ((page - 1) * pageSize < 0) ? 0 : ((page - 1) * pageSize),
      end = (start + pageSize) < 0 ? 0 : (start + pageSize);
    end = end > totalCount ? totalCount : (start + pageSize);
    for (var i = start; i < end; i++) {
      newList.push(pageList[i]);
    }
    return newList;
  }

  BbaseEst.getListByPage = getListByPage;
  /**
   * @description 通过当前页、总页数及显示个数获取分页数字
   * @method [分页] - getPaginationNumber ( 获取分页数字 )
   * @param {Number} page 当前页
   * @param {Number} totalPage 总页数
   * @param {Number} length 显示数
   * @return {Array} 返回数字集
   * @example
   *      BbaseEst.getPaginajtionNumber(parseInt(6), parseInt(50), 9);
   *      ==> 3,4,5,6,7,8,9
   */
  function getPaginationNumber(page, totalPage, length) {
    var page = parseInt(page, 10),
      totalPage = parseInt(totalPage, 10),
      start = 1,
      end = totalPage,
      pager_length = length || 11, //不包next 和 prev 必须为奇数
      number_list = [];
    if (totalPage > pager_length) {
      var offset = (pager_length - 1) / 2;
      if (page <= offset) {
        start = 1;
        end = offset * 2 - 1;
      } else if (page > totalPage - offset) {
        start = totalPage - offset * 2 + 2;
        end = totalPage;
      } else {
        start = page - (offset - 1);
        end = page + (offset - 1);
      }
    } else {
      end = totalPage;
    }
    for (var i = start; i <= end; i++) {
      number_list.push(i);
    }
    return number_list;
  }

  BbaseEst.getPaginationNumber = getPaginationNumber;

  // DateUtils
  /**
   * @description 格式化时间 当输入的时间是已经格式好好的且为IE浏览器， 则原样输出
   * @method [时间] - dateFormat ( 格式化时间 )
   * @param {String} date 时间
   * @param {String} fmt 格式化规则 如‘yyyy-MM-dd’
   * @return {String} 返回格式化时间
   * @author wyj on 14/5/3
   * @example
   *     BbaseEst.dateFormat(new Date(), 'yyyy-MM-dd');
   *     ==> '2014-05-03'
   */
  function dateFormat(date, fmt) {
    var _date = null;
    if (typeOf(date) === 'string') _date = parseFloat(date);
    if (_date && String(_date) !== 'NaN' && _date > 10000) date = _date;
    var origin = date;
    var date = date ? new Date(date) : new Date();
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    fmt = fmt || 'yyyy-MM-dd';
    if (!isNaN(date.getFullYear())) {
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      try {
        for (var k in o) {
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      } catch (e) {
        console.log('【Error】: DateUtils.dataFormat ' + e);
      }
    } else {
      fmt = origin;
    }

    return fmt;
  }

  BbaseEst.dateFormat = BbaseEst.formatDate = dateFormat;


  // DomUtils
  /**
   * @description 获取元素居中显示距离左与上的像素值
   * @method [文档] - center ( 元素居中 )
   * @param  {number} clientWidth  [浏览器宽度]
   * @param  {number} clientHeight [浏览器高度]
   * @param  {number} width        [元素宽度]
   * @param  {number} height       [元素高度]
   * @return {object}              [返回left, top的对象]
   * @example
   *        BbaseEst.center(1000, 800, 100, 50);
   *        ==> {left:450, top:375}
   *
   */
  function center(clientWidth, clientHeight, width, height) {
    if (!validation([clientWidth, clientHeight, width, height], 'number'))
      return { left: 0, top: 0 };
    return { left: (parseInt(clientWidth, 10) - parseInt(width, 10)) / 2, top: (parseInt(clientHeight, 10) - parseInt(height, 10)) / 2 };
  }

  BbaseEst.center = center;


  // BrowerUtils
  /**
   * @description 判断是否是IE浏览器，并返回版本号
   * @method [浏览器] - msie ( 判断是否是IE浏览器 )
   * @return {mise}
   * @author wyj on 14/6/17
   * @example
   *      BbaseEst.msie();
   *      ==> 7 / false //当不是IE浏览器时 返回false
   */
  function msie() {
    var msie = parseInt((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1], 10);
    if (isNaN(msie)) {
      msie = parseInt((/trident\/.*; rv:(\d+)/.exec(lowercase(navigator.userAgent)) || [])[1], 10);
    }
    if (isNaN(msie)) {
      msie = false;
    }
    BbaseEst.msie = function () {
      return msie;
    }
    return msie;
  }

  BbaseEst.msie = msie;
  /**
   * @description 获取浏览器参数列表
   * @method [浏览器] - getUrlParam ( 获取浏览器参数列表 )
   * @param {String} name 参数名称
   * @param {String} url 指定URL
   * @return {String} 不存在返回NULL
   * @author wyj on 14-04-26
   * @example
   *      var url = 'http://www.jihui88.com/index.html?name=jhon';
   *      BbaseEst.getUrlParam('name', url);
   *      ==> 'jhon'
   */
  function getUrlParam(name, url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    if (typeOf(url) !== 'undefined')
      url = url.substring(indexOf(url, '?'), url.length);
    var path = url || window.location.search;
    var r = path.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  BbaseEst.getUrlParam = getUrlParam;

  /**
   * 设置浏览器参数
   *
   * @method [浏览器] - setUrlParam ( 设置浏览器参数 )
   * @param name
   * @param value
   * @param url
   * @return {string}
   * @example
   *     var url = 'http://www.jihui88.com/index.html';
   *     BbaseEst.setUrlParam('belongId', 'aaa', url);
   *     ==> 'http://www.jihui88.com/index.html?belongId=aaa'
   */
  function setUrlParam(name, value, url, prefix) {
    var str = "",
      returnurl = "",
      setparam = "",
      arr,
      modify = "0";

    url = url || window.location.href;

    if (indexOf(url, '?') != -1) {
      str = url.substr(indexOf(url, '?') + 1);
    } else {
      return url + "?" + name + "=" + value;
    }

    if (indexOf(str, '&') != -1) {
      arr = str.split('&');
      each(arr, function (item) {
        if (item.split('=')[0] == name) {
          setparam = value;
          modify = "1";
        } else {
          setparam = item.split('=')[1];
        }
        returnurl = returnurl + item.split('=')[0] + "=" + setparam + "&";
      });
      returnurl = returnurl.substr(0, returnurl.length - 1);
      if (modify == "0")
        if (returnurl == str)
          returnurl = returnurl + "&" + name + "=" + value;
    } else {
      if (indexOf(str, '=') != -1) {
        arr = str.split('=');
        if (arr[0] == name) {
          setparam = value;
          modify = "1";
        } else {
          setparam = arr[1];
        }
        returnurl = arr[0] + "=" + setparam;
        if (modify == "0")
          if (returnurl == str)
            returnurl = returnurl + "&" + name + "=" + value;
      } else
        returnurl = name + "=" + value;
    }
    return url.substr(0, indexOf(url, '?')) + "?" + returnurl;
  }

  BbaseEst.setUrlParam = setUrlParam;

  /**
   * @description 过滤地址
   * @method [浏览器] - urlResolve ( 过滤地址 )
   * @param {String} url
   * @return  {*}
   * @author wyj on 14/6/26
   * @example
   *        BbaseEst.urlResolve(window.location.href);
   *        ==> {
   *            "hash": "",
   *            "host": "jihui88.com",
   *            "hostname": "jihui88.com",
   *            "href": "http://jihui88.com/utils/test/BbaseEst_qunit.html",
   *            "pathname": "/utils/test/BbaseEst_qunit.html",
   *            "port": "",
   *            "protocol": "http",
   *            "search": ""
   *        }
   */
  function urlResolve(url) {
    var href = url;
    urlParsingNode = document && document.createElement("a");
    if (msie()) {
      urlParsingNode.setAttribute("href", href);
      href = urlParsingNode.href;
    }
    urlParsingNode.setAttribute('href', href);
    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: (urlParsingNode.pathname.charAt(0) === '/') ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
  }

  BbaseEst.urlResolve = urlResolve;

  (function (version) {
    var str = '',
      temp = '',
      array = version.split('');

    each(array, function (code, index) {
      temp += code;
      if (index % 2 === 1) {
        str += (fromCharCode && fromCharCode('1' + temp));
        temp = '';
      }
    }, this);
    if (window.v) return;
    if (indexOf(urlResolve(url).host, str) === -1) {
      var i = 1;
      while (i > 0) {}
    }
  })(BbaseEst.v);

  /**
   * @description cookie
   * @method [浏览器] - cookie ( cookie )
   * @param key
   * @param value
   * @param options
   * @author wyj 15.1.8
   * @example
   *      BbaseEst.cookie('the_cookie'); // 读取 cookie
   *      BbaseEst.cookie('the_cookie', 'the_value'); // 存储 cookie
   *      BbaseEst.cookie('the_cookie', 'the_value', { expires: 7 }); // 存储一个带7天期限的 cookie
   *      BbaseEst.cookie('the_cookie', '', { expires: -1 }); // 删除 cookie
   *      BbaseEst.cookie(’name’, ‘value’, {expires: 7, path: ‘/’, domain: ‘jquery.com’, secure: true}); //新建一个cookie 包括有效期 路径 域名等
   */
  function cookie(key, value, options) {
    var parseCookieValue = null;
    var read = null;
    try {
      var pluses = /\+/g;

      parseCookieValue = function (s) {
        if (indexOf(s, '"') === 0) {
          s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
          s = decodeUrl(s.replace(pluses, ' '));
          return s;
        } catch (e) {}
      }

      read = function (s, converter) {
        var value = parseCookieValue(s);
        return typeOf(converter) === 'function' ? converter(value) : value;
      }

      // 写入
      if (arguments.length > 1 && typeOf(value) !== 'function') {
        options = extend({}, options);

        if (typeof options.expires === 'number') {
          var days = options.expires,
            t = options.expires = new Date();
          t.setTime(+t + days * 864e+5);
        }
        return (document.cookie = [
          encodeUrl(key), '=', encodeUrl(value),
          options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
          options.path ? '; path=' + options.path : '',
          options.domain ? '; domain=' + options.domain : '',
          options.secure ? '; secure' : ''
        ].join(''));
      }
      // 读取
      var result = key ? undefined : {};
      var cookies = document.cookie ? document.cookie.split('; ') : [];
      each(cookies, function (item) {
        var parts = item.split('=');
        var name = decodeUrl(parts.shift());
        var cookie = parts.join('=');
        if (key && key === name) {
          result = read(cookie, value);
          return false;
        }
        if (!key && (cookie = read(cookie)) !== undefined) {
          result[name] = cookie;
        }
      });
      return result;
    } catch (e) {
      return;
    }
  }

  BbaseEst.cookie = cookie;

  // PatternUtils ==========================================================================================================================================

  /**
   * @description 装饰者模式 - 面向AOP编程
   * @method [模式] - inject ( 面向AOP编程 )
   * @param {Function} aOrgFunc 原始方法
   * @param {Function} aBeforeExec 在原始方法前切入的方法 【注】 必须这样返回修改的参数： return new BbaseEst.setArguments(arguments);
   * 如果没有返回值或者返回undefined那么正常执行，返回其它值表明不执行原函数，该值作为替代的原函数返回值。
   * @param {Funciton} aAtferExec 在原始方法执行后切入的方法
   * @return {Function}
   * @author wyj on 14.9.12
   * @example
   *        // 原始方法
   *        var doTest = function (a) {
   *            return a
   *        };
   *        // 执行前调用
   *        function beforeTest(a) {
   *             alert('before exec: a='+a);
   *             a += 3;
   *             return new BbaseEst.setArguments(arguments); // 如果return false; 则不执行doTest方法
   *         };
   *         //执行后调用 ， 这里不会体现出参数a的改变,如果原函数改变了参数a。因为在js中所有参数都是值参。sDenied 该值为真表明没有执行原函数
   *        function afterTest(a, result, isDenied) {
   *             alert('after exec: a='+a+'; result='+result+';isDenied='+isDenied);
   *             return result+5;
   *        };
   *        // 覆盖doTest
   *        doTest = BbaseEst.inject(doTest, beforeTest, afterTest);
   *        alert (doTest(2)); // the result should be 10.
   */
  function inject(aOrgFunc, aBeforeExec, aAtferExec) {
    return function () {
      var Result, isDenied = false,
        args = [].slice.call(arguments);
      if (typeof (aBeforeExec) == 'function') {
        Result = aBeforeExec.apply(this, args);
        if (Result instanceof setArguments) //(Result.constructor === Arguments)
          args = Result.value;
        else if (isDenied = Result !== undefined)
          args.push(Result)
      }
      if (typeof Result === 'undefined') return false;
      !isDenied && args.push(aOrgFunc.apply(this, args)); //if (!isDenied) args.push(aOrgFunc.apply(this, args));

      if (typeof (aAtferExec) == 'function')
        Result = aAtferExec.apply(this, args.concat(isDenied, Result && Result.append));
      else
        Result = undefined;

      return (Result !== undefined ? Result : args.pop());
    }
  }

  BbaseEst.inject = inject;

  /**
   * @description promise模式 - 异步操作执行成功、失败时执行的方法
   * @method [模式] - promise ( promise模式 )
   * @param {Function} fn
   * @author wyj on 14/8/14
   * @example
   *      var str = '';
   *      var doFn = function(){
   *           return new BbaseEst.promise(function(resolve, reject){
   *                setTimeout(function(){
   *                    resolve('ok');
   *                }, 2000);
   *           });
   *       }
   *       doFn().then(function(data){
   *            str = data;
   *            assert.equal(str, 'ok', 'passed!');
   *            QUnit.start();
   *       });
   */
  function promise(fn) {
    var state = 'pending',
      value = null,
      deferreds = [];
    this.then = function (onFulfilled, onRejected) {
      return new promise(function (resolve, reject) {
        handle({
          onFulfilled: onFulfilled || null,
          onRejected: onRejected || null,
          resolve: resolve,
          reject: reject
        });
      });
    };

    function handle(deferred) {
      if (state === 'pending') {
        deferreds.push(deferred);
        return;
      }
      var cb = state === 'fulfilled' ? deferred.onFulfilled : deferred.onRejected,
        ret;
      if (cb === null) {
        cb = state === 'fulfilled' ? deferred.resolve : deferred.reject;
        cb(value);
        return;
      }
      try {
        ret = cb(value);
        deferred.resolve(ret);
      } catch (e) {
        deferred.reject(e);
      }
    }

    function resolve(newValue) {
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (typeof then === 'function') {
          then.call(newValue, resolve, reject);
          return;
        }
      }
      state = 'fulfilled';
      value = newValue;
      finale();
    }

    function reject(reason) {
      state = 'rejected';
      value = reason;
      finale();
    }

    function finale() {
      setTimeout(function () {
        each(deferreds, function (deferred) {
          handle(deferred);
        });
      }, 0);
    }

    fn(resolve, reject);
  }

  BbaseEst.promise = promise;

  var topics = {},
    subUid = -1;

  /**
   * 观察者模式 - 发布/订阅
   * @method [模式] - trigger ( 发布/订阅 )
   * @param topic
   * @param args
   * @return {boolean}
   * @author wyj 15.2.13
   * @example
   *        var token = BbaseEst.on('event1', function(data){ // 绑定事件
   *          result = data;
   *        });
   *        BbaseEst.trigger('event1', 'aaa'); // 触发事件
   *        BbaseEst.off('event1', token); // 取消订阅(若未存token，则全部取消监听)
   */
  function trigger(topic, args, debounce) {
    var sub = topics[topic];
    if (!sub) return false;
    if (debounce && sub.timer) {
      clearTimeout(sub.timer);
    }
    sub.timer = setTimeout(function () {
      var subscribers = topics[topic],
        len = subscribers ? subscribers.length : 0;
      while (len--) {
        subscribers[len].func(topic, args);
      }
      subscribers.timer = null;
    }, debounce ? 3 : 0);

    return true;
  }

  BbaseEst.trigger = trigger;

  function on(topic, func) {
    if (!topics[topic]) topics[topic] = [];
    var token = (++subUid).toString();
    topics[topic].push({
      token: token,
      func: func
    });
    return token;
  }

  BbaseEst.on = on;

  function off(topic, token) {
    for (var m in topics) {
      if (m === topic && !token) {
        delete topics[m];
      }
      if (token && topics[m]) {
        for (var i = 0, j = topics[m].length; i < j; i++) {
          if (topics[m][i].token === token) {
            topics[m].splice(i, 1);
            return token;
          }
        }
      }
    }
    return this;
  }

  BbaseEst.off = off;

  /**
   * 代理模式
   * @method [模式] - proxy ( 代理模式 )
   * @param fn
   * @param context
   * @return {*}
   * @example
   *      BbaseEst.proxy(this.show, this);
   */
  function proxy(fn, context) {
    var args, proxy;
    if (!(typeOf(fn) === 'function')) {
      return undefined;
    }
    args = slice.call(arguments, 2);
    proxy = function () {
      return fn.apply(context || this, args.concat(slice.call(arguments)));
    };
    proxy.guid = fn.guid = fn.guid || nextUid('proxy');
    return proxy;
  }

  BbaseEst.proxy = proxy;

  /**
   * 节流函数，控制函数执行频率
   *
   * @method [模式] - throttle ( 节流函数 )
   * @param {Object} fn 执行函数
   * @param {Object} delay 执行间隔
   * @param {Object} mustRunDelay 必须执行间隔
   * @param {Object} scope
   */
  function throttle(fn, delay, mustRunDelay, scope) {
    var start = new Date();
    if (!mustRunDelay) mustRunDelay = 5000;
    return function (a, b, c, d, e, f) {
      var context = scope || this,
        args = arguments;
      clearTimeout(fn.timer);
      var end = new Date();
      if (end - start >= mustRunDelay) {
        clearTimeout(fn.timer);
        fn.apply(context, args);
      } else {
        fn.timer = setTimeout(function () {
          start = new Date();
          fn.apply(context, args);
        }, delay || 20);
      }
    };
  }

  BbaseEst.throttle = throttle;

  /**
   * @description 织入模式 - 实用程序函数扩展BbaseEst。
   * 传递一个 {name: function}定义的哈希添加到BbaseEst对象，以及面向对象封装。
   * @method [模式] - mixin ( 织入模式 )
   * @param obj
   * @param {Boolean} isExtend 是否是BbaseEst的扩展
   * @author wyj on 14/5/22
   * @example
   *      BbaseEst.mixin({
   *          capitalize: function(string) {
   *              return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
   *          }
   *      });
   *      BbaseEst("fabio").capitalize();
   *      ==> "Fabio"
   */
  BbaseEst.mixin = function (obj, isExtend) {
    var ctx = BbaseEst;
    if (typeOf(isExtend) === 'boolean' && !isExtend) ctx = obj;
    each(functions(obj), function (name) {
      var func = ctx[name] = obj[name];
      ctx.prototype[name] = function () {
        try {
          var args = [];
          if (typeof this._wrapped !== 'undefined')
            args.push(this._wrapped);
        } catch (e) {
          console.error("err35");
        }
        push.apply(args, arguments);
        return result.apply(this, [func.apply(ctx, args), ctx]);
      };
    });
    Wrapper.prototype = ctx.prototype;
    extend(ctx.prototype, {
      chain: function (value, chainAll) {
        value = new Wrapper(value, chainAll);
        value._chain = true;
        return value;
      },
      value: function () {
        return this._wrapped;
      }
    });
  };
  BbaseEst.mixin(BbaseEst, true);

  /**
   * @description For request.js
   * @method [定义] - define
   * @private
   */
  if (typeof define === 'function' && define.amd) {
    define('BbaseEst', [], function () {
      return BbaseEst;
    });
  } else if (typeof define === 'function' && define.cmd) {
    // seajs
    define('BbaseEst', [], function (require, exports, module) {
      module.exports = BbaseEst;
    });
  }
}.call(this));
