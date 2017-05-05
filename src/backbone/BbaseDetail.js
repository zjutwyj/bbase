/**
 * @description BbaseDetail
 * @class BbaseDetail - 详细页面
 * @author yongjin<zjut_wyj@163.com> 2014.11.12
 */

var BbaseDetail = BbaseSuperView.extend({
  /**
   * 初始化
   *
   * @method [初始化] - _initialize ( 初始化 )
   * @param options
   * @author wyj 14.11.20
   * @example
   *      this._initialize({
       *         template : template, // 字符串模板
       *         model: ProductModel, // 模型类
       *         // 可选
       *         hideSaveBtn: true, // 保存成功后的弹出提示框中是否隐藏保存按钮
       *         hideOkBtn: true, // 保存成功后的弹出提示框中是否隐藏确定按钮
       *         autoHide: true, // 保存成功后是否自动隐藏提示对话框
       *         enterRender: '#submit' // 执行回车后的按钮点击的元素选择符
       *         modelBind: true, // 表单元素与模型类 双向绑定
       *         toolTip: true, // 是否显示title提示框   html代码： <div class="tool-tip" title="提示内容">内容</div>
       *         id: ctx.model.get('id'), // 当不是以dialog形式打开的时候， 需要传递ID值
                 page: ctx._getPage() // 点击返回按钮且需要定位到第几页时， 传入page值，
                 data: {} // 附加数据  获取方法为  _data.name
       *      });
   */
  _initialize: function (options) {
    this._initOptions(options);
    this._initTemplate(this._options);
    this._initList(this._options);
    this._initModel(options.model, this);
    this._initEnterEvent(this._options);
  },
  /**
   * 初始化参数
   *
   * @method [private] - _initOptions
   * @private
   * @author wyj 15.1.12
   */
  _initOptions: function (options) {
    this._options = BbaseEst.extend(this.options, options || {});
    this._options.speed = this._options.speed || 9;
    this.viewId = this._options.viewId;
    this.viewType = 'detail';
  },
  /**
   * 初始化模板， 若传递一个Template模板字符中进来， 则渲染页面
   *
   * @method [private] - _initTemplate
   * @private
   * @author wyj 15.1.12
   */
  _initTemplate: function (options) {
    this._data = options.data = options.data || {};
    if (options.template) {
      this.template = BbaseHandlebars.compile(this._parseHbs(options.template));
      this.$template = '<div>' + options.template + '</div>';
      //this.$el.append(this.template(options.data));
    }
    return this._data;
  },
  /**
   * 初始化列表视图容器
   *
   * @method [private] - _initList
   * @private
   * @author wyj 15.1.12
   */
  _initList: function (options) {
    var ctx = this;
    this.list = options.render ? this.$(options.render) : this.$el;
    if (this.list.size() === 0)
      this.list = $(options.render);
    return this.list;
  },
  /**
   * 渲染
   *
   * @method [渲染] - _render ( 渲染 )
   * @author wyj 14.11.20
   * @example
   *        this._render();
   */
  _render: function () {
    if (this.beforeRender) this.beforeRender.call(this, this._options);
    if (!this._options.append) this.list.empty();

    this.list.append(this.template(this.model.attributes));

    if (this._options.modelBind) setTimeout(this._bind(function () {
      this._modelBind();
    }), 0);
    if (window.topDialog) this.$('.form-actions').hide();
    if (this._watchBind) setTimeout(this._bind(function () {
      this._watchBind.call(this, this._options.template);
    }), 0);
    if (this._bbBind) setTimeout(this._bind(function () {
      this._bbBind.call(this, this._options.template, this.$el);
    }), 0);
    if (this.afterRender) setTimeout(this._bind(function () {
      this.afterRender.call(this, this._options);
    }), 0);
    if (this._options.onReady) setTimeout(this._bind(function () {
      this._options.onReady.call(this, this._options);
    }), 0);
    if (this._options.toolTip) setTimeout(this._bind(function () {
      this._initToolTip();
    }), 0);
    if (this._options.form) {
      this._formList = this._options.form.split(':');
      this._form(this._formList[0])._initSubmit({
        beforeSave: this.beforeSave,
        afterSave: this.afterSave
      }, this._formList.length > 1 ? this._formList[1] : null);
    }

    this._ready_component_ = true;

    BbaseUtils.removeLoading();
  },
  /**
   * 初始化模型类 将自动判断是否有ID传递进来，
   * 若存在则从服务器端获取详细内容
   * 若为添加， 则在ctx 与模型类里设置 _isAdd = true
   *
   * @method [private] - _initModel
   * @private
   * @param model
   * @param ctx
   * @author wyj 14.11.15
   */
  _initModel: function (model, ctx) {
    this._options.id = BbaseEst.typeOf(this._options.id) === 'number' ? this._options.id + '' : this._options.id;
    this._options.data.id = BbaseEst.typeOf(this._options.data.id) === 'number' ? this._options.data.id + '' : this._options.data.id;
    ctx.passId = this.options.id || this._options.data.id || BbaseEst.getUrlParam('id', window.location.href);

    if (!BbaseEst.isEmpty(this.passId)) {
      ctx.model = new model();
      ctx.model.set('id', ctx.passId);
      ctx.model.set('_data', ctx._options.data);
      ctx.model.set('CONST', CONST);
      if (ctx._initDefault) ctx._initDefault.call(this);
      if (ctx.beforeLoad) ctx.beforeLoad.call(this);
      ctx.model.fetch().done(function (response) {
        if (response.msgType === 'notLogin') {
          BbaseEst.trigger('checkLogin', null, true);
        }
        if (!response.success) {
          if (ctx.errorFetch) {
            ctx.errorFetch.call(ctx, response);
          }
        }
        ctx._attributes = response.attributes;
        BbaseEst.each(ctx.__def_vals_, function (value, key) {
          if (typeof ctx._get(key) === 'undefined') {
            ctx._set(key, value);
          }
        });
        ctx.model.set('_isAdd', ctx._isAdd = false);
        if (ctx.afterLoad) ctx.afterLoad.call(ctx, response);
        ctx.render();
      });
    } else {
      ctx.passId = new Date().getTime();
      ctx.model = new model(this._options.data || {});
      ctx.model.set('_data', ctx._options.data);
      ctx.model.set('_isAdd', ctx._isAdd = true);
      if (ctx._initDefault) ctx._initDefault.call(this);
      ctx.render();
    }

    if (this._options.hideOkBtn) ctx.model.hideOkBtn = true;
    if (this._options.hideSaveBtn) ctx.model.hideSaveBtn = true;
    if (this._options.autoHide) ctx.model.autoHide = true;

  },
  /**
   * form包装器， 传递表单选择符
   *
   * @method [表单] - _form ( form包装器 )
   * @param {String} formSelector 选择器
   * @return {BbaseDetail}
   * @author wyj on 14.11.15
   * @example
   *        this._form('#J_Form')._validate()._initSubmit({
   *          beforeSave: function(){
   *            // 处理特殊字段
   *            this.model.set('taglist', BbaseEst.map(ctx.tagInstance.collection.models, function (item) {
   *              return item.get('name');
   *            }).join(','));
   *          },
   *          afterSave : function(response){
   *             if(response.attributes.success == false ){
   *                ctx.refreshCode();
   *                return true;
   *             }
   *            BbaseUtils.tip('请验证邮箱后再登录!');
   *            window.location.href = '/member/modules/login/login.html';
   *          }
   *        });
   */
  _form: function (formSelector) {
    this.formSelector = formSelector;
    this.formElemnet = this.$(this.formSelector);
    return this;
  },
  /**
   * 启用表单验证
   *
   * @method [表单] - _validate ( 表单验证 )
   * @return {BbaseDetail}
   * @param options [url: 远程验证地址][fields{Array}: 字段名称]
   * @author wyj 14.11.15
   * @example
   *        this._form('#J_Form')._validate({
   *            url: CONST.API + '/user/validate',
   *            fields: ['vali-username', 'vali-email'] // 注意， 字段前加vali-
   *        });
   */
  _validate: function (options) {
    return this;
  },
  /**
   * 绑定提交按钮
   *
   * @method [表单] - _init ( 绑定提交按钮 )
   * @param options [beforeSave: 保存前方法] [afterSave: 保存后方法]
   * @author wyj 14.11.15
   * @example
   *        this._form()._validate()._initSubmit({
   *            beforeSave: function(){},
   *            afterSave: function(){},
   *            onErrorSave: function(){}
   *        });
   *
   *
   *        <input id="model-music.custom" name="music.custom" value="{{music.custom}}" type="text" class="input-large">
   *
   */
  _initSubmit: function (options, selector) {
    var ctx = this,
      passed = true,
      modelObj = {},
      isPassed = true;

    options = options || {};
    $(selector || '#submit', this.$el).on('click', function () {
      var $button = $(this);
      var bt = $button.is('input');
      var preText = ctx.preText = bt ? $button.val() : $button.html();
      passed = true; // 设置验证通过
      try {
        ctx.formElemnet.submit();
      } catch (e) {

      }
      $("input, textarea, select", $(ctx.formElemnet)).each(function () {
        var name, val, pass, modelKey, modelList;
        name = $(this).attr('name');
        if ($(this).hasClass('bui-form-field-error')) {
          passed = false;
        }
        var modelId = $(this).attr('id');
        if (modelId && modelId.indexOf('model') !== -1) {
          switch (this.type) {
            case 'radio':
              val = $(this).is(":checked") ? $(this).val() : pass = true;
              break;
            case 'checkbox':
              val = $(this).is(':checked') ? (BbaseEst.isEmpty($(this).attr('true-value')) ? true : $(this).attr('true-value')) :
                (BbaseEst.isEmpty($(this).attr('false-value')) ? false : $(this).attr('false-value'));
              break;
            default:
              val = $(this).val();
              break;
          }
          if (!pass) {
            modelKey = modelId.replace(/^model\d?-(.+)$/g, "$1");
            modelList = modelKey.split('.');
            if (modelList.length > 1) {
              try {
                if (!ctx.model.attributes[modelList[0]]) {
                  ctx.model.attributes[modelList[0]] = {};
                }
                BbaseEst.setValue(ctx.model.attributes, modelKey, val);
              } catch (e) {
                debug('Error18 -> _initSubmit -> ' + e); //debug__
              }
              //ctx.model.set(modelList[0], modelObj[modelList[0]]);
            } else {
              ctx.model.set(modelList[0], val);
            }
          }
        }
      });
      if (passed) {
        if (typeof options.beforeSave !== 'undefined')
          isPassed = options.beforeSave.call(ctx);
        if (BbaseEst.typeOf(isPassed) !== 'undefined' && !isPassed) return false;
        if (bt) {
          $button.val(CONST.LANG.SUBMIT);
        } else {
          $button.html(CONST.LANG.SUBMIT);
        }
        $button.prop('disabled', true);

        if (!BbaseEst.isEmpty(ctx.model.url())) ctx._baseSave(function (response) {
          if (options.afterSave) {
            options.afterSave = BbaseEst.inject(options.afterSave, function (response) {
              return new BbaseEst.setArguments(arguments);
            }, function (response) {
              if (bt) {
                $button.val(preText);
              } else {
                $button.html(preText);
              }
              $button.prop('disabled', false);
            });
            options.afterSave.call(ctx, BbaseEst.typeOf(response) === 'string' ? { msg: null, msgType: null, success: true } : BbaseEst.typeOf(BbaseEst.getValue(response, 'attributes._response.success')) === 'boolean' ?
              BbaseEst.getValue(response, 'attributes._response') : { msg: null, msgType: null, success: true });
          }
          $button.html(preText);
        }, function (response) {
          if (response.msgType === 'notLogin') {
            BbaseEst.trigger('checkLogin', null, true);
          }
          if (ctx.errorSave) ctx.errorSave.call(ctx, response);
          if (options.onErrorSave) options.onErrorSave.call(ctx, response);
        });
        setTimeout(function () {
          $button.html(preText);
          $button.prop('disabled', false);
        }, 5000);
      }
      return false;
    });
  },
  _baseSave: function (callback, error) {
    this._saveItem(callback, error);
  },
  /**
   * 保存结果
   *
   * @method [private] - _save
   * @private
   * @author wyj 14.11.18
   */
  _save: function (callback, error) {
    var _this = this,
      isPassed;
    if (typeof _this.beforeSave !== 'undefined')
      isPassed = _this.beforeSave.call(_this);
    if (BbaseEst.typeOf(isPassed) !== 'undefined' && !isPassed) return false;
    this._saveItem(function (response) {
      var resp = BbaseEst.typeOf(response) === 'string' ? { attributes: {data: response}, msg: null, msgType: null, success: true } : BbaseEst.typeOf(BbaseEst.getValue(response, 'attributes._response.success')) === 'boolean' ?
        BbaseEst.getValue(response, 'attributes._response') : { msg: null, msgType: null, success: true }
      if (_this.afterSave) {
        _this.afterSave.call(_this, resp);
      }
      if (callback) callback.call(_this, resp);
    }, function () {
      if (_this.errorSave) {
        _this.errorSave.call(_this, resp);
      }
      if (error) error.call(_this, resp);
    });
  },
  /**
   * 保存表单
   *
   * @method [private] - _saveItem
   * @private
   * @param callback
   * @param context
   * @author wyj 14.11.15
   */
  _saveItem: function (callback, error) {
    var _this = this;

    if (BbaseEst.isEmpty(this.model.url())) {
      return;
    }
    if (this.model.attributes._response) {
      delete this.model.attributes._response;
    }

    BbaseEst.off('errorSave' + this.model.cid).on('errorSave' + this.model.cid, this._bind(function (type, response) {
      if (this.errorSave) this.errorSave.call(this, response);
    }));

    this.model.save(null, {
      wait: true,
      success: function (response) {
        BbaseApp.addModel(BbaseEst.cloneDeep(response.attributes));
        try {
          if (top && top.model) {
            top.model = response.attributes;
          }
        } catch (e) {}
        if (callback && typeof callback === 'function')
          callback.call(this, response);
      },
      error: function (model, XMLHttpRequest, errorThrown) {
        if (XMLHttpRequest.status === 200) {
          if (callback) {
            callback.call(this, XMLHttpRequest.responseText);
          } else if (_this.afterSave) {
            _this.afterSave.call(_this, BbaseEst.typeOf(XMLHttpRequest.responseText) === 'string' ? { msg: null, msgType: null, success: true } : BbaseEst.typeOf(BbaseEst.getValue(XMLHttpRequest.responseText, 'attributes._response.success')) === 'boolean' ?
              BbaseEst.getValue(XMLHttpRequest.responseText, 'attributes._response') : { msg: null, msgType: null, success: true });
          }

        } else if (error && typeof error === 'function') {
          if (error) {
            error.call(this, XMLHttpRequest, model, errorThrown);
          } else if (_this.errorSave) {
            _this.errorSave.call(_this, XMLHttpRequest.responseText);
          }
        }
      }
    });
  },
  /**
   * 清空视图， 并移除所有绑定的事件
   *
   * @method [渲染] - _empty ( 清空视图 )
   * @author wyj 14.11.16
   * @example
   *      this._empty();
   */
  _empty: function () {
    this.model.off();
    this.$el.empty().off();
  }
});
