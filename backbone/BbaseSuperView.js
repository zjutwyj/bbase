/**
 * @description 所有BaseXxx模块的超类， 子类继承超类的一切方法
 * @class BbaseSuperView - 所有BaseXxx模块的超类
 * @author yongjin<zjut_wyj@163.com> 2015/1/24
 */

var BbaseSuperView = BbaseBackbone.View.extend({
  /**
   * 传递options进来
   *
   * @method [private] - constructor
   * @private
   * @param options
   * @author wyj 14.12.16
   */
  constructor: function (options) {
    this.options = options || {};
    this._re_dup = {};
    this._re_selector = {};
    this._attr_list = {};
    this._directives_ = [];
    this._ready_component_ = false;
    if (this.init && BbaseEst.typeOf(this.init) !== 'function') {
      this._initialize(this.init);
    }
    BbaseBackbone.View.apply(this, arguments);
  },
  /**
   * 调用父类方法
   *
   * @method [构造] - _super
   * @return {[type]} [description]
   */
  _super: function (type, args) {
    if (BbaseEst.typeOf(type) === 'object') {
      this._initialize(type);
    } else if (BbaseEst.isEmpty(type)) {
      return BbaseApp.getView(this.viewId);
    } else {
      switch (type) {
        case 'data':
          return BbaseApp.getView(this.viewId).model.toJSON();
        case 'view':
          return BbaseApp.getView(this.viewId);
        case 'model':
          return BbaseApp.getView(this.viewId).model;
        case 'options':
          if (BbaseApp.getView(this.viewId)) {
            return BbaseApp.getView(this.viewId)._options;
          } else {
            return this._options.data;
          }
          break;
        default:
          if (BbaseApp.getView(this.viewId) && BbaseApp.getView(this.viewId)[type]) {
            if (BbaseApp.getView(this.viewId)[type].timer) {
              clearTimeout(BbaseApp.getView(this.viewId)[type].timer);
            }
            BbaseApp.getView(this.viewId)[type].timer = setTimeout(this._bind(function () {
              BbaseApp.getView(this.viewId)[type](args);
              BbaseApp.getView(this.viewId)[type].timer = null;
            }), 20);
          } else if (this[type]) {
            this[type](args);
          }
          return this;
      }
    }
  },
  /**
   * 初始化
   *
   * @method [初始化] - initialize
   * @private
   * @return {[type]} [description]
   */
  initialize: function () {
    this._super('_initialize');
  },

  /**
   * 继承
   *
   * @method [继承] - _extend
   * @private
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  _extend: function (options) {
    BbaseEst.extend(this.options, options);
  },
  /**
   * 获取视图
   *
   * @method [视图] - _view
   * @param  {[type]} viewId [description]
   * @return {[type]}        [description]
   */
  _view: function (viewId) {
    return BbaseApp.getView(viewId + this.cid);
  },
  /**
   * 添加视图区域
   *
   * @method [视图] - _region
   * @param  {[type]} name     [description]
   * @param  {[type]} instance [description]
   * @param  {[type]} options  [description]
   * @return {[type]}          [description]
   */
  _region: function (name, instance, options) {
    if (arguments.length === 1) {
      return this._view(name);
    }
    BbaseApp.addRegion(name + this.cid, instance, options);
  },
  /**
   * service服务
   *
   * @method _service
   * @return {[type]} [description]
   */
  _service: function (type, options) {
    return Service[type](options);
  },
  /**
   * 导航
   *
   * @method [导航] - _navigate ( 导航 )
   * @param name
   * @author wyj 15.1.13
   */
  _navigate: function (name, options) {
    options = options || true;
    typeof Backbone === 'undefined' ? BbaseBackbone.history.navigate(name, options)
    : Backbone.history.navigate(name, options);
  },
  /**
   *  watch system
   *
   * +------------+    .
   * | _watchBind |    .
   * +------------+    .
   *       |           .
   *       v           .
   * +------------+    .
   * |  bb-watch  |    .
   * |  bb-render |    .
   * |  bb-chnage |    .
   * +------------+    .                         +-----------+
   *       |           .            +-----------+|  observer |
   *       |           .            |            |  _set     |                      +--------------------+
   * +-----|------+    .            v            +-----------+                      | html,value,attr    |
   * |     |      |    .    +--------------+                     +------------+     | show,checked,event |
   * |     +-----------.--->|   bindName   |                     | directive  |<---+| ...                |
   * |            |    .    |              |     +------------+  |            |     |                    |
   * |   _watch   |    .    | selector:dir |<---+|_viewReplace|<-|------------|     +--------------------+
   * |            |    .    |              |     |  bb-render |  | selector   |
   * |            |    .    |   callback   |     +------------+  |            |
   * |     +-----------.--->|              |                     +------------+
   * |     |      |    .    +--------------+
   * +-----|------+    .            ^            +------------+
   *       |           .            |            |  callback  |
   *       +           .            +-----------+|  bb-change |
   * +-------------+   .                         +------------+
   * |   _bbBind   |   .
   * |-------------|   .
   * |   bb-model  |   .
   * |   bb-show   |   .
   * |   bb-checked|   .
   * |   bb-event  |   .
   * |   bb-...    |   .
   * +-------------+   .
   */

  /**
   * 单个模型字段绑定
   *
   * @method [绑定] - _singeBind
   * @param selector
   * @param model
   * @author wyj 15.7.20
   * @example
   * @private
   * @author wyj 15.7.20
   * @example
   *    this._singleBind('#model-name', this.model);
   */
  _singleBind: function (parent, selector, model, changeFn) {
    var _self = this;

    $(selector, parent || this.$el).each(function () {

      var bbModels = [];
      var bbModel = $(this).attr('bb-model');
      var bindType = $(this).attr('data-bind-type') || 'change';

      if (!BbaseEst.isEmpty(bbModel)) {
        bbModels = bbModel.split(':');
        bindType = bbModels.length > 1 ? bbModels[1] : 'change';
      }
      $(this).off(bindType).on(bindType, function (e) {
        var val, pass, modelId, name, bbMod;

        if (e.keyCode === 37 || e.keyCode === 39 ||
          e.keyCode === 38 || e.keyCode === 40) {
          return false;
        }
        modelId = $(this).attr('id');
        bbMod = $(this).attr('bb-model');
        if (!BbaseEst.isEmpty(bbMod)) bbMod = bbMod.split(':')[0];

        if (bbMod || (modelId && modelId.indexOf('model') !== -1)) {
          switch (this.type) {
            case 'radio':
              val = $(this).is(":checked") ? $(this).val() : pass = true;
              break;
            case 'checkbox':
              val = $(this).is(':checked') ? (BbaseEst.isEmpty($(this).attr('true-value')) ? true :
                  $(this).attr('true-value')) :
                (BbaseEst.isEmpty($(this).attr('false-value')) ? false : $(this).attr('false-value'));
              break;
            default:
              val = $(this).val();
              break;
          }
          if (!pass) {
            name = bbMod || modelId.replace(/^model\d?-(.+)$/g, "$1");
            _self._set(name, val);
            if (changeFn) changeFn.call(_self, name, e);
            //TODO 新版将移除update回调
            if (_self.update) _self.update.call(_self, name);
          }
        }
      });
    });
  },
  /**
   * 视图到模型类的绑定
   *
   * @method [绑定] - _modelBind
   * @private
   * @author wyj 14.12.25
   * @example
   *        this._modelBind();
   */
  _modelBind: function (parent, selector, changeFn) {
    var _self = this;
    if (selector) this._singleBind(parent, selector, this.model, changeFn);
    else this.$("input, textarea, select").each(function () {
      _self._singleBind(null, $(this), _self.model, changeFn);
    });
  },
  /**
   * 获取模板
   *
   * @method _getCompileTemp
   * @param  {string} attrName   属性名称
   * @param  {jquery} node       作用元素
   * @param  {string} selector   选择符
   * @param  {string} ngAttrName 属性名称(针对IE浏览器)
   * @return {Handlebar}         模板
   */
  _getCompileTemp: function (dirName, node, selector, ngDirName, fieldName) {
    var hbsStr = null,
      compileStr = '';

    switch (dirName) {
      case 'html':
        compileStr = this._parseHbs(node.html());
        return { compile: BbaseHandlebars.compile(compileStr), compileStr: compileStr };
      case 'checked':
        compileStr = '{{' + /bb-checked=\"(.*?)\"\s?/img.exec(selector)[1] + '}}';
        return { compile: BbaseEst.compile(compileStr), compileStr: compileStr };
      case 'show':
        hbsStr = node.attr('bb-show').split(':');
        if (hbsStr.length > 1) hbsStr = hbsStr[1];
        else hbsStr = hbsStr[0];
        compileStr = '{{' + hbsStr + '}}';
        return { compile: BbaseEst.compile(compileStr), compileStr: compileStr };
      default:
        if (BbaseApp.getDirective(dirName)) {
          compileStr = node.attr('bb-' + ngDirName);
          compileStr = compileStr || fieldName;
          return { compile: BbaseApp.getDirective(dirName).compile ? BbaseApp.getDirective(dirName).compile : compileStr.indexOf('{{') > -1 ? BbaseHandlebars.compile(compileStr) : BbaseEst.compile('{{' + compileStr + '}}'), compileStr: selector };
        } else {
          hbsStr = this._parseHbs(node.attr(ngDirName));
          if (!hbsStr && node.is('textarea')) hbsStr = this._parseHbs(node.html());
          compileStr = (BbaseEst.isEmpty(hbsStr) || hbsStr.indexOf('{{') === -1) ? '{{' + fieldName + '}}' : hbsStr;
          return {
            compile: BbaseHandlebars.compile(compileStr),
            compileStr: compileStr,
            directive: ngDirName === 'value' ? selector.indexOf('bb-model') > -1 ? 'model' : ngDirName : ngDirName
          };
        }
    }
  },
  /**
   * 元素替换
   *
   * @method [替换] - _replaceNode
   * @param  {string} attrName   属性名称
   * @param  {jquery} node       元素
   * @param  {string} result     模板结果字符串
   * @param  {string} selector   选择符
   * @param  {string} ngAttrName 属性名称(针对IE)
   */
  _replaceNode: function (attrName, node, result, selector, ngAttrName) {
    switch (attrName) {
      case 'value':
        if (node.is(':checkbox')) {
          if (result === 'false' || result === '0' || BbaseEst.isEmpty(result)) node.prop('checked', false);
          else node.prop('checked', true);
        }
        node.val(result);
        break;
      case 'html':
        node.html(result);
        break;
      case 'show':
        if ((result === 'false' || result === '0' || BbaseEst.isEmpty(result))) node.hide();
        else node.show();
        break;
      case 'checked':
        //node.prop('checked', this._get(/bb-checked=\"(.*?)\"\s?/img.exec(selector)[1]));
        if (this._get(/bb-checked=\"(.*?)\"\s?/img.exec(selector)[1])) {
          node.prop('checked', true);
        } else {
          node.prop('checked', false);
        }
        break;
      default:
        if (BbaseApp.getDirective(attrName) && BbaseApp.getDirective(attrName).update) {
          BbaseApp.getDirective(attrName).update.apply(this, [attrName, node, selector, result]);
        } else {
          node.attr(ngAttrName, result);
        }
    }
  },
  /**
   * 执行替换操作
   *
   * @method _handleReplace
   * @param  {object} item       缓存的替换对象集
   * @param  {object} model      模型类
   * @param  {string} selector   选择符
   * @param  {string} attrName   属性名称
   * @param  {string} ngAttrName 属性名称(针对IE)
   */
  _handleReplace: function (item, model, selector, attrName, ngAttrName, name) {
    var _result = '';
    /*if (this.collection && !BbaseEst.equal(model._previousAttributes.models, this.collection.models)) {
      model._previousAttributes.models = BbaseEst.clone(this.collection.models);
      BbaseEst.trigger(this.cid + 'models');
    }*/
    _result = item.compile(model.attributes);

    // 比对数据，若无改变则返回
    if (!(!BbaseEst.isEmpty(item.directive) && item.directive === 'model') &&
      item.result === _result) {
      return;
    }
    // 缓存node
    if (!item.node) {
      item.node = this.$(selector).eq(item.index);
      if (item.node.size() === 0) {
        // 针对bb-src
        item.node = this.$('.directive_' + BbaseEst.hash(selector)).eq(item.index);
        //console.error("error: call wyj for more info");
      }
    }
    // 赋值
    this._replaceNode(attrName, item.node, _result, selector, ngAttrName);
    // 缓存结果
    item.result = _result;
  },
  /**
   * 获取属性列表
   * .render:html:style
   *
   * @method _getAttrList
   * @param  {object} item 缓存的模板对象
   * @return {array}       属性列表
   */
  _getAttrList: function (item) {
    var tempList = [],
      list = [],
      t_list = [];

    var hash = BbaseEst.hash(item);
    if (hash in this._attr_list) return this._attr_list[hash];

    if (item.indexOf(']:') > -1) {
      tempList = item.split(']:');
      list = BbaseEst.map(tempList, function (_item, index) {
        if (index !== tempList.length - 1) {
          return _item + ']';
        } else {
          return _item;
        }
      });
      t_list = list[1].split(':');
      if (t_list.length > 1) {
        list.pop();
        list = list.concat(t_list);
      }
    } else if (item.indexOf('://') > -1) {
      list = [item];
    } else {
      list = item.split(':');
    }
    this._attr_list[hash] = list;
    return list;
  },
  /**
   * [bb-watch="signContent.icon:class:html,signContent.iconType:style"]:class:html,
   * signContent.iconType:style,[bb-watch="signContent.icon:src,signContent.iconType:style"]:src
   *
   * @method _getSelectorSplit
   * @param  {[type]} selector [description]
   * @return {[type]}          [description]
   */
  _getSelectorSplit: function (selector) {
    var hash = BbaseEst.hash(selector);
    if (hash in this._re_selector) return this._re_selector[hash];

    var list = selector.split(',');
    var list2 = [];
    var temp = '';

    if (selector.indexOf('[bb-watch=') > -1) {
      BbaseEst.each(list, function (item) {
        if (item.indexOf('[bb-') > -1 && item.indexOf(']') === -1) {
          temp = item;
        } else if (item.indexOf(']') > -1 && item.indexOf('[bb-') === -1) {
          temp += (',' + item);
          list2.push(temp);
        } else if (item.indexOf('[bb-') > -1 && item.indexOf(']') > -1) {
          list2.push(item);
        } else if (item.indexOf('[bb-') === -1 && item.indexOf(']') === -1) {
          temp += (',' + item);
        }
      });
    } else {
      list2 = list;
    }

    this._re_selector[hash] = list2;
    return list2;
  },
  /**
   * 视图重新渲染
   *
   * @method [渲染] - _viewReplace
   * @param selector
   * @param model
   * @author wyj 15.7.21
   * @example
   *      this._viewReplace('#model-name', this.model);
   */
  _viewReplace: function (selector, model, cbs, name) {
    try {
      if (!this._re_dup) this._re_dup = {};
      BbaseEst.each(this._getSelectorSplit(selector), this._bind(function (item) {
        var list = [],
          _$template = '',
          _result = '',
          _hash = '',
          node = '',
          ngAttrName = '',
          attrName = '';

        if (!BbaseEst.isEmpty(item)) {
          _hash = BbaseEst.hash(item);

          // 获取属性列表
          list = this._getAttrList(item);

          if (list.length > 1) {

            for (var i = 1; i < list.length; i++) {
              _hash = BbaseEst.hash(list[0] + list[i]);
              attrName = list[i];
              if (BbaseEst.msie()) {
                ngAttrName = 'ng-' + list[i];
                if (!this._re_dup[_hash])
                  _$template = this._options.template.replace(new RegExp('\\s' + attrName +
                    '=', "img"), ' ' + ngAttrName + '=');
              } else {
                ngAttrName = attrName;
                _$template = this.$template;
              }
              // 缓存模板
              if (!this._re_dup[_hash]) {

                this._re_dup[_hash] = [];
                node = $(_$template).find(list[0]);
                if (node.size() === 0) {
                  node = this.$el.find(list[0]);
                }

                $.each(node, $.proxy(function (index, node) {
                  this._re_dup[_hash].push(BbaseEst.extend(this._getCompileTemp(attrName, $(node), list[0], ngAttrName, name), {
                    hash: _hash + '' + index,
                    index: index
                  }));
                }, this));
              }
              BbaseEst.each(this._re_dup[_hash], function (item) {
                this._handleReplace(item, model, list[0], attrName, ngAttrName, name);
              }, this);
            }

          } else {
            if (BbaseEst.msie()) {
              if (!this['h_temp_' + _hash])
                _$template = this.$template.replace(new RegExp('\\sstyle=', "img"), ' ng-style=');
              //console.log(item);
              this['h_temp_' + _hash] = this['h_temp_' + _hash] ||
                BbaseHandlebars.compile($(_$template).find(item).wrapAll('<div>').parent().html().replace(/ng-style/img, 'style'));
            } else {
              this['h_temp_' + _hash] = this['h_temp_' + _hash] ||
                BbaseHandlebars.compile($(this.$template).find(item).wrapAll('<div>').parent().html());
            }
            _result = this['h_temp_' + _hash](model.attributes);
            if (this['h_temp_r_' + _hash] === _result) {
              return;
            }
            this.$(item).replaceWith(_result);
            this['h_temp_r_' + _hash] = _result;
          }
        }
      }));

      if (cbs) {
        BbaseEst.each(cbs, function (cb) {
          cb.call(this, name);
        }, this);
      }

    } catch (e) {
      debug('Error -> _viewReplace -> ' + e + 'selector:' + selector, {
        e: e
      });
    }
  },
  /**
   * 双向绑定
   *
   * @method [绑定] - _watch
   * @param name
   * @param selector
   * @param callback
   * @author wyj 15.7.20
   * @example
   *      <input id="model-link" data-bind-type="keyup" type="text"  value="{{link}}">
   *      // data-bind-type="keydown" 绑定方式，默认为change
   *      this._watch(['#model-name', '#model-color'], '#model-name,.model-name', function(){
   *
   *      });
   */
  _watch: function (name, selector, callback) {
    var _self = this,
      triggerName,
      cb_hash = null,
      temp_obj = {},
      list = [];

    if (!this.watchFields) this.watchFields = {};
    if (!this.cbMap) this.cbMap = {};

    if (BbaseEst.typeOf(name) === 'array') {
      list = name;
    } else {
      list.push(name);
    }

    BbaseEst.each(list, function (item) {
      var modelId = item.replace(/^#?model\d?-(.+)$/g, "$1");
      /* debugger
       if (typeof this._get(modelId) === 'undefined'){
         this._setDefault(modelId, '');
       }*/
      if (callback) {
        this.cbMap[modelId] = this.cbMap[modelId] || [];

        if (BbaseEst.typeOf(callback) === 'string') {

          cb_hash = BbaseEst.hash(modelId + callback);
          if (!(cb_hash in this.cbMap)) {
            this.cbMap[cb_hash] = true;
            this.cbMap[modelId].push(this[callback]);
          }

        } else {
          this.cbMap[modelId].push(callback);
        }
      }
      if (modelId in this.watchFields) {
        BbaseEst.each(this._getSelectorSplit(selector), function (item) {

          if (this.watchFields[modelId].indexOf(item) === -1) {
            this.watchFields[modelId] = this.watchFields[modelId] + ',' + item;
          }
        }, this);
      } else {
        this.watchFields[modelId] = selector;
      }

      selector = this.watchFields[modelId];
      triggerName = _self.cid + modelId;

      //if (!_self._options.modelBind || item.indexOf('model-') > -1) _self._modelBind(item);
      if (triggerName in temp_obj) return;

      BbaseEst.off(temp_obj[triggerName] = triggerName).on(triggerName, function (triggerName, name) {
        _self._viewReplace(selector, _self.model, _self.cbMap[modelId], modelId);
        if (_self.update) _self.update.call(_self, modelId);
      });

      _self.model.off('change:' + (temp_obj[modelId] = modelId.split('.')[0]))
        .on('change:' + temp_obj[modelId],
          function () {
            _self._viewReplace(selector, _self.model, _self.cbMap[modelId], modelId);
            if (_self.update) _self.update.call(_self, modelId);
          });

    }, this);
  },
  /**
   * 绑定模型类
   * @method [绑定] - _watchBind
   */
  _watchBind: function (template) {
    var list = [],
      models = [];

    this.cbMap = {};
    this.watchFields = {};

    if (BbaseEst.typeOf(template) === 'string') {
      models = template.match(new RegExp('(bb-watch=\\"(.+?)\"(\\s*)|bb-change=\\"(.+?)\"(\\s*)|bb-model=\\"(.+?)\"(\\s*))(bb-render=\\"(.+?)\\"\\s*)?(bb-change=\\"(.+?)\\"\\s*)?', 'img'));
      BbaseEst.each(models, this._bind(function (item) {
        var watch = '',
          model = '',
          change = '',
          w_list = [],
          watch_render = {},
          w_render = '',
          render = '';

        watch = /bb-watch=\"(.*?)\"\s?/img.exec(item) || '';
        render = /bb-render=\"(.*?)\"\s?/img.exec(item) || '';
        change = /bb-change=\"(.*?)\"\s?/img.exec(item) || '';
        model = /bb-model=\"(.*?)\"\s?/img.exec(item) || '';

        if (BbaseEst.isEmpty(watch) && BbaseEst.isEmpty(model)) return;
        if (watch.length > 1) {

          if (watch[1].indexOf(':') > -1) {
            watch_render = this._getWatchRender(watch, render);
            watch = watch_render.watch;
            render = watch_render.render;

          } else {
            w_list = watch[1].split(':');
            w_render = '[bb-watch="' + watch[1] + '"]' + watch[1].substring(watch[1].indexOf(':'), watch[1].length);

            if (w_list.length > 1) {
              if (render.length < 1) {
                render = ['', w_render];
              } else {
                render[1] += (',' + w_render);
              }
            }
            watch[1] = w_list[0];
          }
        }
        list.push({
          watch: watch.length > 1 ? watch[1] : model[1].split(':')[0],
          render: render.length > 1 ? render[1] : '',
          change:  change.length > 1 ? BbaseEst.trim(change[1].substring(0,
            change[1].indexOf('(') === -1 ? change[1].length : change[1].indexOf('('))) : null
        });
      }));
    }
    BbaseEst.each(list, this._bind(function (item) {
      this._watch(item.watch.split(','), item.render, BbaseEst.isEmpty(item.change) ? null : item.change);
    }));
    if (this.onWatch) {
      this.onWatch.call(this, arguments);
    }
  },
  /**
   * bb-watch="args.color:style,args.color1:html"
   *
   * @method _getWatchRender
   * @param  {[type]} watch  [description]
   * @param  {[type]} render [description]
   * @return {[type]}        [description]
   */
  _getWatchRender: function (watch, render) {
    var _watch = '';
    var _render = '';
    var _watchs = watch[1].split(',');

    BbaseEst.each(_watchs, function (item) {
      var w_list = [];

      w_list = item.split(':');
      _render += ((BbaseEst.isEmpty(_render) ? '' : ',') + '[bb-watch="' + watch[1] + '"]' +
        item.substring(item.indexOf(':'), item.length));
      _watch += ((BbaseEst.isEmpty(_watch) ? '' : ',') + w_list[0]);
    });

    watch[1] = _watch;
    if (render.length < 1) {
      render = ['', _render];
    } else {
      render[1] += (',' + _render);
    }

    return {
      watch: watch,
      render: render
    };
  },
  /**
   * 绑定模型类与事件
   *
   * @method [绑定] - _bbBind
   * @param  {[type]} template [description]
   * @param  {[type]} parent   [description]
   * @return {[type]}          [description]
   */
  _bbBind: function (template, parent) {
    var matchs = [],
      patt,
      hash,
      map = {},
      result;
    this.bbList = [];

    if (BbaseEst.typeOf(template) === 'string') {
      patt = new RegExp('\\bbb-([\\w\\.]+)=\\"(.+?)\\"\\s?', 'img');

      while ((result = patt.exec(template)) !== null) {
        this.bbList.push({
          name: result[1],
          value: result[2]
        });
      }
      BbaseEst.each(this.bbList, this._bind(function (item) {

        hash = BbaseEst.hash(item.name + item.value);
        if (hash in map) return;
        map[hash] = item;

        switch (item.name) {
          case 'watch':
            break;
          case 'render':
            break;
          case 'change':
            break;
          case 'show':
            var sep = item.value.split(':');
            var field = this._getField(item.value);
            this._watch([sep.length > 1 ? sep[0] : field], '[bb-show="' + item.value + '"]:show');
            if (!this._getBoolean(BbaseEst.compile('{{' + item.value + '}}', this.model.attributes))) {
              this.$('[bb-show="' + item.value + '"]').hide();
            }
            //BbaseEst.trigger(this.cid + field);
            break;
          case 'model':
            this._modelBind(parent, '[bb-model="' + item.value + '"]');
            this._watch([item.value.split(':')[0]], '[bb-model="' + item.value + '"]:value');
            this.$('[bb-model="' + item.value + '"]').val(this._get(item.value.split(':')[0]));
            break;
          case 'checked':
            var field = this._getField(item.value);
            this._watch([field], '[bb-checked="' + item.value + '"]:checked');
            this.$('[bb-checked="' + item.value + '"]').prop('checked', this._getBoolean(item.value));
            break;
          default:
            if (BbaseApp.getDirective(item.name)) {
              BbaseEst.extend(BbaseApp.getDirective(item.name), BbaseApp.getDirective(item.name).bind.call(this,
                item.value, '[bb-' + item.name + '="' + item.value + '"]'));
              this._directives_.push({ name: item.name, object: BbaseApp.getDirective(item.name) });
            } else {
              this._handleEvents(parent, item.name, item.value);
            }
        }
      }));
    }
    this._afterTransition();
  },
  /**
   * 处理事件与参数
   *
   * @method _handleEvents
   * @param  {node}   parent 父元素
   * @param  {string} name  字段名称
   * @param  {string} value 字符串
   * @return {void}
   */
  _handleEvents: function (parent, name, value) {
    var colonRe = /:([^:\$\s\(\)]*)/img,
      dollarRe = /\$([^:\$\s\(\)]*)/img,
      bracketRe = /\(([^:\$]*)\)/img,
      nameRe = /(.[^:\$\s\(\)]*).*/img;

    var args = [],
      fn = nameRe.exec(value)[1],
      colons = BbaseEst.map(value.match(colonRe) || [], function (str) {
        return str.replace(':', '');
      }),
      dollars = BbaseEst.map(value.match(dollarRe) || [], function (str) {
        return str.replace('$', '');
      });

    var brackets = value.match(bracketRe);
    if (brackets) {
      BbaseEst.each(brackets[0].split(','), this._bind(function (item) {
        var name = BbaseEst.trim(item.replace(/[\(|\)]/img, ''));
        if (!BbaseEst.isEmpty(name)) {
          if (name.indexOf('\'') > -1) {
            dollars.push(name.replace(/'/img, ''));
          } else if (/^[\d\.]+$/img.test(name)) {
            dollars.push(parseFloat(name));
          } else {
            dollars.push(this._get(name));
          }
        }
      }));
    }

    if (this[fn]) parent.find('[bb-' + name + '="' + value + '"]').off(name).on(name,
      this._bind(function (e) {
        if (colons.length > 0) {
          switch (colons[0]) {
            case 'enter':
              if (e.keyCode === 13) {
                this[fn].apply(this, dollars.concat([e]));
              }
              break;
            default:
              if (e.keyCode === parseInt(colons[0])) {
                this[fn].apply(this, dollars.concat([e]));
              }
          }
        } else {
          this[fn].apply(this, dollars.concat([e]));
        }
      }));
  },


  /**
   * 字段序列化成字符串
   *
   * @method [模型] - _stringifyJSON ( 字段序列化成字符串 )
   * @param array
   * @author wyj 15.1.29
   * @example
   *      this._stringify(['invite', 'message']);
   */
  _stringifyJSON: function (array) {
    var keys, result;
    if (!JSON.stringify) alert(CONST.LANG.JSON_TIP);

    BbaseEst.each(array, function (item) {
      keys = item.split('.');
      if (keys.length > 1) {

        result = BbaseEst.getValue(this.model.attributes, item);
        BbaseEst.setValue(this.model.attributes, item, JSON.stringify(result));
      } else {
        BbaseEst.setValue(this.model.attributes, item, JSON.stringify(this.model.get(item)));
      }
    }, this);
  },
  /**
   * 反序列化字符串
   *
   * @method [模型] - _parseJSON ( 反序列化字符串 )
   * @param array
   */
  _parseJSON: function (array) {
    var keys, result;
    var parse = JSON.parse || $.parseJSON;

    if (!parse) alert(CONST.LANG.JSON_TIP);

    BbaseEst.each(array, function (item) {
      keys = item.split('.');
      if (keys.length > 1) {
        result = BbaseEst.getValue(this.model.attributes, item);
        if (BbaseEst.typeOf(result) === 'string') {
          BbaseEst.setValue(this.model.attributes, item, parse(result));
        }
      } else {
        if (BbaseEst.typeOf(this.model.get(item)) === 'string') {
          if (!BbaseEst.isEmpty(this._get(item))) this._set(item, parse(this.model.get(item)));
        }
      }
    }, this);
  },
  /**
   * 设置参数
   *
   * @method [参数] - _setOption ( 设置参数 )
   * @param obj
   * @return {BbaseList}
   * @author wyj 14.12.12
   * @example
   *      BbaseApp.getView('categoryList')._setOption({
   *          sortField: 'orderList'
   *      })._moveUp(this.model);
   */
  _setOption: function (obj) {
    BbaseEst.extend(this._options, obj);
    return this;
  },
  /**
   * 回车事件
   *
   * @method [private] - _initEnterEvent
   * @private
   * @author wyj 14.12.10
   */
  _initEnterEvent: function (options) {
    if (options.speed > 1 && options.enter) {
      this.$('input').keyup($.proxy(function (e) {
        if (e.keyCode === CONST.ENTER_KEY) {
          this.$(options.enter).click();
        }
      }, this));
    }
  },
  /**
   * 获取配置参数
   *
   * @method [参数] - _getOption ( 获取配置参数 )
   * @param name
   * @return {*}
   * @author wyj 15.1.29
   */
  _getOption: function (name) {
    return this._options[name];
  },
  /**
   * 获取模板字符串
   *
   * @method _getTpl
   * @return {[type]} [description]
   */
  _getTpl: function () {
    return '<div>' + this._options.template + '</div>';
  },
  /**
   * 获取model值
   *
   * @method [模型] - _getValue ( 获取model值 )
   * @param path
   * @author wyj 15.1.30
   * @example
   *      this._getValue('tip.name');
   */
  _getValue: function (path) {
    return BbaseEst.getValue(this.model.attributes, path);
  },
  /**
   * 获取模型类的值
   *
   * @method [模型] - _get
   * @param  {string} path [description]
   * @return {*}      [description]
   */
  _get: function (path) {
    return this._getValue.call(this, path);
  },
  /**
   * 获取整数类型的值
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
   * 获取model值,如果不存在，则设初始值
   *
   * @method [模型] - _getDefault ( 获取model值 )
   * @param path
   * @author wyj 15.1.30
   * @example
   *      this._getDefault('tip.name', 'd');
   */
  _getDefault: function (path, value) {
    this._setDefault(path, value);
    return BbaseEst.getValue(this.model.attributes, path);
  },
  /**
   * 设置初始值
   *
   * @method [模型] - _setDefault ( 设置初始值 )
   * @param path
   * @author wyj 15.1.30
   * @example
   *      this._setDefault('tip.name', 'd');
   */
  _setDefault: function (path, value) {
    var result = BbaseEst.getValue(this.model.attributes, path);
    if (BbaseEst.typeOf(result) === 'undefined' || BbaseEst.typeOf(result) === 'null') {
      BbaseEst.setValue(this.model.attributes, path, value);
    }
  },
  /**
   * 模型类初始化
   * @method [模型] - _initDefault
   * @return {[type]} [description]
   */
  _initDefault: function () {
    if (this.init && BbaseEst.typeOf(this.init) === 'function') {
      this.__def_vals_ = this.init.call(this, this._attributes) || {};
      BbaseEst.each(this.__def_vals_, this._bind(function (value, key) {
        this._setDefault(key, value);
      }));
    }
  },
  /**
   * 重置表单
   *
   * @method [表单] - _reset ( 重置表单 )
   * @author wyj 14.11.18
   */
  _reset: function (data) {
    this.model.attributes = {};
    data = BbaseEst.extend(BbaseEst.extend(this.model.defaults || {}, this.__def_vals_), data);
    this._set(this._getPath(data));
  },
  /**
   * 获取对象路径
   *
   * @method _getPath
   * @return {[type]} [description]
   */
  _getPath: function (data, pre) {
    var paths = [];
    var temp = data;
    if (!pre) { pre = ''; }

    if (temp.CONST) delete temp.CONST;
    if (temp._options) delete temp._options;
    if (temp._data) delete temp._data;
    if (temp._isAdd) delete temp._isAdd;
    if (temp.models) delete temp.models;
    if (temp.children) delete temp.children;

    while (BbaseEst.keys(temp).length > 0) {
      data = temp;
      BbaseEst.each(data, function (value, key) {
        if (BbaseEst.typeOf(value) === 'object') {
          BbaseEst.each(value, function (v, k) {
            temp[key + '.' + k] = v;
          });
        } else {
          paths.push({
            path: key,
            value: value
          });
        }
        delete temp[key];
      });
    }
    BbaseEst.each(paths, this._bind(function (item) {
      temp[pre + item.path] = item.value;
    }));

    return temp;
  },
  /**
   * 获取监听字段
   * 1. {{pipe 'args.logo.length'}}
   * 2. bb-show="models.length > 0"
   * 3. {{PIC pic_path 120}}
   * 4. {{profileImageUrl}}
   *
   * @method _getField
   * @param  {string} value [description]
   * @return {string}       [description]
   */
  _getField: function (value) {
    var str = "",
      list = [],
      result = null;

    str = value.replace(/^[!|(]*(\w+(?:\.\w+)*)(?:[\s|\.|>|<|!|:=])?.*$/img, '$1');
    list = str.replace(/({{|}})/img, '').split(/\s/);

    BbaseEst.each(list, this._bind(function (item) {
      result = this._loopField(item);
      if (result !== null) {
        return false;
      }
    }));

    return result ? result : list[0];
  },
  /**
   * 递归获取模型类可用字段

   * @method _loopField
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  _loopField: function (value) {
    var list = [];

    if (BbaseEst.typeOf(this._get(value)) === 'undefined') {
      list = value.split('.');
      if (list.length === 1) {
        return null;
      }
      list.pop();
      return this._loopField(list.join('.'));
    } else {
      return value;
    }
  },
  /**
   * 获取boolean值，  比如字符串 'true' '1' 'str' 均为true, 'false', '0', '' 均为false
   *
   * @method _getBoolean
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  _getBoolean: function (value) {
    if (BbaseEst.isEmpty(value)){return false;};
    var bool =  BbaseEst.compile('{{' + value + '}}', this.model.attributes);

    if (bool === 'true' || bool === '1') {
      bool = true;
    } else if (bool === 'false' || bool === '0' || bool === '') {
      bool = false;
    } else if (BbaseEst.typeOf(bool) === 'string' && BbaseEst.isEmpty(this._get(bool))) {
      bool = true;
    } else if (BbaseEst.typeOf(this._get(bool)) === 'boolean') {
      bool = this._get(value);
    }
    return bool;
  },
  /**
   * 判断字符串是不是boolean类型
   *
   * @method _isBoolean
   * @param  {[type]}  str [description]
   * @return {Boolean}     [description]
   */
  _isBoolean: function (str) {
    return (str === 'true' || str === 'false');
  },
  /**
   * 获取对象，如："{name: 'aaa'}" => '{"name": "aaa"}' => {name: "aaa"}
   * "{moduleId:'AdminLangconfigList',title:'配置中文语言设置',data: {moduleId:id,lanId:1,key:'value'},cover:true,width:800,height:600}"
   *
   * @method _getObject
   * @param  {string} value 字符串
   * @return {object}
   */
  _getObject: function (str, ignore) {

    var result = '',
      object = { fields: {} },
      list = [],
      temp = '',
      items_o = BbaseEst.trim(str).substring(1, str.length - 1).split(',');

    BbaseEst.each(items_o, function (item) {
      if (BbaseEst.typeOf(item) === 'string' && item.indexOf('{') > -1) {
        temp += (item + ',');
      } else if (BbaseEst.typeOf(item) === 'string' && item.indexOf('}') > -1) {
        temp += item;
        list.push(temp);
        temp = '';
      } else if (temp.length > 0) {
        temp += (item + ',');
      } else {
        list.push(item);
      }
    });

    BbaseEst.each(list, function (item) {
      var list = item.split(':');
      var r = '';
      var fnInfo = {};
      list[0] = BbaseEst.trim(list[0]);
      list[1] = BbaseEst.trim(list[1]);
      if (ignore){
        if (BbaseEst.typeOf('ignore') === 'array'){
          var dx = BbaseEst.findIndex(ignore, function(a){
            return a === list[0];
          });
          if (dx !== -1){
            object[list[0]] = list[1];
            return true;
          }
        } else if (BbaseEst.typeOf('ignore') === 'string'){
          if (ignore === list[0]){
            object[list[0]] = list[1];
            return true;
          }
        }
      }
      if (BbaseEst.typeOf(list[1]) === 'string' && list[1].indexOf('{') > -1) {
        var key = list.shift();
        object[key] = this._getObject(list.join(':'));
      } else if (list[1].indexOf('\'') > -1) {
        object[list[0]] = BbaseEst.trim(list[1].replace(/'/img, ''));
      } else if (list[1] in this.model.attributes) {
        object[list[0]] = this._get(list[1]);
        object.fields[list[0]] = list[1];
      } else if (this[list[1].replace(/(\(.*\))/img, '')]) {
        if (list[1].indexOf('(') > -1) {
          fnInfo = this._getFunction(list[1], this.model.attributes);
          object[list[0]] = this[fnInfo.key].apply(this, fnInfo.args);
        } else {
          object[list[0]] = this[list[1]];
        }

      } else if (this._isBoolean(list[1])) {
        object[list[0]] = this._getBoolean(list[1]);
      } else {
        object[list[0]] = BbaseEst.trim(BbaseEst.compile('{{' + list[1] + '}}', this.model.attributes));
      }
    }, this);

    return object;
  },
  /**
   * 获取方法与参数
   *
   * @method _getFunction
   * @param  {string} str 字符串
   * @param  {object} obj 模型类
   * @return {object}
   */
  _getFunction: function (str, obj) {
    var bracketRe = /\(([^:\$]*)\)/img,
      key = null,
      helper = BbaseEst.trim(str.replace(/\(.*\)/g, ''));
    args = [];

    var brackets = str.match(bracketRe);
    if (brackets) {
      BbaseEst.each(brackets[0].split(','), function (item) {
        var arg = BbaseEst.trim(item.split('.')[0].replace(/[\(|\)]/img, ''));
        if (!key) {
          key = arg;
        }
        if (!arg) return;
        if (arg.indexOf('\'') > -1) {
          args.push(arg.replace(/'/img, ''));
        } else if (/^[\d\.]+$/img.test(arg)) {
          args.push(parseFloat(arg));
        } else if (arg in obj) {
          args.push(BbaseEst.getValue(obj, arg));
        } else if (this[arg]) {
          args.push(this[arg].call(this));
        } else {
          args.push('');
        }
      }, this);
    }

    return {
      key: helper,
      args: args
    };
  },
  /**
   * 设置model值
   *
   * @method [模型] - _setValue ( 设置model值 )
   * @param path
   * @param val
   * @author wyj 15.1.30
   * @example
   *      this._setValue('tip.name', 'aaa');
   */
  _setValue: function (path, val) {
    // just for trigger
    if (!BbaseEst.equal(BbaseEst.getValue(this.model.attributes, path), val)) {
      BbaseEst.setValue(this.model.attributes, path, val);
      BbaseEst.trigger(this.cid + path, path);
      this._m_change_ = true;
    }
  },
  /**
   * 赋值模型类
   *
   * @method [模型] - _set
   * @param {string/object} path [description]
   * @param {string/object} val  [description]
   */
  _set: function (path, val) {
    this._m_change_ = false;

    if (BbaseEst.typeOf(path) === 'object') {
      this._baseSetValues(this._getPath(path));
    } else {
      this._setValue(path, val);
    }
    if (this._m_change_ && this._ready_component_) {
      if (this.options.onUpdate) {
        this.options.onUpdate.call(this, this.model.toJSON());
      }
      if (this.change && !this.change.timer) {
        this.change.timer = setTimeout(this._bind(function () {
          this.change.call(this, this.viewType, path);
          this.change.timer = null;
        }), 20);
      };
      if (this.viewType === 'item') {
        this._super('change', 'item');
      }
    }
  },
  /**
   * 批量赋值
   *
   * @method [模型] - _baseSetValues
   * @param  {object} keyVals [description]
   * @return {*}         [description]
   */
  _baseSetValues: function (keyVals) {
    BbaseEst.each(keyVals, this._bind(function (value, key) {
      this._setValue(key, value);
    }));
  },
  /**
   * 基础设置模型类属性值
   *
   * @method [模型] - _baseSetAttr
   * @param  {[type]} path [description]
   * @param  {[type]} val  [description]
   * @return {[type]}      [description]
   */
  _baseSetAttr: function (path, val) {
    if (BbaseEst.typeOf(path) === 'string') BbaseEst.setValue(this.model.attributes, path, val);
    else BbaseEst.each(path, this._bind(function (value, key) {
      BbaseEst.setValue(this.model.attributes, key, value);
    }));
  },
  /**
   * 设置多个model值, 如果当前视图参数设置里有onChange事件，则调用之
   *
   * @method [模型] - _setValues ( 新版将移除 )
   * @param {[type]} keyVals [description]
   * @example
   *       this._setValues({
   *         'args.styles.name.display': 'block'
   *       });
   */
  _setValues: function (keyVals) {
    this._baseSetValues(keyVals);
    if (this._options.onChange) {
      this._options.onChange.call(this, keyVals);
    }
  },

  /**
   * 设置多个model attributes值， 此方法将不触发模型类改变事件
   *
   * @method [模型] - _setAttr
   * @param {[type]} keyVals [description]
   */
  _setAttr: function (path, val) {
    this._baseSetAttr(path, val);
  },
  /**
   * 设置多个model attributes值， 此方法将不触发模型类改变事件
   * 如果当前视图参数设置里有onChange事件，则调用之
   *
   * @method [模型] - _setAttrValues ( 新版将移除 )
   * @param {[type]} keyVals [description]
   */
  _setAttributes: function (path, val) {
    this._baseSetAttr(path, val);
    if (this._options.onChange) {
      this._options.onChange.call(this, path);
    }
  },
  /**
   * 获取请求参数
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  _getParam: function (name) {
    if (this.collection) {
      return this.collection.__params[name];
    } else {
      return this.model.params[name];
    }
  },
  /**
   * 设置请求参数
   * @param {[type]} name  [description]
   * @param {[type]} value [description]
   */
  _setParam: function (name, value) {
    if (this.collection) {
      this.collection._setParam(name, value);
    } else {
      this.model.params[name] = value;
    }
  },
  /**
   * 获取点击事件源对象
   *
   * @method [事件] - _getTarget
   * @param e
   * @return {*|jQuery|HTMLElement}
   *  @example
   *      this._getTarget(e);
   */
  _getTarget: function (e) {
    return e.target ? $(e.target) : $(e.currentTarget);
  },
  /**
   * 获取绑定事件源对象
   *
   * @method [事件] - _getEventTarget
   * @param e
   * @return {*|jQuery|HTMLElement}
   *  @example
   *      this._getEventTarget(e);
   */
  _getEventTarget: function (e) {
    return e.currentTarget ? $(e.currentTarget) : $(e.target);
  },
  /**
   * 动画执行前
   *
   * @method _beforeTransition
   * @return {[type]} [description]
   */
  _beforeTransition: function () {
    this.$el.css({ 'visibility': 'hidden' });
  },
  /**
   * 动画执行后

   * @method _afterTransition
   * @return {[type]} [description]
   */
  _afterTransition: function () {
    this.$el.css({ 'visibility': 'visible' });
  },
  /**
   * 单次执行
   *
   * @method [事件] - _one
   * @param callback
   * @author wyj 15.6.14
   * @example
   *      this._one(['AwardList'], function (AwardList) {
   *          BbaseApp.addPanel('main', {
   *          el: '#Award',
   *          template: '<div class="leaflet-award"></div>'
   *      }).addView('awardList', new AwardList({
   *          el: '.leaflet-award',
   *          viewId: 'awardList'
   *      }));
   *  });
   */
  _one: function (name, callback) {
    try {
      var _name, isArray = BbaseEst.typeOf(name) === 'array';
      var _nameList = [];
      var _one = null;

      _name = isArray ? name.join('_') : name;
      _one = '_one_' + _name;
      this[_one] = BbaseEst.typeOf(this[_one]) === 'undefined' ? true : false;

      if (this[_one]) {
        if (isArray) {
          BbaseEst.each(name, function (item) {
            _nameList.push(item.replace(/^(.+)-(\d+)?$/g, "$1"));
          });
          this._require(_nameList, callback);
        } else if (callback) {
          callback.call(this);
        }
      }
    } catch (e) {
      debug('Error -> BbaseSuperView._one ->' + JSON.stringify(name) + e, { type: 'error' }); //debug__
    }
  },
  /**
   * 异步加载
   *
   * @method [加载] - _require
   * @param dependent
   * @param callback
   * @author wyj 15.6.14
   * @example
   *        this._require(['Module'], function(Module){
   *            new Module();
   *        });
   */
  _require: function (dependent, callback) {
    seajs.use(dependent, BbaseEst.proxy(callback, this));
  },
  /**
   * 延迟执行
   *
   * @method [加载] - _delay
   * @param time
   * @author wyj 15.12.3
   * @example
   *  this._delay(function(){}, 5000);
   */
  _delay: function (fn, time) {
    setTimeout(BbaseEst.proxy(function () {
      setTimeout(BbaseEst.proxy(function () {
        if (fn) fn.call(this);
      }, this), time);
    }, this), 0);
  },
  /**
   * 代理
   *
   * @method [事件] - _bind
   * @param  {Function} fn [description]
   * @return {[type]}      [description]
   */
  _bind: function (fn) {
    return BbaseEst.proxy(fn, this);
  },
  /**
   * handlebar if 增强
   *
   * @method _parseHbs
   * @param  {[type]} template [description]
   * @return {[type]}          [description]
   */
  _parseHbs: function (template) {
    if (BbaseEst.isEmpty(template)) {
      return null;
    }
    if (template.indexOf('_quote_') > -1) {
      return template;
    }
    return template.replace(/{{#If\s+(.*?)}}/mg, function (expression) {
      return "{{#If '" + expression.replace(/{{#If\s+(.*)}}/mg, '$1').replace(/'/mg, '_quote_') + "'}}";
    });
  },
  _empty: function () {},
  /**
   * 销毁系统绑定的事件及其它
   *
   * @method [销毁] - _destroy
   * @return {[type]} [description]
   */
  _destroy: function () {
    this._re_dup = null;
    BbaseEst.each(this._directives_, this._bind(function (item) {
      if (BbaseApp.getDirective(item.name) && BbaseApp.getDirective(item.name).unbind) {
        BbaseApp.getDirective(item.name).unbind.call(this, item.object);
      }
    }));
  },
  /**
   * 关闭对话框
   *
   * @method _close
   */
  _close: function () {
    if (BbaseApp.getDialog(this.viewId)) {
      BbaseApp.getDialog(this.viewId).close().remove();
    }
  },
  render: function () {
    this._render();
  },
  /**
   * 静态对话框， 当你需要显示某个组件的视图但不是以iframe形式打开时
   * 对话框参数将作为模块里的options参数
   *
   * @method [对话框] - _dialog ( 静态对话框 )
   * @param options
   * @author wyj 15.1.22
   * @example
   *        // 获取对话框
   *          BbaseApp.getDialog('moduleId || id');
   *          this._dialog({
   *                moduleId: 'SeoDetail', // 模块ID
   *                title: 'Seo修改', // 对话框标题
   *                id: this.model.get('id'), // 初始化模块时传入的ID， 如productId
   *                width: 600, // 对话框宽度
   *                height: 250, // 对话框高度
   *                skin: 'form-horizontal', // className
   *                hideSaveBtn: false, // 是否隐藏保存按钮， 默认为false
   *                autoClose: true, // 提交后按确定按钮  自动关闭对话框
   *                quickClose: true, // 点击空白处关闭对话框
   *                button: [ // 自定义按钮
   *                  {
   *                    value: '保存',
   *                    callback: function () {
   *                    this.title('正在提交..');
   *                    $("#SeoDetail" + " #submit").click(); // 弹出的对话ID选择符为id
   *                     (注：当不存在id时，为moduleId值)
   *                    BbaseApp.getView('SeoDetail'); // 视图为moduleId
   *                    return false; // 去掉此行将直接关闭对话框
   *                  }}
   *                ],
   *                onShow: function(){ // 对话框弹出后调用   [注意，当调用show方法时，
   *                 对话框会重新渲染模块视图，若想只渲染一次， 可以在这里返回false]
   *                    return true;
   *                },
   *                onClose: function(){
   *                    this._reload(); // 列表刷新
   *                    this.collection.push(BbaseEst.cloneDeep(BbaseApp.getModels()));
   *                    // 向列表末尾添加数据, 注意必须要深复制
   *                    this.model.set(BbaseApp.getModels().pop()); // 修改模型类
   *                }
   *            }, this);
   */
  _dialog: function (options, context) {
    var ctx = context || this;
    var viewId = options.viewId ? options.viewId :
      BbaseEst.typeOf(options.dialogId) === 'string' ? options.dialogId : options.moduleId;
    if (BbaseEst.typeOf(viewId) === 'function') viewId = BbaseEst.nextUid('dialog_view');
    var comm = {
      width: 'auto',
      title: null,
      cover: false,
      autofocus: false,
      hideOkBtn: true,
      hideCloseBtn: true,
      button: [],
      quickClose: options.cover ? false :
        (BbaseEst.typeOf(options.autofocus) === 'boolean' ? options.quickClose : false),
      skin: 'dialog_min'
    };

    if (options.moduleId && BbaseApp.getStatus(options.moduleId)) {
      comm = BbaseEst.extend(comm, BbaseApp.getStatus(options.moduleId));
    }
    options = BbaseEst.extend(comm, options);

    options = BbaseEst.extend(options, {
      el: '#base_item_dialog' + viewId,
      content: options.content || '<div id="' + viewId + '"></div>',
      viewId: viewId,
      onshow: function () {
        try {
          var result = options.onShow && options.onShow.call(this, options);
          if (typeof result !== 'undefined' && !result)
            return;
          if (BbaseEst.typeOf(options.moduleId) === 'function') {
            options.dialogId = options.dialogId || options.viewId;
            BbaseApp.addPanel(options.dialogId, {
              el: '#' + options.dialogId,
              template: '<div id="base_item_dialog' + options.dialogId + '" class="region ' +
                options.dialogId + '"></div>'
            }).addView(options.dialogId, new options.moduleId(options));
          } else if (BbaseEst.typeOf(options.moduleId) === 'string') {
            seajs.use([options.moduleId], function (instance) {
              try {
                if (!instance) {
                  console.error(options.moduleId + ' is not defined');
                }
                BbaseApp.addPanel(options.viewId, {
                  el: '#' + options.viewId,
                  template: '<div id="base_item_dialog' + options.viewId + '" class="region"></div>'
                }).addView(options.viewId, new instance(options));
              } catch (e) {
                console.error(e);
              }
            });
          }
        } catch (e) {
          console.log(e);
        }
      },
      onclose: function () {
        if (BbaseApp.getPanel(options.viewId)) BbaseApp.removePanel(options.viewId);
        if (options.onClose) options.onClose.call(ctx, options);
        BbaseApp.getDialogs().pop();
      }
    });
    BbaseUtils.dialog(options);
  },
  /**
   * title提示
   *
   * @method [提示] - _initToolTip ( title提示 )
   * @author wyj 15.9.5
   * @example
   *      <div class="tool-tip" title="提示内容">content</div>
   *      this._initToolTip();
   */
  _initToolTip: function ($parent, className) {
    var _className = className || '.tool-tip';
    var $tip = $parent ? $(_className, $parent) : this.$(_className);

    $tip.hover(function (e) {
      var title = $(this).attr('data-title') || $(this).attr('title');
      var offset = $(this).attr('data-offset') || 0;
      if (BbaseEst.isEmpty(title)) return;

      BbaseUtils.dialog({
        dialogId: BbaseEst.hash(title || 'error:446'),
        title: null,
        width: 'auto',
        offset: parseInt(offset, 10),
        skin: 'tool-tip-dialog',
        align: $(this).attr('data-align') || 'top',
        content: '<div style="padding: 5px 6px;;font-size: 12px;">' + title + '</div>',
        hideCloseBtn: true,
        autofocus: false,
        target: $(this).get(0)
      });
      if (!BbaseApp.getData('toolTipList')) BbaseApp.addData('toolTipList', []);
      BbaseApp.getData('toolTipList').push(BbaseEst.hash(title));

      $(window).one('click', BbaseEst.proxy(function () {
        BbaseEst.each(BbaseApp.getData('toolTipList'), function (item) {
          if (BbaseApp.getDialog(item)) BbaseApp.getDialog(item).close();
        });
        BbaseApp.addData('toolTipList', []);

      }, this));
    }, function () {
      try {
        BbaseApp.getDialog(BbaseEst.hash($(this).attr('data-title') || $(this).attr('title'))).close();
      } catch (e) {}
    });
  }
});
