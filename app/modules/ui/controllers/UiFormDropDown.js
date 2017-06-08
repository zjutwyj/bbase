'use strict';
/**
 * @description 模块功能说明
 * @class UiFormDropDown
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiFormDropDown', [], function (require, exports, module) {
  var UiFormDropDown, template;

  template = `
    <div class="UiFormDropDown-wrap module-wrap">
      <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name">指令用法：bbaseuidropdown="{viewId:'bbaseuidropdownmodule',moduleId: 'DemoListTable'}"</span>
            </div>
          </div>
          <div class="main clearfix">
            <div style="padding:10px;margin: 0;cursor: pointer;" class="demo-item clearfix left" bb-bbaseuidropdown="{viewId:'bbaseuidropdown',content: content, align:'left'}">点击显示下拉框[居左]</div>
            <div style="padding:10px;margin: 0;cursor: pointer;" class="demo-item clearfix left" bb-bbaseuidropdown="{viewId:'bbaseuidropdownhover',content: content, mouseHover: true, align:'right'}">鼠标移入显示下拉框[居右]</div>
            <div style="padding:10px;margin: 0;cursor: pointer;" class="demo-item clearfix left" bb-bbaseuidropdown="{viewId:'bbaseuidropdownmodule',moduleId: 'DemoListTodo',align: 'center', showClose: true}">请求模块下拉框[居中]</div>
            <div style="padding:10px;margin: 0;cursor: pointer;" class="demo-item clearfix left" bb-bbaseuidropdown="{viewId:'bbaseuidropdownfollow',content: content, mouseHover: true, mouseFollow: true,align:'center'}">鼠标跟随下拉框</div>

          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; 动态赋值：</div><div class="left" bb-bbaseuiselect="{viewId: 'ddd', cur:cur,items: items}"></div><div class="left"><input type="text" class="text" bb-model="cur:keyup" value="{{cur}}" /></div>
          </div>
        </div>
      </div>

      <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name">指令用法：bbaseuidropdownwin="{viewId:'bbaseuidropdownwin',moduleId: 'ThemeTable01'}"</span>
            </div>
          </div>
          <div class="main clearfix">
            <div style="padding:10px;margin: 0;cursor: pointer;" class="demo-item clearfix left" bb-bbaseuidropdownwin="{viewId:'bbaseuidropdownwin',moduleId: 'ThemeTable01',top:72}">全屏下拉框</div>

          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; 动态赋值：</div><div class="left" bb-bbaseuiselect="{viewId: 'select-win', cur:cur,items: items}"></div><div class="left"><input type="text" class="text" bb-model="cur:keyup" value="{{cur}}" /></div>
          </div>
        </div>
      </div>

      <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name">指令用法：bbaseuidropdownwix="{viewId:'bbaseuidropdownwix',moduleId: 'DemoListTodo'}"</span>
            </div>
          </div>
          <div class="main clearfix">
            <div style="padding:10px;margin: 0;cursor: pointer;" class="demo-item clearfix left" bb-bbaseuidropdownwix="{viewId:'bbaseuidropdownwix',mouseHover: true,moduleId: 'ThemeTable01',top:72}">wix风格下拉框</div>

          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; 动态赋值：</div><div class="left" bb-bbaseuiselect="{viewId: 'select-win', cur:cur,items: items}"></div><div class="left"><input type="text" class="text" bb-model="cur:keyup" value="{{cur}}" /></div>
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
                  <td class="argDesc"><span>视图标识符(如果需要引用弹出的视图的话， 需要在viewId后面加drop_down)</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>content</span></td>
                  <td class="argDesc"><span>显示内容</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>moduleId</span></td>
                  <td class="argDesc"><span>请求模块</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>width</span></td>
                  <td class="argDesc"><span>指定下拉框宽度,请求模块时最好指定下，不然位置将不准确</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>align</span></td>
                  <td class="argDesc"><span>指定下拉位置(left/center/right)</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>center</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>mouseFollow</span></td>
                  <td class="argDesc"><span>下拉框鼠标跟随</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>false</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>mouseHover</span></td>
                  <td class="argDesc"><span>鼠标移到元素上显示下拉框</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>false</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>showClose</span></td>
                  <td class="argDesc"><span>显示关闭按钮</span></td>
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

  UiFormDropDown = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'all',
        content: `
          <div style="padding:10px 20px;">aaaa</div>
        `,
        items: [
          { text: '全部', value: 'all' },
          { text: '已完成', value: 'complete' },
          { text: '未完成', value: 'undo' },
          { text: '部分完成', value: 'part' }
        ]
      }
    },
    onUpdate: function(values, handle, init){
      if (!init){
        console.log(values[0]);
        this._set('cur', '' + values[0]);
      }

    }
  });

  module.exports = UiFormDropDown;
});
