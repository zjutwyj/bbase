/**
 * @description 列表视图
 * @class BbaseList - 列表视图
 * @author yongjin<zjut_wyj@163.com> 2014/12/8
 */

(function(BbaseBackbone, BbaseEst, BbaseApp, BbaseUtils, BbaseHandlebars, BbaseSuperView, BbaseModel, undefined) {
  var BbaseList = BbaseSuperView.extend({
    /**
     * 传递options进来
     *
     * @method [private] - constructor
     * @private
     * @param options
     * @author wyj 14.12.16
     */
    /*constructor: function (options) {
     BbaseEst.interface.implements(this, new BbaseEst.interface('BbaseList', ['initialize', 'render']));
     this.constructor.__super__.constructor.apply(this, arguments);
     },*/
    /**
     * 初始化
     *
     * @method [初始化] - _initialize ( 初始化 )
     * @param options
     * @author wyj 14.11.20
     * @example
     *      this._initialize({
         *        model: ProductModel, // 模型类,
         *        collection:  ProductCollection,// 集合,
         *        item: ProductItem, // 单视图
         *        // 以下为可选
         *        template: listTemp, 字符串模板,
         *        render: '.product-list', 插入列表的容器选择符, 若为空则默认插入到$el中
         *        items: [], // 数据不是以url的形式获取时 (可选), items可为function形式传递;
         *        data: {}, // 附加的数据 BbaseList、BbaseView[js: this._options.data & template: {{name}}] ;
         *                     BbaseItem中为[this._options.data &{{_options._data.name}}] BaseCollecton为this._options.data BbaseModel为this.get('_data')
         *        append: false, // 是否是追加内容， 默认为替换
         *        checkAppend: false, // 鼠标点击checkbox， checkbox是否追加  需在BbaseItem事件中添加 'click .toggle': '_check',
         *        checkToggle: true,// 是否选中切换
         *        enter: (可选) 执行回车后的按钮点击的元素选择符 如 #submit .btn-search
         *        pagination: true/selector, // 是否显示分页 view视图中相应加入<div id="pagination-container"></div>; pagination可为元素选择符
         *        page: parseInt(BbaseEst.cookie('orderList_page')) || 1, //设置起始页 所有的分页数据都会保存到cookie中， 以viewId + '_page'格式存储， 注意cookie取的是字符串， 要转化成int
         *        pageSize: parseInt(BbaseEst.cookie('orderList_pageSize')) || 16, // 设置每页显示个数
         *        max: 5, // 限制显示个数
         *        sortField: 'sort', // 上移下移字段名称， 默认为sort
         *        itemId: 'Category_00000000000123', // 当需要根据某个ID查找列表时， 启用此参数， 方便
         *        filter: [ {key: 'name', value: this.searchKey }] // 过滤结果
         *        toolTip: true, // 是否显示title提示框   html代码： <div class="tool-tip" title="提示内容">内容</div>
         *        clearDialog: true, // 清除所有的对话框， 默认为true
         *        beforeLoad: function(collection){ // collection载入列表前执行
         *            this.setCategoryId(options.categoryId); // collection载入后执行
         *          },
         *        afterLoad: function(){ // collection载入之后
         *            if (this.collection.models.length === 0 ||
                        !this.options._isAdd){
                        this.addOne();
                      }
         *        },
         *        beforeRender: function(thisOpts){}, // 渲染前回调
         *        afterRender: function(thisOpts){ // 渲染后回调， 包括items渲染完成
         *          if (this.collection.models.length === 0 ||
                        !this.options._isAdd){
                        this.addOne();
                      }
         *        },
         *        cache: true, // 数据缓存到内存中
         *        session: true, // 数据缓存到浏览器中，下次打开浏览器，请求的数据直接从浏览器缓存中读取
         *        // 以下为树型列表时 需要的参数
         *        subRender: '.node-tree', // 下级分类的容器选择符
         *        collapse: '.node-collapse' 展开/收缩元素选择符
         *        parentId: 'belongId', // 分类 的父类ID
         *        categoryId: 'categoryId', // 分类 的当前ID
         *        rootId: 'isroot', // 一级分类字段名称
         *        rootValue: '00' // 一级分类字段值  可为数组[null, 'Syscode_']   数组里的选项可为方法， 返回true与false
         *        extend: true // false收缩 true为展开
         *       });
     */
    _initialize: function(options) {
      var _this = this;
      _this.dx = 0;
      _this.views = [];
      return _this._initOpt(options.collection, options);
    },
    /**
     * 初始化集合类
     *
     * @method [private] - _init
     * @private
     * @param collection 对应的collection集合类， 如ProductCollection
     * @param options [beforeLoad: 加载数据前执行] [item: 集合单个视图] [model: 模型类]
     * @author wyj 14.11.16
     */
    _initOpt: function(collection, options) {
      var _this = this;
      _this._initOptions(options);
      _this._initDataModel(BbaseModel.extend({}));
      _this._initTemplate(_this._options);
      _this._initEnterEvent(_this._options, _this);
      _this._initList(_this._options);
      _this._initCollection(_this._options, collection);
      _this._initItemView(_this._options.item, _this);
      _this._initModel(_this._options.model);
      _this._initBind(_this.collection);
      _this._initPagination(_this._options);
      _this._load(_this._options);
      return _this;
    },
    /**
     * 初始化参数
     *
     * @method [private] - _initOptions
     * @private
     * @author wyj 15.1.12
     */
    _initOptions: function(options) {
      var _this = this;
      _this._options = BbaseEst.extend(_this.options, options || {});
      _this._options.sortField = 'sort';
      _this._options.max = _this._options.max || 99999;
      _this._options.speed = _this._options.speed || 9;
      _this.viewId = _this._options.viewId;
      _this.viewType = 'list';
    },
    /**
     * 初始化模型类, 设置index索引
     *
     * @method [private] - _initDataModel
     * @private
     * @param model
     * @author wyj 14.11.20
     */
    _initDataModel: function(model) {
      var _this = this;
      if (_this._options.data) {
        _this._options.data.CONST = CONST;
      }
      _this.model = new model(_this._options.data);

      _this._set('models', []);
    },
    /**
     * 初始化模板， 若传递一个Template模板字符中进来， 则渲染页面
     *
     * @method [private] - _initTemplate ( 待优化， 模板缓存 )
     * @private
     * @author wyj 15.1.12
     */
    _initTemplate: function(options) {
      var _this = this;
      _this._data = options.data = options.data || {};
      if (options.template) {
        options.template = _this._parseHbs(options.template);
        if (_this._initDefault) _this._initDefault.call(_this);
        if (_this.beforeRender) _this.beforeRender.call(_this);
        _this.$template = $('<div>' + options.template + '</div>');
        if (options.render) {
          if (BbaseEst.msie()) {
            _this.__template = options.template.replace(new RegExp('\\sstyle=', 'img'), ' ng-style=');
            options.itemTemp = $('<div>' + _this.__template + '</div>').find(options.render).html();
            if (!BbaseEst.isEmpty(options.itemTemp)) {
              options.itemTemp = options.itemTemp.replace(/ng-style/img, 'style')
            }
          } else {
            options.itemTemp = _this.$template.find(options.render).html();
          }
          if (typeof _this._options.empty === 'undefined' || _this._options.empty) {
            _this.$template.find(options.render).empty();
          }
        } else {
          if (BbaseEst.msie()) {
            _this.__template = options.template.replace(new RegExp('\\sstyle=', 'img'), ' ng-style=');
            options.itemTemp = $('<div>' + _this.__template + '</div>').html();
            if (!BbaseEst.isEmpty(options.itemTemp)) {
              options.itemTemp = options.itemTemp.replace(/ng-style/img, 'style')
            }
          } else {
            options.itemTemp = _this.$template.html();
          }
          _this.$template.empty();
        }
        _this.template = BbaseHandlebars.compile(BbaseEst.isEmpty(options.itemTemp) ? options.template :
          _this.$template.html());
        _this.$el.hide();
        if (_this._options.append) {
          _this.$el.empty();
          _this.$el.append(_this.template(_this.model.attributes));
        } else {
          _this.$el.html(_this.template(_this.model.attributes));
        }
      }
      if (options.modelBind) _this._modelBind();
    },
    /**
     * 回车事件
     *
     * @method [private] - _initEnterEvent
     * @private
     * @author wyj 14.12.10
     */
    _initEnterEvent: function(options, ctx) {
      if (options.enter) {
        ctx.$('input').keyup(function(e) {
          if (e.keyCode === CONST.ENTER_KEY) {
            ctx.$(options.enter).click();
          }
        });
      }
    },
    /**
     * 初始化列表视图容器
     *
     * @method [private] - _initList
     * @private
     * @author wyj 15.1.12
     */
    _initList: function(options) {
      var _this = this;
      _this.list = options.render ? _this.$(options.render) : _this.$el;
      if (_this.list.size() === 0)
        _this.list = $(options.render);
    },
    /**
     * 初始化collection集合
     *
     * @method [private] - _initCollection
     * @param collection
     * @private
     */
    _initCollection: function(options, collection) {
      var _this = this;
      if (!collection.prototype.hasOwnProperty('model')) { collection.prototype.model = _this._options.model };
      if (!_this.collection || (_this.collection && !_this.collection.remove))
        _this.collection = new collection(options);
      if (options.itemId) _this.collection._setItemId(options.itemId);
      //TODO 分类过滤
      if (options.subRender) _this.composite = true;
    },
    /**
     * 初始化单个枚举视图
     *
     * @method [private] - _initItemView
     * @private
     * @param itemView
     * @author wyj 14.11.16
     */
    _initItemView: function(itemView) {
      this.item = itemView;
    },
    /**
     * 初始化模型类, 设置index索引
     *
     * @method [private] - _initModel
     * @private
     * @param model
     * @author wyj 14.11.20
     */
    _initModel: function(model) {
      this.initModel = model;
    },
    /**
     * 绑定事件， 如添加事件， 重置事件
     * @method [private] - _initBind
     * @private
     * @author wyj 14.11.16
     */
    _initBind: function(collection) {
      var _this = this;
      if (collection) {
        collection.bind('add', _this._addOne, _this);
        collection.bind('reset', _this._render, _this);
        // 下面几行不能放_finall方法里
        if (_this._watchBind) _this._watchBind.call(_this, _this._options.template);
        if (_this._bbBind) _this._bbBind.call(_this, _this._options.template, _this.$el);
      }
    },
    /**
     * 初始化分页
     *
     * @method [private] - _initPagination
     * @param options
     * @private
     * @author wyj 14.11.17
     */
    _initPagination: function(options) {
      var ctx = this;
      if (ctx.collection && ctx.collection.paginationModel) {
        // 单一观察者模式， 监听reloadList事件
        ctx.collection.paginationModel.on('reloadList',
          function(model) {
            ctx._set('checked_all', false);
            if (!ctx._options.diff) ctx._clear.call(ctx);
            ctx._load.call(ctx, options, model);
          });
      }
    },
    /**
     * 获取集合数据 当append为true时，只追加数据。
     * 类似有个_reload  这个方法无论append是否为true， 都会清空列表重新加载
     *
     * @method [渲染] - _load ( 获取集合数据 )
     * @param options [beforeLoad: 载入前方法][page: 当前页][pageSize: 每页显示条数]
     * @param model 分页模型类 或为全查必填
     * @author wyj 14.11.16
     * @example
     *        baseListCtx._load({
     *          page: 1,
     *          pageSize: 16,
     *          beforeLoad: function () {
     *            this.collection.setCategoryId(options.categoryId);
     *          },
     *          afterLoad: function(){
     *
     *          }
     *        }).then(function () {
     *          ctx.after();
     *        });
     */
    _load: function(options, model) {
      var ctx = this;
      options = options || ctx._options || {};
      ctx._beforeLoad(options);
      if (options.page || options.pageSize) {
        if (options.page)
          ctx._setPage(options.page || 1);
        // 备份page
        options._page = options.page;
        if (options.pageSize)
          ctx._setPageSize(options.pageSize || 16);
        // 备份pageSize
        options._pageSize = options.pageSize;
        model = ctx.collection.paginationModel;
        //TODO 移除BbaseList默认的page 与pageSize使每页显示条数生效
        options.page = options.pageSize = null;
      }
      if (!ctx._options.diff&& !ctx._options.append) { ctx.list.hide(); }
      //TODO 若存在items且有page与pageSize  处理静态分页
      if (ctx._options.items) {
        if (!ctx._options.diff && !ctx._options.append) ctx._empty();
        ctx._initItems();
      }
      // page pageSize保存到cookie中
      if (ctx._options.viewId && ctx.collection.paginationModel &&
        ctx._getPageSize() < 999) {
        BbaseApp.addCookie(ctx._options.viewId + '_page');
        //BbaseEst.cookie(this._options.viewId + '_page', ctx._getPage());
        BbaseApp.addCookie(ctx._options.viewId + '_pageSize');
        //BbaseEst.cookie(this._options.viewId + '_pageSize', ctx._getPageSize());
      }
      // 判断是否存在url
      if (ctx.collection.url && !ctx._options.items) {

        if (ctx._options.filter) ctx.filter = true;
        // 处理树结构
        if (ctx._options.subRender) {
          ctx.composite = true;
          ctx._setPage(1);
          ctx._setPageSize(9000);
        }
        // 数据载入
        BbaseUtils.addLoading()
        ctx.collection._load(ctx.collection, ctx, model || ctx.collection.paginationModel).
        done(function(result) {
          if (result && result.msg && result.msg === CONST.LANG.AUTH_FAILED) {
            BbaseUtils.tip(CONST.LANG.AUTH_LIMIT + '！', {
              time: 2000
            });
          }
          if (!result) {
            result = { success: false, msg: '请求未知错误' };
            ctx.errorFetch && ctx.errorFetch.call(ctx, result);
          }
          if (result && !result.success && ctx.errorFetch) {
            ctx.errorFetch.call(ctx, result);
          }
          ctx._removeNoResult();
          try {
            if (ctx._getTotalPage() === ctx._getPage()) {
              ctx._set('load_completed', true);
            }
            if (BbaseEst.isEmpty(result) || BbaseEst.isEmpty(result.attributes) || result.attributes.data.length === 0) {
              ctx._handleListNode();
              if (result.msgType === 'notLogin') {
                BbaseEst.trigger('checkLogin', null, true);
              }
            }
          } catch (e) {
            BbaseEst.trigger('checkLogin', null, true);
            console.log('Error4 -> _load -> ' + result.msg); //debug__
          }
          ctx._afterLoad(result);
          //if (ctx._options.diff) ctx._setModels();
          if (ctx._options.subRender) ctx._filterRoot();
          //if (ctx._options.filter) ctx._filterCollection();
          if (result.attributes && result.attributes.model) {
            ctx._options.data = BbaseEst.extend(ctx._options.data, result.attributes.model);
          }
          ctx._filter();
          ctx._resetModels();

          if (!ctx._ready_component_) {
            ctx._finally();
          }
          // 视图更新
          if (ctx._ready_component_ && !ctx._options.diff) {
            if (ctx.viewUpdate) setTimeout(ctx._bind(function() {
              ctx.viewUpdate.call(ctx, ctx._options)
            }), 0);
          }
          if (options && options.afterRender) {

            options.afterRender.call(ctx);
          }
        });
      } else {
        ctx._afterLoad();
        ctx._resetModels();
        if (!ctx._ready_component_) {
          ctx._finally();
        }
        if (ctx.viewUpdate) {
          ctx.viewUpdate.call(ctx);
        }
      }
    },
    /**
     * 初始化完成后执行
     *
     * @method [private] - _finally
     * @private
     */
    _finally: function() {
      var _this = this;
      if (_this.afterRender) setTimeout(function() { _this.afterRender.call(_this, _this._options); }, 0)
      if (_this._options.onReady) _this._options.onReady.call(_this, _this._options);
      if (_this._options.toolTip) _this._initToolTip();
      _this._ready_component_ = true;
      setTimeout(function() {
        _this.$el.show();
        _this._handleDirectiveShow();
        if (_this._options.afterShow) _this._options.afterShow.call(_this);
        if (_this._options.onShow) _this._options.onShow.call(_this);
        if (_this.afterShow) _this.afterShow.call(_this);
      }, 80)
    },
    _resetModels: function() {
      var _this = this;
      _this._set('models', _this.collection.models);
      if (_this.cms) {
        BbaseEst.off(_this.cid + 'models', _this.cms);
      }
      _this.cms = BbaseEst.on(_this.cid + 'models', _this._bind(function() {
        //debug('reset model models');
        _this._set('models', _this.collection.models);
      }));
      BbaseUtils.removeLoading();
    },
    _filter: function() {
      var _this = this;
      if (_this.filter) {
        _this._appendAble_ = true;
        _this.filter.call(_this);
        _this.collection.each(_this._addOne, _this);
        _this._appendAble_ = false;
      }
    },
    _handleListNode: function() {
      var _this = this;
      _this._set('result_none', true);
      _this._options.append ? _this.list.append('<div class="no-result">' + CONST.LANG.LOAD_ALL + '</div>') :
        _this.list.append('<div class="no-result">' + CONST.LANG.NO_RESULT + '</div>');
      if (_this._getPage() === 1) {
        _this.trigger('resultListNone' + _this._options.viewId, {});
      }
    },
    _removeNoResult: function() {
      this.list.find('.no-result').remove();
    },
    /**
     * 刷新列表 会清空已存在的数据
     *
     * @method [渲染] - _reload ( 刷新列表 )
     * @author wyj 15.1.24
     * @example
     *        this._reload();
     */
    _reload: function(options) {
      var _this = this;
      if (!_this._options.diff) {
        _this._empty.call(_this); // 清空视图
        _this.collection.reset(); // 清空collection
        _this.list.empty(); // 清空DOM
      }
      _this._load(options); // 重新加载数据
    },

    /**
     * 列表载入前执行
     *
     * @method [private] - _beforeLoad
     * @param options
     * @private
     */
    _beforeLoad: function(options) {
      var _this = this;
      if (_this.beforeLoad)
        _this.beforeLoad.call(_this, _this.collection);
    },
    /**
     * 列表载入后执行
     *
     * @method [private] - _afterLoad
     * @private
     */
    _afterLoad: function(response) {
      var _this = this;
      _this.list.show();

      if (_this.afterLoad)
        _this.afterLoad.call(_this, response);
    },
    /**
     * 初始化items
     *
     * @method [private] - _initItems
     * @private
     * @author wyj 15.1.8
     */
    _initItems: function() {
      var _this = this;
      if (BbaseEst.typeOf(_this._options.items) === 'function') {
        _this._options.items = _this._options.items.apply(_this, arguments);
      }
      /*if (this._options.filter) {
        this.collection.push(this._options.items);
        this._filterCollection();
        this._options.items = BbaseEst.pluck(BbaseEst.cloneDeep(this.collection.models, function() {}, this), 'attributes');
      }*/
      if (_this._options._page || _this._options._pageSize) {
        _this._renderListByPagination();
      } else {
        BbaseEst.each(_this._options.items, function(item) {
          if (_this._checkStop()) return false;
          _this.collection.push(new this.initModel(item));
        }, _this);
        if (_this._options.subRender) _this._filterRoot();
      }
      _this._filter();
      if (_this._options.items.length === 0) {
        _this._handleListNode();
      }
    },
    /**
     * 缓存编译模板
     *
     * @method [private] - _setTemplate
     * @private
     * @author wyj 15.2.14
     */
    _setTemplate: function(compile) {
      this.compileTemp = compile;
    },
    /**
     * 获取编译模板
     *
     * @method [private] - _getTemplate
     * @private
     * @author wyj 15.2.14
     */
    _getTemplate: function() {
      return this.compileTemp;
    },
    /**
     * 停止遍历
     *
     * @method [渲染] - _stop ( 停止遍历 )
     * @author wyj 15.1.27
     * @example
     *        this._stop();
     */
    _stop: function() {
      this.stopIterator = true;
    },
    /**
     * 检查是否停止遍历
     *
     * @method [private] - _checkStop
     * @private
     * @return {boolean}
     * @author wyj 15.1.27
     */
    _checkStop: function() {
      var _this = this;
      if (_this.stopIterator) {
        _this.stopIterator = false;
        return true;
      }
      return false;
    },
    /**
     * 渲染视图
     *
     * @method [渲染] - _render ( 渲染视图 )
     * @author wyj 14.11.16
     * @example
     *
     */
    _render: function() {
      var _this = this;
      _this._addAll();
      _this.trigger('after', _this);
    },
    /**
     * 过滤父级元素
     *
     * @method [private] - _filterRoot
     * @private
     * @author wyj 14.12.9
     */
    _filterRoot: function() {
      var ctx = this;
      var temp = [];
      var roots = [];
      ctx.composite = false;
      /* ctx.collection.comparator = function (model) {
       return model.get('sort');
       }
       ctx.collection.sort();*/
      BbaseEst.each(ctx.collection.models, function(item) {
        temp.push({
          categoryId: item.attributes[ctx._options.categoryId],
          belongId: item.attributes[ctx._options.parentId]
        });
      });
      ctx.collection.each(function(thisModel) {
        var i = temp.length,
          _children = [];
        while (i > 0) {
          var item = temp[i - 1];
          if ((item.belongId + '') === (thisModel.get(ctx._options.categoryId) + '')) {
            _children.unshift(item.categoryId);
            temp.splice(i - 1, 1);
          }
          i--;
        }
        thisModel.set('children', _children);
        thisModel.set('id', thisModel.get(ctx._options.categoryId));
        // 添加父级元素

        if (BbaseEst.typeOf(ctx._options.rootValue) === 'array') {
          //TODO 如果存入的rootValue为数组
          BbaseEst.each(ctx._options.rootValue, function(item) {
            if (BbaseEst.typeOf(item) === 'function') {
              // 判断是否是方法， 如果返回true则添加到roots中
              if (item.call(ctx, item)) {
                thisModel.set('level', 1);
                roots.push(thisModel);
              }
            } else {
              if (!BbaseEst.isEmpty(item) && thisModel.get(ctx._options.rootId) &&
                thisModel.get(ctx._options.rootId).indexOf(item) > -1) {
                // 判断不为null 且索引是否大于-1
                thisModel.set('level', 1);
                roots.push(thisModel);
              } else if (thisModel.get(ctx._options.rootId) === item) {
                // 如果为null值， 则直接===比较， true则添加到roots中
                thisModel.set('level', 1);
                roots.push(thisModel);
              }
            }
          });
        } else if (thisModel.get(ctx._options.rootId) === ctx._options.rootValue) {
          thisModel.set('level', 1);
          thisModel.set('isroot', '01');
          roots.push(thisModel);
        }
      });
      // 清空原先生成的dom元素
      ctx.list.empty();
      BbaseEst.each(roots, function(model) {
        model.set('isroot', '01');
        if (!ctx._options.diff) {
          ctx._addOne(model);
        }
      });
      if (ctx._options.diff) {
        ctx._setModels(roots);
      }
    },
    _remove: function(start, end) {
      var _this = this;
      var end = typeof end === 'undefined' ? (start + 1) : end;
      if (end > _this.collection.models.length) {
        return;
      }
      while (end > start) {
        _this.collection.models[end - 1].attributes.id = null;
        _this.collection.models[end - 1].view._remove(_this.collection.models[end - 1].get('dx'));
        end--;
      }
    },
    _setModels: function(list) {
      var _this = this;
      var len_c = _this.collection.models.length;
      var len_l = _this._options.max < 99999 ? _this._options.max > list.length ? list.length : _this._options.max : list.length;
      var dx = (_this._getPageSize() || 16) *
        ((_this._getPage() - 1) || 0);
      if (len_l > 0 && list[0].view) {
        list = BbaseEst.map(list, function(model) {
          return model.attributes;
        });
      }
      if (_this._options.append) {
        for (var i = 0, len = list.length; i < len; i++) {
          _this.collection.push(list[i]);
        }
      } else {
        _this.collection.each(_this._bind(function(model, i) {
          if (i > len_l - 1) {} else {
            if (list[i]) {
              list[i]['dx'] = dx;
              dx++;
              model.view && (model.id = list[i]['id']);
              model.view && model.view._set(_this._getPath(list[i]));
              model.view && model.view._onAfterShow();
            }
          }
        }));
        if (len_l > len_c) { // 添加
          //setTimeout(function() {
            for (var j = len_c + 1; j <= len_l; j++) {
              list[j - 1]['dx'] = dx;
              dx++;
              _this.collection.add(new _this._options.model(list[j - 1]));
              //_this._push(new _this._options.model(list[j - 1]));
            }
          //}, 0);
        } else if (len_l < len_c) {
          setTimeout(function() {
            _this._remove(len_l, len_c);
          }, 20);
        }
      }

      _this.list.show();

      setTimeout(function() {
        if (BbaseEst.typeOf(_this.___append) === 'boolean') {
          _this._options.append = _this.___append;
        }
      }, 25);

      if (_this.viewUpdate) setTimeout(function() {
        _this.viewUpdate.call(_this, _this._options);
      }, 25);
    },
    /**
     * 向视图添加元素
     *
     * @method [private] - _addOne
     * @private
     * @param model
     * @author wyj 14.11.16
     */
    _addOne: function(model, arg1, arg2) {
      var ctx = this;
      if (!ctx.composite && ctx.dx < ctx._options.max) {
        model.set({
          'dx': ctx.dx++
        });
        switch (ctx._options.speed) {
          case 1:
            model.set('_options', {});
            break;
          case 9:
            model.set('_options', {
              _speed: ctx._options.speed,
              _item: ctx._options.item,
              _items: ctx._options.items ? true : false,
              _model: ctx._options.model,
              _collection: BbaseEst.isEmpty(ctx._options.subRender) ? null : ctx.collection,
              _subRender: ctx._options.subRender,
              _collapse: ctx._options.collapse,
              _extend: ctx._options.extend,
              _checkAppend: ctx._options.checkAppend,
              _checkToggle: ctx._options.checkToggle,
              _data: ctx.options.data || ctx._options.data
            });
        }
        //BbaseApp.addData('maxSort', model.get('dx') + 1);
        var itemView = new this.item({
          model: model,
          viewId: ctx._options.viewId,
          speed: ctx._options.speed,
          data: ctx._data,
          views: ctx.views,
          itemTemp: ctx._options.itemTemp
        });
        itemView._setInitModel(ctx.initModel);
        //TODO 优先级 new对象里的viewId > _options > getCurrentView()
        itemView._setViewId(ctx._options.viewId || BbaseApp.getCurrentView());

        if (arg2 && arg2.at < ctx.collection.models.length - 1 &&
          ctx.collection.models.length > 1) {
          ctx.collection.models[arg2.at === 0 ? 0 :
            arg2.at - 1].view.$el.after(itemView._render().el);
        } else if (!ctx.filter || ctx._appendAble_) {
          ctx.list.append(itemView._render().el);
        }
        ctx.views.push(itemView);
      }
    },
    /**
     * 向列表中添加数据
     * @method [集合] - _push ( 向列表中添加数据 )
     * @param model
     * @param opts
     * @author wyj 15.6.10
     * @example
     *        this._push(new model());
     *        this._push(new model(), 0); // 表示在第一个元素后面添加新元素
     *        this._push(new pictureModel(model), this._findIndex(curModel) + 1);
     */
    _push: function(model, index) {
      var _this = this;
      // 判断第二个参数是否是数字， 否-> 取当前列表的最后一个元素的索引值
      // 判断index是否大于列表长度
      // 若存在items， 则相应插入元素
      var obj, _index = BbaseEst.typeOf(index) === 'number' ? index + 1 :
        _this.collection.models.length === 0 ? 0 : _this.collection.models.length + 1;
      var opts = {
        at: _index > _this.collection.models.length ?
          _this.collection.models.length + 2 : _index
      };
      if (!model.cid) model = new this.initModel(model);
      if (_this._options.items) {
        obj = BbaseEst.typeOf(model) === 'array' ? BbaseEst.pluck(model, function(item) {
          return item.attributes;
        }) : model.attributes;
        if (!_this._options.diff) _this._options.items.splice(opts.at - 1, 0, obj);
      }
      _this._appendAble_ = true;
      _this.collection.push(model, opts);
      _this._appendAble_ = false;
      if (!BbaseEst.isEmpty(index) && _this._getLength() > 1) {
        _this._exchangeOrder(_index - 1, _index, {});
      }
      _this._resetDx();
      _this._setValue('checked_all', false);

      BbaseEst.trigger(_this.cid + 'models', null, true);

      if (_this._get('result_none')) {
        _this.list.find('.no-result').remove();
        _this._set('result_none', false);
      }
    },
    /**
     * 通过索引值获取当前视图的jquery对象
     * @method [集合] - _eq
     * @param  {number} index 索引值
     * @return {array}       [description]
     */
    _eq: function(index) {
      return this.collection.models[index].view.$el;
    },
    /**
     * 重新排序dx列表
     * @method [private] - _resetDx
     * @private
     * @author wyj 15.9.3
     */
    _resetDx: function() {
      var _this = this;
      var _dx = (_this._getPageSize() || 16) *
        ((_this._getPage() - 1) || 0);;
      BbaseEst.each(_this.collection.models, function(item) {
        item.view && item.view._set('dx', _dx);
        _dx++;
      });
      _this.dx = _this.collection.models.length;
    },
    /**
     * 获取当前模型类在集合类中的索引值
     * @method [集合] - _findIndex ( 索引值 )
     * @param model
     * @return {number}
     * @author wyj 15.6.10
     * @example
     *      this._findIndex(this.curModel); ==> 1
     */
    _findIndex: function(model) {
      return BbaseEst.findIndex(this.collection.models, {
        cid: model.cid
      });
    },
    /**
     * 过滤集合
     *
     * @method [private] - _filterCollection
     * @private
     * @author wyj 15.1.10
     */
    /*_filterCollection: function() {
      this._filter(this._options.filter, this._options);
    },*/
    /**
     * 静态分页
     *
     * @method [private] - _renderListByPagination
     * @private
     * @author wyj 15.1.8
     */
    _renderListByPagination: function() {
      var _this = this;
      _this.page = _this._getPage();
      _this.pageSize = _this._getPageSize();
      _this.startIndex = (_this.page - 1) * parseInt(_this.pageSize, 10);
      _this.endIndex = _this.startIndex + parseInt(_this.pageSize, 10);

      if (_this._options.diff && !_this._options.append) {
        var models = [];
        for (var i = _this.startIndex; i < _this.endIndex; i++) {
          if (_this._options.items[i]) {
            var model = BbaseEst.cloneDeep(_this._options.items[i]);
            model['dx'] = _this.startIndex + i;
            models.push(model);
          }
        }
        _this._setModels(models);
      } else {
        for (var i = _this.startIndex; i < _this.endIndex; i++) {
          _this.collection.push(_this._options.items[i]);
        }
        if (_this.viewUpdate) setTimeout(_this._bind(function() {
          _this.viewUpdate.call(_this, _this._options)
        }), 0);
      }

      // 渲染分页
      _this._setCount(_this._options.items.length);
      _this.collection._paginationRender();
      BbaseUtils.removeLoading();
      return _this.collection;
    },

    /**
     * 清空列表， 并移除所有绑定的事件
     *
     * @method [集合] - _empty ( 清空列表 )
     * @author wyj 14.11.16
     * @private
     * @example
     *      this._empty();
     */
    _empty: function() {
      var _this = this;
      _this.dx = 0;
      if (_this._options.append) {
        return _this.collection;
      }
      if (_this.collection && !_this.collection.remove) {}
      if (_this.collection._reset) _this.collection._reset();
      if (_this.collection) {
        var len = _this.collection.length;
        while (len > -1) {
          _this.collection.remove(_this.collection[len]);
          len--;
        }
      }
      // 设置当前页的起始索引， 如每页显示20条，第2页为20
      if (_this.collection.paginationModel) {
        _this.dx = (_this._getPageSize() || 16) *
          ((_this._getPage() - 1) || 0);
      }
      //遍历views数组，并对每个view调用BbaseBackbone的remove
      BbaseEst.each(_this.views, function(view) {
        view.off().remove();
      });
      //清空views数组，此时旧的view就变成没有任何被引用的不可达对象了
      //垃圾回收器会回收它们
      _this.views = [];

      BbaseEst.trigger(_this.cid + 'models', null, true);
      //this.list.empty();
      return _this.collection;
    },
    /**
     * 清空DOM列表
     *
     * @method [集合] - _clear ( 清空DOM列表 )
     * @author wyj 15.1.24
     * @private
     * @example
     *        this._clear();
     */
    _clear: function() {
      var _this = this;
      _this._empty.call(_this);
      _this.list.empty();
      _this.collection.models.length = 0;
    },
    /**
     * 添加所有元素， 相当于刷新视图
     *
     * @method [private] - _addAll
     * @private
     * @author wyj 14.11.16
     */
    _addAll: function() {
      var _this = this;
      _this._empty();
      _this.collection.each(_this._addOne, _this);
    },
    /**
     * 搜索(新版将移除)
     *
     * @method [搜索] - _search ( 搜索 )
     * @param options [onBeforeAdd: 自定义过滤]
     * @author wyj 14.12.8
     * @example
     *      this._search({
     *        filter: [
     *         {key: 'name', value: this.searchKey },
     *         {key: 'prodtype', value: this.searchProdtype} ,
     *         {key: 'category', value: this.searchCategory},
     *         {key: 'loginView', value: this.searchLoginView},
     *         {key: 'ads', value: this.searchAds}
     *         ],
     *        onBeforeAdd: function(item){
     *          // 自定义过滤， 即通过上面的filter后还需要经过这一层过滤
     *          // 若通过返回true
     *          return item.attributes[obj.key].indexOf(obj.value) !== -1;
     *       }});
     */
    /*  _search: function(options) {
        var ctx = this;
        this._clear();
        this.filter = true;
        options = BbaseEst.extend({
          onBeforeAdd: function() {}
        }, options);
        this._load({
          page: 1,
          pageSize: 5000,
          afterLoad: function() {
            ctx.filter = false;
            if (!ctx._options.items) {
              ctx._filter(options.filter || ctx._options.filter, options);
            } else {
              ctx._filterItems(options.filter || ctx._options.filter, options);
            }
          }
        });
      },*/
    /**
     * 过滤collection(新版将移除)
     *
     * @method [private] - _filter
     * @param array
     * @param options
     * @private
     * @author wyj 14.12.8
     */
    /*_filter: function(array, options) {
      var ctx = this;
      var result = [];
      var len = ctx.collection.models.length;
      ctx.filter = false;
      while (len > 0) {
        if (this._checkStop()) len = -1;

        var item = ctx.collection.models[len - 1];
        var pass = true;

        BbaseEst.each(array, function(obj) {
          var match = false;
          var keyval = BbaseEst.getValue(item.attributes, obj.key);

          if (BbaseEst.typeOf(obj.match) === 'regexp') {
            match = !obj.match.test(keyval);
          } else {
            match = BbaseEst.isEmpty(keyval) || (keyval.indexOf(obj.value) === -1);
          }
          if (pass && !BbaseEst.isEmpty(obj.value) && match) {
            ctx.collection.remove(item);
            pass = false;
            return false;
          }
        });
        if (pass && options.onBeforeAdd) {
          var _before_add_result = options.onBeforeAdd.call(this, item);
          if (BbaseEst.typeOf(_before_add_result) === 'boolean' && !_before_add_result) {
            pass = false;
          }
        }
        if (pass) {
          result.unshift(item);
        }
        len--;
      }
      BbaseEst.each(result, function(item) {
        item.set('_isSearch', true);
        ctx._addOne(item);
      });
      BbaseEst.trigger(this.cid + 'models');
    },*/
    /**
     * 过滤items(新版将移除)
     *
     * @method [private] - _filterItems
     * @param array
     * @param options
     * @private
     * @author wyj 14.12.8
     */
    /*_filterItems: function(array, options) {
      var ctx = this;
      var result = [];
      var items = BbaseEst.cloneDeep(ctx._options.items);
      var len = items.length;
      ctx.filter = false;
      while (len > 0) {
        if (this._checkStop()) break;
        var item = items[len - 1];
        var pass = true;
        BbaseEst.each(array, function(obj) {
          var match = false;
          var keyval = BbaseEst.getValue(item, obj.key);
          if (BbaseEst.typeOf(obj.match) === 'regexp') {
            match = !obj.match.test(keyval);
          } else {
            match = BbaseEst.isEmpty(keyval) || (keyval.indexOf(obj.value) === -1);
          }
          if (pass && !BbaseEst.isEmpty(obj.value) && match) {
            items.splice(len, 1);
            pass = false;
            return false;
          }
        });
        if (pass && options.onBeforeAdd) {
          var _before_add_result = options.onBeforeAdd.call(this, item);
          if (BbaseEst.typeOf(_before_add_result) === 'boolean' && !_before_add_result) {
            pass = false;
          }
        }
        if (pass) {
          result.unshift(item);
        }
        len--;
      }
      BbaseEst.each(result, function(item) {
        item = new ctx.initModel(item);
        item.set('_isSearch', true);
        ctx.collection.push(item);
        //ctx._addOne(item);
      });
    },*/
    /**
     * 全选checkbox选择框, 只能全选中， 不能全不选中(新版将移除)
     *
     * @method [选取] - _checkAll ( 全选checkbox选择框 )
     * @author wyj 14.11.16
     */
    _checkAll: function(e) {
      var checked,
        _self = this,
        $check = null;

      if (BbaseEst.typeOf(e) === 'boolean') {
        // 直接指定true/false
        _self._setValue('checked_all', e);
      } else if (e) {
        // node元素
        $check = _self._getEventTarget(e);
        if ($check.is('checkbox')) {
          _self._setValue('checked_all', $check.get(0).checked);
        } else {
          _self._setValue('checked_all', !_self._getValue('checked_all'));
        }
      } else {
        // handle click
        _self._setValue('checked_all', !_self._getValue('checked_all'));
      }
      checked = _self._getValue('checked_all');
      _self.collection.each(function(model) {
        model._set('checked', checked);
        //if (!_self._options.diff) model.view.render();
      });
      _self._checkedAll(_self._getValue('checked_all'));
    },
    /**
     * 是否全选
     * @method [选取] - _checkedAll
     * @param  {[type]} checked [description]
     * @return {[type]}         [description]
     */
    _checkedAll: function(checked) {
      this._setValue('checked_all', checked);
    },
    /**
     * 保存sort值
     *
     * @method [保存] - _saveSort ( 保存sort值 )
     * @param model
     * @author wyj 14.12.4
     */
    _saveSort: function(model) {
      var _this = this;
      var sortOpt = {
        id: model.get('id')
      };
      sortOpt[_this._options.sortField || 'sort'] = model.get(_this._options.sortField);
      model._saveField(sortOpt, _this, {
        async: false,
        hideTip: true
      });
    },
    _saveSorts: function(model, args) {
      var sortOpt = {
        id: model.get('id')
      };
      sortOpt.sorts = args;
      model._saveField(sortOpt, this, {
        async: false,
        hideTip: true
      });
    },
    /**
     * 插序 常用于sortable
     *
     * @method [移动] - _insertOrder
     * @param begin
     * @param end
     * @author wyj 15.9.26
     * @example
     *    this._insertOrder(1, 6);
     */
    _insertOrder: function(begin, end, callback) {
      var _this = this;
      if (begin < end) {
        end++;
      }
      BbaseEst.arrayInsert(_this.collection.models, begin, end, {
        arrayExchange: function(list, begin, end, opts) {
          _this._exchangeOrder(begin, end, {
            path: _this._options.sortField || 'sort',
            success: function(thisNode, nextNode) {
              if (thisNode.get('id') && nextNode.get('id')) {
                //this._saveSort(thisNode);
                //this._saveSort(nextNode);
                thisNode.stopCollapse = false;
                nextNode.stopCollapse = false;
              } else {
                console.log('Error8 -> _insertOrder'); //debug__
              }
            }
          });
        },
        callback: function(list) {
          if (callback) callback.call(_this, list);
        }
      });
      _this._resetDx();
    },
    /**
     * 交换位置
     *
     * @method [private] - _exchangeOrder
     * @param original_index
     * @param new_index
     * @param options
     * @return {BbaseList}
     * @private
     * @author wyj 14.12.5
     */
    _exchangeOrder: function(original_index, new_index, options) {
      var _this = this;
      var tempObj = {},
        nextObj = {};
      var temp = _this.collection.at(original_index);
      var next = _this.collection.at(new_index);

      // 互换dx
      if (temp.view && next.view) {
        var thisDx = temp.view.model.get('dx');
        var nextDx = next.view.model.get('dx');
        tempObj.dx = nextDx;
        nextObj.dx = thisDx;
      }
      // 互换sort值
      if (options.path) {
        var thisValue = temp.view.model.get(options.path);
        var nextValue = next.view.model.get(options.path);
        tempObj[options.path] = nextValue;
        nextObj[options.path] = thisValue;
      }
      temp.view.model.stopCollapse = true;
      next.view.model.stopCollapse = true;
      // 交换model
      _this.collection.models[new_index] = _this.collection.models.splice(original_index, 1, _this.collection.models[new_index])[0];
      temp.view._set(tempObj);
      next.view._set(nextObj);

      // 交换位置
      if (original_index < new_index) {
        temp.view.$el.before(next.view.$el).removeClass('hover');
      } else {
        temp.view.$el.after(next.view.$el).removeClass('hover');
      }
      if (temp.view.$el.hasClass('bui-grid-row-even')) {
        temp.view.$el.removeClass('bui-grid-row-even');
        next.view.$el.addClass('bui-grid-row-even');
      } else {
        temp.view.$el.addClass('bui-grid-row-even');
        next.view.$el.removeClass('bui-grid-row-even');
      }
      if (options.success) {
        options.success.call(_this, temp, next);
      }
      return _this;
    },
    /**
     * 上移, 默认以sort为字段进行上移操作， 如果字段不为sort， 则需重载并设置options
     *
     * @method [移动] - _moveUp ( 上移 )
     * @param model
     * @author wyj 14.12.4
     * @example
     *      BbaseApp.getView('attributesList')._setOption({
     *        sortField: 'orderList'
     *      })._moveUp(this.model);
     */
    _moveUp: function(model) {
      var ctx = this;
      var first = ctx.collection.indexOf(model);
      var last, parentId;
      var result = [];
      if (ctx._options.subRender) {
        parentId = model.get(ctx._options.parentId);
        ctx.collection.each(function(thisModel) {
          if (parentId === thisModel.get(ctx._options.parentId)) {
            result.push(thisModel);
          }
        });
        //TODO 找出下一个元素的索引值
        var thisDx = BbaseEst.findIndex(result, function(item) {
          return item.get('id') === model.get('id');
        });
        if (thisDx === 0) return;
        last = ctx.collection.indexOf(result[thisDx - 1]);
      } else {
        if (first === 0) return;
        last = first - 1;
      }
      //model.stopCollapse = true;
      ctx._exchangeOrder(first, last, {
        path: ctx._options.sortField || 'sort',
        success: function(thisNode, nextNode) {
          if (thisNode.get('id') && nextNode.get('id')) {
            //this._saveSort(thisNode);
            //this._saveSort(nextNode);
            ctx._saveSorts(thisNode, {
              ids: thisNode.get('id') + ',' + nextNode.get('id'),
              sorts: thisNode.get(ctx._options.sortField || 'sort') + ',' +
                nextNode.get(ctx._options.sortField || 'sort')
            });
            thisNode.stopCollapse = false;
            nextNode.stopCollapse = false;
          } else {
            console.log('Error8 -> _moveUp'); //debug__
          }
        }
      });
    },
    /**
     * 下移
     *
     * @method [移动] - _moveDown ( 下移 )
     * @param model
     * @author wyj 14.12.4
     */
    _moveDown: function(model) {
      var ctx = this;
      var first = ctx.collection.indexOf(model);
      var last, parentId;
      var result = [];
      if (ctx._options.subRender) {
        parentId = model.get(ctx._options.parentId);
        ctx.collection.each(function(thisModel) {
          if (parentId === thisModel.get(ctx._options.parentId)) {
            result.push(thisModel);
          }
        });
        //TODO 找出上一个元素的索引值
        var thisDx = BbaseEst.findIndex(result, function(item) {
          return item.get('id') === model.get('id');
        });
        if (thisDx === result.length - 1) return;
        last = ctx.collection.indexOf(result[thisDx + 1]);
      } else {
        if (first === ctx.collection.models.length - 1) return;
        last = first + 1;
      }
      //model.stopCollapse = true;
      ctx._exchangeOrder(first, last, {
        path: ctx._options.sortField,
        success: function(thisNode, nextNode) {
          if (thisNode.get('id') && nextNode.get('id')) {
            //this._saveSort(thisNode);
            //this._saveSort(nextNode);
            ctx._saveSorts(thisNode, {
              ids: thisNode.get('id') + ',' + nextNode.get('id'),
              sorts: thisNode.get(ctx._options.sortField || 'sort') + ',' +
                nextNode.get(ctx._options.sortField || 'sort')
            });
            thisNode.stopCollapse = false;
            nextNode.stopCollapse = false;
          } else {
            console.log('Error8 -> _moveDown'); //debug__
          }
        }
      });
    },
    /**
     *  获取checkbox选中项所有ID值列表
     *
     * @method [选取] - _getCheckedIds ( 获取checkbox选中项所有ID值列表 )
     * @return {*}
     * @author wyj 14.12.8
     * @example
     *      this._getCheckedIds(); => ['id1', 'id2', 'id3', ...]
     */
    _getCheckedIds: function(field) {
      return BbaseEst.pluck(this._getCheckedItems(), BbaseEst.isEmpty(field) ? 'id' : ('attributes.' + field));
    },
    __filter: function(item) {
      return item.attributes.checked;
    },
    /**
     *  获取checkbox选中项
     *
     * @method [选取] - _getCheckedItems ( 获取checkbox选中项 )
     * @return {*}
     * @author wyj 14.12.8
     * @example
     *      this._getCheckedItems(); => [{model}, {model}, {model}, ...]
     *      this._getCheckedItems(true); => [{item}, {item}, {item}, ...]
     */
    _getCheckedItems: function(pluck) {
      var _this = this;
      return pluck ? BbaseEst.chain(_this.collection.models).filter(_this.__filter).pluck('attributes').value() :
        BbaseEst.chain(_this.collection.models).filter(_this.__filter).value();
    },
    /**
     * 转换成[{key: '', value: ''}, ... ] 数组格式 并返回 （频繁调用存在性能问题）
     *
     * @method [集合] - _getItems ( 获取所有列表项 )
     * @author wyj 15.1.15
     * @example
     *      BbaseApp.getView('productList').getItems();
     */
    _getItems: function(options) {
      return BbaseEst.map(this.collection.models, function(model) {
        return model.toJSON(options);
      });
    },
    /**
     * 获取集合中某个元素
     *
     * @method [集合] - getItem ( 获取集合中某个元素 )
     * @param index
     * @return {*}
     * @author wyj 15.5.22
     */
    _getItem: function(index) {
      var list = this._getItems();
      index = index || 0;
      if (list.length > index) return list[index];
      return null;
    },
    /**
     * 向集合末尾添加元素
     *
     * @method [集合] - _add ( 向集合末尾添加元素 )
     * @author wyj 15.1.15
     * @example
     *      BbaseApp.getView('productList')._add(new model());
     */
    _add: function(model) {
      this.collection.push(model);
    },
    /**
     * 批量删除， 隐藏等基础接口
     *
     * @method [批量] - _batch ( 批量删除 )
     * @param options [url: 批量请求地址] [tip: 操作成功后的消息提示]
     * @author wyj 14.12.14
     * @example
     *        this._batch({
                  url: ctx.collection.batchDel,
                  tip: '删除成功'
                });
     *
     */
    _batch: function(options) {
      var ctx = this;
      options = BbaseEst.extend({
        tip: CONST.LANG.SUCCESS + '！'
      }, options);
      ctx.checkboxIds = ctx._getCheckedIds(options.field || 'id');
      if (ctx.checkboxIds.length === 0) {
        BbaseUtils.tip(CONST.LANG.SELECT_ONE + '！');
        return;
      }
      if (options.url) {
        $.ajax({
          type: 'POST',
          async: false,
          url: options.url,
          data: {
            ids: ctx.checkboxIds.join(',')
          },
          success: function(result) {
            if (!result.success) {
              BbaseUtils.tip(result.msg);
            } else
              BbaseUtils.tip(options.tip);
            ctx._load();
            BbaseEst.trigger(ctx.cid + 'models', null, true);
            if (options.callback)
              options.callback.call(ctx, result);
          }
        });
      } else {
        BbaseEst.each(ctx._getCheckedItems(), function(item) {
          item.destroy();
        });
        BbaseEst.trigger(ctx.cid + 'models', null, true);
        if (options.callback)
          options.callback.call(ctx);
      }

    },
    /**
     * 批量删除
     *
     * @method [批量] - _batchDel ( 批量删除 )
     * @param options
     * @author wyj 14.12.14
     * @example
     *      this._batchDel({
     *        url: CONST.API + '/message/batch/del',
     *        field: 'id',
     *      });
     */
    _batchDel: function(options, callback) {
      var ctx = this;
      var url = null;
      var field = 'id';
      var $target = ctx._getEventTarget(options);
      // options 为 event
      if ($target.size() > 0) {
        url = $target.attr('data-url');
        field = $target.attr('data-field') || 'id';
      } else {
        url = options.url;
        id = options.id || 'id';
      }

      ctx.checkboxIds = ctx._getCheckedIds(field);
      if (ctx.checkboxIds && ctx.checkboxIds.length === 0) {
        BbaseUtils.tip(CONST.LANG.SELECT_ONE);
        return;
      }
      BbaseUtils.confirm({
        success: function() {
          ctx._batch({
            url: url,
            field: field,
            tip: CONST.LANG.DEL_SUCCESS,
            callback: callback
          });
        }
      });
    },
    /**
     * 使所有的checkbox初始化为未选择状态
     *
     * @method [选取] - _clearChecked ( 所有选取设置为未选择状态 )
     * @author wyj 14.12.14
     * @example
     *      this._clearChecked();
     */
    _clearChecked: function(focus) {
      BbaseEst.each(this.collection.models, function(model) {
        if ((!BbaseEst.equal(model._previousAttributes.checked, model.attributes.checked) || focus) && model.view) {
          model.attributes.checked = false;
          BbaseEst.trigger(model.view.cid + 'checked', 'checked', true);
        }
      });
    },
    _getPage: function() {
      return this.collection.paginationModel.get('page');
    },
    _setPage: function(page) {
      this.collection.paginationModel.set('page', page);
    },
    _getTotalPage: function() {
      var _this = this;
      return _this._getCount() % _this._getPageSize() == 0 ? _this._getCount() / _this._getPageSize() : Math.floor(_this._getCount() / _this._getPageSize()) + 1;
    },
    _getCount: function() {
      return this.collection.paginationModel.get('count');
    },
    _setCount: function(count) {
      this.collection.paginationModel.set('count', count);
    },
    _getPageSize: function() {
      return this.collection.paginationModel.get('pageSize');
    },
    _setPageSize: function(pageSize) {
      this.collection.paginationModel.set('pageSize', pageSize);
    },
    _getLength: function() {
      return this.collection.models.length;
    },
    _hasMore: function(){
      var _this = this;
      if (_this._getTotalPage() === 0 ||
        _this._getPage('page') === _this._getTotalPage()) {
        return false;
      }
      return true;
    },
    _loadMore: function() {
      var _this = this;
      _this.___append = BbaseEst.typeOf(_this._options.append) === 'boolean' ? _this._options.append : false;
      if (!_this._hasMore()) {
        return false;
      }
      _this._options.append = true;
      _this._setPage(_this._getPage() + 1);
      BbaseUtils.addLoading();
      _this._load();
    }
  });
  window.BbaseList = BbaseList;
})(window.BbaseBackbone, window.BbaseEst, window.BbaseApp, window.BbaseUtils, window.BbaseHandlebars, window.BbaseSuperView, window.BbaseModel);