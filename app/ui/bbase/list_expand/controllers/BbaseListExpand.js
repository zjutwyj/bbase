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
              <div class="inner-more">
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
              <div class="bbasefont bbase-ok already-used-check" bb-show="checked"></div>
            </div>
          `,
          afterRender: function () {},
          handleClick: function () {
            this._super('view').handleClick(this.model.toJSON());
          }
        }),
        diff: true,
        pageSize: 999999,
        render: '.inner-list'
      });
    },
    initData: function () {
      this.initMax = this._options.max || 99999;
      return {
        showMore: false,
        height: this._options.height || 200
      }
    },
    afterLoad: function (result) {
      this.copyList = BbaseEst.cloneDeep(result ? result.attributes.data : this._options.items);
    },
    afterRender: function () {
      var _this = this;
      if (this.collection.models.length <= this._options.max) {
        this._set('showMore', false);
      }
      setTimeout(function () {
        _this.iscroll.refresh();
      }, 100);
      if (this._options.cur) {
        this.handleClick({
          id: this._options.cur
        });
      }
    },
    handleClick: function (item) {
      this.collection.each(function (model) {
        if (model._get('id') === item.id) {
          model.view._set('checked', true);
        } else {
          model.view._set('checked', false);
        }
      });
      if (this._options.onChange) {
        this._options.onChange.call(this, item);
      }
    },
    setValue: function (value) {
      this.handleClick({
        id: value
      });
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
