'use strict';
/**
 * @description BbaseTab
 * @class UI - ui库
 * @author yongjin<zjut_wyj@163.com> 2015/9/6
 */
define('BbaseTab', [], function (require, exports, module) {
  var BbaseTab, model, collection, item;

  model = BbaseModel.extend({
    baseId: 'id',
    defaults: BbaseEst.extend({}, BbaseModel.prototype.defaults)
  });

  collection = BbaseCollection.extend({
    model: model
  });

  item = BbaseItem.extend({
    tagName: function () {
      return this.options.data.tagName || 'li';
    },
    className: 'tab-li',
    events: {
      'click .toggle': 'toggleChecked'
    },
    initialize: function () {
      this.tabName = this.options.data.tagName || 'li';
      this._super({
        template: '<div class="toggle">' + this.options.data.template + '</div>',
        toolTip: this.options.data.toolTip
      });
    },
    afterRender: function () {
      if (this.options.data.cur !== '-' && (this.options.data.cur === this._get(this.options.data.path))) {
        this._check();
        this.options.data.onChange.call(this, this.model.attributes, true);
        setTimeout(BbaseEst.proxy(function () {
          this.showCurModule(this._get('moduleId'), this._get('nodeId'), true);
        }, this), 0);
      }
      this.$('.toggle:first').addClass('tab-' + this._get(this.options.data.path));
      if (BbaseEst.typeOf(this._get('delay')) === 'boolean' && !this._get('delay')) {
        this._delay(function () {
          this._super('view').renderModule(this._get('dx'), this._get('moduleId'), this._get('viewId'));
        }, 100);
      }
    },
    showCurModule: function (modId, nodeId, lazy) {
      if (BbaseApp.getView(this._options.viewId)) {
        if (this._super('view').getType() === 'tab-ul-line') this.setSliderBar(lazy);
        this._super('view').showModule(modId, nodeId, this.model.get('dx'), this.model.get('viewId'));
      }
    },
    setSliderBar: function (lazy) {
      setTimeout(BbaseEst.proxy(function () {
        if (this._super().options.direction === 'v') {
          BbaseApp.getView(this._options.viewId).setSliderBar(null, this.$el.outerHeight(), null, this.$el.position().top);
        } else {
          BbaseApp.getView(this._options.viewId).setSliderBar(this.$el.outerWidth(), null, this.$el.position().left, null);
        }

      }, this), lazy ? 200 : 0);
    },
    toggleChecked: function (e) {
      this._check(e);
      this.showCurModule(this._get('moduleId'), this._get('nodeId'));
      $(this._options.data.target).val(this._get(this.options.data.path));
      this.options.data.onChange.call(this, this.model.attributes);
    },
    handleClick(type){
      this._super('view').handleClick(type, this.model.toJSON(true));
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
    initialize: function () {
      this.targetVal = $(this.options.target).val();
      this.$tabCont = $('<div class="tab-cont"></div>'); // 导航容器
      this.$tabList = []; // 导航列表
      this.$listCont = this.options.contSelector ? $(this.options.contSelector) : this.$tabCont; // 目标元素的容器

      this.options.data = BbaseEst.extend(this.options.data || {}, {
        template: this.options.tpl || '<span>{{text}}</span>',
        cur: this.options.cur || (BbaseEst.typeOf(this.targetVal) === 'undefined' ? '' : this.targetVal),
        path: this.options.path || 'value',
        tagName: this.options.tagName || 'li',
        target: this.options.target,
        onChange: this.options.onChange || function () {}
      });

      this.hasCount = this.options.contSelector ? true : false;
      BbaseEst.each(this.options.items, this._bind(this.addTab, this));

      var theme = (this.options.theme || 'tab-ul-normal');
      this._super({
        template: '<div class="bbase-ui-tab ' + (this.options.direction || 'h') + '"><div class="tab-head tab-head-' + theme + '"><ul class="tab-ul tab-ul' + this.options.viewId + ' ' + theme + ' nav-justified clearfix"></ul></div>' + (this.options.theme === 'tab-ul-line' ? '<div class="slideBar"><div class="slideBarTip transitionPanel" style=""></div></div></div>' : ''),
        model: model,
        render: '.tab-ul' + this.options.viewId,
        collection: collection,
        item: item,
        checkAppend: false
      });
    },
    afterRender(){
      this.$el.find('.bbase-ui-tab').append(this.$tabCont);
      this.$('.no-result').remove();
    },
    handleClick(type, item){
      if (this._options.handleClick){
        this._options.handleClick.call(this, type, item);
      }
    },
    addTab: function (item, index) {
      if (item.moduleId) {
        if (this.$listCont.find('.tab-cont-' + this.options.viewId + index).size() === 0) {
          this.$tabList.push($('<div class="tab-cont-div tab-cont-' + this.options.viewId + index + '" style="display: none;"></div>'));
          this.$listCont.append(this.$tabList[index]);
        } else {
          this.$tabList.push(this.$listCont.find('.tab-cont-' + this.options.viewId + index));
        }
      } else if (item.nodeId) {
        if (this.$listCont.find(item['nodeId']).size() === 0 || $('body').find(item['nodeId']).size() === 0){
          this.$tabList.push(this.hasCount ? this.$listCont.find(item['nodeId']) : $('body').find(item['nodeId']));
        }
      }
    },
    renderModule: function (index, moduleName, viewId) {
      try {
        if (!moduleName) {
          return;
        }
        var viewId = viewId || (moduleName + '-' + index);
        this.renderType = BbaseEst.typeOf(this.options.items[index]['oneRender']) === 'undefined' ? '_one' :
          this.options.items[index]['oneRender'] ? '_one' : '_require';

        this[this.renderType]([moduleName + (this.renderType === '_one' ? '-' + index : '')], function (instance) {
          this._region(moduleName + '-' + index, instance, {
            el: this.$tabList[index],
            viewId: viewId,
            data: this.options.items[index]['data'] || {}
          });
        });
        if (BbaseApp.getView(viewId) && BbaseApp.getView(viewId).refresh)
          BbaseApp.getView(viewId).refresh();
      } catch (e) {
        console.dir(e);
      }
    },
    showModule: function (modId, nodeId, index, viewId) {
      try {
        var moduleName = modId;
        if (this.$tabList.length === 0) return;

        // 显示隐藏
        for (var i = 0, len = this.$tabList.length; i < len; i++) {
          if (i === index) {
            this.$tabList[index].show();
          } else {
            this.$tabList[i].hide();
          }
        }
        if (nodeId || (!nodeId && !modId) || (!this.require && !modId)) {
          return;
        } else if (modId) {
          moduleName = modId;
        }
        this.renderModule(index, moduleName, viewId);
      } catch (e) {
        console.log(e);
      }
    },
    setSliderBar: function (width, height, left, top) {
      if (width) {
        this.$('.slideBarTip:first').css({
          left: left,
          width: width
        });
      } else {
        this.$('.slideBarTip:first').css({
          top: top,
          height: height,
          width: this.$('.slideBarTip:first').width()
        });
      }
    },
    setValue: function (value) {
      var checkModel = this._getCheckedItems();
      if (checkModel.length > 0 && checkModel[0]._get(this._options.path || 'value') === value) {
        return;
      }
      if(value === '' && checkModel.length>0){
        checkModel[0].view.$el.removeClass('item-active');
      }
      this.collection.each(this._bind(function (model) {
        if (model._get(this._options.path || 'value') === value) {
          model.view.toggleChecked();
        }
      }));
    },
    getType: function () {
      return this._options.theme;
    },
    setList: function (items) {
      this.$('.no-result').remove();
      this._setModels(items);
      this.$tabList = [];
      BbaseEst.each(items, this._bind(this.addTab, this));
    }
  });

  module.exports = BbaseTab;
});
