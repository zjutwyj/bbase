/**
 * @description 单视图
 *
 *  - el: 目标元素Id 如 "#jhw-main"
 *  - tagName: 'tr',
 *  - className: 'bui-grid-row',
 *  - events: {
 *     'click .btn-del': '_del', // 删除
       'click .btn-move-up': '_moveUp', // 上移
       'click .btn-move-down': '_moveDown', // 下移
       'click .btn-toggle': '_check',// 全选按钮
       'change .input-sort': '_saveSort', // 保存sort字段
       'click .btn-more': '_more', // 更多
 *  }，
 *  - initialize: function(){this._render()}
 *  - render: function(){this._render()}
 *
 * @class BbaseItem - 单视图
 * @author yongjin<zjut_wyj@163.com> 2014/12/8
 */

var BbaseItem = BbaseSuperView.extend({
  /**
   * 初始化, 若该视图的子元素有hover选择符， 则自动为其添加鼠标经过显示隐藏事件
   *
   * @method [初始化] - _initialize ( 初始化 )
   * @param {Object} options [template: 模板字符串]
   * @author wyj 14.11.16
   * @example
   *        this._initialize({
       *            template: itemTemp, // 模板字符串
       *            // 可选
       *            modelBind: false, // 绑定模型类， 比如文本框内容改变， 模型类相应改变; 当元素为checkbox是， 需设置true-value="01" false-value="00",
       *            若不设置默认为true/false
       *            detail: '#/product', // 详细页面路由  如果不是以dialog形式弹出时 ， 此项不能少 , 且开头为“#/”  需配置路由如： BbaseApp.addRoute('product/:id', function (id) {
                            productDetail(BbaseEst.decodeId(id, 'Product_', 32));
                            }); 如果需要弹出对话框， 则route为具体的详细页模块 如：ProductDetail
                    encodeUrl: false, // 是否缩减url    如： #/product/Product_000000000000000000099 =>> #/product/99  路由中需解码：BbaseEst.decodeId(id, 'Product_', 32)
       *            filter: function(model){ // 过滤模型类
       *            },
       *            beforeRender: function(model){},
       *            afterRender: function(model){},
       *            enterRender: '#submit' // 执行回车后的按钮点击的元素选择符
       *        });
   */
  _initialize: function(options) {
    this._initOptions(options);
    this._initCollapse(this.model.get('_options'));
    this._initTemplate(this._options);
    this._initBind(this._options);
    this._initView(this._options);
    this._initStyle(this._options);
    this._initEnterEvent(this._options);
  },
  /**
   * 初始化参数
   *
   * @method [private] - _initOptions
   * @private
   * @author wyj 15.1.12
   */
  _initOptions: function(options) {
    this._options = BbaseEst.extend(this.options, options || {});
    this._options.speed = this._options.speed || 9;
    this.viewId = this._options.viewId;
    this.viewType = 'item';
  },
  /**
   * 初始化展开收缩
   *
   * @method [private] - _initCollapse
   * @param options
   * @private
   * @author wyj 15.2.14
   */
  _initCollapse: function(options) {
    if (options._speed > 1) {
      this.model.stopCollapse = false;
      this.collapsed = options ? options._extend : false;
    }
  },
  /**
   * 初始化模板， 若传递一个Template模板字符中进来， 则渲染页面
   *
   * @method [private] - _initTemplate
   * @private
   * @author wyj 15.1.12
   */
  _initTemplate: function(options) {
    options.template = this.template || options.template || options.itemTemp;
    if (options.template) {
      this.$template = '<div>' + options.template + '</div>';
      if (options.viewId) {
        if (!BbaseApp.getCompileTemp(options.viewId)) {
          BbaseApp.addCompileTemp(options.viewId, BbaseHandlebars.compile(this._parseHbs(options.template)));
        }
      } else {
        this.hbstemplate = BbaseHandlebars.compile(this._parseHbs(options.template));
      }
    }
  },
  /**
   * 绑定事件， 如添加事件， 重置事件
   *
   * @method [private] - _initBind
   * @private
   * @author wyj 14.11.16
   */
  _initBind: function(options) {
    if (options.speed > 1) {
      this.model.bind('reset', this.render, this);
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    }
  },
  /**
   * 初始化视图
   *
   * @method [private] - _initView
   * @param options
   * @private
   * @author wyj 15.2.14
   */
  _initView: function(options) {
    if (options.speed > 1) {
      if (this.model.view) this.model.view.remove();
      this.model.view = this;
    }
  },
  /**
   * 初始化样式
   *
   * @method [private] - _initStyle
   * @private
   * @author wyj 15.2.14
   */
  _initStyle: function(options) {
    if (options.speed > 1) {
      var item_id = this._get('id') ? (this._get('id') + '') : (this._get('dx') + 1 + '');
      if (this._get('dx') % 2 === 0) this.$el.addClass('bui-grid-row-even');
      this.$el.addClass('_item_el_' + (this.viewId || '') + '_' + item_id.replace(/^[^1-9]+/, ""));
      if (this.$el.hover) {
        this.$el.hover(function() {
          $(this).addClass('hover');
        }, function() {
          $(this).removeClass('hover');
        });
      }
    }
  },
  /**
   * 渲染
   *
   * @method [渲染] - _render ( 渲染 )
   * @return {BbaseCollection}
   * @author wyj 14.11.18
   */
  _render: function() {
    this._onBeforeRender();
    if (this._options && this._options.filter){
      var fresult = this._options.filter.call(this, this.model);
      if (typeof fresult !== 'undefined' && !fresult){
        this.$el.remove();
        return ;
      }
    }
    // 添加判断是否存在this.$el
    this._beforeTransition();
    this.$el.html(this.hbstemplate ? this.hbstemplate(this.model.attributes) :
      this.viewId && BbaseApp.getCompileTemp(this.viewId) && BbaseApp.getCompileTemp(this.viewId)(this.model.attributes));
    this._onAfterRender();
    // 判断是否存在子元素
    var modelOptions = this._get('_options');
    if (modelOptions && modelOptions._subRender && this._get('children') &&

      this._get('children').length > 0) {
      // Build child views, insert and render each
      var ctx = this;
      var childView = null;
      var level = this._get('level') || 1;

      var tree = this.$(modelOptions._subRender + ':first');
      this._setupEvents(modelOptions);

      BbaseEst.each(this.model._getChildren(modelOptions._collection), function(newmodel) {
        var childView = null;

        newmodel.set('_options', modelOptions);
        newmodel.set('level', level + 1);

        childView = new modelOptions._item({
          model: newmodel,
          data: ctx._options._data
        });
        childView._setInitModel(ctx.initModel);
        childView._setViewId(ctx._options.viewId);
        //TODO 解决子类下的移序问题
        newmodel.view = childView;

        tree.append(childView.$el);
        if (ctx._options.views) {
          ctx._options.views.push(childView);
        }
        childView._render();
      });
      /* Apply some extra styling to views with children */
      if (childView) {
        // Add bootstrap plus/minus icon
        //this.$('> .node-collapse').prepend($('<i class="icon-plus"/>'));
        // Fixup css on last item to improve look of tree
        //childView.$el.addClass('last-item').before($('<li/>').addClass('dummy-item'));
      }
    }

    return this;
  },
  /**
   * 设置viewId
   *
   * @method [参数] - _setViewId ( 设置viewId )
   * @param name
   * @private
   * @author wyj 14.12.20
   */
  _setViewId: function(name) {
    if (this._options) this._options.viewId = this.viewId = name;
  },
  /**
   * 设置模型类
   *
   * @method [private] - _setInitModel
   * @private
   * @param model
   * @author wyj 14.11.20
   */
  _setInitModel: function(model) {
    this.initModel = model;
  },
  /**
   * 绑定展开收缩事件
   *
   * @method [private] - _setupEvents
   * @private
   * @author wyj 14.12.9
   */
  _setupEvents: function(opts) {
    // Hack to get around event delegation not supporting ">" selector
    var that = this;
    that._toggleCollapse.call(this, opts);
    this.$(opts._collapse + ':first').click(function() {
      that._toggleCollapse.call(that, opts);
    });
  },
  /**
   * 展开收缩
   *
   * @method [private] - _toggleCollapse
   * @private
   * @author wyj 14.12.9
   */
  _toggleCollapse: function(opts) {
    var ctx = this;
    if (this.model.stopCollapse) {
      this.$(opts._subRender + ':first').addClass('hide');
      return;
    }
    ctx.collapsed = !ctx.collapsed;

    if (ctx.collapsed) {
      this.$(opts._collapse + ':first').removeClass('x-caret-down');
      this.$(opts._subRender + ':first').slideUp(CONST.COLLAPSE_SPEED).addClass('hide');
    } else {
      this.$(opts._collapse + ':first').addClass('x-caret-down');
      this.$(opts._subRender + ':first').slideDown(CONST.COLLAPSE_SPEED).removeClass('hide');
    }
  },
  /**
   * 渲染前事件
   *
   * @method [private] - _onBeforeRender
   * @private
   * @author wyj 14.12.3
   */
  _onBeforeRender: function() {
    if (this._initDefault) this._initDefault.call(this);
    if (this.beforeRender) this.beforeRender.call(this, this.model);
  },
  /**
   * 渲染后事件
   *
   * @method [private] - _onAfterRender
   * @private
   * @author wyj 14.12.3
   */
  _onAfterRender: function() {
    if (this._options.modelBind) setTimeout(this._bind(function() {
      this._modelBind();
    }), 0);
    if (this._options.toolTip) setTimeout(this._bind(function() {
      this._initToolTip();
    }), 0);
    if (this.afterRender) setTimeout(this._bind(function() {
      this.afterRender.call(this, this.model);
    }), 0);
    if (this._watchBind) setTimeout(this._bind(function() {
      this._watchBind.call(this, this._options.template);
    }), 0);
    if (this._bbBind) setTimeout(this._bind(function() {
      this._bbBind.call(this, this._options.template, this.$el);
    }), 0);

    this._ready_component_ = true;
  },
  /**
   * 移除监听
   *
   * @method [private] - _close
   * @private
   * @author wyj 14.11.16
   */
  _close: function() {
    this.stopListening();
  },
  /**
   * 移除此模型
   *
   * @method [private] - _clear
   * @private
   * @author wyj 14.11.16
   */
  _clear: function() {
    this.model.destroy();
  },
  /**
   * checkbox选择框转换
   *
   * @method [选取] - _check ( checkbox选择框转换 )
   * @author wyj 14.11.16
   * @example
   *      itemClick: function(e){
   *        e.stopImmediatePropagation();
   *        this.loadPhoto();
   *        this._check(e);
   *      }
   */
  _check: function(e) {
    var checked = this._get('checked');
    var beginDx = null;
    var endDx = null;
    var dx = null;
    var checked_all = true;

    this._checkAppend = typeof this._get('_options')._checkAppend === 'undefined' ? false :
      this._get('_options')._checkAppend;
    this._checkToggle = typeof this._get('_options')._checkToggle === 'undefined' ? false :
      this._get('_options')._checkToggle;

    // 单选， 清除选中项
    if (!this._checkAppend) {
      if (this.viewId) {
        if (BbaseApp.getView(this.viewId))
          BbaseApp.getView(this.viewId)._clearChecked();
      }
    }

    if (this._checkToggle) {
      this._set('checked', BbaseEst.typeOf(e) === 'boolean' ? e : !checked);
    } else {
      this._set('checked', BbaseEst.typeOf(e) === 'boolean' ? e : true);
      this._itemActive({
        add: this._checkAppend
      }, e);
    }
    if (this._get('checked') && this._checkToggle) {
      this._itemActive({
        add: this._checkAppend
      }, e);
    } else if (this._checkToggle) {
      this.$el.removeClass('item-active');
      this._set('checked', false);
    }
    //TODO shift + 多选
    if (e && e.shiftKey && this._checkAppend) {
      beginDx = BbaseApp.getData('curChecked');
      endDx = this._get('dx');
      BbaseEst.each(this.model.collection.models, function(model) {
        dx = model.get('dx');
        if (beginDx < dx && dx < endDx) {
          model.view._set('checked', true);
          model.view.$el.addClass('item-active');
        }
      });
    } else {
      BbaseApp.addData('curChecked', this._get('dx'));
    }
    //TODO 如果
    if (BbaseEst.typeOf(e) !== 'boolean' && e)
    //e.stopImmediatePropagation();
      BbaseEst.trigger(this.cid + 'checked', 'checked', true);
    if (!this._get('checked')) {
      checked_all = false;
    } else {
      BbaseEst.each(this.model.collection.models, function(model) {
        if (!model.attributes.checked) {
          checked_all = false;
        }
      });
    }
    if (BbaseApp.getView(this.viewId))
      BbaseApp.getView(this.viewId)._set('checked_all',checked_all);
  },
  /**
   * 添加当前ITEM的CLASS为item-active
   *
   * @method [选取] - _itemActive ( 设置为选中状态 )
   * @param options [add: true 是否为添加模式]
   * @author wyj 14.12.13
   * @example
   *        this._itemActive({
   *          add: true         //是否为添加模式
   *        });
   */
  _itemActive: function(options, e) {
    var _class = null;
    options = options || {};
    if (!BbaseApp.getData('itemActiveList' + this.viewId))
      BbaseApp.addData('itemActiveList' + this.viewId, []);
    var list = BbaseApp.getData('itemActiveList' + this.viewId);
    if (!options.add) {
      BbaseEst.each(list, BbaseEst.proxy(function(selecter) {
        $('.' + selecter, BbaseApp.getView(this.viewId) ?
          BbaseApp.getView(this.viewId).$el : $("body")).removeClass('item-active');
      }, this));
      list.length = 0;
    }
    if (BbaseEst.typeOf(e) === 'boolean' && !e) return;
    this.$el.addClass('item-active');

    _class = this.$el.attr('class').replace(/^.*(_item_el_.+?)\s+.*$/g, "$1");
    if (BbaseEst.findIndex(list, function(item) {
        return item === _class;
      }) === -1) {
      list.push(_class);
    }
  },
  /**
   * 上移
   *
   * @method [移动] - _moveUp ( 上移 )
   * @param e
   * @author wyj 14.12.14
   */
  _moveUp: function(e) {
    e.stopImmediatePropagation();
    this.collapsed = true;
    if (!this.viewId) {
      return false;
    }
    BbaseApp.getView(this.viewId)._moveUp(this.model);
  },
  /**
   * 下移
   *
   * @method [移动] - _moveDown ( 下移 )
   * @param e
   * @author wyj 14.12.14
   */
  _moveDown: function(e) {
    e.stopImmediatePropagation();
    this.collapsed = true;
    if (!this.viewId) {
      return false;
    }
    BbaseApp.getView(this.viewId)._moveDown(this.model);
  },
  /**
   * 保存sort排序
   *
   * @method [保存] - _saveSort ( 保存sort排序 )
   * @author wyj 14.12.14
   */
  _saveSort: function() {
    var ctx = this;
    var sort = this.$('.input-sort').val();
    this.model._saveField({
      id: this._get('id'),
      sort: sort
    }, ctx, {
      success: function() {
        ctx.model.set('sort', sort);
      },
      fail: function() {

      },
      hideTip: true
    });
  },
  /**
   * 保存模型类
   * @method _save
   * @return {[type]} [description]
   */
  _save: function() {
    if (this.model.attributes._response) delete this.model.attributes._response;
    if (this.beforeSave) this.beforeSave.call(this);
    BbaseEst.off('errorSave' + this.model.cid).on('errorSave' + this.model.cid, this._bind(function(type, response) {
      if (this.errorSave) this.errorSave.call(this, response);
    }));
    var response = this.model.save({}, {
      silent: this._options.diff,
      wait: true
    });
    if (this.afterSave) this.afterSave.call(this, response);
  },
  /**
   * 获取当前列表第几页
   *
   * @method [分页] - _getPage ( 获取当前列表第几页 )
   * @return {*}
   * @author wyj 14.12.31
   *
   */
  _getPage: function() {
    var paginationModel = this.model.collection.paginationModel;
    if (!paginationModel) return 1;
    return paginationModel.get('page');
  },
  /**
   *  删除模型类
   *
   *  @method [删除] - _del ( 删除模型类 )
   *  @author wyj 14.11.16
   */
  _del: function(e, callback) {
    if (e)
      e.stopImmediatePropagation();
    var context = this;
    if (BbaseApp.getData('delItemDialog')) BbaseApp.getData('delItemDialog').close();
    if (context.model.get('children').length > 0) {
      BbaseUtils.confirm({
        title: CONST.LANG.TIP,
        width: 300,
        content: CONST.LANG.DEL_TIP
      });
      return;
    }
    BbaseApp.addData('delItemDialog', BbaseUtils.confirm({
      title: null,
      content: '<div class="item-delete-confirm">' + CONST.LANG.DEL_CONFIRM + '</div>',
      target: e && this._getTarget(e).get(0),
      success: function(resp) {
        if (BbaseEst.isEmpty(context.model.url())) {
          context.model.attributes.id = null;
        }
        context.model.destroy({
          wait: true,
          error: function(model, resp) {
            var buttons = [];
            buttons.push({
              value: CONST.LANG.CONFIRM,
              callback: function() {
                this.close();
              },
              autofocus: true
            });
            BbaseUtils.dialog({
              title: CONST.LANG.TIP + '：',
              content: resp.msg,
              width: 250,
              button: buttons
            });
          },
          success: function(model, response, xhr) {
            context._removeFromItems(context.model.get('dx'));
            if (context.model.deleteTip) {
              BbaseUtils.tip(response.msg);
            }
            if (callback) callback.call(context);
          }
        });
      }
    }));
  },
  /**
   * 直接移除，不提示
   * @method _remove
   * @param  {[type]}   e        [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  _remove: function(e, callback) {
    this.model.destroy({
      wait: true,
      success: this._bind(function() {
        this._removeFromItems(this.model.get('dx'));
        if (callback) callback.call(this);
      })
    });
  },
  /**
   * 从this._options.items中通过dx移除元素
   * @method [集合] - _removeFromItems
   * @param dx
   * @private
   * @author wyj 15.6.10
   * @example
   *      this._removeFromItems(context.model.get('dx'));
   */
  _removeFromItems: function(dx) {
    BbaseEst.trigger(this._super('view').cid + 'models', null, true);
    if (BbaseEst.typeOf(dx) === 'undefined') return;
    if (BbaseApp.getView(this.viewId)) {
      if (BbaseApp.getView(this.viewId)._options.items){
        if (!BbaseApp.getView(this.viewId)._options.diff){
          BbaseApp.getView(this.viewId)._options.items.splice(dx, 1);
        }
      }
      BbaseApp.getView(this.viewId)._resetDx();
    }
  }
});
