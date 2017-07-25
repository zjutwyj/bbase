'use strict';
/**
 * @description 模块功能说明
 * @class BbaseColorPanel
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseColorPanel', [], function (require, exports, module) {
  var BbaseColorPanel, template, color;

  template = `
    <div class="bbase-component-colorpanel BbaseColorPanel-wrap">
      <div bb-bbaseuiitemcheck="{viewId:'colorpanel',cur:cur,items:items, tpl: tpl, onChange: handleChange ,compare:compare}"></div>

    </div>
  `;

  BbaseColorPanel = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    initData: function () {
      color=this._options.color || '#ffffff';
      return {
        cur: color,
        items:  [
          { text: '透明', value: 'transparent'  ,borderColor: 'transparent'},
          { text: '白色', value: '#ffffff', rgb: 'rgb(255, 255, 255)' ,borderColor: '#fff'},
          { text: '米色', value: '#fedac2', rgb: 'rgb(254, 218, 194)' ,borderColor: '#fedac2'},
          { text: '天蓝', value: '#abedfa', rgb: 'rgb(171, 237, 250)' ,borderColor: '#abedfa'},
          { text: '楷体', value: '#eaeac6', rgb: 'rgb(234, 234, 198)' ,borderColor: '#eaeac6'},
          { text: '黑体', value: '#bbe4e6', rgb: 'rgb(187, 228, 230)' ,borderColor: '#bbe4e6'},
          { text: '黑体', value: '#fac8f5', rgb: 'rgb(250, 200, 245)' ,borderColor: '#fac8f5'},
          { text: '黑体', value: '#b7e775', rgb: 'rgb(183, 231, 117)' ,borderColor: '#b7e775'},
          { text: '黑体', value: '#e3f094', rgb: 'rgb(227, 240, 148)' ,borderColor: '#e3f094'},
          { text: '黑体', value: '#fdeb7a', rgb: 'rgb(253, 235, 122)' ,borderColor: '#fdeb7a'},
          { text: '黑体', value: '#cccccc', rgb: 'rgb(204, 204, 204)' ,borderColor: '#cccccc'},
          { text: '黑体', value: '#ccff33', rgb: 'rgb(204, 255, 51)' ,borderColor: '#ccff33'},
          { text: '黑体', value: '#ff6666', rgb: 'rgb(255, 102, 102)' ,borderColor: '#ff6666'},
          { text: '黑体', value: '#66ccff', rgb: 'rgb(102, 204, 255)' ,borderColor: '#66ccff'},
          { text: '黑体', value: '#ff0000', rgb: 'rgb(255, 0, 0)' ,borderColor: '#ff0000'},
          { text: '黑体', value: '#3399ff', rgb: 'rgb(51, 153, 255)' ,borderColor: '#3399ff'},
          { text: '黑体', value: '#ff9900', rgb: 'rgb(255, 153, 0)' ,borderColor: '#ff9900'},
          { text: '黑体', value: '#339966', rgb: 'rgb(51, 153, 102)' ,borderColor: '#339966'},
          { text: '黑体', value: '#ffff99', rgb: 'rgb(255, 255, 153)' ,borderColor: '#ffff99'},
          { text: '黑体', value: '#cc99ff', rgb: 'rgb(204, 153, 255)' ,borderColor: '#cc99ff'},
          { text: '黑体', value: '#00ffff', rgb: 'rgb(0, 255, 255)' ,borderColor: '#00ffff'},
          { text: '黑体', value: '#66ffcc', rgb: 'rgb(102, 255, 204)' ,borderColor: '#66ffcc'},
          { text: '黑体', value: '#999999', rgb: 'rgb(153, 153, 153)' ,borderColor: '#999999'},
          { text: '黑体', value: '#666666', rgb: 'rgb(102, 102, 102)' ,borderColor: '#666666'},
          { text: '黑体', value: '#21292b', rgb: 'rgb(33, 41, 43)' ,borderColor: '#21292b'},
          { text: '黑体', value: '#cccc00', rgb: 'rgb(204, 204, 0)' ,borderColor: '#cccc00'},
          { text: '黑体', value: '#996633', rgb: 'rgb(153, 102, 51)' ,borderColor: '#996633'},
          { text: '黑体', value: '#66cccc', rgb: 'rgb(102, 204, 204)' ,borderColor: '#66cccc'},
          { text: '黑体', value: '#99cccc', rgb: 'rgb(153, 204, 204)',borderColor: '#99cccc' },
          { text: '黑体', value: '#ccffff', rgb: 'rgb(204, 255, 255)' ,borderColor: '#ccffff'},
          { text: '黑体', value: '#ccffcc', rgb: 'rgb(204, 255, 204)' ,borderColor: '#ccffcc'},
          { text: '黑体', value: '#9999ff', rgb: 'rgb(153, 153, 255)' ,borderColor: '#9999ff'},
          { text: '黑体', value: '#66cc99', rgb: 'rgb(102, 204, 153)',borderColor: '#66cc99' },
          { text: '黑体', value: '#6666cc', rgb: 'rgb(102, 102, 204)' ,borderColor: '#6666cc'},
          { text: '黑体', value: '#dfdfdf', rgb: 'rgb(223, 223, 223)' ,borderColor: '#dfdfdf'},
          { text: '黑体', value: 'rgba', rgb: 'rgba' ,borderColor: 'transparent'}
        ],
        tpl: '<span class="cd-r-cur-in-cnt fl" style="width: 100%;height: 100%;display: inline-block;background-color:{{value}};border:1px solid {{borderColor}};">&nbsp;</span>'
      }
    },
    compare: function (item) {
      if (item.value === 'rgba') {
        this.$('.cd-r-cur-in-cnt').addClass('sprite-design background-color-custom');
      }
      if (item.value === color || item.rgb === color) {
        return true;
      } else {
        return false;
      }
    },
    handleChange: function (item, init) {
      if (item['value'] !== 'rgba') {
        color = item.value;
        if (this._options.onChange){
          this._options.onChange.call(this, item.value, init);
        }
      } else {
        this._dialog({
          moduleId: 'BbaseColorPick',
          title: null,
          quickClose: true,
          cover: false,
          hideCloseBtn: true,
          width: 400,
          color: color,
          hideSaveBtn: true,
          target: this.$('.background-color-custom').get(0),
          onChange: BbaseEst.proxy(function (value) {
            color = value;
            if (this._options.onChange){
              this._options.onChange.call(this, value, false);
            }
          }, this)
        });
      }

    }
  });
  module.exports = BbaseColorPanel;
});
