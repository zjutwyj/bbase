'use strict';
/**
 * @description 模块功能说明
 * @class UiFormTab
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiFormTab', [], function (require, exports, module) {
  var UiFormTab, template;

  var itemTip = `
    显示项数组列表(选项说明：如果存在moduleId, 则动态加载模块， 如果存在nodeId(如#tab1), 则显示nodeId的元素, 如果存在oneRender, 则只渲染一次，如果存在delay， 则延迟加载)
  `;

  template = `
    <div class="UiFormTab-wrap module-wrap">
      <div class="formPanel form-demo">

        <div class="anything">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name">bbaseuitabnormal="{viewId: 'bbaseuitabnormal', cur: cur, items: items,onChange: handleChange}"</span>
            </div>
          </div>
          <div class="main">
             <div class="demo-item clearfix" bb-bbaseuitabnormal="{viewId:'bbaseuitabnormal',cur:cur,items:items}"></div>
             <div id="tab1" style="display:none;">tab1</div>
             <div id="tab2" style="display:none;">tab2</div>
             <div id="tab3" style="display:none;">tab3</div>
             <div id="tab4" style="display:none;">tab4</div>
          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; 动态赋值：</div><div class="left" bb-bbaseuiselect="{viewId: 'select-normal', cur:cur,items: items}"></div><div class="left"><input type="text" class="text" bb-model="cur:keyup" value="{{cur}}" /></div>
          </div>
        </div>
      </div>

      <div class="formPanel form-demo">

        <div class="anything">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name">bbaseuitabtext="{viewId: 'bbaseuitabtext', cur: cur, items: items,onChange: handleChange}"</span>
            </div>
          </div>
          <div class="main">
             <div class="demo-item clearfix" bb-bbaseuitabtext="{viewId:'bbaseuitabtext',cur:cur,items:items}"></div>
             <div id="tab1" style="display:none;">tab1</div>
             <div id="tab2" style="display:none;">tab2</div>
             <div id="tab3" style="display:none;">tab3</div>
             <div id="tab4" style="display:none;">tab4</div>
          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; 动态赋值：</div><div class="left" bb-bbaseuiselect="{viewId: 'select-text', cur:cur,items: items}"></div><div class="left"><input type="text" class="text" bb-model="cur:keyup" value="{{cur}}" /></div>
          </div>
        </div>
      </div>

      <div class="formPanel form-demo">

        <div class="anything">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name">bbaseuitabbtn="{viewId: 'bbaseuitabbtn', cur: cur, items: items,onChange: handleChange}"</span>
            </div>
          </div>
          <div class="main">
             <div class="demo-item clearfix" bb-bbaseuitabbtn="{viewId:'bbaseuitabbtn',cur:cur,items:items}"></div>
             <div id="tab1" style="display:none;">tab1</div>
             <div id="tab2" style="display:none;">tab2</div>
             <div id="tab3" style="display:none;">tab3</div>
             <div id="tab4" style="display:none;">tab4</div>
          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; 动态赋值：</div><div class="left" bb-bbaseuiselect="{viewId: 'select-btn', cur:cur,items: items}"></div><div class="left"><input type="text" class="text" bb-model="cur:keyup" value="{{cur}}" /></div>
          </div>
        </div>
      </div>

       <div class="formPanel form-demo">

        <div class="anything">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name">bbaseuitabblock="{viewId: 'bbaseuitabblock', cur: cur, items: items,onChange: handleChange}"</span>
            </div>
          </div>
          <div class="main">
             <div class="demo-item clearfix" bb-bbaseuitabblock="{viewId:'bbaseuitabblock',cur:cur,items:items}"></div>
             <div id="tab1" style="display:none;">tab1</div>
             <div id="tab2" style="display:none;">tab2</div>
             <div id="tab3" style="display:none;">tab3</div>
             <div id="tab4" style="display:none;">tab4</div>
          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; 动态赋值：</div><div class="left" bb-bbaseuiselect="{viewId: 'select-tabblock', cur:cur,items: items}"></div><div class="left"><input type="text" class="text" bb-model="cur:keyup" value="{{cur}}" /></div>
          </div>
        </div>
      </div>

      <div class="formPanel form-demo">

        <div class="anything">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name">bbaseuitabunderline="{viewId: 'bbaseuitabunderline', cur: cur, items: items,onChange: handleChange}"</span>
            </div>
          </div>
          <div class="main">
             <div class="demo-item clearfix" bb-bbaseuitabunderline="{viewId:'bbaseuitabunderline',cur:cur,items:items}"></div>
             <div id="tab1" style="display:none;">tab1</div>
             <div id="tab2" style="display:none;">tab2</div>
             <div id="tab3" style="display:none;">tab3</div>
             <div id="tab4" style="display:none;">tab4</div>
          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; 动态赋值：</div><div class="left" bb-bbaseuiselect="{viewId: 'select-bbaseuitabunderline', cur:cur,items: items}"></div><div class="left"><input type="text" class="text" bb-model="cur:keyup" value="{{cur}}" /></div>
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
                  <td class="argName"><span>items</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc" style="white-space: normal;" title="${itemTip}"><span>${itemTip}</span></td>
                  <td class="argType"><span>array</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onChange</span></td>
                  <td class="argDesc"><span>回调函数</span></td>
                  <td class="argType"><span>function(item, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>path</span></td>
                  <td class="argDesc"><span>作用域字段</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>value</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>require</span></td>
                  <td class="argDesc"><span>是否请求模块，默认为true</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>true</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>contSelector</span></td>
                  <td class="argDesc"><span>nodeId选择符作用域</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>tpl</span></td>
                  <td class="argDesc"><span>自定义模板</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </div>
  `;

  UiFormTab = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    initData: function () {
      return {
        cur: 'all',
        items: [
          { text: '全部', value: 'all', nodeId: '#tab1' },
          { text: '已完成', value: 'complete', nodeId: '#tab2' },
          { text: '未完成', value: 'undo', nodeId: '#tab3' },
          { text: '部分完成', value: 'part', nodeId: '#tab4' }
        ]
      }
    },
    handleChange: function (item, init) {
      console.log(item);
    }
  });

  module.exports = UiFormTab;
});
