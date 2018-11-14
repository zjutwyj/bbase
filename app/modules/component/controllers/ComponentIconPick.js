'use strict';
/**
 * @description 模块功能说明
 * @class ComponentIconPick
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentIconPick', [], function (require, exports, module) {
  var ComponentIconPick, template;

  template = `
    <div class="ComponentIconPick-wrap" style="padding:10px;">
      <div class="formPanel form-demo">
        <div class="anything" style="display: block;">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name pointer" id="viewCode01" bb-click="viewCode('viewCode01')">点击查看代码</span>
            </div>
          </div>
          <div class="main">
            <div class="demo-item pointer clearfix" bb-bbasecomponenticonpick="{viewId:'bbasecomponenticonpick',cur:cur, font: 'bbasefont',iconColor: iconColor,iconColorState: iconColorState,iconType: iconType,iconTypeItems: iconTypeItems,items: items, showTypeSelect: true,onChange: handleIconPickChange,showSearch: true}">点我打开图标选择框</div>
          </div>
          <div class="footer">
          <div class="item-type-title clearfix left">输出结果：<i bb-watch="cur:class,iconColor:style" class="bbasefont {{cur}}" style="color: {{iconColor}}"></i>字体名称：<span bb-watch="cur:html">{{cur}}</span>, 字体内容：<span bb-watch="fontcontent:html">{{fontcontent}}</span>字体颜色是否默认：<span  bb-watch="iconColorState:html">{{#If iconColorState==='d'}}是{{else}}否{{/If}}</span><span bb-watch="iconType:html">主题：{{iconType}}</span></div></div>
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
                  <td class="argName"><span>iconType</span></td>
                  <td class="argDesc"><span>图标风格</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>showTypeSelect</span></td>
                  <td class="argDesc"><span>是否显示风格列表下拉菜单</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>false</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>iconTypeItems</span></td>
                  <td class="argDesc"><span>风格列表</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>showSearch</span></td>
                  <td class="argDesc"><span>显示搜索框(相应的数组中添加字段label)</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>false</span></td>
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


  ComponentIconPick = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      var items = [
          { text: '默认', value: 'iconDefault', content: '' ,label: ''},
          { text: '', value: 'bbase-setting', content: '"\\e756"' ,label: '设置,齿轮'},
          { text: '', value: 'bbase-crop', content: '"\\e62d"',label: '剪切' },
          { text: '', value: 'bbase-arrowleft', content: '"\\e721"' ,label: '左箭头'},
          { text: '', value: 'bbase-arrowrigt', content: '"\\e612"' ,label: '右箭头'},
          { text: '', value: 'bbase-x', content: '"\\e659"',label: '关闭' },
          { text: '', value: 'bbase-close', content: '"\\e611"',label: '关闭' },
          { text: '', value: 'bbase-close_thin', content: '"\\e62c"',label: '关闭'},
          { text: '', value: 'bbase-correct', content: '"\\e63d"' ,label: '正确'},
          { text: '', value: 'bbase-ok', content: '"\\e6ac"' ,label: '确定'},
          { text: '', value: 'bbase-caretdown', content: '"\\e627"' ,label: '下拉箭头'},
          { text: '', value: 'bbase-play', content: '"\\e720"' ,label: '播放，开始'},
          { text: '', value: 'bbase-pause', content: '"\\e604"' ,label: '暂停'},
          { text: '', value: 'bbase-yuandian', content: '"\\e601"' ,label: '圆点，录像'},
          { text: '', value: 'bbase-xialasanjiao', content: '"\\e63a"' ,label: '三角'},
          { text: '', value: 'bbase-delete', content: '"\\e64c"' ,label: '删除'},
          { text: '', value: 'bbase-yihen', content: '"\\e62f"' ,label: ''},
          { text: '', value: 'bbase-search', content: '"\\e62a"' ,label: '搜索'},
          { text: '', value: 'bbase-copy', content: '"\\e75d"',label: '复制' }
        ];
      return {
        cur: 'bbase-x1',
        iconColor: '#dfdfdf',
        iconColorState: 'd',
        fontcontent: '',
        iconType: 'pc',
        items: items,
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
        ]
      }
    },
    handleIconPickChange: function(item){
      console.log(item);
      this._set('fontcontent', item.content);
    },
    viewCode(selector, evt){
      window.viewCode.call(this, selector, JSON.stringify(this.model.toJSON()), evt);
    }
  });

  module.exports = ComponentIconPick;
});
