'use strict';
/**
 * @description 模块功能说明
 * @class DemoListTable
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('DemoListTable', [], function(require, exports, module){
  var DemoListTable, template;

  var items = [];
  for(var i = 0; i< 100; i++){
    items.push({
      name: 'name' + i,
      cellphone: new Date().getTime(),
      email: 'zjut' + i + '@163.com'
    });
  }

  template = `
    <div class="DemoListTable-wrap" style="padding:10px; width: 994px;">
         <div class="formPanel form-demo">
          <div class="anything" style="display: block;">
            <div class="header">
              <div class="formIdArea">
              <span class="checkboxAll" bb-bbaseuicheckbox="{viewId: 'checkAll', cur: checkAll,items: allItems,onChange: handleAllChange}"></span>
                <span class="name">我的表单1488173365180</span>
              </div>
              <div class="excelBtn">
                <span class="formExcelClick">导出为EXCEL</span>
              </div>
            </div>
            <div class="main">
              <table class="title">
                <tbody>
                  <tr>
                    <td width="22">&nbsp;</td>
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

  DemoListTable = BbaseList.extend({
    initialize: function(){
      this._super({
        template: template,
        model: BbaseModel.extend({}),
        collection: BbaseCollection.extend({}),
        item: BbaseItem.extend({
          tagName: 'tr',
          template: `
          <td title="xvdd td-checkbox" width="22" bb-bbaseuicheckbox="{viewId: viewId,cur: cur, items: items,onChange: handleChange}"></td>
          <td title="xvdd"><span bb-watch="name:html">{{name}}</span></td>
          <td title="xvc"><span bb-watch="cellphone:html">{{cellphone}}</span></td>
          <td title="xvfd"><span bb-watch="email:html">{{email}}</span></td>
          `,
          init: function () {
            return {
              cur: '00',
              viewId: 'checkbox' + this.cid,
              items: [{text: '', value: '01'}]
            }
          },
          handleChange: function () {
              console.log(this._get('cur'));
          }
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
        cur: '00',
        page: 1,
        pageSize: 10,
        totalPage: 0,
        totalCount: 0,
        checkAll: '00',
        allItems: [{text: '全选', value: '01'}]
      }
    },
    beforeLoad: function(){
      this.collection.each(this._bind(function(model){
        model._set('cur', '00');
      }));
    },
    afterLoad: function(){
      this._set({
        'page': this._getPage(),
        'pageSize': this._getPageSize(),
        'totalPage': this._getTotalPage(),
        'totalCount': this._getCount()
      });
    },

    // 全选
    handleAllChange: function () {
      console.log(this._get('checkAll'));
      this.collection.each(this._bind(function(model){
        model._set('cur', this._get('checkAll'));
      }));
    },

    // 分页
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

  module.exports = DemoListTable;
});