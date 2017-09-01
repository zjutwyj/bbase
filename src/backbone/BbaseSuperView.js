/**
 * @description 所有BaseXxx模块的超类， 子类继承超类的一切方法
 * @class BbaseSuperView - 所有BaseXxx模块的超类
 * @author yongjin<zjut_wyj@163.com> 2015/1/24
 */
(function(BbaseBackbone, BbaseEst, BbaseApp, BbaseUtils, BbaseHandlebars, undefined) {
  var BbaseSuperView = BbaseBackbone.View.extend({
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
      _this._re_dup = {};
      _this._re_selector = {};
      _this._attr_list = {};
      _this._directives_ = [];
      _this._directives_show_ = [];
      _this._ready_component_ = false;
      if (_this.init && BbaseEst.typeOf(_this.init) !== 'function') {
        _this._initialize(_this.init);
      }
      if (_this.initData && BbaseEst.typeOf(_this.initData) !== 'function') {
        _this._initialize(_this.initData);
      }
      BbaseBackbone.View.apply(_this, arguments);
    },
    /**
     * 调用父类方法
     *
     * @method [构造] - _super
     * @return {[type]} [description]
     */
    _super: function(type, args) {
      var _this = this;
      if (BbaseEst.typeOf(type) === 'object') {
        _this._initialize(type);
      } else if (BbaseEst.isEmpty(type)) {
        return BbaseApp.getView(_this.viewId);
      } else {
        switch (type) {
          case 'data':
            return BbaseApp.getView(_this.viewId).model.toJSON();
          case 'view':
            return BbaseApp.getView(_this.viewId);
          case 'model':
            return BbaseApp.getView(_this.viewId).model;
          case 'options':
            if (BbaseApp.getView(_this.viewId)) {
              return BbaseApp.getView(_this.viewId)._options;
            } else {
              return _this._options.data;
            }
            break;
          case '_initialize':
            _this[type](args);
            break;
          default:
            if (BbaseApp.getView(_this.viewId) && BbaseApp.getView(_this.viewId)[type]) {
              if (BbaseApp.getView(_this.viewId)[type].timer) {
                clearTimeout(BbaseApp.getView(_this.viewId)[type].timer);
              }
              var _arguments = Array.prototype.slice.apply(arguments);
              BbaseApp.getView(_this.viewId)[type].timer = setTimeout(_this._bind(function() {
                BbaseApp.getView(_this.viewId)[type].apply(BbaseApp.getView(_this.viewId), _arguments.splice(1, _arguments.length - 1));
                BbaseApp.getView(_this.viewId)[type].timer = null;
              }), 10);
            }
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
    initialize: function() {
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
    _extend: function(options) {
      BbaseEst.extend(this.options, options);
    },
    /**
     * 获取视图
     *
     * @method [视图] - _view
     * @param  {[type]} viewId [description]
     * @return {[type]}        [description]
     */
    _view: function(viewId) {
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
    _region: function(name, instance, options) {
      var _this = this;
      if (arguments.length === 1) {
        return _this._view(name);
      }
      options.__viewId = name;
      BbaseApp.addRegion(name + _this.cid, instance, options);
    },
    /**
     * service服务
     *
     * @method _service
     * @return {[type]} [description]
     */
    _service: function(type, options) {
      return Service[type](options);
    },
    /**
     * 导航
     *
     * @method [导航] - _navigate ( 导航 )
     * @param name
     * @author wyj 15.1.13
     */
    _navigate: function(name, options) {
      options = options || true;
      typeof Backbone === 'undefined' ? BbaseBackbone.history.navigate(name, options) : Backbone.history.navigate(name, options);
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
    _singleBind: function(parent, selector, model, changeFn) {
      var _self = this;

      $(selector, parent || _self.$el).each(function() {
        var _this = this;
        var bbModels = [];
        var bbModel = $(_this).attr('bb-model');
        var bindType = $(_this).attr('data-bind-type') || 'change';

        if (!BbaseEst.isEmpty(bbModel)) {
          bbModels = bbModel.split(':');
          bindType = bbModels.length > 1 ? bbModels[1] : 'change';
        }
        $(_this).off(bindType).on(bindType, function(e) {
          var _this = this;
          var val, pass, modelId, name, bbMod;

          if (e.keyCode === 37 || e.keyCode === 39 ||
            e.keyCode === 38 || e.keyCode === 40) {
            return false;
          }
          modelId = $(_this).attr('id');
          bbMod = $(_this).attr('bb-model');
          if (!BbaseEst.isEmpty(bbMod)) bbMod = bbMod.split(':')[0];

          if (bbMod || (modelId && modelId.indexOf('model') !== -1)) {
            switch (_this.type) {
              case 'radio':
                val = $(_this).is(":checked") ? $(_this).val() : pass = true;
                break;
              case 'checkbox':
                val = $(_this).is(':checked') ? (BbaseEst.isEmpty($(_this).attr('true-value')) ? true :
                    $(_this).attr('true-value')) :
                  (BbaseEst.isEmpty($(_this).attr('false-value')) ? false : $(_this).attr('false-value'));
                break;
              default:
                val = $(_this).val();
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
    _modelBind: function(parent, selector, changeFn) {
      var _self = this;
      if (selector) _self._singleBind(parent, selector, _self.model, changeFn);
      else _self.$("input, textarea, select").each(function() {
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
    _getCompileTemp: function(dirName, node, selector, ngDirName, fieldName) {
      var _this = this;
      var hbsStr = null,
        compileStr = '';

      switch (dirName) {
        case 'html':
          compileStr = _this._parseHbs(node.html());
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
            hbsStr = _this._parseHbs(node.attr(ngDirName));
            // 默认其它表单元素都经过特殊符号过滤， 当node为textarea元素时，取html代码，若html代码中存在{{{}}}符号，则不过滤符号
            if (!hbsStr && node.is('textarea')) hbsStr = _this._parseHbs(node.html());
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
    _replaceNode: function(attrName, node, result, selector, ngAttrName) {
      var _this = this;
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
          if (_this._get(/bb-checked=\"(.*?)\"\s?/img.exec(selector)[1])) {
            node.prop('checked', true);
          } else {
            node.prop('checked', false);
          }
          break;
        default:
          if (BbaseApp.getDirective(attrName) && BbaseApp.getDirective(attrName).update) {
            BbaseApp.getDirective(attrName).update.apply(_this, [attrName, node, selector, result]);
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
    _handleReplace: function(item, model, selector, attrName, ngAttrName, name) {
      var _result = '';
      var _this = this;

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
      if (!item.node || (item.node.size && item.node.size() === 0)) {
        item.node = _this.$(selector).eq(item.index);

        if (item.node.size() === 0) {

          // 针对bb-src
          item.node = _this.$('.directive_' + BbaseEst.hash(selector)).eq(item.index);

          //console.error("error: call wyj for more info");
        }
      }
      BbaseApp._batch_replace_ready.push({
        item: item,
        attrName: attrName,
        _result: _result,
        selector: selector,
        ngAttrName: ngAttrName
      });

      // 批量更新
      if (!BbaseApp._batchReplaceTimer) {
        BbaseApp._batchReplaceTimer = true;

        BbaseApp._batchReplaceTimer = setTimeout(function() {

          BbaseApp._batch_replace = BbaseApp._batch_replace_ready.splice(0);
          BbaseApp._batch_replace_ready = [];

          _this._batchReplace();
          BbaseApp._batch_replace = [];
          BbaseApp._batchReplaceTimer = null;

        }, 3);
      }

      // 缓存结果
      item.result = _result;
    },
    _batchReplace: function() {
      var _this = this;
      while (BbaseApp._batch_replace.length > 0) {
        var pop = BbaseApp._batch_replace.pop();
        _this._replaceNode(pop.attrName, pop.item.node, pop._result, pop.selector, pop.ngAttrName);
      }
    },
    /**
     * 获取属性列表
     * .render:html:style
     *
     * @method _getAttrList
     * @param  {object} item 缓存的模板对象
     * @return {array}       属性列表
     */
    _getAttrList: function(item, hash) {
      var _this = this;
      var tempList = [],
        list = [],
        t_list = [];

      if (hash in _this._attr_list) return _this._attr_list[hash];

      if (item.indexOf(']:') > -1) {
        tempList = item.split(']:');
        list = BbaseEst.map(tempList, function(_item, index) {
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
      _this._attr_list[hash] = list;
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
    _getSelectorSplit: function(selector) {
      var _this = this;
      var hash = BbaseEst.hash(selector);
      if (hash in _this._re_selector) return _this._re_selector[hash];

      var list = selector.split(',');
      var list2 = [];
      var temp = '';

      if (selector.indexOf('[bb-watch=') > -1) {
        BbaseEst.each(list, function(item) {
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

      _this._re_selector[hash] = list2;
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
    _viewReplace: function(selector, model, cbs, name) {
      var _this = this;
      try {
        if (!_this._re_dup) _this._re_dup = {};
        BbaseEst.each(_this._getSelectorSplit(selector), function(item) {
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
            list = _this._getAttrList(item, _hash);

            if (list.length > 1) {

              for (var i = 1; i < list.length; i++) {
                _hash = BbaseEst.hash(list[0] + list[i]);
                attrName = list[i];

                if (BbaseEst.msie()) {
                  ngAttrName = 'ng-' + list[i];

                  if (!_this._re_dup[_hash])
                    _$template = _this._options.template.replace(new RegExp('\\s' + attrName +
                      '=', "img"), ' ' + ngAttrName + '=');

                } else {
                  ngAttrName = attrName;
                  _$template = _this.$template;
                }

                // 缓存模板
                if (!_this._re_dup[_hash]) {

                  _this._re_dup[_hash] = [];
                  node = $(_$template).find(list[0]);

                  if (node.size() === 0) {
                    node = _this.$el.find(list[0]);
                  }

                  $.each(node, function(index, node) {
                    _this._re_dup[_hash].push(BbaseEst.extend(_this._getCompileTemp(attrName, $(node), list[0], ngAttrName, name), {
                      hash: _hash + '' + index,
                      index: index
                    }));
                  });
                }

                BbaseEst.each(_this._re_dup[_hash], function(item) {
                  _this._handleReplace(item, model, list[0], attrName, ngAttrName, name);
                });
              }

            } else {
              if (BbaseEst.msie()) {
                if (!_this['h_temp_' + _hash])
                  _$template = _this.$template.replace(new RegExp('\\sstyle=', "img"), ' ng-style=');
                _this['h_temp_' + _hash] = _this['h_temp_' + _hash] ||
                  BbaseHandlebars.compile($(_$template).find(item).wrapAll('<div>').parent().html().replace(/ng-style/img, 'style'));
              } else {
                _this['h_temp_' + _hash] = _this['h_temp_' + _hash] ||
                  BbaseHandlebars.compile($(_this.$template).find(item).wrapAll('<div>').parent().html());
              }
              _result = _this['h_temp_' + _hash](model.attributes);
              if (_this['h_temp_r_' + _hash] === _result) {
                return;
              }
              _this.$(item).replaceWith(_result);
              _this['h_temp_r_' + _hash] = _result;
            }
          }
        });

        if (cbs) {
          BbaseEst.each(cbs, function(cb) {
            cb.call(_this, name);
          });
        }

      } catch (e) {
        console.log('Error -> _viewReplace -> selector:' + selector);
        console.log(e.message);
        console.log(e.stack);
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
    _watch: function(name, selector, callback) {
      var _self = this,
        triggerName,
        cb_hash = null,
        temp_obj = {},
        list = [];

      if (!_self.watchFields) _self.watchFields = {};
      if (!_self.cbMap) _self.cbMap = {};

      if (BbaseEst.typeOf(name) === 'array') {
        list = name;
      } else {
        list.push(name);
      }

      BbaseEst.each(list, function(item) {
        var modelId = item.replace(/^#?model\d?-(.+)$/g, "$1");
        /* debugger
         if (typeof this._get(modelId) === 'undefined'){
           this._setDefault(modelId, '');
         }*/
        if (callback) {
          _self.cbMap[modelId] = _self.cbMap[modelId] || [];

          if (BbaseEst.typeOf(callback) === 'string') {

            cb_hash = BbaseEst.hash(modelId + callback);
            if (!(cb_hash in _self.cbMap)) {
              _self.cbMap[cb_hash] = true;
              _self.cbMap[modelId].push(_self[callback]);
            }

          } else {
            _self.cbMap[modelId].push(callback);
          }
        }
        if (modelId in _self.watchFields) {
          BbaseEst.each(_self._getSelectorSplit(selector), function(item) {

            if (_self.watchFields[modelId].indexOf(item) === -1) {
              _self.watchFields[modelId] = _self.watchFields[modelId] + ',' + item;
            }
          });
        } else {
          _self.watchFields[modelId] = selector;
        }

        selector = _self.watchFields[modelId];
        triggerName = _self.cid + modelId;

        //if (!_self._options.modelBind || item.indexOf('model-') > -1) _self._modelBind(item);
        if (triggerName in temp_obj) return;

        BbaseEst.off(temp_obj[triggerName] = triggerName).on(triggerName, function(triggerName, name) {
          _self._viewReplace(selector, _self.model, _self.cbMap[modelId], modelId);
          if (_self.update) _self.update.call(_self, modelId);
        });

        _self.model.off('change:' + (temp_obj[modelId] = modelId.split('.')[0]))
          .on('change:' + temp_obj[modelId],
            function() {
              _self._viewReplace(selector, _self.model, _self.cbMap[modelId], modelId);
              if (_self.update) _self.update.call(_self, modelId);
            });

      });
    },
    /**
     * 绑定模型类
     * @method [绑定] - _watchBind
     */
    _watchBind: function(template) {
      var _this = this;
      var list = [],
        models = [];

      _this.cbMap = {};
      _this.watchFields = {};

      if (BbaseEst.typeOf(template) === 'string') {
        models = template.match(new RegExp('(bb-watch=\\"(.+?)\"(\\s*)|bb-change=\\"(.+?)\"(\\s*)|bb-model=\\"(.+?)\"(\\s*))(bb-render=\\"(.+?)\\"\\s*)?(bb-change=\\"(.+?)\\"\\s*)?', 'img'));
        BbaseEst.each(models, function(item) {
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
              watch_render = _this._getWatchRender(watch, render);
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
            change: change.length > 1 ? BbaseEst.trim(change[1].substring(0,
              change[1].indexOf('(') === -1 ? change[1].length : change[1].indexOf('('))) : null
          });
        });
      }
      BbaseEst.each(list, function(item) {
        _this._watch(item.watch.split(','), item.render, BbaseEst.isEmpty(item.change) ? null : item.change);
      });
      if (_this.onWatch) {
        _this.onWatch.call(_this, arguments);
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
    _getWatchRender: function(watch, render) {
      var _watch = '';
      var _render = '';
      var _watchs = watch[1].split(',');

      BbaseEst.each(_watchs, function(item) {
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
    _bbBind: function(template, parent) {
      var _this = this;
      var matchs = [],
        patt,
        hash,
        map = {},
        result;
      _this.bbList = [];

      if (BbaseEst.typeOf(template) === 'string') {
        patt = new RegExp('\\bbb-([\\w\\.]+)=\\"(.+?)\\"\\s?', 'img');

        while ((result = patt.exec(template)) !== null) {
          _this.bbList.push({
            name: result[1],
            value: result[2]
          });
        }
        BbaseEst.each(_this.bbList, function(item) {

          if (item.value.indexOf('$dx') > -1) {
            item.value = item.value.replace(/\$dx/img, _this.model.attributes.dx);
          }

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
              var field = _this._getField(item.value);
              _this._watch([sep.length > 1 ? sep[0] : field], '[bb-show="' + item.value + '"]:show');
              if (!_this._getBoolean(item.value)) {
                _this.$('[bb-show="' + item.value + '"]').hide();
              }
              //BbaseEst.trigger(this.cid + field);
              break;
            case 'model':
              _this._modelBind(parent, '[bb-model="' + item.value + '"]');
              _this._watch([item.value.split(':')[0]], '[bb-model="' + item.value + '"]:value');
              _this.$('[bb-model="' + item.value + '"]').val(_this._get(item.value.split(':')[0]));
              break;
            case 'checked':
              var field = _this._getField(item.value);
              if (typeof _this._options._checkAppend === 'undefined') {
                _this._set('_options._checkAppend', true);
              }
              _this._watch([field], '[bb-checked="' + item.value + '"]:checked');
              _this.$('[bb-checked="' + item.value + '"]').prop('checked', _this._getBoolean(item.value));
              _this.$('[bb-checked="' + item.value + '"]').change(function(a) {
                if (item.value === 'checked_all') {
                  _this._checkAll && _this._checkAll(a);
                } else {
                  _this._check && _this._check($(a.target).is(':checked'));
                }
              });
              break;
            default:
              if (BbaseApp.getDirective(item.name)) {
                if (BbaseApp.getDirective(item.name).bind) {
                  BbaseEst.extend(BbaseApp.getDirective(item.name), BbaseApp.getDirective(item.name).bind.call(_this,
                    item.value, '[bb-' + item.name + '="' + item.value + '"]'));
                }
                if (BbaseApp.getDirective(item.name).show) {
                  _this._directives_show_.push({
                    name: item.name,
                    object: _this._getObject(item.value),
                    value: item.value,
                    selector: '[bb-' + item.name + '="' + item.value + '"]'
                  });
                }

                _this._directives_.push({ name: item.name, object: _this._getObject(item.value) });
              } else {
                _this._handleEvents(parent, item.name, item.value);
              }
          }
        });
      }
      _this._afterTransition();
    },
    _handleDirectiveShow: function() {
      var _this = this;
      BbaseEst.each(_this._directives_show_, function(item) {
        BbaseApp.getDirective(item.name).show.call(_this, item.object,
          item.value, '[bb-' + item.name + '="' + item.value + '"]');
      });
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
    _handleEvents: function(parent, name, value) {
      var _this = this;
      var colonRe = /:([^:\$\s\(\)]*)/img,
        dollarRe = /\$([^:\$\s\(\)]*)/img,
        bracketRe = /\(([^:\$]*)\)/img,
        nameRe = /(.[^:\$\s\(\)]*).*/img;

      var args = [],
        fn = nameRe.exec(value)[1],
        colons = BbaseEst.map(value.match(colonRe) || [], function(str) {
          return str.replace(':', '');
        }),
        dollars = BbaseEst.map(value.match(dollarRe) || [], function(str) {
          return str.replace('$', '');
        });

      var brackets = value.match(bracketRe);
      if (brackets) {
        BbaseEst.each(brackets[0].split(','), function(item) {
          var name = BbaseEst.trim(item.replace(/[\(|\)]/img, ''));
          if (!BbaseEst.isEmpty(name)) {
            if (name.indexOf('\'') > -1) {
              dollars.push(name.replace(/'/img, ''));
            } else if (/^[\d\.]+$/img.test(name)) {
              dollars.push(parseFloat(name));
            } else {
              dollars.push(_this._get(name));
            }
          }
        });
      }

      if (_this[fn]) parent.find('[bb-' + name + '="' + value + '"]').off(name).on(name,
        function(e) {
          if (colons.length > 0) {
            switch (colons[0]) {
              case 'enter':
                if (e.keyCode === 13) {
                  _this[fn].apply(_this, dollars.concat([e]));
                }
                break;
              default:
                if (e.keyCode === parseInt(colons[0])) {
                  _this[fn].apply(_this, dollars.concat([e]));
                }
            }
          } else {
            _this[fn].apply(_this, dollars.concat([e]));
          }
        });
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
    _stringifyJSON: function(array) {
      var _this = this;
      var keys, result;
      if (!JSON.stringify) alert(CONST.LANG.JSON_TIP);

      BbaseEst.each(array, function(item) {
        keys = item.split('.');
        if (keys.length > 1) {

          result = BbaseEst.getValue(_this.model.attributes, item);
          BbaseEst.setValue(_this.model.attributes, item, JSON.stringify(result));
        } else {
          BbaseEst.setValue(_this.model.attributes, item, JSON.stringify(_this.model.get(item)));
        }
      });
    },
    /**
     * 反序列化字符串
     *
     * @method [模型] - _parseJSON ( 反序列化字符串 )
     * @param array
     */
    _parseJSON: function(array) {
      var _this = this;
      var keys, result;
      var parse = JSON.parse || $.parseJSON;

      if (!parse) alert(CONST.LANG.JSON_TIP);

      BbaseEst.each(array, function(item) {
        keys = item.split('.');
        if (keys.length > 1) {
          result = BbaseEst.getValue(_this.model.attributes, item);
          if (BbaseEst.typeOf(result) === 'string') {
            BbaseEst.setValue(_this.model.attributes, item, parse(result));
          }
        } else {
          if (BbaseEst.typeOf(_this.model.get(item)) === 'string') {
            if (!BbaseEst.isEmpty(_this._get(item))) _this._set(item, parse(_this.model.get(item)));
          }
        }
      });
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
    _setOption: function(obj) {
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
    _initEnterEvent: function(options) {
      var _this = this;
      if (options.speed > 1 && options.enter) {
        _this.$('input').keyup(function(e) {
          if (e.keyCode === CONST.ENTER_KEY) {
            _this.$(options.enter).click();
          }
        });
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
    _getOption: function(name) {
      return this._options[name];
    },
    /**
     * 获取模板字符串
     *
     * @method _getTpl
     * @return {[type]} [description]
     */
    _getTpl: function() {
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
    _getValue: function(path) {
      return BbaseEst.getValue(this.model.attributes, path);
    },
    /**
     * 获取模型类的值
     *
     * @method [模型] - _get
     * @param  {string} path [description]
     * @return {*}      [description]
     */
    _get: function(path) {
      return this._getValue.call(this, path);
    },
    /**
     * 获取整数类型的值
     * @method _getInt
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    _getInt: function(path) {
      return parseInt(this._get(path), 10);
    },
    /**
     * 获取浮点型数值
     * @method _getFloat
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    _getFloat: function(path) {
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
    _getDefault: function(path, value) {
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
    _setDefault: function(path, value) {
      var _this = this;
      var result = BbaseEst.getValue(_this.model.attributes, path);
      if (BbaseEst.typeOf(result) === 'undefined' || BbaseEst.typeOf(result) === 'null') {
        BbaseEst.setValue(_this.model.attributes, path, value);
      }
    },
    /**
     * 模型类初始化
     * @method [模型] - _initDefault
     * @return {[type]} [description]
     */
    _initDefault: function() {
      var _this = this;
      if (_this.init && BbaseEst.typeOf(_this.init) === 'function') {
        _this.__def_vals_ = _this.init.call(_this, _this._attributes) || {};
        BbaseEst.each(_this.__def_vals_, function(value, key) {
          _this._setDefault(key, value);
        });
      }
      if (_this.initData && BbaseEst.typeOf(_this.initData) === 'function') {
        _this.__def_vals_ = _this.initData.call(_this, _this._attributes) || {};
        BbaseEst.each(_this.__def_vals_, function(value, key) {
          _this._setDefault(key, value);
        });
      }
    },
    /**
     * 重置表单
     *
     * @method [表单] - _reset ( 重置表单 )
     * @author wyj 14.11.18
     */
    _reset: function(data) {
      var _this = this;
      _this.model.attributes = {};
      data = BbaseEst.extend(BbaseEst.extend(_this.model.defaults || {}, _this.__def_vals_), data);
      _this._set(_this._getPath(data));
    },
    /**
     * 获取对象路径
     *
     * @method _getPath
     * @return {[type]} [description]
     */
    _getPath: function(data, pre) {
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
        BbaseEst.each(data, function(value, key) {
          if (BbaseEst.typeOf(value) === 'object') {
            BbaseEst.each(value, function(v, k) {
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
      BbaseEst.each(paths, function(item) {
        temp[pre + item.path] = item.value;
      });

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
    _getField: function(value) {
      var str = "",
        list = [],
        result = null;

      str = value.replace(/^[!|(]*(\w+(?:\.\w+)*)(?:[\s|\.|>|<|!|:=])?.*$/img, '$1');
      list = str.split('}}')[0].replace(/({{|}})/img, '').split(/\s/);

      BbaseEst.each(list, this._bind(function(item) {
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
    _loopField: function(value) {
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
    _getBoolean: function(value) {
      var _this = this;
      if (BbaseEst.isEmpty(value)) {
        return false;
      };
      var bool = value;
      var field = _this._getField(value);
      if (!BbaseEst.isEmpty(field)) {
        bool = BbaseEst.compile('{{' + value + '}}', _this.model.attributes);
      }

      if (bool === 'true' || bool === '1') {
        bool = true;
      } else if (bool === 'false' || bool === '0' || bool === '') {
        bool = false;
      } else if (BbaseEst.typeOf(bool) === 'string' && BbaseEst.isEmpty(_this._get(bool))) {
        bool = true;
      } else if (BbaseEst.typeOf(_this._get(bool)) === 'boolean') {
        bool = _this._get(value);
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
    _isBoolean: function(str) {
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
    _getObject: function(str, ignore) {
      var _this = this;

      if (str.indexOf('{') === -1) return null;
      var result = '',
        object = { fields: {} },
        list = [],
        temp = '',
        items_o = BbaseEst.trim(str).substring(1, str.length - 1).split(',');

      BbaseEst.each(items_o, function(item) {
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

      BbaseEst.each(list, function(item) {
        var list = item.split(':');
        var r = '';
        var fnInfo = {};
        list[0] = BbaseEst.trim(list[0]);
        list[1] = BbaseEst.trim(list[1]);
        if (list.length > 2) {
          for (var j = 2; j < list.length; j++) {
            list[1] = list[1] + ':' + list[j];
          }
        }
        if (ignore) {
          if (BbaseEst.typeOf(ignore) === 'array') {
            var dx = BbaseEst.findIndex(ignore, function(a) {
              return a === list[0];
            });
            if (dx !== -1) {
              object[list[0]] = list[1].replace(/'/img, '');
              return true;
            }
          } else if (BbaseEst.typeOf(ignore) === 'string') {
            if (ignore === list[0]) {
              object[list[0]] = list[1].replace(/'/img, '');
              return true;
            }
          }
        }
        var ltype = BbaseEst.typeOf(list[1]);
        if (ltype === 'string' && list[1].indexOf('{') > -1) {
          // 子对象
          var key = list.shift();
          object[key] = _this._getObject(list.join(':'));
        } else if (list[1].indexOf('\'') > -1) {
          // 字符串
          object[list[0]] = list[1] === "''" ? '' : BbaseEst.trim(list[1].replace(/'/img, ''));
        } else if (list[1] in _this.model.attributes) {
          // 模型值
          object[list[0]] = _this._get(list[1]);
          object.fields[list[0]] = list[1];
        } else if (_this[list[1].replace(/(\(.*\))/img, '')]) {
          // 方法
          if (list[1].indexOf('(') > -1) {
            fnInfo = _this._getFunction(list[1], _this.model.attributes);
            object[list[0]] = _this[fnInfo.key].apply(_this, fnInfo.args);
          } else {
            object[list[0]] = _this[list[1]];
          }
        } else if (_this._isBoolean(list[1])) {
          // boolean
          object[list[0]] = _this._getBoolean(list[1]);
        } else if (BbaseEst.validation(list[1], 'number')) {
          // number
          object[list[0]] = parseFloat(list[1], 10);
        } else {
          object[list[0]] = BbaseEst.trim(BbaseEst.compile('{{' + list[1] + '}}', _this.model.attributes));
        }
      });

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
    _getFunction: function(str, obj) {
      var _this = this;
      var bracketRe = /\(([^:\$]*)\)/img,
        key = null,
        helper = BbaseEst.trim(str.replace(/\(.*\)/g, ''));
      args = [];

      var brackets = str.match(bracketRe);
      if (brackets) {
        BbaseEst.each(brackets[0].split(','), function(item) {
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
          } else if (_this[arg]) {
            args.push(_this[arg].call(_this));
          } else {
            args.push('');
          }
        });
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
    _setValue: function(path, val) {
      var _this = this;
      // just for trigger
      if (!BbaseEst.equal(BbaseEst.getValue(_this.model.attributes, path), val)) {
        BbaseEst.setValue(_this.model.attributes, path, val);
        BbaseEst.trigger(_this.cid + path, path, true);
        //console.log('path=' + path + ',val=' + val);
        _this._m_change_ = true;
        _this._m_change_list && _this._m_change_list.push(path);
      }
    },
    /**
     * 赋值模型类
     *
     * @method [模型] - _set
     * @param {string/object} path [description]
     * @param {string/object} val  [description]
     */
    _set: function(path, val) {
      var _this = this;
      _this._m_change_ = false;
      _this._m_change_list = [];

      if (BbaseEst.typeOf(path) === 'object') {
        _this._baseSetValues(_this._getPath(path));
      } else {
        _this._setValue(path, val);
      }
      if (_this._m_change_ && _this._ready_component_) {
        if (_this.options.onUpdate) {
          _this.options.onUpdate.call(_this, _this.model.toJSON());
        }
        BbaseEst.each(_this._m_change_list, function(item) {
          if (_this.change && !_this.change.timer) {
            _this.change.timer = setTimeout(_this._bind(function() {
              _this.change.call(_this, item, _this.viewType);
              _this.change.timer = null;
            }), 10);
          }
        })
      }
    },
    /**
     * 批量赋值
     *
     * @method [模型] - _baseSetValues
     * @param  {object} keyVals [description]
     * @return {*}         [description]
     */
    _baseSetValues: function(keyVals) {
      BbaseEst.each(keyVals, this._bind(function(value, key) {
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
    _baseSetAttr: function(path, val) {
      var _this = this;
      if (BbaseEst.typeOf(path) === 'string') BbaseEst.setValue(_this.model.attributes, path, val);
      else BbaseEst.each(path, function(value, key) {
        BbaseEst.setValue(_this.model.attributes, key, value);
      });
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
    _setValues: function(keyVals) {
      var _this = this;
      _this._baseSetValues(keyVals);
      if (_this._options.onChange) {
        _this._options.onChange.call(_this, keyVals);
      }
    },

    /**
     * 设置多个model attributes值， 此方法将不触发模型类改变事件
     *
     * @method [模型] - _setAttr
     * @param {[type]} keyVals [description]
     */
    _setAttr: function(path, val) {
      this._baseSetAttr(path, val);
    },
    /**
     * 设置多个model attributes值， 此方法将不触发模型类改变事件
     * 如果当前视图参数设置里有onChange事件，则调用之
     *
     * @method [模型] - _setAttrValues ( 新版将移除 )
     * @param {[type]} keyVals [description]
     */
    _setAttributes: function(path, val) {
      var _this = this;
      _this._baseSetAttr(path, val);
      if (_this._options.onChange) {
        _this._options.onChange.call(_this, path);
      }
    },
    /**
     * 获取请求参数
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    _getParam: function(name) {
      var _this = this;
      if (_this.collection) {
        return _this.collection.__params[name];
      } else {
        return _this.model.params[name];
      }
    },
    /**
     * 设置请求参数
     * @param {[type]} name  [description]
     * @param {[type]} value [description]
     */
    _setParam: function(name, value) {
      var _this = this;
      if (_this.collection) {
        _this.collection._setParam(name, value);
      } else {
        _this.model._setParam(name, value);
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
    _getTarget: function(e) {
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
    _getEventTarget: function(e) {
      return e.currentTarget ? $(e.currentTarget) : $(e.target);
    },
    /**
     * 动画执行前
     *
     * @method _beforeTransition
     * @return {[type]} [description]
     */
    _beforeTransition: function() {
      this.$el.css({ 'visibility': 'hidden' });
    },
    /**
     * 动画执行后

     * @method _afterTransition
     * @return {[type]} [description]
     */
    _afterTransition: function() {
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
    _one: function(name, callback) {
      var _this = this;
      try {
        var _name, isArray = BbaseEst.typeOf(name) === 'array';
        var _nameList = [];
        var _one = null;

        _name = isArray ? name.join('_') : name;
        _one = '_one_' + _name;
        _this[_one] = BbaseEst.typeOf(_this[_one]) === 'undefined' ? true : false;

        if (_this[_one]) {
          if (isArray) {
            BbaseEst.each(name, function(item) {
              _nameList.push(item.replace(/^(.+)-(\d+)?$/g, "$1"));
            });
            _this._require(_nameList, callback);
          } else if (callback) {
            callback.call(_this);
          }
        }
      } catch (e) {
        console.log(e); //debug__
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
    _require: function(dependent, callback) {
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
    _delay: function(fn, time) {
      var _this = this;
      setTimeout(function() {
        setTimeout(function() {
          if (fn) fn.call(_this);
        }, time);
      }, 0);
    },
    /**
     * 代理
     *
     * @method [事件] - _bind
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
    _bind: function(fn) {
      return BbaseEst.proxy(fn, this);
    },
    /**
     * handlebar if 增强
     *
     * @method _parseHbs
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    _parseHbs: function(template) {
      if (BbaseEst.isEmpty(template)) {
        return null;
      }
      if (template.indexOf('_quote_') > -1) {
        return template;
      }
      return template.replace(/{{#If\s+(.*?)}}/mg, function(expression) {
        return "{{#If '" + (expression + "&& '1'").replace(/{{#If\s+(.*)}}/mg, '$1').replace(/'/mg, '_quote_') + "'}}";
      });
    },
    _empty: function() {},
    /**
     * 销毁系统绑定的事件及其它
     *
     * @method [销毁] - _destroy
     * @return {[type]} [description]
     */
    _destroy: function() {
      var _this = this;
      _this._re_dup = null;
      BbaseEst.each(_this._directives_, function(item) {
        if (BbaseApp.getDirective(item.name) && BbaseApp.getDirective(item.name).unbind) {
          BbaseApp.getDirective(item.name).unbind.call(_this, item.object);
        }
      });
    },
    /**
     * 关闭对话框
     *
     * @method _close
     */
    _close: function() {
      var _this = this;
      if (BbaseApp.getDialog(_this.viewId)) {
        BbaseApp.getDialog(_this.viewId).close().remove();
      }
    },
    render: function() {
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
    _dialog: function(options, context) {
      var _this = this;
      var ctx = context || this;
      if (BbaseEst.typeOf(options) === 'string') {
        return BbaseApp.getDialog(options + _this.cid);
      }
      var viewId = options.viewId ? options.viewId :
        BbaseEst.typeOf(options.dialogId) === 'string' ? options.dialogId : options.moduleId;
      if (BbaseEst.typeOf(viewId) === 'function') viewId = BbaseEst.nextUid('dialog_view');
      options.viewId = viewId + _this.cid;
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
        el: '#base_item_dialog' + options.viewId,
        content: options.content || '<div id="' + options.viewId + '"></div>',
        viewId: options.viewId,
        onshow: function() {
          try {
            var result = options.onShow && options.onShow.call(_this, options);
            if (typeof result !== 'undefined' && !result)
              return;
            if (BbaseEst.typeOf(options.moduleId) === 'function') {
              options.dialogId = options.dialogId || options.viewId;
              BbaseApp.addPanel(options.viewId, {
                el: '#' + options.dialogId,
                template: '<div id="base_item_dialog' + options.dialogId + '" class="region ' +
                  options.viewId + '"></div>'
              }).addView(options.viewId, new options.moduleId(options));
            } else if (BbaseEst.typeOf(options.moduleId) === 'string') {
              seajs.use([options.moduleId], function(instance) {
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
        onclose: function() {
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
    _initToolTip: function($parent, className) {
      var _className = className || '.tool-tip';
      var $tip = $parent ? $(_className, $parent) : this.$(_className);

      if (this._options.render) {
        $tip = $tip.not(this._options.render + ' .tool-tip');
      }

      $tip.hover(function(e) {
        var _this = this;
        var hash = $(_this).attr('data-hash');
        var offset = $(_this).attr('data-offset') || 1;
        var title = $(_this).attr('data-title') || $(_this).attr('title') || '';

        if (!hash) {
          $(_this).attr('data-title', title);
          $(_this).attr('title', '');
          if (BbaseEst.isEmpty(title)) return;

          hash = BbaseEst.hash(BbaseEst.nextUid(title) || 'error:446');
          $(_this).attr('data-hash', hash);
        }

        if (!BbaseApp.getData('toolTipList')) BbaseApp.addData('toolTipList', []);
        /*if (BbaseEst.indexOf(BbaseApp.getData('toolTipList'), hash) > -1) {
          BbaseApp.getDialog(hash) && BbaseApp.getDialog(hash).show();
          return;
        }*/
        BbaseApp.getData('toolTipList').push(hash);
        $(window).one('click', function() {
          BbaseEst.each(BbaseApp.getData('toolTipList'), function(item) {
            if (BbaseApp.getDialog(item)) {
              BbaseApp.getDialog(item).close().remove();
            };
          });
          $('.tool-tip-dialog').parent().hide();
        });


        BbaseUtils.dialog({
          dialogId: hash,
          title: null,
          width: $(_this).attr('data-width') || 'auto',
          offset: parseInt(offset, 10),
          skin: 'tool-tip-dialog',
          align: $(_this).attr('data-align') || 'top',
          content: '<div style="padding: 5px 6px;;font-size: 12px;">' + title + '</div>',
          hideCloseBtn: true,
          autofocus: false,
          target: $(_this).get(0)
        });

      }, function() {
        var _this = this;
        try {
          if ($(_this).attr('data-hash')) {
            BbaseApp.getDialog($(_this).attr('data-hash')).close().remove();
          }
        } catch (e) {
          BbaseEst.each(BbaseApp.getData('toolTipList'), function(item) {
            if (BbaseApp.getDialog(item)) BbaseApp.getDialog(item).close().remove();
          });
          setTimeout(function() { $('.tool-tip-dialog').parent().hide(); }, 500);
        }
      });
    }
  });
  window.BbaseSuperView = BbaseSuperView;
})(window.BbaseBackbone, window.BbaseEst, window.BbaseApp, window.BbaseUtils, window.BbaseHandlebars);