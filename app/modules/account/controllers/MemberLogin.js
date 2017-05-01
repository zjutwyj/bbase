'use strict';
/**
 * @description 模块功能说明
 * @class MemberLogin
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('MemberLogin', [], function (require, exports, module) {
  var MemberLogin, template;

  template = `
    <div class="MemberLogin-wrap member-mask">
      <div class="middle">
        <div class="content">
          <div class="left">
            <a id="reg-button" class="regBtn"></a>
          </div>
          <div class="right">
            <div class="righttop">登录&nbsp;<a id="reg-link" href="#/member_register">/注册</a></div>
            <div id="log-form" class="rightmid">
              <div class="log-input-container">
                <div class="clear" style="font-size:0px;"></div>
                <div class="log-line" id="rowCacct">
                  <div class="log-txt" style="display: none;">帐号/邮箱/手机号码</div>
                  <input id="log-cacct" bb-model="username" type="text" autocomplete="off" maxlength="30" class="log-input input2" placeholder="账号" >
                  <div class="logIco logIcoCacct">&nbsp;</div>
                </div>
                <div class="log-line log-line-hover" id="rowPwd">
                  <input id="log-pwd" bb-model="password" type="password" autocomplete="new-password" placeholder="密码" maxlength="20" class="log-input input2">
                  <div class="logIco logIcoPwd">&nbsp;</div>
                </div>
                <div id="log-valid-line" class="log-line" style="display:block;">
                  <input id="log-valid" bb-model="verCode" type="text" class="log-input input2" placeholder="验证码" style="width:116px; padding-left:12px;">
                  <img id="log-valid-img" name="verifyPic" bb-click="refreshCode" width="56" height="25" class="validete-num refreshCode" bb-src="{{verCodeImgSrc}}" title="看不清？点击换一张">
                  <span id="log-refresh-btn" bb-click="refreshCode" title="看不清？点击换一张"></span>
                </div>
              </div>
              <div class="goin1" style="display:none;"><a href="javascript:;" >忘记密码？</a></div>
              <div class="option" id="staff-login-option">
                <div class="goin"><label class="checkItemLabel"></label><label for="staff-login">&nbsp;</label></div>
                </div>
              <div id="error" class="worn" bb-watch="errorMsg:html" bb-show="errorMsg!==''">{{errorMsg}}</div>
              <div id="login-button" class="loginBtn">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</div>
              <div class="clear"></div>
              <div class="login_otherAcct">
                <span class="login_other">其他帐号登录</span>
                <a class="login_WeChatI" href="javascript:;" title="微信登录"></a>
                <a class="login_QQI" href="javascript:;" title="QQ登录"></a>
              </div>
            </div>
          </div>
      </div>
    </div>
  `;

  MemberLogin = BbaseDetail.extend({
    initialize: function () {
      this._super({
        template: template,
        model: BbaseModel.extend({
          baseId: 'loginId',
          baseUrl: CONST.API + '/user/login'
        }),
        form: '.MemberLogin-wrap:.loginBtn',
        enter: '#login-button'
      });
    },
    init: function () {
      return {
        verCodeImgSrc: '/random',
        username: '',
        password: '',
        verCode: '',
        errorMsg: ''
      }
    },
    refreshCode: function () {
      this._set('verCodeImgSrc', BbaseEst.setUrlParam('v', new Date().getTime(),
        this._get('verCodeImgSrc')));
    },
    // 演示用，随便输入什么账号都可以进入
    beforeSave: function () {
      if (BbaseEst.isEmpty(this._get('username'))){
        this._set('errorMsg', '请输入账号');
        return false;
      }
      CONST.USER = {
        username: this._get('username')
      };
      BbaseEst.trigger('accountRender', CONST.USER);
      this._navigate('#/teach', true);
      BbaseApp.removePanel('MemberLogin');
      return false;
    },
    afterSave: function (response) {
      if (!response.success) {
        this._set('errorMsg', response.msg);
      } else {
        this._set('errorMsg', '');
        CONST.USER = this.model.toJSON();
        BbaseEst.trigger('accountRender', CONST.USER);
        this._set({ password: '', verCode: '' });
        // 判断是否是登录页面， 是跳转到首页
        if (location.hash.indexOf('member_login') > -1) {
          this._navigate('#/manage', true);
        }
        // 判断是否是设计页面， 是移除当前视图
        else if (location.hash.indexOf('design_center') === -1) {
          this._navigate(location.hash, true);
        }
        BbaseApp.removePanel('MemberLogin');
      }
    }
  });

  module.exports = MemberLogin;
});
