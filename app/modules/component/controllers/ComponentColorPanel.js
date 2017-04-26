'use strict';
/**
 * @description 模块功能说明
 * @class ComponentColorPanel
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentColorPanel', [], function (require, exports, module) {
  var ComponentColorPanel, template;

  template = `
    <div class="ComponentColorPanel-wrap" style="padding:10px;">
      <div class="formPanel form-demo">
        <div class="anything" style="display: block;">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name">bbasecomponentcolorpanel="{viewId: 'bbasecomponentcolorpanel', cur: cur}"</span>
            </div>
          </div>
          <div class="main">
            <div class="demo-item clearfix" bb-bbasecomponentcolorpanel="{viewId:'bbasecomponentcolorpanel',cur:cur}" style="width: 200px;"></div>
          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; </div>
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
                  <td class="argName"><span>onChange</span></td>
                  <td class="argDesc"><span>回调函数</span></td>
                  <td class="argType"><span>function(item, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>tpl</span></td>
                  <td class="argDesc"><span>自定义模板</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>delay</span></td>
                  <td class="argDesc"><span>延时加载</span></td>
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


  ComponentColorPanel = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: '#ffffff'
      }
    }
  });

  module.exports = ComponentColorPanel;
});
