/**
 * @description ThemeList02
 * @class ThemeList02
 * @author yongjin<zjut_wyj@163.com> 2015/12/29
 */
define('ThemeList02', [], function (require, exports, module) {
  var ThemeList02, template;

  var pics = [
    'http://img.leminchou.com/wcd/upload/029/2017/07/26/c2f0fe48-4061-4713-a4cd-c2dc6abf3866.jpg?v=3783305377',
    'http://img.leminchou.com/wcd/upload/029/2017/07/25/a78f0f86-0327-443a-a6cb-4ef8d26ee4ab.jpg?v=3744100224',
    'http://img.leminchou.com/wcd/upload/029/2017/07/15/08af373a-8e2c-41ec-9103-d8abbf3e536c.png?v=116420884',
    'http://img.leminchou.com/wcd/upload/029/2017/07/13/7adea40c-820a-4336-b833-995cdff61123.png?v=3706144612',
    'http://img.leminchou.com/wcd/upload/029/2017/07/12/7463464c-cd1e-4489-8a08-47835afb07a0.png?v=3706144612',
    'http://img.leminchou.com/wcd/upload/029/2017/07/11/1f6b6da0-b633-4cf7-b8dc-b73a9886b06f.png?v=3706144612',
    'http://img.leminchou.com/wcd/upload/029/2017/07/11/da830860-c7f1-4a7a-9718-34561f162447.png?v=3706144612',
    'http://img.leminchou.com/wcd/upload/029/2017/07/01/dc2a3332-3415-40e6-9384-49afa427273b.jpg?v=3738521475',
    'http://img.leminchou.com/wcd/upload/029/2017/06/24/636cf652-4dc1-4990-8c40-61d3ad5c2783.png?v=4058835084'
    ];

  for (var j = 0; j < 10; j++) {
      pics = pics.concat(pics);
  }
  var items = [];
  for(var i = 0; i< 200; i++){
    items.push({filename:'图片名称' + i, serverPath: pics[i] + i,wcdId: 'name' + i, seoTitle: 'title' + i, views: i, rviews: i });
  }

  ThemeList02 = BbaseList.extend({
    initialize: function () {
      var theme = BbaseEst.nextUid('ThemeList02');
      this._super({
        template: `
          <div class="theme-black ${theme}-wrap" style="padding:20px;width: 1016px; padding-right: 0;">
          <style>
              .${theme}-wrap .i-template {display: block; width: 322px; height: 218px; outline: 0; cursor: default; text-decoration: none; float: left; margin-right: 16px; margin-bottom: 16px; position: relative; background: url(http://dfwjjingtai.b0.upaiyun.com/upload//a//a1//admin//picture//2017//05//23/9c42cdda-6592-441f-a508-e4f9abe50c3f.png) no-repeat 0 0; }
              .${theme}-wrap .i-templateImg, .${theme}-wrap .i-template .i-templateLayer, .${theme}-wrap .i-template .i-templateCover {width: 320px; height: 200px; position: absolute; top: 17px; left: 1px; }
              .${theme}-wrap .i-templateImg {overflow: hidden; }
              .${theme}-wrap .i-template .i-templateLayer {visibility: hidden; z-index: 2; }
              .${theme}-wrap .i-templateBtnContainer {width: 100%; height: 56px; text-align: center; position: absolute; top: 50%; margin-top: -28px; }
              .${theme}-wrap .i-lookTemplateBtn, .${theme}-wrap .i-copyTemplateBtn {display: inline-block; width: 102px; height: 47px; line-height: 47px; color: #fff !important; font-size: 14px; text-decoration: none; overflow: hidden; position: relative; border-radius: 25px; background-color: ${CONST.MAIN_COLOR}; }
              .${theme}-wrap .i-lookTemplateBtn .i-icon,.i-copyTemplateBtn .i-icon {width: 30px; height: 30px; line-height: 30px; margin: 8px 0 0 0px; background-repeat: no-repeat; font-size: 28px; display: inline-block; vertical-align: top; }
              .${theme}-wrap .i-template .i-templateCover {visibility: hidden; opacity: 0; filter: alpha(opacity=70); background: #000; }
              .${theme}-wrap .i-template:hover .i-templateLayer {visibility: visible; }
              .${theme}-wrap .i-template:hover .i-templateCover {visibility: visible; opacity: .7; -webkit-transition: opacity 1s; -moz-transition: opacity 1s; -o-transition: opacity 1s; transition: opacity 1s; }
              .${theme}-wrap .addWork .text{width: 320px; height: 200px; margin-top: 17px; margin-left: 1px; background-color: #fff; line-height: 200px; text-align: center; font-size: 20px; cursor: pointer; }
              .${theme}-wrap .addWork .text:hover{color: ${CONST.MAIN_COLOR}; }
              .${theme}-wrap .case-list{overflow:hidden;}
              .${theme}-wrap .wrap-load-more{text-align: center;}
              .${theme}-wrap .wrap-load-more a{cursor: pointer;}
            </style>
            <div class="case-list square-scene">
                <div class="addWork workDiv i-template">
                  <div class="bgPic"></div>
                  <div class="text">新建空白</div>
                </div>
            </div>
            <div class="wrap-load-more hide" bb-click="loadMore">
              <a>查看更多...</a>
            </div>
          </div>
        `,
        model: BbaseModel.extend({
          baseId: 'layoutId',
          baseUrl: CONST.API + '/baseLayout/detail'
        }),
        collection: BbaseCollection.extend({
          url: CONST.PUBLIC_API + '/index/list'
        }),
        item: BbaseItem.extend({
          tagName: 'div',
          className: 'i-template',
          template: `
            <div title="" class="i-templateImg">
              <img bb-src="{{PIC serverPath}}" width="322px" style="display: block;">
            </div>
            <div class="i-templateLayer">
              <div class="i-templateBtnContainer">
                <a href="javascript:;" hidefocus="true" class="i-templateBtn i-lookTemplateBtn">
                  <span class="i-icon bbasefont bbase-search"></span>
                  <span class="i-text">查看</span>
                </a>
                <a href="javascript:;" hidefocus="true" class="i-templateBtn i-copyTemplateBtn">
                  <span class="i-icon bbasefont bbase-copy"></span>
                  <span class="i-text">使用</span>
                </a>
              </div>
            </div>
            <div class="i-templateCover"></div>
          `,
          initialize: function () {
            this._super({
              toolTip: true
            });
          },
          beforeRender: function (model) {
            if (model.get('mviews') == undefined) model._set('mviews', '0');
          },
          afterRender: function () {
            this.$('.hooked').removeClass('hooked');
          }
        }),
        pageSize: 5,
        append: true,
        render: '.case-list',
        items: items,
        empty: false,
        pagination: true
      });
    },
    beforeLoad: function () {
      this._setPageSize(this._getPage() === 1 ? 5 : 6);
    },
    afterLoad: function () {
      this.$('.no-result').hide();
      if (this._getTotalPage() === 0 ||
        this._getPage() === this._getTotalPage()) {
        this.$('.wrap-load-more').hide();
      } else {
        this.$('.wrap-load-more').show();
      }
    },
    loadMore: function () {
      this._setPage(this._getPage() + 1);
      this._load();
    }
  });

  module.exports = ThemeList02;
});
