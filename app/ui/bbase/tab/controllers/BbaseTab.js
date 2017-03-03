'use strict';
/**
 * @description BbaseTab
 * @class UI - ui库
 * @author yongjin<zjut_wyj@163.com> 2015/9/6
 */
define('BbaseTab', [], function(require, exports, module) {
  var BbaseTab, model, collection, item;

  model = BbaseModel.extend({
    baseId: 'id',
    defaults: BbaseEst.extend({}, BbaseModel.prototype.defaults)
  });

  collection = BbaseCollection.extend({
    model: model
  });

  item = BbaseItem.extend({
    tagName: function() {
      return this.options.data.tagName || 'li';
    },
    className: 'tab-li',
    events: {
      'click .toggle': 'toggleChecked'
    },
    initialize: function() {
      this.tabName = this.options.data.tagName || 'li';
      this._super({
        template: '<div class="toggle">' + this.options.data.template + '</div>',
        toolTip: this.options.data.toolTip
      });
    },
    afterRender: function() {
      if (this.options.data.cur !== '-' && (this.options.data.cur === this._getValue(this.options.data.path))) {
        this._check();
        this.options.data.onChange.call(this, this.model.attributes, true);
        setTimeout(BbaseEst.proxy(function() {
          this.showCurModule(this.options.data.cur, true);
        }, this), 0);
      }
      this.$('.toggle:first').addClass('tab-' + this._getValue(this.options.data.path));
      if (BbaseEst.typeOf(this._getValue('delay')) === 'boolean' && !this._getValue('delay')) {
        this._delay(function() {
          BbaseApp.getView(this._options.viewId).renderModule(this._getValue('dx'), this._getValue('moduleId'), this._getValue('viewId'));
        }, 100);
      }
    },
    showCurModule: function(modId, lazy) {
      if (BbaseApp.getView(this._options.viewId)) {
        BbaseApp.getView(this._options.viewId).showModule(modId, this.model.get('dx'), this.model.get('moduleId'), this.model.get('viewId'));
        if (BbaseApp.getView(this._options.viewId).getType() === 'tab-ul-line') this.setSliderBar(lazy);
      }
    },
    setSliderBar: function(lazy) {
      setTimeout(BbaseEst.proxy(function() {
        BbaseApp.getView(this._options.viewId).setSliderBar(this.$el.outerWidth(), this.$el.position().left);
      }, this), lazy ? 200 : 0);
    },
    toggleChecked: function(e) {
      this._check(e);
      this.showCurModule(this._getValue(this.options.data.path));
      $(this._options.data.target).val(this._getValue(this.options.data.path));
      this.options.data.onChange.call(this, this.model.attributes);
    }
  });

  /**
   * tab选项卡
   * @method [选项卡] - BbaseTab
   * @author wyj 15.8.20
   * @example
   *        BbaseApp.addView('manageListNav', new BbaseTab({
   *          el: this.$('.wdm_cat'),                                                 // 插入点
   *          viewId: 'manageListNav',                                                // 视图ID
   *          tpl: '<a href="javascript:;">{{text}}</a>',                             // 模版
   *          toolTip: true,                                                          // 是否初始化提示，详见SuperView的_initilize参数说明
   *          cur: '#config-prop',                                                    // 显示当前项内容
   *          require: false,                                                         // 是否模块化请求， 默认为true（若去除此配置，items里的nodeId都得改成moduleId）
   *          theme: 'tab-ul-text',                                                   // 样式：目前有tab-ul-normal,tab-ul-text,tab-ul-btn,tab-ul-line
   *          path: 'nodeId',                                                         // 作用域字段
   *          contSelector: '#tab-cont',                                                       // 【可选】容器选择符
   *          args: {},                                                               // 传递给视图的参数
   *          items: [
   *            { text: '最新', nodeId: '#config-prop', sortType: 'addTime'},         // 若存在moduleId,则配置项里require是否为false,都会根据模块类型渲染，el默认为nodeId
   *            { text: '浏览量', nodeId: '#config-global', sortType: 'views', oneRender: false},  // 若存在oneRender: true,则只渲染一次， 否则实时
   *            { text: '转发量', nodeId: '#config-global', sortType: 'mviews', delay: false}, // 是否延迟加载
   *            { text: '反馈量', nodeId: '#config-global', sortType: 'rviews'}
   *          ],
   *          onChange: BbaseEst.proxy(function (item, init) {                               // 点击事件回调
   *            if (init) return;                                                     // 是否是初始化
   *            this.collection.paginationModel.set('sortType', item.sortType);
   *            this._reload();                                                       // 重新加载列表   _load()表示可追加列表
   *          }, this)
   *        }));
   */
  BbaseTab = BbaseList.extend({
    initialize: function() {
      this.targetVal = $(this.options.target).val();
      this.$tabCont = $('<div class="tab-cont"></div>'); // 导航容器
      this.$tabList = null; // 导航列表
      this.$selectorList = []; // 目标元素选择符列表
      this.$listCont = this.options.contSelector ? $(this.options.contSelector) : this.$tabCont; // 目标元素的容器

      this.options.data = BbaseEst.extend(this.options.data || {}, {
        template: this.options.tpl || '<span>{{text}}</span>',
        cur: this.options.cur || (BbaseEst.typeOf(this.targetVal) === 'undefined' ? '' : this.targetVal),
        path: this.options.path || 'value',
        tagName: this.options.tagName || 'li',
        target: this.options.target,
        onChange: this.options.onChange || function() {}
      });
      if (typeof this.options.require === 'undefined' ||
        (typeof this.options.require !== 'undefined' && this.options.require)) {
        this.require = true;
        BbaseEst.each(this.options.items, BbaseEst.proxy(function(item, index) {
          this.$listCont.append($('<div class="tab-cont-div tab-cont-' + this.options.viewId + index + '" style="display: none;"></div>'));
        }, this));
        this.$tabList = this.$listCont.find('.tab-cont-div');
      } else if ('nodeId' in this.options.items[this.options.items.length - 1]) {
        BbaseEst.each(this.options.items, function(item) {
          this.$selectorList.push(item[this.options.path]);
        }, this);
        setTimeout(BbaseEst.proxy(function() {
          this.$tabList = $(this.$selectorList.join(', '));
        }, this), 0);
      }
      this._super({
        template: '<ul class="tab-ul tab-ul' + this.options.viewId + ' ' + (this.options.theme || 'tab-ul-normal') + ' nav-justified clearfix"></ul>' + (this.options.theme === 'tab-ul-line' ? '<div class="slideBar"><div class="slideBarTip transitionPanel" style="left: 3.5px; width: auto;"></div></div>' : ''),
        model: model,
        render: '.tab-ul' + this.options.viewId,
        collection: collection,
        item: item,
        checkAppend: false
      });
    },
    renderModule: function(index, moduleName, viewId) {
      try{
        var viewId = viewId || (moduleName + '-' + index);
      this.renderType = BbaseEst.typeOf(this.options.items[index]['oneRender']) === 'undefined' ? '_one' :
        this.options.items[index]['oneRender'] ? '_one' : '_require';

      this[this.renderType]([moduleName + (this.renderType === '_one' ? '-' + index : '')], function(instance) {
        BbaseApp.addRegion(moduleName + '-' + index, instance, {
          el: this.$tabList.eq(index),
          viewId: viewId,
          passData:  BbaseEst.typeOf(this.options.items[index]['data']) === 'undefined' ?
            BbaseApp.getView(this.$el.parents('.region:first').attr('data-view')).model.toJSON() : this.options.items[index]['data'] || {}
        });
      });
      if (BbaseApp.getView(viewId) && BbaseApp.getView(viewId).refresh)
        BbaseApp.getView(viewId).refresh();
      }catch(e){
        console.dir(e);
      }
    },
    showModule: function(modId, index, moduleId, viewId) {
      try {
        var moduleName = modId;
        if (!this.$tabList) return;

        // 显示隐藏
        this.$tabList.hide();
        this.$tabList.size() > 0 && this.$tabList.eq(index).show();
        if (!this.require && !moduleId) {
          return;
        } else if (moduleId) {
          moduleName = moduleId;
        }
        this.renderModule(index, moduleName, viewId);
      } catch (e) {
        console.log(e);
      }
    },
    setSliderBar: function(width, left) {
      this.$('.slideBarTip:first').css({
        left: left,
        width: width
      });
    },
    getType: function() {
      return this._options.theme;
    },
    afterRender: function() {
      this.$el.append(this.$tabCont);
    }
  });

  module.exports = BbaseTab;
});