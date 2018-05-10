'use strict';
/**
 * @description 模块功能说明
 * @class UiSortable
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiSortable', [], function(require, exports, module){
  var UiSortable, template;

  template = `
   <div class="UiSortable-wrap module-wrap">
        <style>
          .s-li{padding: 5px; background: #efefef; margin-bottom: 5px; cursor: pointer; }
        </style>
        <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name pointer" id="viewCode01" bb-click="viewCode('viewCode01')">点击查看代码</span>
            </div>
          </div>
          <div class="main">
             <ul class="demo-item clearfix" bb-bbaseuisortable="{viewId:'bbaseuisortable',onEnd: onSortEnd}" style="height:150px;width:200px;">
                <li class="s-li">点我拖动1</li>
                <li class="s-li">点我拖动2</li>
                <li class="s-li">点我拖动3</li>
                <li class="s-li">点我拖动4</li>
             </ul>
          </div>
          <div class="footer">

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
                  <td class="argDesc"><span title="返回的对象， 在视图中可以使用this[id]来获取sortable对象">返回的对象， 在视图中可以使用this[id]来获取sortable对象</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>sortable</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>handle</span></td>
                  <td class="argDesc"><span>拖动的元素</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>li</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>draggable</span></td>
                  <td class="argDesc"><span>拖动使用域元素</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>li</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onEnd</span></td>
                  <td class="argDesc"><span>拖动结束后回调</span></td>
                  <td class="argType"><span>function(evt, list)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  UiSortable = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    onSortEnd: function(list){
      console.log(list);
    },
    viewCode(selector, evt){
      window.viewCode.call(this, selector, JSON.stringify(this.model.toJSON()), evt);
    }
  });

  module.exports = UiSortable;
});