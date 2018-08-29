/**
 * @description 基础集合类
 *
 * - url: CONST.API + '/product/list', // 如果是function形式构建的时候，记得带上page 与pageSize; // 可选
 * - batchDel: CONST.API + '/product/batch/del', // 可选
 * - model: ProductModel,
 * - initialize: function(){this._initialize();} // 可选
 *
 * @classb BbaseCollection 集合类
 * @author yongjin<zjut_wyj@163.com> 2014/11/6
 */
(function(BbaseBackbone, BbaseEst, BbaseApp, BbaseUtils, undefined){
  var BbasePaginationModel = BbaseBackbone.Model.extend({
  defaults: {
    page: 1,
    pageSize: 16,
    count: 0
  },
  initialize: function() {}
});

var BbaseCollection = BbaseBackbone.Collection.extend({
  //localStorage: new BbaseBackbone.LocalStorage('base-collection'),
  /**
   * 传递options进来
   *
   * @method [private] - constructor
   * @private
   * @param options
   * @author wyj 14.12.16
   */
  constructor: function(options) {
    var _this = this;
    _this.options = options || {};
    BbaseBackbone.Collection.apply(_this, [null, arguments]);
  },
  /**
   * 调用父类方法
   * @method [构造] - _super
   * @return {[type]} [description]
   */
  _super: function(type, args) {
    var _this = this;
    if (BbaseEst.typeOf(type) === 'object') {
      _this._initialize(type);
    } else {
      switch (type) {
        case 'data':
          if (BbaseApp.getView(_this.options.viewId)) {
            return BbaseApp.getView(_this.options.viewId).model.toJSON();
          } else {
            return _this.options.data;
          }
          break;
        case 'model':
          if (BbaseApp.getView(_this.options.viewId)) {
            return BbaseApp.getView(_this.options.viewId).model;
          } else {
            var model = _this.model;
            return new model(_this.options.data);
          }
          break;
        case 'view':
          return BbaseApp.getView(_this.options.viewId);
        default:
          if (BbaseApp.getView(_this.options.viewId)[type]) BbaseApp.getView(_this.options.viewId)[type](args);
          return _this;
      }
    }
  },
  /**
   * 初始化
   *
   * @method [初始化] - _initialize ( 初始化 )
   * @author wyj 14.11.16
   * @example
   initialize: function () {
                this._initialize();
              }
   */
  _initialize: function() {
    var _this = this;
    _this._baseUrl = _this.url;
    _this.__params = _this.__params || {};
    if (!_this.paginationModel) {
      _this.paginationModel = new BbasePaginationModel({
        page: _this.options.page || 1,
        pageSize: _this.options.pageSize || 16
      });
    }
  },
  initialize: function() {
    this._initialize();
  },
  /**
   * 处理url 与 分页
   *
   * @method [private] - _parse (  )
   * @private
   * @param resp
   * @param xhr
   * @return {attributes.data|*}
   * @author wyj 14.11.16
   */
  parse: function(resp, xhr) {
    var ctx = this;
    if (BbaseEst.isEmpty(resp)) {
      return [];
    }
    if (!resp.success && resp.msg) {
      if (resp.msgType === "notLogin" && !BbaseEst.isEmpty(ctx.url)) {
        BbaseEst.trigger('checkLogin', null, true);
      }
      else if (resp.msgType === "nopriv" && CONST.NO_PRIV){
        if (CONST.NO_PRIV.indexOf('#/') > -1){
          ctx._navigate(CONST.NO_PRIV, true);
        }else{
          window.location.href=CONST.NO_PRIV;
        }
      }
       else{
        BbaseUtils.tip(resp.msg, { zIndex: 5000 });
      }
    }
    ctx._parsePagination(resp);
    ctx._parseUrl(ctx.paginationModel);
    //TODO this.options.pagination 防止被其它无分页的列表覆盖
    if (ctx.options.pagination && ctx.paginationModel) {
      ctx._paginationRender();
    }
    return resp.attributes.data;
  },
  /**
   * 处理url地址， 加上分页参数
   *
   * @method [private] - _parseUrl (  )
   * @private
   * @param model
   * @author wyj 14.11.16
   */
  _parseUrl: function(model) {
    var _this = this;
    var page = 1,
      pageSize = 16;
    if (model && model.get('pageSize')) {
      pageSize = model.get('pageSize');
      page = model.get('page');
    }
    if (_this.options.subRender) {
      page = 1;
      pageSize = 9000;
    }
    if (typeof _this.url !== 'function') {
      var end = '';
      if (!BbaseEst.isEmpty(_this._itemId)) end = '/' + _this._itemId;
      _this.url = _this._baseUrl + end + (_this._baseUrl.indexOf('?') > -1 ? '&' : '?') + 'page=' + page + '&pageSize=' + pageSize + _this._getParams();
    }
  },
  /**
   * 设置请求参数
   * @method _setParam
   *
   * @param {[type]} name  [description]
   * @param {[type]} value [description]
   */
  _setParam: function(name, value) {
    var _this = this;
    _this.__params[name] = value;
    _this._parseUrl(_this.paginationModel);
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
  _getParams: function() {
    var result = '';
    var _this = this;
    BbaseEst.each(_this.__params, function(val, key) {
      result += ('&' + key + '=' + val);
    }, _this);
    return result;
  },
  /**
   * 设置分页模型类
   *
   * @method [private] - _parsePagination
   * @private
   * @param resp
   * @author wyj 14.11.16
   */
  _parsePagination: function(resp) {
    var _this = this;
    resp.attributes = resp.attributes || {
      page: 1,
      per_page: 10,
      count: 10
    };
    if (_this.paginationModel) {
      _this.paginationModel.set('page', resp.attributes.page || 1);
      _this.paginationModel.set('pageSize', resp.attributes.per_page || 16);
      _this.paginationModel.set('count', resp.attributes.count || 0);
    }
  },
  /**
   * 渲染分页
   *
   * @method [private] - _paginationRender
   * @private
   * @author wyj 14.11.16
   */
  _paginationRender: function() {
    var _this = this;
    seajs.use(['BbasePagination'], function(Pagination) {
      if (!Pagination) return;
      if (!_this.pagination) {
        var $el = $(_this.options.el);
        var isStr = BbaseEst.typeOf(_this.options.pagination) === 'string';
        var _$el = $(!isStr ? "#pagination-container" :
          _this.options.pagination, $el.size() > 0 ? $el : $('body'));
        if (isStr) {
          _this.paginationModel.set('numLength', parseInt(_$el.attr('data-numLength') || 7, 10));
        }
        _this.pagination = new Pagination({
          el: _$el,
          model: _this.paginationModel
        });
      } else {
        _this.pagination.render();
      }
    });
  },
  /**
   * 加载列表
   *
   * @method [集合] - _load ( 加载列表 )
   * @param instance 实例对象
   * @param context 上下文
   * @param model 模型类
   * @return {ln.promise} 返回promise
   * @author wyj 14.11.15
   * @example
   *      if (this.collection.url){
   *             this.collection._load(this.collection, this, model)
   *                 .then(function(result){
   *                     resolve(result);
   *                 });
   *         }
   */
  _load: function(instance, context, model) {
    var _this = this;
    _this._parseUrl(model);
    return instance.fetch({
      success: function() {
        if (!context.options.diff) context._empty();
      },
      cacheData: _this.options.cache,
      session: _this.options.session
    });
  },
  /**
   * 设置itemId
   *
   * @method [分类] - _setItemId ( 设置itemId )
   * @param itemId
   * @author wyj 14.12.16
   * @example
   *        this._setItemId('Category00000000000000000032');
   */
  _setItemId: function(itemId) {
    this._itemId = itemId;
  },
  /**
   * 设置列表
   * @method _set
   * @param {[type]} list [description]
   */
  _set: function(list) {
    return this._super('view')._setModels(list);
  },
  /**
   * 清空列表
   *
   * @method [集合] - _empty ( 清空列表 )
   * @author wyj 14.11.15
   */
  _empty: function() {
    var _this = this;
    if (_this.collection) {
      var len = _this.collection.length;
      while (len > -1) {
        _this.collection.remove(_this.collection[len]);
        len--;
      }
      BbaseEst.trigger(_this._super('view').cid + 'models', null, true)
    }
  },
  _getPage: function () {
    return this.paginationModel.get('page');
  },
  _setPage: function (page) {
    this.paginationModel.set('page', page);
  },
  _getTotalPage: function () {
    var _this = this;
    return _this._getCount() % _this._getPageSize() == 0 ? _this._getCount() / _this._getPageSize() : Math.floor(_this._getCount() / _this._getPageSize()) + 1;
  },
  _getCount: function () {
    return this.paginationModel.get('count');
  },
  _setCount: function (count) {
    this.paginationModel.set('count', count);
  },
  _getPageSize: function () {
    return this.paginationModel.get('pageSize');
  },
  _setPageSize: function (pageSize) {
    this.paginationModel.set('pageSize', pageSize);
  }
});
window.BbaseCollection = BbaseCollection;
})(window.BbaseBackbone, window.BbaseEst, window.BbaseApp, window.BbaseUtils);

