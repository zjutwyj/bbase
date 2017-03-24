'use strict';
/**
 * @description 模块功能说明
 * @class BbaseColorPanel
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseColorPanel', [], function (require, exports, module) {
  var BbaseColorPanel, template;

  template = `
    <div class="BbaseColorPanel-wrap">
      <div bb-bbaseuiitemcheck="{viewId:'colorpanel',cur:cur,items:items, tpl: tpl, onChange: handleChange }"></div>
    </div>
  `;

  BbaseColorPanel = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    initData: function () {
      return {
        items: [
          { text: '透明', value: 'transparent' },
          { text: '白色', value: '#ffffff', rgb: 'rgb(255, 255, 255)' },
          { text: '米色', value: '#fedac2', rgb: 'rgb(254, 218, 194)' },
          { text: '天蓝', value: '#abedfa', rgb: 'rgb(171, 237, 250)' },
          { text: '楷体', value: '#eaeac6', rgb: 'rgb(234, 234, 198)' },
          { text: '黑体', value: '#bbe4e6', rgb: 'rgb(187, 228, 230)' },
          { text: '黑体', value: '#fac8f5', rgb: 'rgb(250, 200, 245)' },
          { text: '黑体', value: '#b7e775', rgb: 'rgb(183, 231, 117)' },
          { text: '黑体', value: '#e3f094', rgb: 'rgb(227, 240, 148)' },
          { text: '黑体', value: '#fdeb7a', rgb: 'rgb(253, 235, 122)' },
          { text: '黑体', value: '#cccccc', rgb: 'rgb(204, 204, 204)' },
          { text: '黑体', value: '#ccff33', rgb: 'rgb(204, 255, 51)' },
          { text: '黑体', value: '#ff6666', rgb: 'rgb(255, 102, 102)' },
          { text: '黑体', value: '#66ccff', rgb: 'rgb(102, 204, 255)' },
          { text: '黑体', value: '#ff0000', rgb: 'rgb(255, 0, 0)' },
          { text: '黑体', value: '#3399ff', rgb: 'rgb(51, 153, 255)' },
          { text: '黑体', value: '#ff9900', rgb: 'rgb(255, 153, 0)' },
          { text: '黑体', value: '#339966', rgb: 'rgb(51, 153, 102)' },
          { text: '黑体', value: '#ffff99', rgb: 'rgb(255, 255, 153)' },
          { text: '黑体', value: '#cc99ff', rgb: 'rgb(204, 153, 255)' },
          { text: '黑体', value: '#00ffff', rgb: 'rgb(0, 255, 255)' },
          { text: '黑体', value: '#66ffcc', rgb: 'rgb(102, 255, 204)' },
          { text: '黑体', value: '#999999', rgb: 'rgb(153, 153, 153)' },
          { text: '黑体', value: '#666666', rgb: 'rgb(102, 102, 102)' },
          { text: '黑体', value: '#21292b', rgb: 'rgb(33, 41, 43)' },
          { text: '黑体', value: '#cccc00', rgb: 'rgb(204, 204, 0)' },
          { text: '黑体', value: '#996633', rgb: 'rgb(153, 102, 51)' },
          { text: '黑体', value: '#66cccc', rgb: 'rgb(102, 204, 204)' },
          { text: '黑体', value: '#99cccc', rgb: 'rgb(153, 204, 204)' },
          { text: '黑体', value: '#ccffff', rgb: 'rgb(204, 255, 255)' },
          { text: '黑体', value: '#ccffcc', rgb: 'rgb(204, 255, 204)' },
          { text: '黑体', value: '#9999ff', rgb: 'rgb(153, 153, 255)' },
          { text: '黑体', value: '#66cc99', rgb: 'rgb(102, 204, 153)' },
          { text: '黑体', value: '#6666cc', rgb: 'rgb(102, 102, 204)' },
          { text: '黑体', value: 'rgba', rgb: 'rgba' }
        ],
        tpl: '<span class="cd-r-cur-in-cnt fl" style="width: 100%;height: 100%;display: inline-block;background-color:{{value}}">&nbsp;</span>'
      }
    },
    compare: function (item) {
      if (item.value === 'rgba') {
        this.$('.cd-r-cur-in-cnt').addClass('sprite-design background-color-custom');
      }
      if (item.value === cur || item.rgb === cur) {
        return true;
      } else {
        return false;
      }
    },
    handleChange: function () {
      if (item['value'] !== 'rgba') {
        this._set(object.cur, item['value']);
      } else {
        this._dialog({
          moduleId: 'BbaseColorPick',
          title: null,
          quickClose: true,
          cover: false,
          hideCloseBtn: true,
          width: 400,
          color: this._get('cur'),
          hideSaveBtn: true,
          target: this.$el.get(0),
          onChange: BbaseEst.proxy(function (color) {
            this._set(object.cur, color);
          }, this)
        });
      }
    }
  });

  module.exports = BbaseColorPanel;
});
