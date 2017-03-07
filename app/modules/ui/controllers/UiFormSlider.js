'use strict';
/**
 * @description 模块功能说明
 * @class UiFormSlider
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiFormSlider', [], function (require, exports, module) {
  var UiFormSlider, template;

  template = `
    <div class="UiFormSlider-wrap" style="padding:10px;">
      <div class="formPanel form-demo">
        <div class="anything" style="display: block;">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name">指令用法：bbaseuislider="{viewId: 'viewId', cur: cur, width: width, onChange: handleChange}"</span>
            </div>
          </div>
          <div class="main">
            <div class="demo-item clearfix" bb-bbaseuislider="{viewId:'bbaseuiradio',cur:cur,width: width ,onUpdate: onUpdate}"></div>
          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; 动态赋值：</div><div class="left" bb-bbaseuiselect="{viewId: 'ddd', cur:cur,items: items}"></div><div class="left"><input type="text" class="text" bb-model="cur:keyup" value="{{cur}}" /></div>
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
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>10</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>step</span></td>
                  <td class="argDesc"><span>步长，取值必须大于 0，并且可被 (max - min) 整除</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>1</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>width</span></td>
                  <td class="argDesc"><span>宽度</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>100</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onSlide</span></td>
                  <td class="argDesc"><span>滑动条装载后</span></td>
                  <td class="argType"><span>function(values, handle, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onSet</span></td>
                  <td class="argDesc"><span>设置值</span></td>
                  <td class="argType"><span>function(values, handle, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onStart</span></td>
                  <td class="argDesc"><span>开始滑动时</span></td>
                  <td class="argType"><span>function(values, handle, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onEnd</span></td>
                  <td class="argDesc"><span>停止鼠滑动标未松开时回调</span></td>
                  <td class="argType"><span>function(values, handle, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>onUpdate</span></td>
                  <td class="argDesc"><span>滑动时回调</span></td>
                  <td class="argType"><span>function(values, handle, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onChange</span></td>
                  <td class="argDesc"><span>停止滑动且鼠标松开后回调函数</span></td>
                  <td class="argType"><span>function(values, handle, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  `;

var items = [];
for(var i = 0; i < 100; i++){
  items.push(
    {text: '' + i, value: ''+i + '.00'}
  );
}

  UiFormSlider = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: '5.00',
        width: 100,
        items: items
      }
    },
    onUpdate: function(values, handle, init){
      if (!init){
        console.log(values[0]);
        this._set('cur', '' + values[0]);
      }

    }
  });

  module.exports = UiFormSlider;
});
