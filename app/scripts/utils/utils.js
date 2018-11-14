/**
 * @description Utils
 * @class Utils - 工具类
 * @author yongjin<zjut_wyj@163.com> 2014/12/2
 */
var UTIL = {

  // 添加加载动画
  addLoading: function (options) {
    try {
      if (window.$loading) {
         clearTimeout(window.$loading_timer);
        window.$loading_timer = setTimeout(function(){
        BbaseUtils.removeLoading();
      }, 30000);
      }
      window.$loading = $('<div id="loading" class="loading"><div class="object" id="object_one">' +
        '</div><div class="object" id="object_two"></div><div class="object" id="object_three"></div></div>');
      $('body').append(window.$loading);
      if (window.$loading_timer) {
        clearTimeout(window.$loading_timer);
      }
      window.$loading_timer = setTimeout(function () {
        UTIL.removeLoading();
      }, 30000);
    } catch (e) {}
    return window.$loading;
  },

  // 移除加载动画
  removeLoading: function (options) {
    if (window.$loading) {
      window.$loading.remove();
      window.$loading = null;
    }else $('.loading').remove();
  },

  createCallback: function (func, context, argCount) {
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
  },

  // 数据类型
  typeOf: function (target) {
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
    return _type[typeof target] || _type[Object.prototype.toString.call(target)] || (target ? "object" : "null");
  },

  // 获取对象key数组
  keys: function (obj) {
    if (UTIL.typeOf(obj) !== 'object') return [];
    if (Object.keys) return Object.keys(obj);
    var keys = [];
    for (var key in obj)
      if (hasKey(obj, key)) keys.push(key);
    return keys;
  },

  // 数组或对象的遍历
  each: function (obj, callback, context) {
    var i, length, first = false,
      last = false;
    if (obj == null) return obj;
    callback = UTIL.createCallback(callback, context);
    if (obj.length === +obj.length) {
      for (i = 0, length = obj.length; i < length; i++) {
        first = i === 0 ? true : false;
        last = i === length - 1 ? true : false;
        if (callback(obj[i], i, obj, first, last) === false) break;
      }
    } else {
      var ks = UTIL.keys(obj);
      for (i = 0, length = ks.length; i < length; i++) {
        first = i === 0 ? true : false;
        last = i === ks.length - 1 ? true : false;
        if (callback(obj[ks[i]], ks[i], obj, i, first, last) === false) break;
      }
    }
    return obj;
  },

  // 获取字符串的hash值
  hash: function (str) {
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
  },
  setArguments: function (args, append) {
    this.value = [].slice.call(args);
    this.append = append;
  },

  // 方法注入
  inject: function (aOrgFunc, aBeforeExec, aAtferExec) {
    return function () {
      var Result, isDenied = false,
        args = [].slice.call(arguments);
      if (typeof (aBeforeExec) == 'function') {
        Result = aBeforeExec.apply(this, args);
        if (Result instanceof UTIL.setArguments) //(Result.constructor === Arguments)
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
};
