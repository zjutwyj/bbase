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
        <style>
          .s-li{padding: 5px; background: #efefef; margin-bottom: 5px; cursor: pointer; }
        </style>
        <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name">bbaseuiscrollbar="{viewId: 'viewId', id: 'iscroll'}"</span>
            </div>
          </div>
          <div class="main">
             <div class="demo-item clearfix" bb-bbaseuiscrollbar="{viewId:'bbaseuiscrollbar',id:'iscroll'}" style="height:50px;width:200px;">
              <ul class="inner s-ul">
              <li class="s-li" data-id="s-li-1">鼠标拖动1</li>
              <li class="s-li" data-id="s-li-2">鼠标拖动2</li>
              <li class="s-li" data-id="s-li-3">鼠标拖动3</li>
              <li class="s-li" data-id="s-li-4">鼠标拖动4</li>
              <li class="s-li" data-id="s-li-5">鼠标拖动5</li>
              <li class="s-li" data-id="s-li-6">鼠标拖动6</li>
              <li class="s-li" data-id="s-li-7">鼠标拖动7</li>
              <li class="s-li" data-id="s-li-8">鼠标拖动8</li>
              <li class="s-li" data-id="s-li-9">鼠标拖动9</li>
              <li class="s-li" data-id="s-li-10">鼠标拖动10</li>
              <li class="s-li" data-id="s-li-11">鼠标拖动11</li>
              <li class="s-li" data-id="s-li-12">鼠标拖动12</li>
              <li class="s-li" class="s-li" class="s-li" class="s-li" data-id="s-li-13">鼠标拖动13</li>
              <li class="s-li" class="s-li" class="s-li" data-id="s-li-14">鼠标拖动14</li>
              <li class="s-li" class="s-li" data-id="s-li-15">鼠标拖动15</li>
              <li class="s-li" data-id="s-li-16">鼠标拖动16</li>
              <li class="s-li" data-id="s-li-17">鼠标拖动17</li>
              <li class="s-li" data-id="s-li-18">鼠标拖动18</li>
              <li class="s-li" data-id="s-li-19">鼠标拖动19</li>
              </ul>
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
                <tr>
                  <td class="argName"><span>preventDefault</span></td>
                  <td class="argDesc"><span>阻止事件冒泡,开启后文本框将不能选择</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>false</span></td>
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
    },
    afterRender: function(){
      this.$('.s-ul li').click(function(){
        alert($(this).attr('data-id'));
      });
    }
  });

  module.exports = UiScrollbar;
});
