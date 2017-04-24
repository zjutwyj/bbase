'use strict';
/**
 * @description 模块功能说明
 * @class BbaseListExpand
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseListExpand', [], function (require, exports, module) {

  var BbaseListExpand = BbaseList.extend({
    initialize: function () {
      this._super({
        template: `
          <div bb-bbaseuiscrollbar="{viewId: 'viewId'}" class="bbase-ui-listexpand section-list cc-scrollbar ps-container ps-theme-default" style="height: {{height}}px;" >
            <div class="inner">
              <div class="inner-list">

              </div>
              <div class="inner-more" bb-show="hasMore" style="display:none;">
                 <span class="more-sections" bb-click="showMoreCate"  role="button" tabindex="0">
                  <span bb-watch="showMore:html">{{#If showMore}}收起全部{{else}}查看全部{{/If}}</span>
                <div bb-watch="showMore:class" class="bbasefont bbase-dropdown {{#If showMore}}dropup{{/If}}"></div>
              </span>
              </div>
            </div>
          </div>

        `,
        model: BbaseModel.extend({
          baseId: 'id',
          baseUrl: CONST.API + '/modules/detail'
        }),
        collection: BbaseCollection.extend({
          url: CONST.API + '/modules/list'
        }),
        item: BbaseItem.extend({
          tagName: 'div',
          className: 'section-button-container',
          template: `
            <div bb-watch="checked:class" class="section-button already-used {{#If checked}}selected{{/If}}" bb-click="handleClick" data-hook="section-button" role="button" tabindex="0">
              <span bb-watch="name:html">{{name}}</span>
              <div class="bbasefont bbase-correct already-used-check" bb-show="checked"></div>
            </div>
          `,
          afterRender: function () {},
          handleClick: function () {
            this._super('view').handleClick(this._get(this._super('view')._options.path));
          }
        }),
        diff: true,
        pageSize: 999999,
        render: '.inner-list'
      });
    },
    initData: function () {
      this.initMax = this._options.max || 99999;
      this.initView = true;
      if (!this._options.path) { this._options.path = 'id'; }
      return {
        showMore: false,
        hasMore: false,
        height: this._options.height || 200
      }
    },
    afterLoad: function (result) {
      this.copyList = BbaseEst.cloneDeep(result ? result.attributes.data : this._options.items);
    },
    afterRender: function () {
      var _this = this;
      this._set('showMore', this.collection.models.length <= parseInt(this._options.max, 10) ? false : true);
      this._set('hasMore', this._getCount() <= parseInt(this._options.max, 10) ? false : true);
      setTimeout(function () {
        _this.iscroll.refresh();
      }, 100);
      if (this._options.cur) {
        this.handleClick(this._options.cur);
      }
    },
    handleClick: function (value) {
      var curModel = null;
      var _this = this;
      if (this.curValue && this.curValue === value) {
        return;
      }
      this.curValue = value;
      this.collection.each(function (model) {
        if (model._get(_this._options.path) === value) {
          curModel = model.toJSON(true);
          model.view._set('checked', true);
        } else {
          model.view._set('checked', false);
        }
      });
      if (this._options.onChange) {
        var init = this.initView;
        this.initView = false;
        this._options.onChange.call(this, curModel, init);
      }
    },
    setValue: function (value) {
      this.handleClick(value);
    },
    showMoreCate: function () {
      this._set('showMore', !this._get('showMore'));
      this._options.max = this._get('showMore') ? 10000 : this.initMax;
      this._setModels(this.copyList);
      this.iscroll.refresh();
    }

  });

  module.exports = BbaseListExpand;
});
