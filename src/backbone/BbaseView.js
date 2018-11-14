/**
 * @description 普通视图
 *
 *  - el: 目标元素Id 如 "#jhw-main"
 *  - initialize 实现父类_initialize
 *  - render 实现父类_render
 *  - 事件
 *      var panel = new Panel();
 *      panel.on('after', function(){
 *        this.albumList = BbaseApp.addView('albumList', new AlbumList());
 *        this.photoList = BbaseApp.addView('photoList', new PhotoList());
 *      });
 *      panel.render(); // 渲染
 *
 * @class BbaseView - 普通视图
 * @author yongjin<zjut_wyj@163.com> 2014/12/8
 */

(function (BbaseBackbone, BbaseEst, BbaseApp, BbaseUtils, BbaseHandlebars, BbaseSuperView, BbaseModel, undefined) {
  var BbaseView = BbaseSuperView.extend({
    /**
     * 初始化
     *
     * @method [初始化] - _initialize ( 初始化 )
     * @param options [template: 字符串模板][model: 实例模型]
     * @author wyj 14.11.20
     * @example
     *      this._initialize({
     *         viewId: 'productList'，
     *         template: 字符串模板，
     *         data: 对象数据
     *         // 可选
     *         enterRender: 执行回车后的按钮点击的元素选择符 如 #submit .btn-search
     *         append: false // 视图是否是追加,
     *         toolTip: true, // 是否显示title提示框   html代码： <div class="tool-tip" title="提示内容">内容</div>
     *         beforeRender: function(){},
     *         afterRender: function(){}
     *      });
     */
    _initialize: function (options) {
      var _this = this;
      _this._initOptions(options);
      _this._initModel(_this._options.data, BbaseModel.extend({
        fields: _this._options.fields
      }));
      _this._initTemplate(_this._options.template);
      _this._initBind(_this._options);
      _this.render();
      return _this;
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
      _this._options.data = _this._options.data || {};
      _this.viewId = _this._options.viewId;
      _this.viewType = 'view';
    },
    /**
     * 初始化模板， 若传递一个Template模板字符中进来， 则渲染页面
     *
     * @method [private] - _initTemplate
     * @private
     * @author wyj 15.1.12
     */
    _initTemplate: function (template) {
      var _this = this;
      if (template) {
        template = _this._parseHbs(template);
        _this.template = BbaseHandlebars.compile(template);
        _this.$template = '<div>' + template + '</div>';
        //_this.$clone = _this.$el.clone();
        //_this.$el.parent().append(_this.$clone);
        _this.$el.hide();
      }
    },
    /**
     * 初始化模型类, 设置index索引
     *
     * @method [private] - _initModel
     * @private
     * @param model
     * @author wyj 14.11.20
     */
    _initModel: function (data, model) {
      if (data) data.CONST = CONST;
      this.model = new model(data);
    },
    /**
     * 绑定事件， 如添加事件， 重置事件
     *
     * @method [private] - _initBind
     * @private
     * @author wyj 14.11.16
     */
    _initBind: function (options) {
      var _this = this;
      _this.model.bind('reset', _this.render, _this);
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
      if (_this._initDefault) _this._initDefault.call(_this);
      if (_this.beforeRender) _this.beforeRender.call(_this, _this._options);
      if (_this._options.append) _this.$el.append(_this.template(_this.model.attributes));
      else _this.$el.html(_this.template(_this.model.attributes));

      if (_this._options.modelBind) _this._modelBind();
      if (_this._watchBind)_this._watchBind.call(_this, _this._options.template);
      if (_this._bbBind)_this._bbBind.call(_this, _this._options.template, _this.$el);
      if (_this.afterRender)  setTimeout(function(){ _this.afterRender.call(_this, _this._options);}, 0);
      if (_this._options.onReady) _this._options.onReady.call(_this, _this._options);
      if (_this._options.toolTip)_this._initToolTip();
      _this._initEnterEvent(_this._options);
      _this._ready_component_ = true;

      setTimeout(function () {
        //_this.$clone&&_this.$clone.remove();
        //window['$clone' + _this.options.viewId] && window['$clone' + _this.options.viewId].remove();
        _this.$el.show();
        _this._handleDirectiveShow();
        if (_this._options.afterShow) _this._options.afterShow.call(_this);
        if (_this._options.onShow) _this._options.onShow.call(_this);
        if (_this.afterShow) _this.afterShow.call(_this);
        BbaseUtils.removeLoading();

      }, 80)
    },
    render: function () {
      this._render();
    }
  });
  window.BbaseView = BbaseView;
})(window.BbaseBackbone, window.BbaseEst, window.BbaseApp, window.BbaseUtils, window.BbaseHandlebars, window.BbaseSuperView, window.BbaseModel);
