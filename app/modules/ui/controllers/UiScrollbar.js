'use strict';
/**
 * @description 模块功能说明
 * @class UiScrollbar
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiScrollbar', [], function (require, exports, module) {
  var UiScrollbar, template;

  template = `
    <div class="UiScrollbar-wrap module-wrap">
        <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name">bbaseuiscrollbar="{viewId: 'viewId', id: 'iscroll'}"</span>
            </div>
          </div>
          <div class="main">
             <div class="demo-item clearfix" bb-bbaseuiscrollbar="{viewId:'bbaseuiscrollbar',id:'iscroll',disableMouse:false}" style="height:50px;width:200px;">
              <div class="inner">
                 鼠标拖动1<br>
                 鼠标拖动2<br>
                 鼠标拖动3<br>
                 鼠标拖动4<br>
                 鼠标拖动5<br>
                 鼠标拖动6<br>
                 鼠标拖动7<br>
                 鼠标拖动8<br>
                 鼠标拖动9<br>
                 鼠标拖动10<br>
                 鼠标拖动11<br>
                 鼠标拖动12<br>
                 鼠标拖动13<br>
                 鼠标拖动14<br>
                 鼠标拖动15<br>
              </div>
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
                  <td class="argDesc"><span title="返回的对象， 在视图中可以使用this[id]来获取scroll对象">返回的对象， 在视图中可以使用this[id]来获取scroll对象</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>iscroll</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>cur</span></td>
                  <td class="argDesc"><span>页面初始滚动位置</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>0</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onChange</span></td>
                  <td class="argDesc"><span>回调函数</span></td>
                  <td class="argType"><span>function(item, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>mouseWheel</span></td>
                  <td class="argDesc"><span>是否支持鼠标滚动</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>true</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>scrollbars</span></td>
                  <td class="argDesc"><span>是否显示滚动条</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>true</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>disableMouse</span></td>
                  <td class="argDesc"><span>禁用鼠标</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>true</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>disablePointer</span></td>
                  <td class="argDesc"><span>禁用指针</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>true</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>interactiveScrollbars</span></td>
                  <td class="argDesc"><span>滚动条能拖动</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>true</span></td>
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

  UiScrollbar = BbaseView.extend({
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
    }
  });

  module.exports = UiScrollbar;
});
