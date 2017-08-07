'use strict';
/**
 * @description 模块功能说明
 * @class ThemeTable01
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ThemeTable01', [], function (require, exports, module) {
  var ThemeTable01;

  var items = [];
  for (var i = 0; i < 100; i++) {
    items.push({
      name: 'name' + i,
      cellphone: new Date().getTime(),
      email: 'zjut' + i + '@163.com'
    });
  }

  ThemeTable01 = BbaseList.extend({
    initialize: function () {
      var theme = BbaseEst.nextUid('ThemeTable01');
      this._super({
        template: `
          <div class="${theme}-wrap" style="padding:10px; width: 994px;">
            <style>
              .${theme}-wrap .formPanel {font-size: 13px; box-sizing: border-box; overflow: hidden; border: 1px solid #dfdfdf; position: relative; margin-bottom:10px; }
              /* header */
              .${theme}-wrap .formPanel .header {position: relative; height: 50px; line-height: 50px; padding-left: 14px; background-color: ${CONST.LIGHTEN_COLOR}; border-bottom: 1px solid #dfdfdf; font-size: 0; }
              .${theme}-wrap .formPanel .header .formIdArea {float: left; position: relative; font-size: 14px; }
              .${theme}-wrap .formPanel .header .dataType {display: inline-block; font-size: 14px; }
              .${theme}-wrap .formPanel .header .dataType::before {content: ""; display: inline-block; width: 20px; height: 20px; background: url(img/manage/tongyong2.png?v=201612191754) no-repeat -60px -2px; vertical-align: middle; padding-right: 7px; }
              .${theme}-wrap .anything .header .dataType::after {content: ""; }
              .${theme}-wrap .formPanel .header .name {display: inline-block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; vertical-align: top; padding-left: 6px; }
              .${theme}-wrap .formPanel .header .formIdArea .formIdComboBox {display: none; position: absolute; left: 70px; top: 50px; z-index: 1; background-color: #f4f5f9; border: 1px solid #e7e7eb; border-top: 0; max-width: 200px; max-height: 150px; }
              .${theme}-wrap .formPanel .header .formIdArea .formIdComboBox li {cursor: pointer; padding-left: 6px; padding-right: 22px; max-width: 172px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; height: 40px; line-height: 32px; }
              .${theme}-wrap .formPanel .header .excelBtn {cursor: pointer; float: right; position: relative; color:${CONST.MAIN_COLOR}; text-align: center; font-size: 15px; padding-right: 20px; }
              /* main */
              .${theme}-wrap .formPanel .main {padding-bottom: 50px; overflow:hidden; }
              .${theme}-wrap .formPanel .main .title {table-layout: fixed; width: 100%; height: 40px; line-height: 40px; border-collapse: collapse; text-align: center; font-size: 16px; background-color: #fbfbfb; }
              .${theme}-wrap .formPanel .main .title td {padding: 0 10px; position: relative; border-right: 1px solid #e7e7eb; text-align: center; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
              .${theme}-wrap .formPanel .main .title td:last-child {border-right: 0; }
              .${theme}-wrap .formPanel .main .content {width: 100%; border-collapse: collapse; text-align: center; table-layout: fixed; }
              .${theme}-wrap .formPanel .main .content td {line-height: 40px; height: 40px; padding: 0 10px; border: 1px solid #e7e7eb; white-space: normal; text-overflow: ellipsis; overflow: hidden; }
              .${theme}-wrap .formPanel .main .content tr td:first-child {border-left: none; }
              /* footer */
              .${theme}-wrap .formPanel .footer {position: absolute; bottom: 1px; left: 1px; right: 1px; height: 50px; line-height: 50px; border-top: 1px solid #dadada; background-color: ${CONST.LIGHTEN_COLOR}; color: #666; box-sizing: border-box; }
              .${theme}-wrap .formPanel .footer .pageInfo {display: inline-block; position: relative; vertical-align: top; padding-left: 14px; }
              .${theme}-wrap .formPanel .footer .pageOperate {display: inline-block; position: relative; float: right; padding-right: 20px; top: -2px; }
              .${theme}-wrap .formPanel .footer .pageOperate .prevPage {cursor: pointer; display: inline-block; vertical-align: middle; width: 21px; height: 21px; line-height:22px;color:#000; background: url(img/manage/qt.png?v=201612191754) -333px -174px; border: 1px solid #a0a1a2; }
              .${theme}-wrap .formPanel .footer .pageOperate .currentPage {margin: 0 5px; display: inline-block; vertical-align: middle; height: 21px; line-height: 21px; }
              .${theme}-wrap .formPanel .footer .pageOperate .nextPage {cursor: pointer; display: inline-block; vertical-align: middle; width: 21px; height: 21px;line-height:22px; color:#000;background: url(img/manage/qt.png?v=201612191754) -351px -174px; border: 1px solid #a0a1a2; }
              .${theme}-wrap .formPanel .footer .pageOperate .disablePage {cursor: default; border-color: #e1e1e1; }

              /* checkbox */
              .${theme}-wrap .checkboxAll{display: inline-block; height: 42px; padding-top: 8px; line-height: 50px; vertical-align: middle; }
              .${theme}-wrap .td-checkbox .bbase-ui-itemcheck.ui-item-check-checkbox{margin-top: -15px; text-align: center; padding-left: 2px;}
              .${theme}-wrap tr.item-active,.${theme}-wrap tr:hover{background-color: ${CONST.LIGHTEN_COLOR};}

              /* demo */
              .${theme}-wrap .form-demo .header{padding-left:8px; }
              .${theme}-wrap .form-demo .footer{height: 40px; line-height: 40px; border-top: 1px solid #e7e7e7; background-color: #f4f5f9; padding-left:10px; }

            </style>
               <div class="formPanel form-demo">
                <div class="anything" style="display: block;">
                  <div class="header">
                    <div class="formIdArea">
                      <span class="checkboxAll" bb-bbaseuicheckbox="{viewId: 'checkAll', cur: checked_all,items: allItems}" bb-click="handleAllChange"></span>
                      <span class="name tool-tip" data-title="我的表单1488173365180">我的表单1488173365180</span>
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
          <td class="td-checkbox" width="22" bb-bbaseuicheckbox="{viewId: viewId,cur: checked, items: items}"></td>
          <td><span bb-watch="name:html" class="tool-tip" data-title="{{name}}">{{name}}</span></td>
          <td><span bb-watch="cellphone:html">{{cellphone}}</span></td>
          <td><span bb-watch="email:html">{{email}}</span></td>
          `,
          initData: function () {
            return {
              viewId: 'checkbox' + this.cid,
              items: [{ text: '', value: true }]
            }
          },
          change: function (path) {
            if (path === 'checked') {
              if (BbaseEst.isEmpty(this._get('checked'))) {
                this._set('checked', false);
              }
              if (!this._super('view').stopItemCheck) {
                this._check(this._get('checked'));
              }
            }
          }
        }),
        items: items,
        checkAppend: true,
        pagination: true,
        toolTip:true,
        pageSize: 10,
        diff: true,
        render: '.uilist01-tbody'
      });
    },
    init: function () {
      return {
        page: 1,
        pageSize: 10,
        totalPage: 0,
        totalCount: 0,
        allItems: [{ text: '全选', value: true }]
      }
    },

    afterLoad: function () {
      this._set({
        'page': this._getPage(),
        'pageSize': this._getPageSize(),
        'totalPage': this._getTotalPage(),
        'totalCount': this._getCount()
      });
    },

    // 全选
    handleAllChange: function () {
      var _this = this;
      _this.stopItemCheck = true;
      _this.collection.each(function (model) {
        model._set('checked', _this._get('checked_all'));
        model.view._itemActive({add: true}, BbaseEst.isEmpty(_this._get('checked_all')) ? false : _this._get('checked_all'));
      });
      setTimeout(function () {
        _this.stopItemCheck = false;
      }, 50);

    },

    // 上一页
    prevPage: function () {
      if (this._getPage() === 1) {
        return;
      }
      this._setPage(this._getPage() - 1);
      this._load();
    },

    // 下一页
    nextPage: function () {
      if (this._getTotalPage() === this._getPage()) {
        return;
      }
      this._setPage(this._getPage() + 1);
      this._load();
    }
  });

  module.exports = ThemeTable01;
});
