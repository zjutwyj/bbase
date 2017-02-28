'use strict';
/**
 * @description 模块功能说明
 * @class UiList01
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiList01', [], function(require, exports, module){
  var UiList01, template;

  var items = [];
  for(var i = 0; i< 100; i++){
    items.push({
      name: 'name' + i,
      cellphone: new Date().getTime(),
      email: 'zjut' + i + '@163.com'
    });
  }

  template = `
    <div class="UiList01-wrap" style="padding:5px;">
  <div class="formPanel">
    <div class="anything" style="display: block;">
      <div class="header">
        <div id="formIdArea" class="formIdArea">
          <span class="dataType">表单</span>
          <span class="name" title="我的表单1488173365180" formid="1488173365180">我的表单1488173365180</span>
          <ul id="formIdComboBox" class="formIdComboBox">
            <li formid="1488173365180" title="我的表单1488173365180">我的表单1488173365180</li>
          </ul>
        </div>
        <div id="formExcelBtn" class="excelBtn">
          <span class="formExcelClick">导出为EXCEL</span>
        </div>
        <form id="downloadFormExcel" action="" method="post" style="display:none"></form>
      </div>
      <div class="main">
        <table class="title">
          <tbody>
            <tr>
              <td>姓名</td>
              <td>电话</td>
              <td>邮箱</td>
            </tr>
          </tbody>
        </table>
        <table class="content">
          <tbody class="uilist01-tbody">

          </tbody>
        </table>
      </div>
      <div class="footer">
      <div class="pageInfo" >共<span bb-watch="totalPage:html">{{totalPage}}</span>页，<span bb-watch="totalCount:html">{{totalCount}}</span>条记录</div>
        <div class="pageOperate">
          <span bb-watch="page:class" class="prevPage {{#If page===1}}disablePage{{/If}}" bb-click="prevPage" ></span>
          <span class="currentPage"><span bb-watch="page:html">{{page}}</span>/<span bb-watch="totalPage:html">{{totalPage}}</span></span>
          <span bb-watch="page:class" class="nextPage {{#If page===totalPage}}disablePage{{/If}}" bb-click="nextPage"></span>
        </div>
      </div>
    </div>
  </div>
</div>

  `;

  UiList01 = BbaseList.extend({
    initialize: function(){
      this._super({
        template: template,
        model: BbaseModel.extend({}),
        collection: BbaseCollection.extend({}),
        item: BbaseItem.extend({
          tagName: 'tr',
          template: `
          <td title="xvdd"><span bb-watch="name:html">{{name}}</span></td>
          <td title="xvc"><span bb-watch="cellphone:html">{{cellphone}}</span></td>
          <td title="xvfd"><span bb-watch="email:html">{{email}}</span></td>
          `
        }),
        items: items,
        pagination: true,
        pageSize: 10,
        diff: true,
        render: '.uilist01-tbody'
      });
    },
    init: function(){
      return {
        page: 1,
        pageSize: 10,
        totalPage: 0,
        totalCount: 0
      }
    },
    afterLoad: function(){
      this._set({
        'page': this._getPage(),
        'pageSize': this._getPageSize(),
        'totalPage': this._getTotalPage(),
        'totalCount': this._getCount()
      });
    },
    prevPage: function(){
      if (this._getPage() === 1){
        return;
      }
      this._setPage(this._getPage() - 1);
      this._load();
    },
    nextPage: function(){
      if (this._getTotalPage() === this._getPage()){
        return;
      }
      this._setPage(this._getPage() +1);
      this._load();
    }
  });

  module.exports = UiList01;
});