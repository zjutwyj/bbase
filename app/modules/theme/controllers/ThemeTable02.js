'use strict';
/**
 * @description 模块功能说明
 * @class ThemeTable02
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ThemeTable02', [], function (require, exports, module) {
  var ThemeTable02;

  var items = [];
  for (var i = 0; i < 100; i++) {
    items.push({
      name: 'name' + i,
      content: 'content' + i
    });
  }

  ThemeTable02 = BbaseList.extend({
    initialize: function () {
      var theme = BbaseEst.nextUid('ThemeTable02');
      this._super({
        template: `
          <div class="${theme}-wrap" style="padding:10px; width: 994px;">
            <style>
              .${theme}-wrap{    font-size: 12px;}
              .${theme}-wrap .formPanel{border: none!important;}
              .${theme}-wrap .cube_link_header {height: 24px; background: ${CONST.LIGHTEN_COLOR}; border: 1px solid ${CONST.LIGHT_COLOR}; position: relative; margin-top: 5px }
              .${theme}-wrap .cube_link_body {position: relative; height: 250px; border-left: 1px solid ${CONST.LIGHT_COLOR}; border-bottom: 1px solid ${CONST.LIGHT_COLOR}; border-right: 1px solid ${CONST.LIGHT_COLOR}; overflow-x: hidden; overflow-y: auto }
              .${theme}-wrap .cube_link_header table {height: 24px; line-height: 24px }
              .${theme}-wrap .pl_20 {padding-left: 20px; }
              .${theme}-wrap .pl_10 {padding-left: 10px; }
              .${theme}-wrap .cube_link_body td .iconfont {font-size: 14px!important }
              .${theme}-wrap .cube_link_body td.td_operate .iconfont {color: #C7AAA8 }
              .${theme}-wrap .cube_link_body td.td_operate a:focus,.${theme}-wrap .cube_link_body td.td_operate a:hover {color: ${CONST.LIGHT_COLOR}; text-decoration: none }
              .${theme}-wrap .cube_link_body td,.${theme}-wrap .cube_link_header td,.${theme}-wrap .pl_10,.pl_20 {text-align: left }
              .${theme}-wrap .td_sep {width: 2px }
              .${theme}-wrap .sep {border-left: 1px solid ${CONST.LIGHT_COLOR}; float: left; height: 18px; width: 1px }
              .${theme}-wrap .cube_link_header table {height: 24px; line-height: 24px }
              .${theme}-wrap .cube_link_header td, .${theme}-wrap .cube_link_body td {text-align: left }
              .${theme}-wrap .cube_link_body li.bui-grid-row-even{background-color: ${CONST.LIGHTEST_COLOR}; }
              .${theme}-wrap .cube_link_body td .iconfont{font-size:14px !important; }
              .${theme}-wrap .cube_link_body td.td_operate .iconfont{color: #C7AAA8; }
              .${theme}-wrap .cube_link_body td.td_operate a:focus, .${theme}-wrap .cube_link_body td.td_operate a:hover {color: ${CONST.LIGHT_COLOR}; text-decoration: none; }
              .${theme}-wrap .td_link_text {width: 100px }
              .${theme}-wrap .td_link_href {width: 175px }
              .${theme}-wrap .td_link_ico {width: 60px }
              .${theme}-wrap .td_link_cover {width: 60px }
              .${theme}-wrap .td_show {width: 60px }
              .${theme}-wrap .td_operate {width: 155px }
              .${theme}-wrap .cube_link { padding: 10px 0 10px 0; transition: background 1000ms ease-in; background: #fff; border-bottom: 1px dashed #999; line-height: 0px } 】
              .${theme}-wrap .cube_link tr {height: 22px }
              .${theme}-wrap .cube_link .td_sep {width: 3px }
              .${theme}-wrap .link_text {width: 100px }
              .${theme}-wrap .link_href {width: 175px }
              .${theme}-wrap .str_ctrl {overflow: hidden; white-space: nowrap; -o-text-overflow: ellipsis; -moz-text-overflow: ellipsis; text-overflow: ellipsis }
              .${theme}-wrap .link_separate {border-bottom: 1px solid gainsboro }
              .${theme}-wrap .input-transparent {background: 0 0; border: none !important; }
              .${theme}-wrap .input-transparent:focus {border: 1px solid ${CONST.LIGHT_COLOR} !important; }
              .${theme}-wrap .select, .${theme}-wrap .text {height: 22px; text-indent: 8px; line-height: 22px; margin-right: 2px; }
              /* footer */
              .${theme}-wrap .formPanel .footer {position: absolute; bottom: 1px; left: 0px; right: 0px; height: 32px; line-height: 32px; border-bottom: 1px solid ${CONST.LIGHT_COLOR}; border-left: 1px solid ${CONST.LIGHT_COLOR}; border-right: 1px solid ${CONST.LIGHT_COLOR}; border-top: 1px solid ${CONST.LIGHTEN_COLOR}; background-color: ${CONST.LIGHTEN_COLOR}; color: #666; box-sizing: border-box;}
              .${theme}-wrap .formPanel .footer .pageInfo {display: inline-block; position: relative; vertical-align: top; padding-left: 14px; }
              .${theme}-wrap .formPanel .footer .pageOperate {display: inline-block; position: relative; float: right; padding-right: 20px; top: -2px; }
              .${theme}-wrap .formPanel .footer .pageOperate .prevPage {cursor: pointer; display: inline-block; vertical-align: middle; width: 21px; height: 21px; line-height:22px;color:#000; background: url(img/manage/qt.png?v=201612191754) -333px -174px; border: 1px solid #a0a1a2; }
              .${theme}-wrap .formPanel .footer .pageOperate .currentPage {margin: 0 5px; display: inline-block; vertical-align: middle; height: 21px; line-height: 21px; }
              .${theme}-wrap .formPanel .footer .pageOperate .nextPage {cursor: pointer; display: inline-block; vertical-align: middle; width: 21px; height: 21px;line-height:22px; color:#000;background: url(img/manage/qt.png?v=201612191754) -351px -174px; border: 1px solid #a0a1a2; }
              .${theme}-wrap .formPanel .footer .pageOperate .disablePage {cursor: default; border-color: #e1e1e1; }
              </style>
            <div class="dialog-inner formPanel" style="height: 464px;overflow:auto;">
              <div class="module-form">
                <div id="cube_link_header" class="cube_link_header magrinLR_25">
                  <table cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td class="pl_20" style="width: 273px;">名称</td>
                        <td class="td_sep"> <div class="sep"></div> </td>
                        <td class="pl_20" style="width: 273px;">内容</td>
                        <td class="td_sep"> <div class="sep"></div> </td>
                        <td class="td_operate pl_10">操作</td>
                        <td>&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <ul class="cube_link_body magrinLR_25 ui-sortable render-ul" style="background-color: #FFFCFC;height: 400px;">
                </ul>
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
        `,
        model: BbaseModel.extend({}),
        collection: BbaseCollection.extend({}),
        item: BbaseItem.extend({
          tagName: 'li',
          className: 'cube_link',
          template: `
            <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="pl_10" style="width: 283px;">
                  <div class="str_ctrl">
                    <input type="text" class="text input-transparent" bb-model="name" bb-change="_save" value="{{name}}" placeholder="请输入名称"/>
                  </div>
                </td>
                <td class="td_sep"></td>
                <td class="pl_10" style="width: 283px;">
                    <input type="text" class="text input-transparent" bb-model="content" bb-change="_save" value="{{content}}" placeholder="请输入内容"/>
                </td>
                <td class="td_sep"></td>
                <td class="td_operate pl_10">
                  <a herf="javascript:;" class="btn-del" bb-click="_del">删除</a>
                </td>
              </tr>
            </tbody>
          </table>
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
        pageSize: 10,
        diff: true,
        render: '.render-ul'
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
        model.view._itemActive({ add: true }, BbaseEst.isEmpty(_this._get('checked_all')) ? false : _this._get('checked_all'));
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

  module.exports = ThemeTable02;
});
