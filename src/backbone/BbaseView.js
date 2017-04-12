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
  _initialize: function(options) {
    this._initOptions(options);
    this._initTemplate(this._options.template);
    this._initModel(this._options.data, BbaseModel.extend({
      fields: this._options.fields
    }));
    this._initBind(this._options);
    this.render();
    return this;
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
    this._options.data = this._options.data || {};
    this.viewId = this._options.viewId;
    this.viewType = 'view';
  },
  /**
   * 初始化模板， 若传递一个Template模板字符中进来， 则渲染页面
   *
   * @method [private] - _initTemplate
   * @private
   * @author wyj 15.1.12
   */
  _initTemplate: function(template) {
    if (template) {
      template = this._parseHbs(template);
      this.template = BbaseHandlebars.compile(template);
      this.$template = '<div>' + template + '</div>';
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
  _initModel: function(data, model) {
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
  _initBind: function(options) {
    this.model.bind('reset', this.render, this);
  },
  /**
   * 渲染
   *
   * @method [渲染] - _render ( 渲染 )
   * @author wyj 14.11.20
   * @example
   *        this._render();
   */
  _render: function() {
    if (this._initDefault) this._initDefault.call(this);
    if (this.beforeRender) this.beforeRender.call(this, this._options);
    if (this._options.append) this.$el.append(this.template(this.model.attributes));
    else this.$el.html(this.template(this.model.attributes));

    if (this._options.modelBind) setTimeout(this._bind(function() {
      this._modelBind();
    }), 0);
    if (this.afterRender) setTimeout(this._bind(function() {
      this.afterRender.call(this, this._options);
    }), 0);
    if (this._options.onReady) setTimeout(this._bind(function() {
      this._options.onReady.call(this, this._options);
    }), 0);
      if (this.onReady) setTimeout(this._bind(function() {
      this.onReady.call(this, this._options);
    }), 0);

    if (this._watchBind) setTimeout(this._bind(function() {
      this._watchBind.call(this, this._options.template);
    }), 0);
    if (this._bbBind) setTimeout(this._bind(function() {
      this._bbBind.call(this, this._options.template, this.$el);
    }), 0);
    if (this._options.toolTip) setTimeout(this._bind(function() {
      this._initToolTip();
    }), 0);

    this._initEnterEvent(this._options);
    this._ready_component_ = true;
    BbaseUtils.removeLoading();
  },
  render: function() {
    this._render();
  }
});
