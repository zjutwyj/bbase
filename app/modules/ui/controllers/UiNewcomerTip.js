'use strict';
/**
 * @description 模块功能说明
 * @class UiNewcomerTip
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiNewcomerTip', [], function(require, exports, module) {
  var UiNewcomerTip, template;

  template = `
    <div class="UiNewcomerTip-wrap module-wrap">
        <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name pointer" id="viewCode01" bb-click="viewCode('viewCode01')">点击查看代码</span>
            </div>
          </div>
          <div class="main" style="height: 500px;">
            <div bb-click="showNewcomerTip">点击显示新手提示</div>
             <div class="demo-item clearfix"  bb-bbaseuinewcomertip="{viewId:'bbaseuinewcomertip',cur:showTip,items:showTipItems}">

             </div>
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
                <tr id="tip01">
                  <td class="argName"><span>viewId</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>视图标识符</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr id="tip02">
                  <td class="argName"><span>cur</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>关联模型类字段(true/false),true表示显示提示</span></td>
                  <td class="argType"><span>any</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr >
                  <td class="argName"><span>items</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc" id="tip03"><span>显示项数组列表</span></td>
                  <td class="argType"><span>array</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr >
                  <td class="argName" id="tip05"><span>onChange</span></td>
                  <td class="argDesc"><span>回调函数</span></td>
                  <td class="argType"><span>function(item, init)</span></td>
                  <td class="argDefault" id="tip04"><span>-</span></td>
                </tr> <tr >
                  <td class="argName"><span>beforeTip</span></td>
                  <td class="argDesc"><span>提前函数</span></td>
                  <td class="argType"><span>function()</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  `;

  UiNewcomerTip = BbaseView.extend({
    initialize: function() {
      this._super({
        template: template
      });
    },
    initData: function() {
      return {
        showTip: true,
        showTipItems: [
          {selector: '', text: '客官好，小汇这厢有礼了。<br>接下来有些小提示,帮助您更快的熟悉编辑器，开始建站之旅...',btnTxt: '开始'},
          {selector: '#tip05', text: 'function'},
          {selector: '#tip01', text: '视图标识符'},
          {selector: '#tip02', text: '关联模型类字段(true/false),true表示显示新闻提示'},
          {selector: '#tip03', text: '显示项数组列表'},
          {selector: '#tip04', text: '回调函数'},
          {selector: '.tab-UiMore', text: 'sfsfsdf'},
          {selector: '.ThemeCode-wrap', text: 'sfsfsdf', click: '#viewCode01', timeout: 1000},
          {selector: '', text: '结束'},
        ]
      }
    },
    showNewcomerTip(){
      this._set('showTip', true);
    },
    viewCode(selector, evt) {
      window.viewCode.call(this, selector, JSON.stringify(this.model.toJSON()), evt);
    }
  });

  module.exports = UiNewcomerTip;
});