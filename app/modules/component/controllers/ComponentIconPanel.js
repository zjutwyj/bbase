'use strict';
/**
 * @description 模块功能说明
 * @class ComponentIconPanel
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentIconPanel', [], function (require, exports, module) {
  var ComponentIconPanel, template;

  template = `
    <div class="ComponentIconPanel-wrap" style="padding:10px;">
      <div class="formPanel form-demo">
        <div class="anything" style="display: block;">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name pointer" id="viewCode01" bb-click="viewCode('viewCode01')">点击查看代码</span>
            </div>
          </div>
          <div class="main">
            <div  class="demo-item clearfix" bb-bbasecomponenticonpanel="{viewId:'bbasecomponenticonpanel',cur:cur, font: font,iconColor: iconColor,iconColorState: iconColorState,iconType: iconType,iconTypeItems: iconTypeItems,items: items, showTypeSelect: true,onChange: handleIconPickChange}"></div>
          </div>
          <div class="footer">
          <div class="item-type-title clearfix left">输出结果：<i bb-watch="cur:class,iconColor:style" class="bbasefont {{cur}}" style="color: {{iconColor}}"></i>字体名称：<span bb-watch="cur:html">{{cur}}</span>, 字体内容：<span bb-watch="fontcontent:html">{{fontcontent}}</span>字体颜色是否默认：<span  bb-watch="iconColorState:html">{{#If iconColorState==='d'}}是{{else}}否{{/If}}</span><span bb-watch="iconType:html">, 主题：{{iconType}}</span></div></div>
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
                  <td class="argName"><span>cur</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>关联模型类字段</span></td>
                  <td class="argType"><span>any</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>iconColor</span></td>
                  <td class="argDesc"><span>图标颜色</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>#ffffff</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>iconColorState</span></td>
                  <td class="argDesc"><span>图标颜色是否默认</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>d</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>items</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>图标列表[{ text: '', value: 'bbase-x1', content: '"\\e611"' }]</span></td>
                  <td class="argType"><span>array</span></td>
                  <td class="argDefault"><span>[]</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>font</span></td>
                  <td class="argDesc"><span>字体库别名</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>iconfont</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onChange</span></td>
                  <td class="argDesc"><span>回调函数</span></td>
                  <td class="argType"><span>function(item, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  `;


  ComponentIconPanel = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      var items = [{ text: '默认', value: 'iconDefault', content: '' },
          { text: '', value: 'bbase-setting', content: '"\\e756"' },
          { text: '', value: 'bbase-crop', content: '"\\e62d"' },
          { text: '', value: 'bbase-arrowleft', content: '"\\e721"' },
          { text: '', value: 'bbase-arrowrigt', content: '"\\e612"' },
          { text: '', value: 'bbase-x', content: '"\\e659"' },
          { text: '', value: 'bbase-close', content: '"\\e611"' },
          { text: '', value: 'bbase-close_thin', content: '"\\e62c"' },
          { text: '', value: 'bbase-correct', content: '"\\e63d"' },
          { text: '', value: 'bbase-ok', content: '"\\e6ac"' },
          { text: '', value: 'bbase-caretdown', content: '"\\e627"' },
          { text: '', value: 'bbase-play', content: '"\\e720"' },
          { text: '', value: 'bbase-pause', content: '"\\e604"' },
          { text: '', value: 'bbase-yuandian', content: '"\\e601"' },
          { text: '', value: 'bbase-xialasanjiao', content: '"\\e63a"' },
          { text: '', value: 'bbase-delete', content: '"\\e64c"' },
          { text: '', value: 'bbase-yihen', content: '"\\e62f"' },
          { text: '', value: 'bbase-search', content: '"\\e62a"' },
          { text: '', value: 'bbase-copy', content: '"\\e75d"' }];

      return {
        cur: 'bbase-x1',
        font: 'bbasefont',
        iconColor: '#dfdfdf',
        iconColorState: 'd',
        iconType: 'pc',
        iconTypeItems:  [
          { text: '风格1', value: 'pc', url: '', iconItems: items},
          {
            text: '风格2',
            value: 'ssss',
            url: '',
            iconItems: [
              { text: '', value: 'bbase-caretdown', content: '"\\e627"' },
              { text: '', value: 'bbase-play', content: '"\\e720"' },
              { text: '', value: 'bbase-pause', content: '"\\e604"' },
              { text: '', value: 'bbase-yuandian', content: '"\\e601"' },
              { text: '', value: 'bbase-xialasanjiao', content: '"\\e63a"' },
              { text: '', value: 'bbase-delete', content: '"\\e64c"' },
              { text: '', value: 'bbase-yihen', content: '"\\e62f"' },
              { text: '', value: 'bbase-search', content: '"\\e62a"' },
              { text: '', value: 'bbase-copy', content: '"\\e75d"' }
            ]
          }
        ],
        showTypeSelect: true,
        items: items
        //listApi: 'http://cdn.jihuinet.com/icon/ionicons.js'
      }
    },
    handleIconPickChange: function(item){
      this._set(item);
      this._set('fontcontent', item.content);
    },
    viewCode(selector, evt){
      window.viewCode.call(this, selector, JSON.stringify(this.model.toJSON()), evt);
    }
  });

  module.exports = ComponentIconPanel;
});
