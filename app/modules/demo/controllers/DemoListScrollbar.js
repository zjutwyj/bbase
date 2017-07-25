'use strict';
/**
 * @description 模块功能说明
 * @class DemoListScrollbar
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('DemoListScrollbar', [], function (require, exports, module) {
  var DemoListScrollbar;

  var items = [];
  for(var i = 0; i< 2000; i++){
    items.push({
      id: i,
      seoTitle: 'seoTitle' + i,
      bind: {
        address: 'www.bbase.com' + i,
        url: 'http://www.bbase.com/' + i
      }
    });
  }

  DemoListScrollbar = BbaseList.extend({
    initialize: function () {
      var theme = BbaseEst.nextUid('DemoListScrollbar');
      this._super({
        template: `
          <div class="DemoListScrollbar-wrap ${theme}-wrap" style="padding: 20px; background-color: ${CONST.LIGHTEN_COLOR};">
            <style>
              .${theme}-wrap .tab-container, .tab-content {height: 100%; }
              .${theme}-wrap .cursor {cursor:pointer; }
              .${theme}-wrap .overview-title {font-size: 24px; font-family: HelveticaNeueW01-45Ligh,HelveticaNeueW02-45Ligh,HelveticaNeueW10-45Ligh,sans-serif; font-weight: 300; margin-top: 28px; margin-left: 12px; color: #20455e; margin-bottom: 8px;}
              .${theme}-wrap .overview-title.first {margin-top: 0; }
              .${theme}-wrap .settings-section {background-color: #fff; border-radius: 8px; box-shadow: 0 2px 0 0 rgba(228,228,228,.59); padding-top: 29px; padding-bottom: 29px; padding-left: 33px; margin-right: 26px; margin-bottom: 19px; overflow: hidden; min-width: 850px; max-width: 989px;    font-size: 14px; }
              .${theme}-wrap .settings-section.overview-section {padding: 0; margin-bottom: 9px; }
              .${theme}-wrap .overview-item {height: 60px; line-height: 60px; display: block; }
              .${theme}-wrap .overview-item .row-action:hover {text-decoration: none; }
              .${theme}-wrap .overview-item .row-action {display: block; height: 100%; overflow:hidden;}
              .${theme}-wrap .overview-item .row-action a{    text-decoration: none; color: #666;}
              .${theme}-wrap .row-action {border-bottom: solid #f0f4f7 1px; margin-left: 23px; margin-right: 23px; }
              .${theme}-wrap .overview-item .row-action>div {display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #20455e; }
              .${theme}-wrap .overview-item .item-name {width: 210px; font-family: HelveticaNeueW01-65Medi,HelveticaNeueW02-65Medi,HelveticaNeueW10-65Medi,sans-serif; font-weight: bold; }
              .${theme}-wrap .overview-item .item-content {width: 300px; margin-right: 40px; }
              .${theme}-wrap .overview-item .item-flag {position: relative; top: 16px; vertical-align: top; }
              .${theme}-wrap .true-icon {background-position: 0 -1946px; }
              .${theme}-wrap .true-icon {width: 29px; height: 29px; border: 1px solid ${CONST.MAIN_COLOR}; border-radius: 50%; line-height: 31px; font-size: 20px; text-indent: 4px; color: ${CONST.MAIN_COLOR}; }
              .${theme}-wrap .false-icon{border: 1px solid #4b5463;color: #4b5463;}
              .${theme}-wrap .overview-item .item-action {float: right; text-align: right; }
              .${theme}-wrap .overview-item .action-text {color: ${CONST.MAIN_COLOR}; }
              .${theme}-wrap .action-icon {width: 7px; height: 58px; line-height: 54px; display: inline-block; margin-left: 19px; margin-top: 0px; font-size: 24px;}
              .${theme}-wrap .overview-item:hover {background-color: ${CONST.LIGHTEST_COLOR}; }
              .${theme}-wrap .overview-item .action-text .bbase-arrowleft{transform: rotate(180deg); }
              /*文本框、按钮*/
              .${theme}-wrap .text{border-bottom: 1px solid #ff5291; padding: 6px;}
              .${theme}-wrap .button{background: transparent; border: 1px solid ${CONST.MAIN_COLOR}; padding: 5px 8px; border-radius: 10px; cursor: pointer;}
              .${theme}-wrap .button:hover{background-color: ${CONST.MAIN_COLOR};color: #fff;}
              .${theme}-wrap .flag-title{height: 29px; line-height: 29px; margin-left: 5px;}
            </style>
            <div class="tab-container">
              <div class="tab-content" bb-bbaseuiscrollbar="{viewId: 'viewId', id: 'iscroll', maxScroll: maxScroll, offset: 20}" style="height: 400px;">
                <section class="render-section settings-section overview-section">

                </section>
              </div>
            </div>

          </div>
        `,
        model: BbaseModel.extend({
          baseId: 'id',
          baseUrl: CONST.API + '/baseLayout/detail',
          fields: ['id', 'seoTitle']
        }),
        collection: BbaseCollection.extend({
          url: CONST.API + '/baseLayout/list'
        }),
        item: BbaseItem.extend({
          tagName: 'div',
          className: 'ng-isolate-scope overview-item',
          template : `
                <div class="row-action">
                  <!---->
                  <div class="item-name ng-binding">
                    网站名称
                  </div>
                  <!---->
                  <!---->
                  <div class="item-content ng-binding">
                    <span bb-watch="seoTitle:html">{{seoTitle}}</span>
                  </div>
                  <!---->
                  <div class="item-flag">
                    <div class="flag-group">
                        <div class="true-icon bbasefont bbase-correct left"></div>
                        <div class="flag-title left">审核通过</div>
                    </div>
                  </div>
                  <!---->
                  <!---->
                  <div  class="item-action cursor" bb-click="goToDesign">
                    <div class="action-text">
                      <span class="ng-binding">进入设计</span>
                      <div class="action-icon bbasefont bbase-arrowleft"></div>
                    </div>
                  </div>
                  <!---->
                </div>
          `,
          initData: function(){
            return {
              nameEdit: false,
              bind: {
                address: '',
                url: '',
                state: '00'
              }
            }
          }
        }),
        items: items,
        pageSize: 16,
        render: '.render-section'
      });
    },
    initData: function () {
      return {}
    },
    viewUpdate: function(){
      this.iscroll &&this.iscroll.refresh();
    },
    maxScroll: function(){
      this._loadMore();
    }
  });

  module.exports = DemoListScrollbar;
});
