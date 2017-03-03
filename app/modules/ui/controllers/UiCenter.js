'use strict';
/**
 * @description 模块功能说明
 * @class UiCenter
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiCenter', [], function (require, exports, module) {
  var UiCenter, template;

  template = `
    <div class="UiCenter-wrap" style="padding:10px;">
      <style>
        .UiCenter-tag{
          border-left: 1px solid #dfdfdf;
          border-top: 1px solid #dfdfdf;
          box-shadow: 1px 1px 1px #e9e8e8;
        }
        .UiCenter-tag .tab-ul-line{
          height: auto;
        }
        .UiCenter-tag .tab-ul-line .tab-li{
          float: left;
          position: relative;
          width: 110px;
          height: 58px;
          line-height: 58px;
          text-align: center;
          font-size: 16px;
          list-style-type:none;
        }
        .UiCenter-tag .tab-ul-line .tab-li span {
          display: inline-block;
          vertical-align: middle;
          padding-left: 4px;
        }
        .UiCenter-tag .tab-ul-line .tab-li.item-active {
          cursor: default;
        }
        .UiCenter-tag .tab-ul-line .tab-li a {
          display: block;
          width: 100%;
          height: 100%;
          color: #000;
          padding:0;
        }
        .UiCenter-tag .tab-ul-line .tab-li.item-active a{
          color: #4a68ec;
          cursor: pointer;
        }
        .UiCenter-tag .tab-ul-line .tab-li.item-active a{
          cursor: default;
        }
        .UiCenter-tag .tab-ul-line .tab-li .tabImgComm {
          display: inline-block;
          width: 22px;
          height: 22px;
          background: url(/manage/styles/default/img/manage/tongyong2.png?v=201612191754) no-repeat;
          vertical-align: middle;
        }
        .UiCenter-tag .tab-ul-line .tab-li.hover .ui-tabs-anchor span{
          color: #4a68ec;
        }

        .UiCenter-tag .tab-ul-line .tab-li .dataTabUiList {
            background-position: 0 0;
        }
        .UiCenter-tag .tab-ul-line .tab-li.item-active .dataTabUiList,.UiCenter-tag .tab-ul-line .tab-li.hover .dataTabUiList {
            background-position: -30px 0px;
        }

        .UiCenter-tag .tab-ul-line .tab-li .dataTabUiForm {
            background-position: 0 -28.5px;
        }
        .UiCenter-tag .tab-ul-line .tab-li.item-active .dataTabUiForm,.UiCenter-tag .tab-ul-line .tab-li.hover .dataTabUiForm {
            background-position: -30px -28.5px;
        }

        .UiCenter-tag .tab-ul-line .tab-li .dataTabUiDropDown {
            background-position: 0 -58px;
        }
        .UiCenter-tag .tab-ul-line .tab-li.item-active .dataTabUiDropDown,.UiCenter-tag .tab-ul-line .tab-li.hover .dataTabUiDropDown {
            background-position: -30px -58px;
        }
        .UiCenter-tag .tab-ul-line .tab-li .dataTabUiDirective {
            background-position: 0 -179px;
        }
        .UiCenter-tag .tab-ul-line .tab-li.item-active .dataTabUiDirective,.UiCenter-tag .tab-ul-line .tab-li.hover .dataTabUiDirective {
            background-position: -30px -179px;
        }
         .UiCenter-tag .tab-ul-line .tab-li .dataTabUiItemCheck {
            background-position: 0 -329px;
        }
        .UiCenter-tag .tab-ul-line .tab-li.item-active .dataTabUiItemCheck,.UiCenter-tag .tab-ul-line .tab-li.hover .dataTabUiItemCheck {
            background-position: -30px -329px;
        }



      </style>
      <div class="UiCenter-tag" bb-bbaseuitab="{viewId: 'uicentertab', cur: cur,tpl:tpl, theme:'tab-ul-line', path:'moduleId', items: items, onChange: handleTabChange}" ></div>
    </div>
  `;

  UiCenter = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'UiList',
        items: [
          { text: '列表', moduleId: 'UiList' ,oneRender: false},
          { text: '表单', moduleId: 'UiForm' ,oneRender: false},
          { text: '下拉', moduleId: 'UiDropDown' ,oneRender: false},
          { text: '选项卡', moduleId: 'UiItemCheck' ,oneRender: false},
          { text: '指令', moduleId: 'UiDirective',oneRender: false }
        ],
        tpl:  `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTab{{moduleId}} tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    },
    handleTabChange: function (item, init, a, b) {
      console.log(item);
    },
    afterRender: function () {

    }
  });

  module.exports = UiCenter;
});
