'use strict';
/**
 * @description 模块功能说明
 * @class UiScrollfix
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiScrollfix', [], function (require, exports, module) {
  var UiScrollfix, template;

  template = `
    <div class="UiScrollfix-wrap module-wrap">
        <style>
          .s-li{padding: 5px; background: #efefef; margin-bottom: 5px; cursor: pointer; }
        </style>
        <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name">bbaseuiscrollfix="{viewId: 'viewId', id: 'scrollfix'}"</span>
            </div>
          </div>
          <div class="main" style="height: 1500px;padding: 10px;">
             <div class="demo-item clearfix" bb-bbaseuiscrollfix="{viewId:'bbaseuiscrollfix1',id:'scrollfix1', offset: 10, dir: 'top'}" style="height:50px;width:200px;background-color: #efefef;z-index: 999999;">

             </div>
             <div class="demo-item clearfix" bb-bbaseuiscrollfix="{viewId:'bbaseuiscrollfix2',id:'scrollfix2', offset: 10, dir: 'bottom'}" style="height:50px;width:200px;background-color: #efefef;z-index: 999999;margin-top: 1000px;">

             </div>
          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; 动态赋值：</div><div class="left" bb-bbaseuiselect="{viewId: 'ddd', cur:cur,items: selectitems}"></div><div class="left"><input type="text" class="text" bb-model="cur:keyup" value="{{cur}}" /></div>
          </div>
        </div>
      </div>
      <div class="formPanel form-api">
        <div class="anything">
          <div class="main">
            <table class="title">
              <tbody>
                <tr>
                  <td>参数</td>
                  <td>说明</td>
                  <td>类型</td>
                  <td>默认值</td>
                </tr>
              </tbody>
            </table>
            <table class="content">
              <tbody class="uilist01-tbody">
                <tr>
                  <td class="argName"><span>viewId</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>视图标识符</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>id</span></td>
                  <td class="argDesc"><span>返回的对象， 在视图中可以使用this[id]来获取scrollfix对象</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>scrollfix</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>offset</span></td>
                  <td class="argDesc"><span>设置距离顶部达到指定距离时触发</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>0</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>dir</span></td>
                  <td class="argDesc"><span>设置固定位置（top/bottom）</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>top</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  var selectitems = [];
  for (var i = 0; i < 100; i++) {
    selectitems.push({
      text: i + '',
      value: i
    });
  }

  UiScrollfix = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    initData: function () {
      return {
        cur: 0,
        selectitems: selectitems
      }
    },
    update: function(){
      this._set('cur', parseInt(this._get('cur')));
    },
    afterRender: function(){
      this.$('.s-ul li').click(function(){
        alert($(this).attr('data-id'));
      });
    }
  });

  module.exports = UiScrollfix;
});
