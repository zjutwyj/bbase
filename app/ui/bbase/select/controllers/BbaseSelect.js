'use strict';
/**
 * @description 下拉菜单
 * @class UI - ui库
 * @author yongjin<zjut_wyj@163.com> 2015/1/5
 */
define('BbaseSelect', [], function(require, exports, module) {
  var BbaseSelect, model, item, collection, list;
  var listTemp = '';
  var viewTemp = '<div class="bbase-ui-select bui-select ui-select" aria-disabled="false" tabindex="0" hidefocus="true" style="width: {{width}}px;" aria-pressed="false"> <input type="text" readonly="readonly" class="bui-select-input bui-form-field" style="width: {{minus width 56}}px;border-right:none;" aria-disabled="false" aria-pressed="false"> <span class="x-icon x-icon-normal down" style="margin-left: -4px;"><i class="bbasefont bbase-caretdown" style="width: 8px; height: 8px"></i> </span> </div>';

  model = BbaseModel.extend({});

  collection = BbaseCollection.extend({
    model: model
  });

  item = BbaseItem.extend({
    tagName: 'li',
    className: 'bui-list-item bui-list-item-select',
    events: {
      'click .select-div': 'selectItem'
    },
    initialize: function() {
      this._initialize({});
      /*this.model.set('text', this.model.get(this._options.data.text));
      this.model.set('value', this.model.get(this._options.data.value));*/
      this.model.attributes.text = this.model.get(this._options.data.text);
      this.model.attributes.value = this.model.get(this._options.data.value);
      this.model.on('autoSelectNode', this.autoSelectNode, this);
      if (BbaseEst.typeOf(this._options.data.inputValue) === 'number' && this._options.data.inputValue === this.model.get('value')) {
        setTimeout(BbaseEst.proxy(function() {
          this.selectItem(false);
        }, this), 0);
      }
      if (BbaseEst.typeOf(this._options.data.inputValue) === 'string' && this._options.data.inputValue &&
        this._options.data.inputValue.indexOf(this.model.get('value')) !== -1) {
        setTimeout(BbaseEst.proxy(function() {
          this.selectItem(false);
        }, this), 0);
      }
      if (BbaseEst.isEmpty(this._options.data.inputValue) && BbaseEst.isEmpty(this.model.get('value'))) {
        setTimeout(BbaseEst.proxy(function() {
          this.selectItem(false);
        }, this), 0);
      }
    },
    autoSelectNode: function() {
      setTimeout(BbaseEst.proxy(function() {
        var $selectNode = this.$el.find('.select-div');
        $selectNode.click();
      }, this), 100);
    },
    selectItem: function(hasCallback) {
      if (BbaseEst.typeOf(hasCallback) === 'undefined') hasCallback = true;
      this._options.data.inputValue = this.model.get('value');
      BbaseApp.getView(this._options.viewId).setInputValue(this.model.get('text'), this.model.toJSON(), false, hasCallback, this._options.data.postData);
      BbaseApp.getView(this._options.viewId).setCurrentSelect(this.$el);
      BbaseApp.getView(this._options.viewId).setSubSelect(this.model);
      BbaseApp.getView(this._options.viewId).setVal();
    }
  });

  list = BbaseList.extend({
    events: {
      'click .select-search': 'searchClick',
      'keyup .select-search': 'search',
      'click .select-search-btn': 'search'
    },
    initialize: function() {
      this._initialize({
        model: model,
        collection: collection,
        item: item,
        template: listTemp,
        clearDialog: false,
        enterRender: '.select-search-btn'
      });
    },
    // 搜索
    search: function(e) {
      e.stopImmediatePropagation();
      this.searchKey = BbaseEst.trim(this.$('.select-search').val());
      if (this.preSearchKey === this.searchKey) return;
      this.preSearchKey = this.searchKey;
      this.isSearch = false;
      if (!this.isSearch) {
        this.isSearch = true;
        setTimeout(BbaseEst.proxy(function() {
          if (BbaseEst.isEmpty(this.searchKey)) {
            this._load({
              page: 1,
              pageSize: 1000
            });
          } else {
            this._search({
              filter: [{
                key: this._options.data.text,
                value: this.searchKey
              }]
            });
          }
          this.isSearch = false;
        }, this), 500);
      }
    },
    selectClick: function(id) {
      BbaseEst.each(this.collection.models, BbaseEst.proxy(function(item) {
        if (item.get('value') === id) {
          item.trigger('autoSelectNode');
          return false;
        }
      }, this));
    },
    searchClick: function(e) {
      e.stopImmediatePropagation();
    },
    setInputValue: function(val, model, _init, hasCallback, postData) {
      this.$input.val(BbaseEst.trim(val).replace('|-', ''));
      this._select = model.value;
      if (!_init) {
        if (this._options.onChange && hasCallback)
          this._options.onChange.call(this, model, _init, postData);
      }
      this._options._init = false;
    },
    setInputNode: function(node) {
      this.$input = node;
    },
    setCurrentSelect: function(select) {
      if (this.$currentSelect) {
        this.$currentSelect.removeClass('bui-list-item-selected');
      }
      this.$currentSelect = select;
      this.$currentSelect.addClass('bui-list-item-selected');
    },
    setSubSelect: function(model) {
      this.empty();
    },
    empty: function() {
      if (this.sub) {
        this.sub.empty();
        this.sub = null;
      }
    },
    setVal: function() {
      if (this._options.input) {
        this._options.input.val(BbaseApp.getView(this._options.originId).getValue());
        if (!this.dic) {
          this._options.input.change();
        }
      }
    },
    disableInputChange: function() {
      this.dic = true;
    },
    enableInputChange: function() {
      this.dic = false;
    },
    getValue: function() {
      if (this.sub) {
        var select = this.sub.getValue();
        if (BbaseEst.isEmpty(select)) {
          return this._select;
        }
        return select;
      } else {
        return this._select;
      }
    },
    getSelect: function() {
      return this.$('.bui-list-picker');
    }
  });

  /**
   * 下拉菜单
   * @method [下拉菜单] - Select
   * @author wyj 15.8.20
   * @example
   *      BbaseUtils.initSelect({
   *        render: '#select2',
   *        target: '#model-categoryId2',
   *        text: 'name',
   *        value: 'categoryId',
   *        width: 300,
   *        tpl: '<div class="bui-list-item-select-inner select-div "><span class="x-grid-checkbox">
   *          <input class="toggle" type="checkbox" {{#if checked}}checked{{/if}}></span>{{text}}</div>', // 自定义选项[选填]
   *        items: list,
   *        search: true,
   *        postData: '',
   *        onChange: function (ev, init, postData) {
   *            console.log($('#select2 input[type=hidden]').val());
   *        }
   *    });
   */
  BbaseSelect = BbaseView.extend({
    events: {
      'click .bui-select-input': 'showSelect',
      'click .down': 'showSelect'
    },
    initialize: function() {
      if (BbaseEst.typeOf(this.options.render) !== 'string') {
        this.$el = $(this.options.el, this.options.render);
      }
      this.options.data = this.options.data || {};
      this.options.data = BbaseEst.extend({
        width: 150
      }, this.options.data);

      if (this.options.width)
        this.options.data.width = this.options.width < 65 ? 65 : this.options.width;
      this.options.text = this.options.text || 'text';
      this.options.value = this.options.value || 'value';
      this.options.disabled = BbaseEst.typeOf(this.options.disabled) === 'boolean' ? this.options.disabled : false;

      this._initialize({
        template: viewTemp
      });
      this.initRender = true;
      listTemp = '<div class="bbase-ui-select bbase-ui-select-down bui-list-picker bui-picker bui-overlay bui-ext-position x-align-bl-tl bui-select-custom" ' +
        'aria-disabled="false" aria-pressed="false" style="visibility: visible;width:{{minus width 2}}px; display: none;"> ' +
        '{{#if search}} <div class="select-search-container"> <input class="select-search-btn" type="hidden"/> ' +
        '<input type="text" class="select-search"  style="width:{{minus width 32}}px;"/> </div> {{/if}}' +
        ' <div class="bui-simple-list bui-select-list" aria-disabled="false" aria-pressed="false"> ' +
        '<ul class="select-ul"><div class="bui-list-item-select-inner select-div">{{text}}</div></ul> ' +
        '</div> </div>';
    },
    /**
     * 初始化下拉框
     * @method initSelect
     * @param items
     * @private
     * @author wyj 15.6.13
     */
    initSelect: function(items) {
      var viewId = this._options.viewId;
      BbaseApp.addPanel('select-' + viewId, {
        el: 'body',
        append: true,
        template: '<div class="select-container-' + viewId + '"></div>'
      });
      this.selectNode = new list({
        el: '.select-container-' + viewId,
        viewId: 'select-list-' + viewId,
        items: items,
        originId: this._options.originId || viewId,
        target: this._options.target,
        input: this._options.input,
        onChange: this._options.onChange,
        clearDialog: false,
        _init: true,
        speed: 1,
        data: {
          tpl: this._options.tpl,
          text: this._options.text || 'text',
          value: this._options.value || 'value',
          postData: this._options.postData,
          inputValue: this._options.inputValue,
          inputNode: this.$('.bui-select-input'),
          search: this._options.search,
          width: this._options.data.width || 150
        },
        render: '.select-ul'
      });
      BbaseApp.addView('select-list-' + viewId, this.selectNode);
      this.selectNode.setInputNode(this.$('.bui-select-input'));
      this.$select = this.selectNode.getSelect();
    },
    changeSelect: function(value) {
      if (!this.selectNode) {
        this.initSelect(this._options.items);
      }
      this.selectNode.selectClick(value);
    },
    /**
     * 设置input隐藏域值
     * @method initInputValue
     * @private
     * @param items
     * @author wyj 15.6.13
     */
    initInputValue: function(items) {
      if (!items) return;
      var id = this._options.cur === 0 ? 0 : (this._options.cur || $(this._options.target).val());
      BbaseEst.each(items, function(item) {
        if (((item[this._options.value] + '') === (id + '')) || (BbaseEst.isEmpty(item[this._options.value]) && BbaseEst.isEmpty(id))) {
          this.$('.bui-select-input').val(BbaseEst.trim(item[this._options.text]).replace('|-', ''));
          //if (!this.initRender)
          if (this._options.onChange)
            this._options.onChange.call(this, item, this.initRender, this._options.data.postData);
        }
      }, this);
      this.initRender = false;
    },
    /**
     * 显示下拉框 判断是否已经存在下拉菜单， 不存在则创建一个下拉菜单，
     * 存在则设置position样式， 并绑定document click事件，
     * 点击隐藏下拉菜单
     *
     * @method showSelect
     * @private
     * @param event
     * @author wyj 15.6.13
     */
    showSelect: function(event) {
      if (this._options.disabled) return;
      $(document).click();
      event.stopImmediatePropagation();
      if (!this.selectNode) this.initSelect(this._options.items);
      this.$select.css({
        zIndex: 100000,
        width: (this._options.data.width || 150) - 19 + 'px',
        left: this.$('.bui-select').offset().left,
        top: this.$('.bui-select').offset().top + 31
      }).show();
      $(document).one('click', $.proxy(function() {
        this.hideSelect();
      }, this));
    },
    hideSelect: function() {
      this.$select.hide();
    },
    disable: function() {
      this._options.disabled = true;
    },
    enable: function() {
      this._options.disabled = false;
    },
    // 清空下拉框
    empty: function() {
      if (this.selectNode) {
        this.selectNode.empty();
      }
      this.$el.off().remove();
    },
    // 获取select值
    getValue: function() {
      if (this.selectNode) {
        return this.selectNode.getValue();
      }
    },
    // 设置input值
    setVal: function() {
      if (this._options.input) {
        this._options.input.val(this.getValue());
      }
    },
    setValue: function(value) {
      var list = null;
      if (!this.selectNode) this.initSelect(this._options.items);
      list = BbaseEst.filter(this.selectNode.collection.models, function(item) {
        return value === item.attributes.value;
      });
      if (list.length > 0) {
        this._options.inputValue = value;
        this.selectNode.setInputValue(list[0].get('text'), list[0].toJSON(), false, true, this._options.data.postData);
        this.selectNode.disableInputChange();
        if (this.selectNode) list[0].trigger('autoSelectNode');
        setTimeout(BbaseEst.proxy(function() {
          this.selectNode.enableInputChange();
        }, this), 300);
      }

    },
    afterRender: function() {
      if (this._options.target) {
        this._options.input = $(this._options.target);
        this._options.inputValue = this._options.input.val();
      }
      if (!BbaseEst.isEmpty(this._options.cur)) this._options.inputValue = this._options.cur;
      if (this._options.items) this.initInputValue(this._options.items);
    }
  });

  module.exports = BbaseSelect;
});
