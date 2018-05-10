'use strict';
/**
 * @description 模块功能说明
 * @class ComponentPhotoCrop
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentPhotoCrop', [], function(require, exports, module){
  var ComponentPhotoCrop, template;

  template = `
    <div class="ComponentPhotoCrop-wrap" style="padding:20px;">
    <div class="formPanel form-demo">
        <div class="anything" style="display: block;">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name pointer" id="viewCode01" bb-click="viewCode('viewCode01')">点击查看代码</span>
            </div>
          </div>
          <div class="main">
          <div class="demo-item clearfix"><a href="javascript:;"  bb-bbasecomponentphotocrop="{viewId:'photocrop',cur:cur,onChange: handleChange }">图片裁切</a></div>
          </div>
          <div class="footer">
          <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}};</div>
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
                  <td class="argName"><span>width</span></td>
                  <td class="argDesc"><span>对话框宽度</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>350</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>height</span></td>
                  <td class="argDesc"><span>对话框高度</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>425</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>height</span></td>
                  <td class="argDesc"><span>对话框高度</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>425</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>picWidth</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>图片实际宽度</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr><tr>
                  <td class="argName"><span>picHeight</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>图片实际高度</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr><tr>
                  <td class="argName"><span>cropWidth</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>裁剪图片宽度</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr><tr>
                  <td class="argName"><span>cropHeight</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>裁剪图片高度</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr><tr>
                  <td class="argName"><span>pos</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>裁剪保留信息</span></td>
                  <td class="argType"><span>json</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr><tr>
                  <td class="argName"><span>prefix</span></td>
                  <td class="argDesc"><span>用于解决同一张图片不同裁切的重复性问题， 此参数传递到后端</span></td>
                  <td class="argType"><span>String</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr><tr>
                  <td class="argName"><span>cutApi</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>裁剪API</span></td>
                  <td class="argType"><span>String</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr><tr>
                  <td class="argName"><span>image</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>原图片地址</span></td>
                  <td class="argType"><span>String</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onChange</span></td>
                  <td class="argDesc"><span>回调函数</span></td>
                  <td class="argType"><span>function(item, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr><tr>
                  <td class="argName"><span>onCancel</span></td>
                  <td class="argDesc"><span>点击取消按钮回调函数</span></td>
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

  ComponentPhotoCrop = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: CONST.PIC_URL + '/upload//j//j2//jihui88//picture//2016//08//31/05c50890-35d4-4867-8d7d-1bb6710362aa.png?v=115305748'
      }
    },
    handleChange: function (result) {
      console.log(result);
    },
    viewCode(selector, evt){
      window.viewCode.call(this, selector, JSON.stringify(this.model.toJSON()), evt);
    }
  });

  module.exports = ComponentPhotoCrop;
});

