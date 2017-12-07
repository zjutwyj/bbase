/**
 * @description 模型类
 *
 *    - initialize (可选) 实现父类_initialize // 可选
 *    - defaults (可选) 默认值  如 BbaseEst.extend({}, BbaseModel.prototype.defaults);
 *    - baseId (可选) ID标识符 如 productId
 *    - baseUrl (可选) 服务器交互地址 // 可选
 *    - params (可选) 附加参数 如  mobile=true&type=01 // 可选
 *    - validate (可选) 当需要实现单个字段保存时， 需要调用父类_validation, 参照ProductModel
 *
 * @class BbaseModel - 模型类
 * @author yongjin<zjut_wyj@163.com> 2014/11/10
 */

(function(BbaseBackbone, BbaseEst, BbaseApp, BbaseUtils, BbaseHandlebars, undefined){
var BbaseModel = BbaseBackbone.Model.extend({
  defaults: { checked: false, checked_all: false, load_completed: false, result_none: false, children: [] },
  baseId: '',
  /**
   * 初始化请求连接, 判断是否为新对象， 否自动加上ID
   *
   * @method [private] - url
   * @private
   * @return {*}
   * @author wyj 14.11.16
   */
  url: function () {
    var _this = this;
    var base = _this.baseUrl;
    var _url = '';
    if (!base) return '';
    if (BbaseEst.typeOf(base) === 'function')
      base = base.call(_this);
    _this.params = _this.params ? _this.params + _this._getParams() : _this._getParams();
    var sep = BbaseEst.isEmpty(_this.params) ? '' : '?';
    if (_this.isNew() && BbaseEst.isEmpty(_this.id)) return base + sep + _this.params;
    _url = base + (base.charAt(base.length - 1) == '/' ? '' : '/') + (_this.attributes[_this.baseId] || _this.attributes.id) + sep + _this.params;
    return _url;
  },
  /**
   * 模型类初始化
   *
   * @method [初始化] - _initialize ( 初始化 )
   * @author wyj 14.11.16
   * @example
   *      this._initialize();
   */
  _initialize: function (options) {
    var _this = this;
    _this.validateMsg = null;
    _this.__params = _this.__params || {};
  },
  /**
   * 过滤结果, 并提示信息对话框, 若不想提示信息可以设置hideTip为true
   *
   * step 1:
   *  当服务器有返回msg消息 并参数设置hideTip为false时  弹出提示信息
   *  成功保存后 当为添加元素时 添加“继续添加”按钮， 点击继续添加按钮， 重新设置id为null, baseId为null, 使其变为新对象
   *  当参数hideOkBtn为false时添加 “确定”按钮， 当点击按钮地， 触发_dialog_submit_callback事件， 关闭_dialog对话框，
   *  关闭当前消息对话框， 当文档中存在btn-back按钮时， 返回列表页面
   * step 2:
   *  当success为false时， 直接返回服务器错误的response信息
   * step 3:
   *  处理data数据， 并把data数据赋值到response对象上
   * step 4:
   *  设置backbone 模型类里的id值， 默认不选中， 设置时间戳
   *
   * this.model.hideTip = true; // 无提示信息弹出框
   * this.model.hideOkBtn = true; // 隐藏保存按钮
   * this.model.hideAddBtn = true; // 隐藏继续添加按钮
   * this.model.autoHide = true; // 自动隐藏提示信息
   * this.model.autoBack = true; // 保存成功后自动返回列表页面
   * this.model.stopCheckLogin = true; // 取消登录判断
   *
   * @method [private] - parse
   * @param response
   * @param options
   * @return {*}
   * @author wyj 14.11.16
   */
  parse: function (response, options) {
    var ctx = this,
      buttons = [],
      _isNew = false;
    if ('msg' in response) BbaseUtils.removeLoading();
    if (BbaseEst.isEmpty(response)) {
      var url = BbaseEst.typeOf(ctx.url) === 'function' ? ctx.url() : ctx.url;
      BbaseUtils.tip(CONST.LANG.REQUIRE_FAILED);
      return false;
    }
    if (response && response.msg && response.msg === CONST.LANG.AUTH_FAILED) {
      BbaseUtils.tip(CONST.LANG.AUTH_LIMIT, { time: 2000 });
    }
    if (response.msgType === 'notLogin' && !ctx.stopCheckLogin) {
      BbaseEst.trigger('checkLogin', null, true);
    } else if (response.msgType === "nopriv" && CONST.NO_PRIV) {
      if (CONST.NO_PRIV.indexOf('#/') > -1) {
        ctx._navigate(CONST.NO_PRIV, true);
      } else {
        window.location.href = CONST.NO_PRIV;
      }
    }
    // 当服务器有返回msg消息 并参数设置hideTip为false时  弹出提示信息
    // 成功保存后 当为添加元素时 添加“继续添加”按钮， 点击继续添加按钮， 重新设置id为null, baseId为null, 使其变为新对象
    // 当参数hideOkBtn为false时添加 “确定”按钮， 当点击按钮地， 触发_dialog_submit_callback事件， 关闭_dialog对话框，
    // 关闭当前消息对话框， 当文档中存在btn-back按钮时， 返回列表页面
    if (response.msg && !ctx.hideTip) {
      if (response.success) {
        if (ctx.isNew() && ctx.continueAdd) {
          buttons.push({
            value: CONST.LANG.ADD_CONTINUE,
            callback: function () {
              ctx.set('id', null);
              ctx.set(ctx.baseId, null);
            }
          });
          _isNew = true;
        }
      }
      if (ctx.saveTip) {
        buttons.push({
          value: CONST.LANG.CONFIRM,
          callback: function () {
            this.close();
          },
          autofocus: true
        });
      }
      if (buttons.length > 0) {
        var dialog_msg = BbaseUtils.dialog({
          id: 'dialog_msg',
          title: CONST.LANG.TIP,
          content: '<div style="padding: 20px;">' + response.msg + '</div>',
          width: 250,
          button: buttons
        });
        if (!ctx.continueAdd) {
          setTimeout(function () {
            BbaseApp.getDialog('dialog_msg') && (ctx.autoHide || !_isNew) &&
              BbaseApp.getDialog('dialog_msg').close().remove();
          }, 2000);
        }
      }
    }
    // 当success为false时， 直接返回服务器错误的response信息
    if (BbaseEst.typeOf(response.success) === 'boolean' && !response.success) {
      ctx.attributes._response = response;
      BbaseEst.trigger('errorSave' + ctx.cid, response, true);
      return ctx.attributes;
    }
    // 处理data数据， 并把data数据赋值到response对象上
    if (response.attributes && response.attributes.data) {
      var keys = BbaseEst.keys(response.attributes);
      if (keys.length > 1) {
        BbaseEst.each(keys, function (item) {
          if (item !== 'data')
            response.attributes['data'][item] = response.attributes[item];
        });
      }
      response = response.attributes.data;
    }
    // 设置backbone 模型类里的id值， 默认不选中， 设置时间戳
    if (response) {
      response.id = response[ctx.baseId || 'id'];
      response.checked = false;
      response.time = new Date().getTime();
    }
    return response;
  },
  /**
   * 保存模型类
   *
   * @method [保存] - _saveField ( 保存模型类 )
   * @param keyValue
   * @param ctx
   * @param options [success: 成功回调][async: 是否异步]
   * @author wyj 14.11.16
   * @example
   *        this.model._saveField({
   *          id: thisNode.get('id'),
   *          sort: thisNode.get('sort')
   *        }, ctx, { // ctx须初始化initModel
   *          success: function(){}, // 保存成功回调
   *          async: false, // 是否同步
   *          hideTip: false // 是否隐藏提示
   *          hideOkBtn: false // 是否隐藏确定按钮
   *        });
   */
  _saveField: function (keyValue, ctx, options) {
    var wait = options.async || true;
    var newModel = new ctx.initModel({
      id: keyValue.id || ctx.model.get('id')
    });
    newModel.clear();
    newModel.set(keyValue);
    newModel.set('silent', true);
    if (options.hideTip) newModel.hideTip = true;
    newModel.hideOkBtn = true;
    newModel.set('editField', true);
    if (newModel.baseUrl) {
      newModel.save(null, {
        success: function (model, result) {
          if (result.msgType === 'notLogin' && !this.stopCheckLogin) {
            BbaseEst.trigger('checkLogin', null, true);
          }
          if (typeof options.success != 'undefined') {
            options.success && options.success.call(ctx, keyValue, result);
          }
        },
        wait: wait
      });
    } else {
      options.success && options.success.call(ctx, keyValue, {});
    }
  },
  /**
   * 获取子模型
   *
   * @method [private] - _getChildren
   * @private
   * @return {*}
   * @author wyj 14.12.18
   */
  _getChildren: function (collection) {
    return BbaseEst.map(this.get('children'), function (ref) {
      // Lookup by ID in parent collection if string/num
      if (typeof (ref) == 'string' || typeof (ref) == 'number')
        return collection.get(ref);
      // Else assume its a real object
      return ref;
    });
  },
  /**
   * 隐藏保存后的提示对话框
   *
   * @method [对话框] - _hideTip ( 隐藏提示对话框 )
   * @author wyj 15.1.29
   * @example
   *      this.model._hideTip();
   */
  _hideTip: function () {
    this.hideTip = true;
  },
  /**
   * 设置checkbox选择框状态
   *
   * @method [选取] - _toggle ( 设置checkbox选择框状态 )
   * @author wyj 14.11.16
   * @example
   *      this.model._toggle();
   */
  _toggle: function () {
    this.set('checked', !this.get('checked'));
  },
  /**
   * 预处理验证， 若模型类里有silent=true字段，则取消验证
   *
   * @method [验证] - _validate ( 预处理验证 )
   * @param attributes
   * @param callback
   * @author wyj 14.11.21
   * @example
   *        validate: function (attrs) {
   *          return this._validation(attrs, function (attrs) {
   *            if (!attrs.sort || attrs.sort < 0) {
   *            this.validateMsg = "sort不能为空";
   *          }
   *         });
   *        }
   */
  _validation: function (attributes, callback) {
    if (!attributes.silent && callback) {
      callback.call(this, attributes);
    }
    return this.validateMsg;
  },
  /**
   * 获取model值
   *
   * @method [获取] - _getValue ( 获取model值 )
   * @param path
   * @author wyj 15.1.30
   * @example
   *      this._getValue('tip.name');
   */
  _getValue: function (path) {
    return BbaseEst.getValue(this.attributes, path);
  },
  /**
   * 设置model值
   *
   * @method [设置] - _setValue ( 设置model值 )
   * @param path
   * @param val
   * @author wyj 15.1.30
   * @example
   *      this._setValue('tip.name', 'aaa');
   */
  _setValue: function (path, val) {
    BbaseEst.setValue(this.attributes, path, val);
  },
  /**
   * 设置模型类值
   * @method _set
   * @param {[type]} path [description]
   * @param {[type]} val  [description]
   */
  _set: function (path, val) {
    var _this = this;
    return _this.view ? _this.view._set(path, val) : _this._setValue(path, val);
  },
  /**
   * 获取模型类值
   * @method _get
   * @param  {[type]} path [description]
   * @return {[type]}      [description]
   */
  _get: function (path) {
    var _this = this;
    return _this.view ? _this.view._get(path) : _this._getValue(path);
  },
  /**
   * 获取整型值
   * @method _getInt
   * @param  {[type]} path [description]
   * @return {[type]}      [description]
   */
  _getInt: function (path) {
    return parseInt(this._get(path), 10);
  },
  /**
   * 获取浮点型数值
   * @method _getFloat
   * @param  {[type]} path [description]
   * @return {[type]}      [description]
   */
  _getFloat: function (path) {
    return parseFloat(this._get(path), 10);
  },
  /**
   * 设置请求参数
   * @method _setParam
   *
   * @param {[type]} name  [description]
   * @param {[type]} value [description]
   */
  _setParam: function (name, value) {
    this.__params[name] = value;
  },
  /**
   * 获取请求参数
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  _getParam: function (name) {
    return this.__params[name];
  },
  /**
   * 拼装请求参数
   * @method _getParams
   *
   * @return {[type]} [description]
   */
  _getParams: function () {
    var result = '';
    BbaseEst.each(this.__params, function (val, key) {
      result += ('&' + key + '=' + val);
    });
    return result;
  },
  initialize: function () {
    this._initialize();
  }
});
window.BbaseModel = BbaseModel;
})(window.BbaseBackbone, window.BbaseEst, window.BbaseApp, window.BbaseUtils, window.BbaseHandlebars);

