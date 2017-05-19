/**
 * @description BbaseHandlebarsHelper模板引擎帮助类
 * @class BbaseHandlebarsHelper - 标签库
 * @author yongjin on 2014/11/11
 */

/**
 * 比较(新版将弃用)
 * @method [判断] - compare
 * @author wyj 2014-03-27
 * @example
 *      {{#compare ../page '!==' this}}danaiPageNum{{else}}active{{/compare}}
 */
BbaseHandlebars.registerHelper('compare', function (v1, operator, v2, options) {
  if (arguments.length < 3)
    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
  try {
    switch (operator.toString()) {
      case '==':
        return (v1 == v2) ? options.fn(this) :
          options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) :
          options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) :
          options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) :
          options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) :
          options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) :
          options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) :
          options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) :
          options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) :
          options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) :
          options.inverse(this);
      case 'indexOf':
        return (v1.indexOf(v2) > -1) ? options.fn(this) :
          options.inverse(this);
      default:
        return options.inverse(this);
    }
  } catch (e) {
    console.log('Errow: hbs.compare v1=' + v1 + ';v2=' + v2 + e);
  }
});


/**
 * 分页
 * @method [分页] - pagination
 * @author wyj 2014-03-27
 * @example
 *        {{#pagination page totalPage}}
 <li class="bui-bar-item bui-button-number bui-inline-block {{#compare ../page this operator='!=='}}danaiPageNum
 {{else}}active{{/compare}}" data-page="{{this}}" aria-disabled="false" id="{{this}}" aria-pressed="false">
 <a href="javascript:;">{{this}}</a></li>
 {{/pagination}}
 */
BbaseHandlebars.registerHelper('pagination', function (page, totalPage, sum, block) {
  var accum = '',
    block = block,
    sum = sum;
  if (arguments.length === 3) {
    block = sum;
    sum = 9;
  }
  var pages = BbaseEst.getPaginationNumber(page, totalPage, sum);
  for (var i = 0, len = pages.length; i < len; i++) {
    accum += block.fn(pages[i]);
  }
  return accum;
});

/**
 * 根据path获取值
 * @method get
 * @author wyj 15.2.1
 * @example
 *      BbaseHandlebars.helpers["get"].apply(this, date)
 */
BbaseHandlebars.registerHelper('get', function (path, options) {
  if (typeof path !== 'undefined' && BbaseEst.typeOf(path) === 'string') {
    var list = path.split('.');
    if (list[0] in this) {
      if (list.length > 1) {
        if (BbaseEst.typeOf(this[list[0]]) !== 'object') {
          this[list[0]] = JSON.parse(this[list[0]]);
        }
        return BbaseEst.getValue(this, path);
      } else {
        return this[list[0]];
      }
    }
  } else {
    return path;
  }
});


/**
 * 时间格式化
 * @method [时间] - dateFormat
 * @author wyj 2014-03-27
 * @example
 *      {{dateFormat $.detail_news.add_time $.lan.news.format}}
 */
BbaseHandlebars.registerHelper('dateFormat', function (date, fmt, options) {
  return BbaseEst.dateFormat(date, fmt);
});

/**
 * 判断字符串是否包含
 * @method [判断] - contains
 * @author wyj 14.11.17
 * @example
 *      {{#contains ../element this}}checked="checked"{{/contains}}
 */
BbaseHandlebars.registerHelper('contains', function (target, thisVal, options) {
  if (BbaseEst.isEmpty(target)) return;
  return BbaseEst.contains(target, thisVal) ? options.fn(this) : options.inverse(this);
});

/**
 * 两数相加
 * @method [运算] - plus
 * @author wyj 2014-03-27
 * @example
 *      {{plus 1 2}} => 3
 */
BbaseHandlebars.registerHelper('plus', function (num1, num2, opts) {
  return parseInt(num1, 10) + parseInt(num2, 10);
});
/**
 * 两数相减
 * @method [运算] - minus
 * @author wyj 2014-03-27
 * @example
 *        {{minus 10 5}} => 5
 */
BbaseHandlebars.registerHelper('minus', function (num1, num2, opts) {
  return (parseInt(num1, 10) - parseInt(num2, 10)) + '';
});

/**
 * 字符串截取
 * @method [字符串] - cutByte
 * @author wyj 2014-03-27
 * @example
 *      {{cutByte name 5 end='...'}}
 */
BbaseHandlebars.registerHelper('cutByte', function (str, len, options) {
  return BbaseEst.cutByte(str, len, options.hash.end || '...');
});

/**
 * 复杂条件(新版将弃用)
 * @method [判断] - xif
 * @author wyj 14.12.31
 * @example
 *       return BbaseHandlebars.helpers["x"].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
 *
 */
BbaseHandlebars.registerHelper("x", function (expression, options) {
  var fn = function () {},
    result;
  try {
    fn = Function.apply(this, ['window', 'return ' + expression + ';']);
  } catch (e) {
    console.warn('[warning] {{x ' + expression + '}} is invalid javascript', e);
  }
  try {
    result = fn.bind(this)(window);
  } catch (e) {
    console.warn('[warning] {{x ' + expression + '}} runtime error', e);
  }
  return result;
});

/**
 * xif条件表达式(新版将弃用)
 * @method [判断] - xif
 * @author wyj 15.2.2
 * @example
 *    {{#xif "this.orderStatus != 'completed' && this.orderStatus != 'invalid' && this.paymentStatus == 'unpaid' &&
              this.shippingStatus == 'unshipped'"}}disabled{{/xif}}
 */
BbaseHandlebars.registerHelper("xif", function (expression, options) {
  return BbaseHandlebars.helpers["x"].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
});

/**
 * if判断
 * @method If
 * @param  {[type]} expression [description]
 * @param  {[type]} options)   {             return BbaseEst.compile(expression, this) ? options.fn(this) : options.inverse(this);} [description]
 * @return {[type]}            [description]
 */
BbaseHandlebars.registerHelper('If', function (expression, options) {
  var bool = BbaseEst.compile('{{' + expression.replace(/_quote_/img, "'").replace(/&amp;/img, "&") + '}}', this);

  if (bool === 'true' || bool === '1') {
    bool = true;
  } else if (bool === 'false' || bool === '0' || bool === '') {
    bool = false;
  } else if (BbaseEst.typeOf(bool) === 'string' && !BbaseEst.isEmpty(bool)) {
    bool = true;
  }

  return bool ? options.fn(this) : options.inverse(this);
});

/**
 * 返回整数
 * @method [数字] - parseInt
 * @author wxw 2014-12-16
 * @example
 *      {{parseInt 01}}
 */
BbaseHandlebars.registerHelper('parseInt', function (result, options) {
  return parseInt(result, 10);
});

/**
 * 缩略ID值
 * @method id2
 * @author wyj
 */
BbaseHandlebars.registerHelper('id2', function (id) {
  return id == null ? "" : id.replace(/^[^1-9]+/, "")
});

/**
 * 返回全局常量
 * @method [常量] - CONST
 * @author wyj 14.12.17
 * @example
 *        {{CONST 'HOST'}}
 */
BbaseHandlebars.registerHelper('CONST', function (name, options) {
  return BbaseEst.getValue(CONST, name);
});
/**
 * 图片尺寸 （返回不带图片域名的地址）
 * @method [图片] - picUrl
 * @author wyj 2014-03-31
 * @example
 *      <img src="{{CONST 'PIC_URL'}}/{{picUrl picPath 6}}" width="52" height="52">
 */
BbaseHandlebars.registerHelper('picUrl', function (src, number, opts) {
  var url = src;
  if (arguments.length < 3) return src || CONST.PIC_NONE;
  if (src == null || src.length == 0) return CONST.PIC_NONE;
  if (number > 10) {
    url = url + '!' + number
  } else {
    var url2 = url.substring(url.lastIndexOf(".") + 1, url.length);
    url = url.substring(0, url.lastIndexOf(".")) + "_" + number + "." + url2;
  }

  return url ? url : '';
});
BbaseHandlebars.registerHelper('_picUrl', function (src, number, options) {
  var domain = CONST.PIC_URL;
  if (options && options.hash.domain) {
    domain = options.hash.domain;
  }
  return domain + '/' + BbaseHandlebars.helpers['picUrl'].apply(this, [src, number, options]);
});

/**
 * 返回图片地址常量（返回添加图片域名的图片地址, 推荐使用）
 * @method [常量] - PIC
 * @author wyj 14.12.17
 * @example
 *        {{PIC pic}}   ==> http://img.jihui88.com/upload/a/a1/picture/2015/12/20/pic.jpg?v=2015-12-20_12:30
 *        {{PIC pic 5}} ==> http://img.jihui88.com/upload/a/a1/picture/2015/12/20/pic_5.jpg?v=2015-12-20_12:30
 */
BbaseHandlebars.registerHelper('PIC', function (name, number, options) {
  var version = '';
  var options = options;
  var def = CONST.PIC_NONE;
  var domain = CONST.PIC_URL;
  if (arguments.length < 3) {
    options = number;
  }
  if (options && options.hash.default) {
    def = options.hash.default;
  }
  if (options && options.hash.domain) {
    domain = options.hash.domain;
  }
  if (name) {
    name = name.replace(/\\/img, '/');
    version += (name.indexOf('?') > -1 ? ('&v=' + BbaseEst.hash(CONST.APP_VERSION)) :
      '?v=' + BbaseEst.hash(CONST.APP_VERSION));
    if (BbaseEst.startsWidth(name, 'CONST')) {
      name = BbaseHandlebars.helpers['CONST'].apply(this, [name.replace('CONST.', ''), options]);
    }
  }
  if (!name || !/[^\s]+\.(?:jpe?g|gif|png|bmp)/i.test(name)) return def.indexOf('http://') > -1 ? def : CONST.DOMAIN + def + version;
  if (name.indexOf('upaiyun.com') === -1 && BbaseEst.startsWidth(name, 'http') && name.indexOf('upload') > -1) {
    name = name.substring(name.indexOf('upload'), name.length);
  }
  if (name.indexOf('upaiyun.com') === -1 && BbaseEst.startsWidth(name, 'upload') || options.hash.upload) {
    return arguments.length < 3 ? domain + (BbaseEst.startsWidth(name, '/') ? '' : '/') + name + version :
      BbaseHandlebars.helpers['_picUrl'].apply(this, [name, number, options]) + version;
  }

  return BbaseEst.startsWidth(name, 'http') ? name + version : CONST.DOMAIN + name + version;
});

/**
 * 判断是否为空
 * @method [判断] - isEmpty
 * @author wyj 14.12.27
 * @example
 *      {{#isEmpty image}}<img src='...'></img>{{/isEmpty}}
 */
BbaseHandlebars.registerHelper('isEmpty', function (value, options) {
  return BbaseEst.isEmpty(value) ? options.fn(this) :
    options.inverse(this);
});

/**
 * 编译url
 * @method [url] - encodeUrl
 * @author wyj 15.2.1
 * @example
 *      {{encodeUrl url}}
 */
BbaseHandlebars.registerHelper('encodeUrl', function (val, options) {
  return encodeURIComponent(val);
});

/**
 * 解析JSON字符串
 * @method [JSON] - json
 * @example
 *      {{json 'invite.title'}}
 */
BbaseHandlebars.registerHelper('json', function (path, options) {
  return BbaseHandlebars.helpers["get"].call(this, path);
});
/**
 * 打版本号
 * @method [版本] - version
 * @example
 *      http://www.jihui88.com?v={{version}}
 */
BbaseHandlebars.registerHelper('version', function (type, options) {
  switch (type) {
    case 'time':
      return new Date().getTime();
      break;
    case 'hash':
      return BbaseEst.hash(new Date().getTime());
      break;
    default:
      return BbaseEst.hash(new Date().getTime());
  }
});

/**
 * 移除script标签
 * @method [标签] - stripScripts
 * @author wyj 15.5.12
 * @example
 *    {{stripScripts '<scripts></scripts>'}}
 */
BbaseHandlebars.registerHelper('stripScripts', function (str, options) {
  return BbaseEst.stripScripts(str);
});

/**
 * 替换
 * @method [字符串] - replace
 * @author wyj 15.5.12
 * @example
 *    {{replace module.type '\d*$' ''}}
 */
BbaseHandlebars.registerHelper('replace', function (val1, reg, val2, options) {
  if (BbaseEst.isEmpty(val1)) {
    return val1
  }
  return val1.replace(new RegExp(reg, 'img'), val2);
});

/**
 * 默认值
 * @method [字符串] - default
 * @author wyj 15.5.12
 * @example
 *    {{default module.type 'aa'}}
 */
BbaseHandlebars.registerHelper('default', function (val1, val2, options) {
  return BbaseEst.isEmpty(val1) ? val2 : val1;
});

/**
 * 映射
 * @method [字符串] - keyMap
 * @author wyj 15.5.12
 * @example
 *    {{keyMap module.type 'aa'}}
 */
BbaseHandlebars.registerHelper('keyMap', function (val1, val2, options) {
  if (!val1 || !val2) return '';
  return val2[val1];
});
/**
 * radio标签
 *
 * @method [表单] - radio
 * @author wyj 15.1.7
 * @example
 *        {{{radio name='isBest' value=isBest option='{"是": "01", "否": "00"}' }}}
 */
BbaseHandlebars.registerHelper('radio', function (options) {
  var result = [], list = $.parseJSON ? $.parseJSON(options.hash.option) : JSON.parse(options.hash.options);
  Est.each(list, function (val, key, list, index) {
    var checked = options.hash.value === val ? 'checked' : '';
    result.push('<label><input bb-model="'+options.hash.name+'" id="model' + index + '-' + options.hash.name + '" type="radio" name="' + options.hash.name +
      '" value="' + val + '" ' + checked + '>&nbsp;' + key + '</label>&nbsp;&nbsp;');
  });
  return result.join('');
});

/**
 * checkbox标签
 *
 * @method [表单] - checkbox
 * @author wyj 15.6.19
 * @example
 *      {{{checkbox label='' name='isDefault' value=isDefault trueVal='1' falseVal='0' }}}
 */
BbaseHandlebars.registerHelper('checkbox', function (options) {
  var id = options.hash.id ? options.hash.id : ('model-' + options.hash.name);
  var random = Est.nextUid('checkbox'); // 随机数
  var icon_style = "font-size: 32px;"; // 图标大小
  var value = Est.isEmpty(options.hash.value) ? options.hash.falseVal : options.hash.value; // 取值
  var isChecked = value === options.hash.trueVal ? true : false; // 是否选中状态
  var defaultClass = isChecked ? 'icon-checkbox' : 'icon-checkboxno';
  var args = ("'" + random + "'"); // 参数

  var result = '<div> <label for="' + id + '" style="overflow:hidden;display:inline-block;"> ' +
    '<input bb-model="'+options.hash.name+'" onclick="window.ckToggleClass(' + args + ');" type="checkbox" name="' + options.hash.name + '" id="' + id + '" value="' + value + '" ' + (isChecked ? 'checked' : '') + ' true-value="' + options.hash.trueVal + '" false-value="' + options.hash.falseVal + '"  class="rc-hidden" style="display: none;">' +
    '<i id="' + random + '" class="iconfont ' + defaultClass + '" style="' + icon_style + '"></i>' + options.hash.label +
    '</label></div>';
  return result;
});

/**
 * select标签
 *
 * @method [表单] - select
 * @author wyj 15.6.22
 * @example
 *      {{{select name='paymentConfit' value=curConfitPanment key='paymentId' text='name' list=paymentConfigList  style="height: 40px;"}}}
 *
 */
BbaseHandlebars.registerHelper('select', function (options) {
  var id = options.hash.id ? options.hash.id : ('model-' + options.hash.name);
  var str = '<select bb-model="'+options.hash.name+'" name="' + options.hash.name + '" id="' + id + '"  class="' + (options.hash.className || '') + '" style="' + (options.hash.style || '') + '"> ';
  Est.each(options.hash.list, function (item) {
    var selected = options.hash.value === item[options.hash.key] ? 'selected' : '';
    str += '<option value="' + item[options.hash.key] + '" ' + selected + '>' + item[options.hash.text] + '</option>';
  });
  return str + '</select>';
});
/**
 * 管道过滤
 *
 * @method [字符串] - pipe
 * @author wyj 15.5.12
 * @example
 *    {{pipe 'Math.floor(age);age+1;plus(age, 1);plus(age, age);'}}
 */
BbaseHandlebars.registerHelper('pipe', function (expression) {
  var result,
    preName = null,
    preType = 'string',
    bracketRe = /\(([^:\$]*)\)/img,
    obj = BbaseEst.cloneDeep(this),
    list = expression.split(';');

  BbaseEst.each(list, function (pipe, index) {
    pipe = BbaseEst.trim(pipe);
    if (BbaseEst.isEmpty(pipe)) return;
    var dollars = [];
    var key = null;
    var helper = '';
    var brackets = pipe.match(bracketRe);
    if (brackets) {
      BbaseEst.each(brackets[0].split(','), function (item) {
        var name = BbaseEst.trim(item.split('.')[0].replace(/[\(|\)]/img, ''));
        if (!key) {
          key = name;
          if (index === 0) preType = BbaseEst.typeOf(BbaseEst.getValue(obj, key));
        }
        if (name.indexOf('\'') > -1) {
          dollars.push(name.replace(/'/img, ''));
        } else if (/^[\d\.]+$/img.test(name)) {
          dollars.push(parseFloat(name));
        } else {
          dollars.push(BbaseEst.getValue(obj, name));
        }
      }, this);
    }

    helper = BbaseEst.trim(pipe.replace(/\(.*\)/g, ''));
    if (BbaseHandlebars.helpers[helper]) {
      result = BbaseHandlebars.helpers[helper].apply(obj, dollars);
    } else if (BbaseApp.getFilter(helper)) {
      result = BbaseApp.getFilter(helper).apply(obj, dollars);
    } else {
      result = BbaseEst.compile('{{' + pipe + '}}', obj);
      if (result.indexOf('NaN') > -1) {
        result = result.replace(/NaN/img, '');
      }
      if (result.indexOf('undefined') > -1) {
        result = result.replace(/undefined/img, '');
      }
      if (result.indexOf('null') > -1) {
        result = result.replace(/null/img, '');
      }
    }

    if (BbaseEst.isEmpty(key)) {
      key = preName;
    } else {
      preName = key;
    }
    switch (preType) {
      case 'string':
        result = String(result);
        break;
      case 'number':
        if (/^[\d.]*$/.test(result)) {
          result = Number(result);
        }
        break;
      case 'boolean':
        result = Boolean(result);
        break;
      default:
        result = String(result);
    }
    obj[key] = result;

  }, this);

  return result;
});
