/**
 * @description 应用程序管理器 - 中介者模式， 用于注册视图、模块、路由、模板等。
 * @class BbaseApp - 用户后台
 * @author yongjin<zjut_wyj@163.com> 2014/12/28
 */
(function(BbaseEst, undefined) {
  var BbaseApplication = function(options) {
    var _this = this;
    _this.options = options;
    BbaseEst.extend(_this, options);
    _this.initialize.apply(_this, arguments);
  };
  BbaseEst.extend(BbaseApplication.prototype, {
    initialize: function() {
      var _this = this;
      _this.data = { itemActiveList: [], sessionId: '' }; // 全局数据
      _this.instance = {}; // 实例对象
      _this.modules = {}; // 所有模块
      _this.routes = {}; // 路由
      _this.templates = {}; // 静态模板
      _this.panels = {}; // 面板
      _this.dialog = []; // 对话框
      _this.dialogs = {}; // 带身份标识的dialog
      _this.status = {}; // 状态
      if (typeof app !== 'undefined' && app.getStatus) {
        _this.status = BbaseEst.extend(_this.status, app.getAllStatus());
      }
      _this.cookies = []; // 会话
      _this.models = []; // 实体对象
      _this.compileTemps = {}; // 编译模版
      _this.filters = { navigator: [], form: [] }; // 过滤器
      _this.cache = {}; // 缓存
      _this.directives = {}; // 指令
      _this._batch_replace_ready = [];
      _this._batch_replace = [];
      _this._batchReplaceTimer = null;
    },
    /**
     * 返回当前应用底层使用的是backbone版本
     *
     * @method [版本] - getAppType ( 获取App版本 )
     * @return {string}
     * @author wyj 15.5.20
     */
    getAppType: function() {
      return 'backbone';
    },
    /**
     * 视图添加， 当重新添加时会调用destroy方法
     *
     * @method [视图] - addRegion ( 添加视图[推荐使用] )
     * @param name
     * @param instance
     * @return {*}
     * @example
     *      BbaseApp.addRegion('productList', ProductList, {
     *        viewId: 'productList',     // 可省略
     *        el: '',
     *        args: args
     *      });
     */
    addRegion: function(name, instance, options) {
      var _this = this;
      var panel = BbaseEst.nextUid('region');

      if (!options.__panelId) {
        options.__panelId = options.el;
      }
      if (options.diff && _this.getView(options.viewId || name)) {
        _this.getView(options.viewId || name)._extend(options);
        _this.getView(options.viewId || name)._reset(options.data);
        return;
      }

     /* if (options.viewId){
          window['$clone' + options.viewId] = $(options.el).clone();
          $(options.el).parent().append(window['$clone' + options.viewId]);
      }*/

      _this.addPanel(name, {
        el: options.__panelId,
        template: '<div class="region ' + panel + '"></div>',
        append: options.append
      }, options);
      if (!options.viewId) {
        options.viewId = name;
      }
      if (options.viewId in _this.instance) {
        _this.removeView(options.viewId);
      }

      return _this.addView(options.viewId, new instance(options));
    },
    /**
     * 添加面板
     *
     * @method [面板] - addPanel ( 添加面板 )
     * @param name
     * @param options
     * @return {BbaseApp}
     * @example
     *        BbaseApp.addPanel('product', new Panel());
     *        BbaseApp.addPanel('product', {
     *          el: '#product-panel',
     *          template: '<div clas="product-panel-inner"></div>'
     *        }).addView('aliPay', new AlipayView({
     *          el: '.product-panel-inner',
     *          viewId: 'alipayView'
     *        }));
     */
    addPanel: function(name, panel, options) {
      var _this = this;
      var isObject = BbaseEst.typeOf(panel.cid) === 'string' ? false : true;
      options = options || {};
      BbaseUtils.addLoading();
      if (isObject) {
        _this.removePanel(name, panel);
        panel.$template = $(panel.template);
        if (options) options.el = panel.$template;
        panel.$template.addClass('__panel_' + name + ' ' + (options.viewId || options.__viewId));
        panel.$template.attr('data-view', options.viewId || name);
        if (!panel.append) $(panel.el).empty();
        $(panel.el).append(panel.$template);
      }
      _this.panels[name] = panel;
      return isObject ? _this : panel;
    },
    /**
     * 移除面板
     *
     * @method [面板] - removePanel ( 移除面板 )
     * @param name
     * @author wyj 14.12.29
     */
    removePanel: function(name, panel) {
      try {
        var _this = this;
        var views = [];
        if (!panel) panel = _this.panels[name];
        if (!panel) return;
        if (panel.append) return;
        if (panel.el !== 'body') {
          $('.region', $(panel.el)).each(function() {
            views.push($(this).attr('data-view'));
          });
          views.reverse();
          BbaseEst.each(views, function(name) {
            _this.removeView(name);
          });
        }
        $('.__panel_' + name, $(panel.el)).off().remove();
        delete _this.panels[name];
      } catch (e) {
        console.error(e);
      }
    },
    /**
     * 视图添加
     *
     * @method [视图] - addView ( 添加视图 )
     * @param name
     * @param instance
     * @return {*}
     * @example
     *      BbaseApp.addView('productList', new ProductList());
     */
    addView: function(name, instance) {
      var _this = this;
      if (name in _this.instance) _this.removeView(name);
      _this.instance[name] = instance;

      instance = instance || {};
      instance.options = instance.options || {};
      instance.options.viewId = instance.options.viewId || name;

      _this.setCurrentView(name);
      return _this.instance[name];
    },
    /**
     * 视图移除， 移除视图绑定的事件及所有itemView的绑定事件,
     * 并移除所有在此视图创建的对话框
     *
     * @method [视图] - removeView ( 移除视图 )
     * @param name
     * @return {BbaseApp}
     * @example
     *        BbaseApp.removeView('productList');
     */
    removeView: function(name) {
      var _this = this;
      try {
        if (_this.getView(name)) {
          if (_this.getView(name).destroy) _this.getView(name).destroy();
          if (_this.getView(name)._destroy) _this.getView(name)._destroy()
          if (_this.getView(name)._empty) _this.getView(name)._empty();
          if (_this.getView(name).stopListening) _this.getView(name).stopListening();
          if (_this.getView(name).$el) _this.getView(name).$el.off().remove();
        }
        delete _this.instance[name];
      } catch (e) {
        console.log(e);
      }
      return _this;
    },

    panel: function(name, panel) {
      return this.addPanel(name, panel);
    },
    /**
     * 显示视图
     *
     * @method [面板] - show ( 显示视图 )
     * @param view
     * @author wyj 14.12.29
     */
    show: function(view) {
      this.addView(this.currentView, view);
    },

    /**
     * 获取面板
     *
     * @method [面板] - getPanel ( 获取面板 )
     * @param name
     * @return {*}
     * @author wyj 14.12.28
     * @example
     *      BbaseApp.getPanelf('panel');
     */
    getPanel: function(name) {
      return this.panels[name];
    },

    add: function(name, instance) {
      return this.addView(name, instance);
    },

    /**
     * 设置当前视图
     * @method [视图] - setCurrentView ( 设置当前视图 )
     * @param name
     * @example
     *      BbaseApp.setCurrentView('list', new List());
     */
    setCurrentView: function(name) {
      this.currentView = name;
    },
    /**
     * 获取当前视图
     * @method [视图] - getCurrentView ( 获取当前视图 )
     * @return {*|BbaseApp.currentView}
     * @author wyj 15.1.9
     * @example
     *        BbaseApp.getCurrentView('list');
     */
    getCurrentView: function() {
      return this.currentView;
    },
    /**
     * 获取视图
     *
     * @method [视图] - getView ( 获取视图 )
     * @param name
     * @return {*}
     * @author wyj 14.12.28
     * @example
     *        BbaseApp.getView('productList');
     */
    getView: function(name) {
      return this.instance[name];
    },
    /**
     * 添加对话框
     *
     * @method [对话框] - addDailog ( 添加对话框 )
     * @param dialog
     * @return {*}
     * @example
     *      BbaseApp.addDialog(dialog, id);
     */
    addDialog: function(dialog, id) {
      var _this = this;
      _this.dialog.push(dialog);
      if (id) {
        _this.addData('_curDialog', id);
        _this.dialogs[id] = dialog;
      }
      return dialog;
    },
    /**
     * 获取所有对话框
     * @method [对话框] - getDialogs ( 获取所有对话框 )
     * @return {*}
     * @author wyj 15.1.23
     */
    getDialogs: function() {
      return this.dialog;
    },
    /**
     * 获取指定对话框
     * @method [对话框] - getDialog ( 获取指定对话框 )
     * @author wyj 15.03.20
     *
     */
    getDialog: function(id) {
      var _this = this;
      if (BbaseEst.isEmpty(id)) {
        return _this.dialogs;
      }
      return _this.dialogs[id];
    },
    /**
     * 获取最后打开的dialog对话框
     * @method [对话框] - getCurrentDialog ( 获取当前对话框 )
     * @return {*}
     * @author wyj 15.10.25
     */
    getCurrentDialog: function() {
      var _this = this;
      if (_this.getData('_curDialog')) {
        return _this.dialogs[_this.getData('_curDialog')];
      }
      return null;
    },
    /**
     * 清空所有对话框, 当切换页面时移除所有对话框
     *
     * @method [对话框] - emptyDialog ( 清空所有对话框 )
     * @author wyj 14.12.28
     * @example
     *      BbaseApp.emptyDialog();
     */
    emptyDialog: function() {
      var _this = this;
      BbaseEst.each(_this.dialog, function(item) {
        if (item && item.close) {
          item.close().remove();
        }
      });
      _this.dialog = [];
      _this.dialogs = {};
      _this.addData('_curDialog', null);
    },
    /**
     * 添加模型类
     * @method [模型] - addModel ( 添加模型类 )
     * @author wyj 15.1.23
     */
    addModel: function(model) {
      this.models.push(model);
      return model;
    },
    /**
     * 获取所有模型类
     * @method [模型] - getModels ( 获取所有模型类 )
     * @author wyj 15.1.23
     */
    getModels: function() {
      return this.models;
    },

    /**
     * 添加数据
     *
     * @method [数据] - addData ( 添加数据 )
     * @param name
     * @param data
     * @author wyj 14.12.28
     * @example
     *      BbaseApp.addData('productList', productList);
     */
    addData: function(name, data) {
      this.data[name] = data;
    },
    /**
     * 获取数据
     *
     * @method [数据] - getData ( 获取数据 )
     * @param name
     * @return {*}
     * @author wyj 14.12.28
     * @example
     *        BbaseApp.getData('productList');
     */
    getData: function(name) {
      return this.data[name];
    },
    /**
     * 添加模块 分拆seajs配置文件，
     * 实现每个模板都有自己的模块配置文件
     *
     * @method [模块] - addModule ( 添加模块 )
     * @param name
     * @param val
     * @author wyj 14.12.28
     * @example
     *        BbaseApp.addModule('ProductList', '/modules/product/controllers/ProductList.js');
     */
    addModule: function(name, val) {
      var _this = this;
      if (name in _this['modules']) {
        console.log('module:' + name + ' isExisted');
      }
      _this.modules[name] = val;
    },
    /**
     * 获取所有模块
     *
     * @method [模块] - getModules ( 获取所有模块 )
     * @return {*}
     * @author wyj 14.12.28
     * @example
     *
     */
    getModules: function() {
      return this.modules;
    },
    /**
     * 添加路由
     *
     * @method [路由] - addRoute ( 添加路由 )
     * @param name
     * @param fn
     * @author wyj 14.12.28
     * @example
     *      BbaseApp.addRoute('product', function(){
     *          seajs.use(['ProductList'], function(ProductList){
     *          });
     *      });
     */
    addRoute: function(name, fn) {
      var _this = this;
      if (name in _this['routes']) {
        console.log('route:' + name + ' isExisted');
      }
      _this.routes[name] = fn;
    },
    /**
     * 获取所有路由
     *
     * @method [路由] - getRoutes ( 获取所有路由 )
     * @return {*}
     * @author wyj 14.12.28
     *
     */
    getRoutes: function() {
      return this.routes;
    },
    /**
     * 添加模板, 目前无法解决seajs的实时获取问题
     *
     * @method [模板] - addTemplate ( 添加模板 )
     * @param name
     * @param fn
     * @author wyj 14.12.28
     * @example
     *        BbaseApp.addTemplate('template/photo_item', function (require, exports, module) {
                module.exports = require('modules/album/views/photo_item.html');
              });
     */
    addTemplate: function(name, fn) {
      this.templates[name] = fn;
    },
    /**
     * 获取所有模板
     *
     * @method [模板] - getTemplates ( 获取所有模板 )
     * @return {*}
     * @author wyj 14.12.28
     * @example
     *        BbaseApp.getTemplates();
     */
    getTemplates: function() {
      return this.templates;
    },
    /**
     * 添加session会话   登录成功后会添加__USER__ 用户信息会话， 获取：App.getSession('__USER__');
     * 当需要区分用户唯一性时， 在设置前先设置sessionId   BbaseApp.addData('sessionId', 'Enterprise_0000000000000000032');
     *
     * @method [会话] - addSession ( 添加session会话 )
     * @param name
     * @param value
     * @return {*}
     * @author wyj 15.4.22
     * @example
     *      App.addSession('__USER__', {username: 'ggggfj'});
     */
    addSession: function(name, value, isSession) {
      try {
        var sessionId = BbaseEst.typeOf(isSession) === 'undefined' ? '' : isSession ? this.data.sessionId : '';
        localStorage['___JHW_BACKBONE__' + BbaseEst.hash(sessionId + name)] = JSON.stringify(value);
      } catch (e) {
        console.log(e); //debug__
      }
      return value;
    },
    /**
     * 读取session会话
     *
     * @method [会话] - getSession ( 读取session会话 )
     * @param name
     * @return {Object}
     * @example
     *      App.getSession('__USER__'); => {username: 'ggggfj'}
     */
    getSession: function(name, isSession, ignoreVersion) {
      try {
        var sessionId = BbaseEst.typeOf(isSession) === 'undefined' ? '' : isSession ? this.data.sessionId : '';
        var version = localStorage['___JHW_BACKBONE__' + BbaseEst.hash(sessionId + 'app_version')];
        if (!ignoreVersion && CONST.APP_VERSION && (!version || version !== CONST.APP_VERSION)) {
          this.removeSession();
          localStorage['___JHW_BACKBONE__' + BbaseEst.hash(sessionId + 'app_version')] = CONST.APP_VERSION;
        }
        return JSON.parse(localStorage['___JHW_BACKBONE__' + BbaseEst.hash(sessionId + name)]);
      } catch (e) {
        return '';
      }

    },
    removeSession: function() {
      var storage = window.localStorage;
      for (var i = 0; i < storage.length; i++) {
        if (storage.key(i).indexOf('___JHW_BACKBONE__') > -1) {
          storage.removeItem(storage.key(i));
        }
      }
    },
    /**
     * 添加编译模板
     * @method [模板] - addCompileTemp ( 添加编译模板 )
     * @param name
     * @param compile
     */
    addCompileTemp: function(name, compile) {
      this.compileTemps[name] = compile;
    },
    /**
     * 获取编译模板
     * @method [模板] - getCompileTemp ( 获取编译模板 )
     * @param name
     * @return {*}
     */
    getCompileTemp: function(name) {
      return this.compileTemps[name];
    },
    /**
     * 添加状态数据
     *
     * @method [状态] - SSaatus ( 添加状态数据 )
     * @param name
     * @param value
     * @author wyj 15.1.7
     */
    addStatus: function(name, value) {
      this.status[name] = value;
    },
    /**
     * 获取状态数据
     *
     * @method [状态] - getStatus ( 获取状态数据 )
     * @param name
     * @param value
     * @author wyj 15.1.7
     */
    getStatus: function(name) {
      return this.status[name];
    },
    /**
     * 获取所有状态数据
     *
     * @method [状态] - getAllStatus ( 获取所有状态数据 )
     * @return {{}|*|BbaseApp.status}
     * @author wyj 15.1.9
     */
    getAllStatus: function() {
      return this.status;
    },
    /**
     * 添加参数配置对象
     *
     * @method [配置] - addOption ( 添加配置对象 )
     * @author wyj 15.9.19
     */
    addOption: function(name, value) {
      this.options[name] = value;
    },
    /**
     * 获取参数配置对象
     *
     * @method [配置] - getOption ( 获取配置对象 )
     * @param name
     * @return {*}
     * @author wyj 15.9.19
     */
    getOption: function(name) {
      return BbaseEst.cloneDeep(this.options[name]);
    },
    /**
     * 添加过滤器
     *
     * @method [过滤] - addFilter
     * @param {string} name
     * @param {fn} fn
     * @author wyj 15.6.22
     * @example
     *
     */
    addFilter: function(name, fn) {
      var _this = this;
      if (name === 'navigator') {
        _this.filters[name].push(fn);
      } else {
        _this.filters[name] = fn;
      }
    },
    /**
     * 获取过滤器
     *
     * @method [过滤] - getFilter
     * @param name
     * @return {*}
     * @author wyj 15.6.22
     * @example
     *      App.getFilter('navigator');
     */
    getFilter: function(name) {
      return this.filters[name];
    },
    /**
     * 获取过滤器
     *
     * @method [过滤] - getFilters
     * @param name
     * @return {*}
     * @author wyj 15.6.22
     * @example
     *      App.getFilters('navigator');
     */
    getFilters: function(name) {
      return this.filters[name];
    },
    /**
     * 获取参数hash值
     *
     * @method [cache] - getParamsHash ( 获取参数hash值 )
     * @param options
     * @author wyj 15.10.25
     */
    getParamsHash: function(options) {
      var params = '',
        cacheId = '';

      for (var key in options) {
        params += options[key];
      }
      cacheId = '_hash' + BbaseEst.hash(params);

      return cacheId;
    },
    /**
     * 缓存数据
     * @method [cache] - addCache ( 数据缓存 )
     * @param options
     * @author wyj 15.10.25
     */
    addCache: function(options, result) {
      try {
        var _this = this;
        var cacheId = '';

        if (!result.success) return;
        cacheId = _this.getParamsHash(options);

        if (options.session && result) {
          _this.addSession(cacheId, result);
        } else {
          _this.cache[cacheId] = result;
        }
      } catch (e) {
        debug('Error12 -> addCache -> ' + e); //debug__
      }
    },
    /**
     * 获取缓存数据
     *
     * @method [cache] - getCache ( 获取缓存数据 )
     * @param options
     * @author wyj 15.10.25
     * @return {*}
     */
    getCache: function(options) {
      var _this = this;
      var result = null;
      var cacheId = _this.getParamsHash(options);
      // localStorage缓存
      if (options.session && !_this.getData('versionUpdated')) {
        return _this.getSession(cacheId);
      } else {
        return _this.cache[cacheId];
      }
    },
    /**
     * 清除缓存数据
     *
     * @method [cache] - removeCache ( 清除缓存数据 )
     * @param options
     * @author wyj 15.10.25
     * @example
     *      BbaseApp.removeCache();
     *      BbaseApp.removeCache(options);
     */
    removeCache: function(options) {
      var _this = this;
      var cacheId = null;
      if (options) {
        cacheId = _this.getParamsHash(options);
        delete _this.cache[cacheId];
        return;
      }
      _this.cache = {};
    },
    /**
     * 添加cookie
     *
     * @method [cookie] - addCookie ( 添加cookie )
     * @author wyj 15.1.13
     */
    addCookie: function(name) {
      var _this = this;
      if (BbaseEst.findIndex(_this.cookies, name) !== -1) {
        return;
      }
      _this.cookies.push(name);
    },
    /**
     * 获取所有保存的cookie
     *
     * @method [cookie] - getCookies ( 获取所有保存的cookie )
     * @return {Array}
     * @author wyj 15.1.13
     */
    getCookies: function() {
      return this.cookies;
    },
    /**
     * 添加指令
     *
     * @method addDirective
     * @param {[type]} name [description]
     * @param {[type]} obj  [description]
     */
    addDirective: function(name, obj) {
      this.directives[name] = obj;
    },
    /**
     * 获取指令

     * @method getDirective
     * @return {[type]} [description]
     */
    getDirective: function(name) {
      return this.directives[name];
    }
  });
  window.BbaseApp = window.BbaseApp || new BbaseApplication({});
  // 注释打开，状态helper将不可用
  /*if (typeof app === 'undefined'){
    window.app = window.BbaseApp;
  }
  */
})(window.BbaseEst);