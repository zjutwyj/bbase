'use strict';
/**
 * @description 模块功能说明
 * @class NewcomerTip
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('NewcomerTip', [], function(require, exports, module) {
  var NewcomerTip;

  NewcomerTip = BbaseView.extend({
    initialize: function() {
      this._super({
        template: `
          <div class="NewcomerTip-wrap">
            <div class="j_yindao" bb-show="showTip" style="display:none;">
              <div class="counter">
                <div class="box" bb-watch="targetWidth:style,targetHeight:style,targetLeft:style,targetTop:style" bb-show="showTarget" style="width: {{targetWidth}}px;height:{{targetHeight}}px;left: {{targetLeft}}px;top:{{targetTop}}px;"></div>
                <div bb-watch="panelNum:class,showTarget:class,left:style,top:style" class="y_panel y_panel_{{panelNum}} {{#If showTarget}}y_panel_line{{/If}}" style="left:{{left}}px;top:{{top}}px;">
                  <div class="ytip1" bb-show="showTarget"></div>
                  <div class="y_header">
                    <span class="">新手提示</span>
                    <span class="close" bb-click="close">关闭</span>
                  </div>
                  <div class="y_content">
                    <p bb-watch="text:html">{{{text}}}</p>
                    <span class="next" bb-click="next" bb-watch="btnTxt:html">{{btnTxt}}</span>
                    <span class="page" bb-watch="curIndex:html">{{curIndex}} / {{totalCount}}</span>
                  </div>
                  <div class="ytip2" bb-show="showTarget"></div>
                </div>
              </div>
              <div class="j_yindao_mask">
                <div bb-watch="targetWidth:style,targetHeight:style,targetLeft:style,targetTop:style" class="box" style="width: {{targetWidth}}px; height: {{targetHeight}}px; left: {{targetLeft}}px; top: {{targetTop}}px;"></div>
              </div>
            </div>
          </div>
        `
      });
    },
    initData: function() {
      return {
        items: [],
        curIndex: 0,
        showTip: false,
        isLast: false,
        isFirst: true,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        targetLeft: 0,
        targetTip: 0,
        targetWidth: 0,
        targetHeight: 0,
        text: this._options.items[0].text,
        showTarget: true,
        panelNum: 0,
        totalCount: this._options.items.length,
        btnTxt: '继续'
      }
    },
    afterRender() {
      this.showTip();
    },
    showTip() {
      var index = this._get('curIndex');
      var selector = this._options.items[index]['selector'];
      var text = this._options.items[index]['text'];
      var btnTxt = this._options.items[index]['btnTxt'];
      var showTarget = !BbaseEst.isEmpty(selector);
      var winWidth = $(window).width();
      var winHeight = $(window).height();
      var left = winWidth / 2 - 159;
      var top = winHeight / 2 - 90;
      var targetWidth = 0;
      var targetHeight = 0;
      var targetLeft = 0;
      var targetTop = 0;
      if (showTarget) {
        var $node = $(selector);
        if ($node.size() === 0) {
          showTarget = false;
        } else {
          targetWidth = $node.width();
          targetHeight = $node.height();
          targetLeft = $node.offset().left;
          targetTop = $node.offset().top;
          this.$('.ytip1,.ytip2').attr('style', '');

          // 判断位置
          if (winWidth - $node.offset().left - $node.width() > 400) {
            // 右边空间充足
            left = $node.offset().left + $node.width() + 68;
            top = $node.offset().top;
            this._set('panelNum', 0);
            if ($(window).height() -181 -top < 0){
              // 下方不足，移上方点
              var offset = $(window).height() - 181 - top;
              top = $(window).height() - 181;
              this.$('.ytip1').css('top',  -offset + 20);
              this.$('.ytip2').css('top',  -offset + 16);
            }

          } else {
            // 移到下方
            this._set('panelNum', 1);
            top = $node.offset().top + $node.height() + 68;
            left = $node.offset().left + $node.width() / 2 - 159;
            if ($(window).width() - 318 - left < 0){
              var offset = $(window).width() - 318 - left;
              left = $(window).width() -318;
              this.$('.ytip1').css('left',  154 - offset );
              this.$('.ytip2').css('left',  150 - offset);
            }
            if ($(window).height() -181 -top < 0){
              // 下方不足，移到上方
              var offset = $(window).height() - 181 - top;
              top = top -355;
              this.$('.ytip1').css('top',  181);
              this.$('.ytip2').css('top',  181 + 55);
            }

          }
        }
      }
      this._set({
        left: left,
        top: top
      });
      this._set({
        targetWidth: targetWidth,
        targetHeight: targetHeight,
        targetLeft: targetLeft,
        targetTop: targetTop
      });
      this._set({
        'showTarget': showTarget,
        'text': text,
        'isFirst': index === 0,
        'isLast': index === this._options.items.length - 1,
        'curIndex': index + 1,
        'showTip': true
      });
      this._set('btnTxt', btnTxt ? btnTxt : this._get('isLast') ? '关闭' : '继续');
    },
    next() {
      var _this = this;
      if (_this._get('curIndex') === _this._options.items.length) {
        _this.close();
        return;
      }
      var index = _this._get('curIndex');
      var click = _this._options.items[index]['click'];
      var timeout = _this._options.items[index]['timeout'] || 100;

      if (!BbaseEst.isEmpty(click)) {
        $(click).click();
        setTimeout(function() {
          _this.showTip();
        }, timeout);
      } else {
        _this.showTip();
      }
    },
    close() {
      this._set('showTip', false);
    }
  });

  module.exports = NewcomerTip;
});