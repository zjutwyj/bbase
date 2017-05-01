'use strict';
/**
 * @description 模块功能说明
 * @class MemberRegister
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('MemberRegister', [], function (require, exports, module) {
  var MemberRegister, template;

  template = `
    <div class="MemberRegister-wrap member-mask">
    <style>
      .regContent{background-color: #fff; width: 1058px; margin: 20px auto; padding: 30px; }
      .regLine {clear: both; display: block; width: 100%; height: 44px; line-height: 44px; font-family: "微软雅黑"; margin-bottom: 27px; }
      .regLine .item1 {float: left; height: 44px; width: 250px; margin-right: 10px; color: #373737; text-align: right; font-size: 16px; }
      .regLine .item2 {float: left; height: 44px; width: 315px; width: 315px\9; }
      .regLine .item3 {float: left; height: 46px; color: #888; margin-left: 24px; font-size:14px; }
      .regLine .item2 input {border: 1px solid #ddd; width: 311px; width: 311px\9; height: 40px; text-indent: 5px; line-height: 40px; color: #4f4f4f; float: left; font-size: 14px; }
      .validete-num{height: 41px; margin-left: 8px; width: 100px; }
      #sign {display: block; width: 314px; height: 44px; line-height: 44px; border-radius: 5px; background: #12b221; text-align: center; color: #fff; font-size: 24px; text-decoration: none; }
      .login_now {display: block; text-align: center; }
      .loginText {width: 100%; text-align: center; font-size: 14px; color: #373737; }
      .login {font-size: 14px; text-decoration: none; padding-right: 10px; color: #2f82ff; margin: 0 5px; text-decoration: underline; }
    </style>
      <div class="regContent">
    <div class="regLine">
        <div class="item1">账号：</div>
        <div class="item2"><input type="text" bb-model="username" id="regAcct" autocomplete="new-password" maxlength="30"></div>
        <div class="item3" style=""><span style="color:red;">*</span>&nbsp;请输入账号</div>
        <div class="item4" id="item4_acct" style="display: none;">请输入账号</div>
        <div class="item5" style="display: none;"></div>
        <div class="clear"></div>
    </div>

    <div id="validateCodeHtml"></div>

    <div class="regLine">
        <div class="item1">密码：</div>
        <div class="item2"><input type="password" bb-model="password" id="pwd" autocomplete="new-password" onpaste="return false" maxlength="20"></div>
        <div class="item3"><span style="color:red;">*</span>&nbsp;请输入密码</div>
        <div class="item5"></div>
        <div class="clear"></div>
    </div>

    <div class="regLine" id="validateCodeBox2">
        <div class="item1">验证码：</div>
        <div class="item2" style="width:220px;"><input bb-model="verCode" type="text" id="verCode" style="width: 100px;" maxlength="4" autocomplete="new-password"><img  name="verifyPic" bb-click="refreshCode" width="56" height="25" class="validete-num refreshCode" bb-src="{{verCodeImgSrc}}" title="看不清？点击换一张" /></div>

        <div class="item3"><span style="color:red;">*</span>&nbsp;请输入正确的验证码</div>
        <div class="item5"></div>
        <div class="clear"></div>
    </div>
    <div class="regLine" bb-show="errorMsg!==''" style="display: none;">
        <div class="item1">&nbsp;</div>
        <div class="item2"> <div id="error" class="worn" bb-watch="errorMsg:html">{{errorMsg}}</div></div>
        <div class="item3">&nbsp;</div>
        <div class="item5"></div>
        <div class="clear"></div>
    </div>
    <div class="clear"></div>
    <div class="regLine" style="margin-top:20px; height:90px;">
        <div class="item1"></div>
        <div class="item3" style="position:relative; line-height:40px; margin-left:0px;">
            <a hidefocus="true" class="registerBtn" id="sign" href="javascript:;"  title="免费网站注册">免费注册</a>
            <div class="clear"></div>
            <div class="login_now">
                <span class="loginText">我已经注册，直接</span><a class="login" hidefocus="true" href="#/member_login">登录</a>
            </div>
        </div>
    </div>
</div>
    </div>
  `;

  MemberRegister = BbaseDetail.extend({
    initialize: function () {
      this._super({
        template: template,
        model: BbaseModel.extend({
          baseId: 'userId',
          baseUrl: CONST.API + '/user/register'
        }),
        enter: '#sign',
        form: '.MemberRegister-wrap:#sign'
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
    afterSave: function(response){
        this._set('errorMsg', response.msg);
    }
  });

  module.exports = MemberRegister;
});
