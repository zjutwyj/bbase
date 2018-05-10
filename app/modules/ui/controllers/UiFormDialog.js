'use strict';
/**
 * @description 模块功能说明
 * @class UiFormDialog
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiFormDialog', [], function (require, exports, module) {
  var UiFormDialog, template;

  template = `
    <div class="UiFormDialog-wrap module-wrap">
        <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name pointer" id="viewCode01" bb-click="viewCode('viewCode01')">点击查看代码</span>
            </div>
          </div>
          <div class="main">
          <div class="red">注意：BbaseItem中如果开启diff:true慎用， 数据不能同步</div>
          <div style="padding:10px;margin: 0;cursor: pointer;" class="demo-item clearfix left" bb-bbaseuidialog="{viewId:'bbaseuidialog',content: 'content', quickClose: true, title:'普通对话框'}">普通对话框</div>
           <div style="padding:10px;margin: 0;cursor: pointer;" class="demo-item clearfix left" bb-bbaseuidialog="{viewId:'bbaseuidialog',moduleId: 'UiListExpand',quickClose: true}">模块对话框</div>
           <div style="padding:10px;margin: 0;cursor: pointer;" class="demo-item clearfix left" bb-bbaseuidialog="{viewId:'bbaseuidialog',content: 'content',quickClose: true, follow: true}">跟随元素</div>
           <div style="padding:10px;margin: 0;cursor: pointer;" class="demo-item clearfix left" bb-bbaseuidialog="{viewId:'bbaseuidialog',content: 'content',quickClose: true, mouse: true}">跟随鼠标</div>
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
                  <td class="argName"><span>moduleId</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>关联模型类字段</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>content</span></td>
                  <td class="argDesc"><span>对话框内容</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>title</span></td>
                  <td class="argDesc"><span>对话框标题</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>width</span></td>
                  <td class="argDesc"><span>对话框宽度</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>auto</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>heigt</span></td>
                  <td class="argDesc"><span>对话框高度</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>auto</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>cover</span></td>
                  <td class="argDesc"><span>显示遮罩</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>false</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>quickClose</span></td>
                  <td class="argDesc"><span>快速关闭</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>false</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>follow</span></td>
                  <td class="argDesc"><span>跟随元素</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>false</span></td>
                </tr>
               <tr>
                  <td class="argName"><span>target</span></td>
                  <td class="argDesc"><span>跟随元素(如： .selector)</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>align</span></td>
                  <td class="argDesc"><span>显示位置(left,top,top left,top right,right,bottom,right,....)</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onChange</span></td>
                  <td class="argDesc"><span>回调函数</span></td>
                  <td class="argType"><span>function()</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onReady</span></td>
                  <td class="argDesc"><span>组件装载后回调</span></td>
                  <td class="argType"><span>function()</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onClose</span></td>
                  <td class="argDesc"><span>对话框关闭后回调</span></td>
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

  UiFormDialog = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'all,complete',
        items: [
          { text: '全部', value: 'all' },
          { text: '已完成', value: 'complete' },
          { text: '未完成', value: 'undo' },
          { text: '部分完成', value: 'part' }
        ]
      }
    },
    viewCode(selector, evt){
      window.viewCode.call(this, selector, JSON.stringify(this.model.toJSON()), evt);
    }
  });

  module.exports = UiFormDialog;
});
