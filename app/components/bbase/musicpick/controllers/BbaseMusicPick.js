'use strict';
/**
 * @description 模块功能说明
 * @class ModuleName
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseMusicPick', ['BbaseItemCheck', 'FileUpload'], function (require, exports, module) {
  var BbaseMusicPick, template, BbaseItemCheck, FileUpload;

  BbaseItemCheck = require('BbaseItemCheck');
  FileUpload = require('FileUpload');
  template = `
    <div class="theme-black bbase-component-musicpick">
    <audio class="sound-effect"  loop="loop" src="" id="sound-effect"
         controls="" style="width: 330px;margin-bottom: 5px;display:none;"></audio>
      <div id="popupWindowClose_8484" class="closeBtn bbasefont bbase-x" bb-click="_close" style="top: 16px; right: 16px;"></div>
      <ul class="materialLeftPanel ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">
        <li id="materialCookie" class="ui-state-default ui-corner-top" style="display:none;">
          <a id="material_select" href="javascript:;" class="ui-tabs-anchor">我的音乐</a>
        </li>
        <li id="myPhotoCookie" class="ui-state-default ui-corner-top ui-tabs-active ui-state-active">
          <a id="myPhoto_select" href="javascript:;" class="ui-tabs-anchor">系统音乐</a>
        </li>
        <li class="uploadPhoto" style="display:none;">
          <span id="uploadButton" class="uploadify" style="cursor: pointer;">上传音乐
        <a id="file_upload_1-button" href="javascript:void(0)" class="uploadify-button"></a>
        </span>
        </li>
      </ul>
      <div id="photo-main">
        <div class="photo-tool" bb-bbaseuitab="{viewId:'itemcheckmusiccate',theme: 'tab-ul-line',cur:curCate,items:cateitems,path:'className', require: false,onChange: handleCateChange }">
        </div>
        <ul class="music-list images-content">
        </ul>
      </div>
      <div id="photo-pagination">
      </div>
      <div id="photo-btns">
        <input type="button" bb-click="_close" value="取消" class="cancel abutton faiButton faiButton-hover" />
        <input type="button" bb-click="onChange" value="确定" class="submit abutton faiButton faiButton-hover" />
      </div>
    </div>
  `;

  BbaseMusicPick = BbaseList.extend({
    initialize: function () {
      this._super({
        model: BbaseModel.extend({
          defaults: BbaseEst.extend({}, BbaseModel.prototype.defaults),
          baseId: 'attId',
          baseUrl: CONST.API + (this.options.detailApi || '/att/detail')
        }),
        collection: BbaseCollection.extend({
          url: CONST.API + (this.options.listApi || '/att/list')
        }),
        item: BbaseItem.extend({
          events: {
            'click .clickToUse': 'clickToUse',
            'click .toggle': '_check',
            'click .music-name': 'addMusic',
            'click .music-play': 'playMusic',
            'click .delBtn': '_del'
          },
          tagName: 'li',
          className: 'music-li',
          template: `
            <div class="music-container ">
              <div class="music-name toggle" bb-watch="filename:html">{{filename}}</div>
              <div class="music-play bbasefont bbase-play" style="display:block;"><span>播放</span></div>
              <div class="music-size" bb-watch="fsize:html">{{fsize}}KB</div>
            </div>
          `,
          clickToUse: function (e) {
            e.stopImmediatePropagation();
            BbaseApp.getView(this._options.viewId).onChange(this.model.toJSON());
          },
          addMusic: function (e) {
            BbaseApp.getView(this._options.viewId).select(this.model.get('serverPath'));
          },
          playMusic: function (e) {
            e.stopImmediatePropagation();
            this.$el.siblings().find('.bbase-pause').click();
            if (this.musicPlay) {
              this.$('.music-play').removeClass('bbase-pause').addClass('icon-play');
              this.musicPlay = false;
              BbaseApp.getView(this._options.viewId).stopMusic();
            } else {
              this.$('.music-play').removeClass('icon-play').addClass('bbase-pause');
              this.musicPlay = true;
              BbaseApp.getView(this._options.viewId).playMusic(this.model.get('serverPath'));
            }

          },
          afterRender: function () {

          }
        }),
        render: '.music-list',
        template: template,
        pagination: '#photo-pagination',
        pageSize: 14,
        diff: true,
        checkAppend: false,
        cache: this.options.cache,
        session: this.options.session
      });
    },
    init: function () {
      return {
        curCate: 'all',
        cateitems: [
          { text: '最新', cateId: 'music100', className: 'all' },
          { text: '轻松', cateId: 'music101', className: '8' },
          { text: '美好', cateId: 'music102', className: '7' },
          { text: '励志', cateId: 'music103', className: '6' },
          { text: '伤感', cateId: 'music104', className: '5' },
          { text: '甜蜜', cateId: 'music105', className: '4' },
          { text: '欢快', cateId: 'music106', className: '3' },
          { text: '安静', cateId: 'music107', className: '2' }
        ]
      }
    },
    beforeLoad: function () {
      this._setParam('sys', '1');
      this._setParam('type', '11');
    },
    handleCateChange: function (item, init) {
      if (!init) {
        this._setParam('belongId', item.className === 'all' ? '' : item.className);
        this._load({ page: 1 });
      }
    },
    onWatch: function () {},
    afterRender: function () {
      this.player = this.player || this.$('#sound-effect');
      this.audioPlayer = this.audioPlayer || this.player[0];
    },
    setMusic: function (mp3Url) {
      this.audioPlayer.pause();
      if (mp3Url.length > 0) {
        this.audioPlayer.src = mp3Url;
        this.audioPlayer.load();
        this.audioPlayer.play();
        this.bMute = 0;
      } else {
        this.bMute = 1;
      }
    },
    startMusic: function () {
      this.audioPlayer && this.audioPlayer.play();
    },
    stopMusic: function () {
      this.audioPlayer && this.audioPlayer.pause();
    },
    playMusic: function (src) {
      this.setMusic(CONST.PIC_URL + '/' + src);
    },
    select: function (src) {
      if (this._options.select) {
        this._options.select.call(this, src);
      } else {
        $('.music-input').val(CONST.PIC_URL + '/' + src);
        $('.music-input').change();
      }
    },
    onChange: function (model) {
      var list = this._getCheckedItems();
      if (this._options.onChange) {
        this._options.onChange.call(this, BbaseEst.map(list, 'attributes'));
      }
      this._close();
    }
  });

  module.exports = BbaseMusicPick;
});
