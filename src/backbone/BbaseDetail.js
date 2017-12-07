/**
 * @description BbaseDetail
 * @class BbaseDetail - 详细页面
 * @author yongjin<zjut_wyj@163.com> 2014.11.12
 */
(function (BbaseBackbone, BbaseEst, BbaseApp, BbaseUtils, BbaseHandlebars, BbaseSuperView, undefined) {
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
      var _this = this;
      _this._initOptions(options);
      _this._initTemplate(_this._options);
      _this._initList(_this._options);
      _this._initModel(options.model, _this);
      _this._initEnterEvent(_this._options);
    },
    /**
     * 初始化参数
     *
     * @method [private] - _initOptions
     * @private
     * @author wyj 15.1.12
     */
    _initOptions: function (options) {
      var _this = this;
      _this._options = BbaseEst.extend(_this.options, options || {});
      _this._options.speed = _this._options.speed || 9;
      _this.viewId = _this._options.viewId;
      _this.viewType = 'detail';
    },
    /**
     * 初始化模板， 若传递一个Template模板字符中进来， 则渲染页面
     *
     * @method [private] - _initTemplate
     * @private
     * @author wyj 15.1.12
     */
    _initTemplate: function (options) {
      var _this = this;
      _this._data = options.data = options.data || {};
      if (options.template) {
        _this.template = BbaseHandlebars.compile(_this._parseHbs(options.template));
        _this.$template = '<div>' + options.template + '</div>';
        _this.$el.hide();
        //this.$el.append(this.template(options.data));
      }
      return _this._data;
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
      ctx.list = options.render ? ctx.$(options.render) : ctx.$el;
      if (ctx.list.size() === 0)
        ctx.list = $(options.render);
      return ctx.list;
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
      var _this = this;
      if (_this.beforeRender) _this.beforeRender.call(_this, _this._options);
      if (!_this._options.append) _this.list.empty();

      _this.list.append(_this.template(_this.model.attributes));

      if (_this._options.modelBind) _this._modelBind();
      if (window.topDialog) _this.$('.form-actions').hide();
      if (_this._watchBind)_this._watchBind.call(_this, _this._options.template);
      if (_this._bbBind) _this._bbBind.call(_this, _this._options.template, _this.$el);
      if (_this.afterRender)  setTimeout(function(){_this.afterRender.call(_this, _this._options);}, 0);
      if (_this._options.onReady) _this._options.onReady.call(_this, _this._options);
      if (_this._options.toolTip)  _this._initToolTip();
      if (_this._options.form) {
        _this._formList = _this._options.form.split(':');
        _this._form(_this._formList[0])._initSubmit({
          beforeSave: _this.beforeSave,
          afterSave: _this.afterSave
        }, _this._formList.length > 1 ? _this._formList[1] : null);
      }
      _this._ready_component_ = true;

      setTimeout(function () {
        _this.$el.show();
        _this._handleDirectiveShow();
        if (_this._options.afterShow) _this._options.afterShow.call(_this);
        if (_this._options.onShow) _this._options.onShow.call(_this);
        if (_this.afterShow) _this.afterShow.call(_this);
        BbaseUtils.removeLoading();
      }, 80);


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
      var _this = this;
      _this._options.id = BbaseEst.typeOf(_this._options.id) === 'number' ? _this._options.id + '' : _this._options.id;
      _this._options.data.id = BbaseEst.typeOf(_this._options.data.id) === 'number' ? _this._options.data.id + '' : _this._options.data.id? _this._options.data.id : _this._options.id;
      ctx.passId = _this.options.id || _this._options.data.id || BbaseEst.getUrlParam('id', window.location.href);

      if (!BbaseEst.isEmpty(_this.passId)) {
        ctx.model = new model();
        ctx.model.set('id', ctx.passId);
        ctx.model.set('_data', ctx._options.data);
        ctx.model.set('CONST', CONST);
        if (ctx._initDefault) ctx._initDefault.call(_this);
        if (ctx.beforeLoad) ctx.beforeLoad.call(_this);
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
            if (typeof ctx._get(key) === 'undefined' || ctx._get(key) === null) {
              ctx._set(key, value);
            }
          });
          ctx.model.set('_isAdd', ctx._isAdd = false);
          if (ctx.afterLoad) ctx.afterLoad.call(ctx, response);
          ctx.render();
        });
      } else {
        ctx.passId = new Date().getTime();
        ctx.model = new model(_this._options.data || {});
        ctx.model.set('_data', ctx._options.data);
        ctx.model.set('_isAdd', ctx._isAdd = true);
        if (ctx._initDefault) ctx._initDefault.call(_this);
        ctx.render();
      }

      if (_this._options.hideOkBtn) ctx.model.hideOkBtn = true;
      if (_this._options.hideSaveBtn) ctx.model.hideSaveBtn = true;
      if (_this._options.autoHide) ctx.model.autoHide = true;

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
      var _this = this;
      _this.formSelector = formSelector;
      _this.formElemnet = _this.$(_this.formSelector);
      return _this;
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
      $(selector || '#submit', ctx.$el).on('click', function () {
        var $button = $(this);
        var bt = $button.is('input');
        var preText = ctx.preText = bt ? $button.val() : $button.html();
        passed = true; // 设置验证通过
        try {
          ctx.formElemnet.submit();
        } catch (e) {

        }
        $("input, textarea, select", $(ctx.formElemnet)).each(function () {
          var _this = this;
          var name, val, pass, modelKey, modelList;
          name = $(_this).attr('name');
          if ($(_this).hasClass('bui-form-field-error')) {
            passed = false;
          }
          var modelId = $(_this).attr('id');
          if (modelId && modelId.indexOf('model') !== -1) {
            switch (_this.type) {
              case 'radio':
                val = $(_this).is(":checked") ? $(_this).val() : pass = true;
                break;
              case 'checkbox':
                val = $(_this).is(':checked') ? (BbaseEst.isEmpty($(_this).attr('true-value')) ? true : $(_this).attr('true-value')) :
                  (BbaseEst.isEmpty($(_this).attr('false-value')) ? false : $(_this).attr('false-value'));
                break;
              default:
                val = $(_this).val();
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
                  console.log('Error18 -> _initSubmit -> ' + e); //debug__
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
              }, function (response) {});
              options.afterSave.call(ctx, BbaseEst.typeOf(response) === 'string' ? { msg: null, msgType: null, success: true } : BbaseEst.typeOf(BbaseEst.getValue(response, 'attributes._response.success')) === 'boolean' ?
                BbaseEst.getValue(response, 'attributes._response') : { msg: null, msgType: null, success: true });
            }
            if (bt) {
              $button.val(preText);
            } else {
              $button.html(preText);
            }
            $button.prop('disabled', false);
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
      _this._saveItem(function (response) {
        var resp = BbaseEst.typeOf(response) === 'string' ? { attributes: { data: response }, msg: null, msgType: null, success: true } : BbaseEst.typeOf(BbaseEst.getValue(response, 'attributes._response.success')) === 'boolean' ?
          BbaseEst.getValue(response, 'attributes._response') : { msg: null, msgType: null, success: true }
        if (_this.afterSave) {
          _this.afterSave.call(_this, resp);
        }
        if (callback &&  BbaseEst.typeOf(callback) === 'function') callback.call(_this, resp);
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

      if (BbaseEst.isEmpty(_this.model.url())) {
        return;
      }
      if (_this.model.attributes._response) {
        delete _this.model.attributes._response;
      }

      BbaseEst.off('errorSave' + _this.model.cid).on('errorSave' + _this.model.cid, _this._bind(function (type, response) {
        if (_this.errorSave) _this.errorSave.call(_this, response);
      }));

      _this.model.save(null, {
        wait: true,
        success: function (response) {
          BbaseApp.addModel(BbaseEst.cloneDeep(response.attributes));
          try {
            if (top && top.model) {
              top.model = response.attributes;
            }
          } catch (e) {}
          if (callback && typeof callback === 'function')
            callback.call(_this, response);
        },
        error: function (model, XMLHttpRequest, errorThrown) {
          if (XMLHttpRequest.status === 200) {
            if (callback) {
              callback.call(_this, XMLHttpRequest.responseText);
            } else if (_this.afterSave) {
              _this.afterSave.call(_this, BbaseEst.typeOf(XMLHttpRequest.responseText) === 'string' ? { msg: null, msgType: null, success: true } : BbaseEst.typeOf(BbaseEst.getValue(XMLHttpRequest.responseText, 'attributes._response.success')) === 'boolean' ?
                BbaseEst.getValue(XMLHttpRequest.responseText, 'attributes._response') : { msg: null, msgType: null, success: true });
            }

          } else if (error && typeof error === 'function') {
            if (error) {
              error.call(_this, XMLHttpRequest, model, errorThrown);
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
      var _this = this;
      _this.model.off();
      _this.$el.empty().off();
    },
    /**
     * 判断是否是新类型类
     * @return {Boolean} [description]
     */
    _isNew: function(){
      return this._get('_isAdd');
    }
  });

  window.BbaseDetail = BbaseDetail;
})(window.BbaseBackbone, window.BbaseEst, window.BbaseApp, window.BbaseUtils, window.BbaseHandlebars, window.BbaseSuperView);
