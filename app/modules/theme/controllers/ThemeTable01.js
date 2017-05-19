'use strict';
/**
 * @description 模块功能说明
 * @class ThemeTable01
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ThemeTable01', [], function(require, exports, module){
  var ThemeTable01;

  var items = [];
  for(var i = 0; i< 100; i++){
    items.push({
      name: 'name' + i,
      cellphone: new Date().getTime(),
      email: 'zjut' + i + '@163.com'
    });
  }

  ThemeTable01 = BbaseList.extend({
    initialize: function(){
      var theme = BbaseEst.nextUid('ThemeTable01');
      this._super({
        template: `
          <div class="${theme}-wrap" style="padding:10px; width: 994px;">
            <style>
              .${theme}-wrap .formPanel .header {position: relative; height: 50px; line-height: 50px; padding-left: 14px; background-color: #f4f5f9; border-bottom: 1px solid #dfdfdf; font-size: 0; }
              .${theme}-wrap .formPanel .header .formIdArea {float: left; position: relative; font-size: 14px; }
              .${theme}-wrap .formPanel .header .dataType {display: inline-block; font-size: 14px; }
              .${theme}-wrap .formPanel .header .dataType::before {content: ""; display: inline-block; width: 20px; height: 20px; background: url(img/manage/tongyong2.png?v=201612191754) no-repeat -60px -2px; vertical-align: middle; padding-right: 7px; }
              .${theme}-wrap .anything .header .dataType::after {content: ""; }
              .${theme}-wrap .formPanel .header .name {display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; vertical-align: top; padding-left: 6px; }
              .${theme}-wrap .formPanel .header .formIdArea .formIdComboBox {display: none; position: absolute; left: 70px; top: 50px; z-index: 1; background-color: #f4f5f9; border: 1px solid #e7e7eb; border-top: 0; max-width: 200px; max-height: 150px; }
              .${theme}-wrap .formPanel .header .formIdArea .formIdComboBox li {cursor: pointer; padding-left: 6px; padding-right: 22px; max-width: 172px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; height: 40px; line-height: 32px; }
              .${theme}-wrap .formPanel .header .excelBtn {cursor: pointer; float: right; position: relative; color: #4e67ee; text-align: center; font-size: 15px; padding-right: 20px; }
              .${theme}-wrap .formPanel .header .excelBtn {cursor: pointer; float: right; position: relative; color: #4e67ee; text-align: center; font-size: 15px; padding-right: 20px; }
              .${theme}-wrap .formPanel .main {padding-bottom: 50px; overflow:hidden; }
              .${theme}-wrap .formPanel .main .title {table-layout: fixed; width: 100%; height: 40px; line-height: 40px; border-collapse: collapse; text-align: center; font-size: 16px; background-color: #fbfbfb; }
              .${theme}-wrap .formPanel .argName{background-color: #fbfbfb; }
              .${theme}-wrap .formPanel .main .title td {padding: 0 10px; position: relative; border-right: 1px solid #e7e7eb; text-align: center; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
              .${theme}-wrap .formPanel .main .title td:last-child {border-right: 0; }
              .${theme}-wrap .formPanel .main .content {width: 100%; border-collapse: collapse; text-align: center; table-layout: fixed; }
              .${theme}-wrap .formPanel .footer {position: absolute; bottom: 1px; left: 1px; right: 1px; height: 50px; line-height: 50px; border-top: 1px solid #dadada; background-color: #f4f5f9; color: #666; box-sizing: border-box; }
              .${theme}-wrap .formPanel .pageInfo {display: inline-block; position: relative; vertical-align: top; padding-left: 14px; }
              .${theme}-wrap .formPanel .pageOperate {display: inline-block; position: relative; float: right; padding-right: 20px; top: -2px; }
              .${theme}-wrap .formPanel .pageOperate .prevPage {cursor: pointer; display: inline-block; vertical-align: middle; width: 21px; height: 21px; line-height:22px;color:#000; background: url(img/manage/qt.png?v=201612191754) -333px -174px; border: 1px solid #a0a1a2; }
              .${theme}-wrap .formPanel .pageOperate .currentPage {margin: 0 5px; display: inline-block; vertical-align: middle; height: 21px; line-height: 21px; }
              .${theme}-wrap .formPanel .pageOperate .nextPage {cursor: pointer; display: inline-block; vertical-align: middle; width: 21px; height: 21px;line-height:22px; color:#000;background: url(img/manage/qt.png?v=201612191754) -351px -174px; border: 1px solid #a0a1a2; }
              .${theme}-wrap .formPanel {font-size: 13px; box-sizing: border-box; overflow: hidden; border: 1px solid #dfdfdf; position: relative; margin-bottom:10px; }
              .${theme}-wrap .formPanel .main .content td {line-height: 40px; height: 40px; padding: 0 10px; border: 1px solid #e7e7eb; white-space: normal; text-overflow: ellipsis; overflow: hidden; }
              .${theme}-wrap .formPanel .main .content tr td:first-child {border-left: none; }
              .${theme}-wrap .formPanel .pageOperate .disablePage {cursor: default; border-color: #e1e1e1; }
              .${theme}-wrap .demo-item{padding:10px; }
              .${theme}-wrap .red{color:red; }
              .${theme}-wrap .form-api{width: 996px;margin-top:10px; }
              .${theme}-wrap .form-api .anything{display:block; }
              .${theme}-wrap .form-demo .header{padding-left:8px; }
              .${theme}-wrap .form-demo  .footer{height: 40px; line-height: 40px; border-top: 1px solid #e7e7e7; background-color: #f4f5f9; padding-left:10px; }
              .${theme}-wrap input[type=text], select, textarea {font-size: 12px; height: 27px; border: 1px solid #d6d6d6; text-indent: 8px; }
              .${theme}-wrap button{font-size: 12px; height: 27px; border: 1px solid #d6d6d6; }
              .${theme}-wrap .checkboxAll{display: inline-block; height: 42px; padding-top: 8px; line-height: 50px; vertical-align: middle; }
            </style>
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
                      <span bb-watch="page:class" class="prevPage bbasefont bbase-arrowleft {{#If page===1}}disablePage{{/If}}" bb-click="prevPage" ></span>
                      <span class="currentPage"><span bb-watch="page:html">{{page}}</span>/<span bb-watch="totalPage:html">{{totalPage}}</span></span>
                      <span bb-watch="page:class" class="nextPage bbasefont  bbase-arrowright {{#If page===totalPage}}disablePage{{/If}}" bb-click="nextPage"></span>
                    </div>
                  </div>
                </div>
              </div>
        </div>
        `,
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

  module.exports = ThemeTable01;
});