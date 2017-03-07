/**
 * @description 用户登录
 * @class auth
 * @author yongjin<zjut_wyj@163.com> 2015/7/9
 */
seajs.use(['BbaseJquery'], function (BbaseJquery) {
  var UserModel = BbaseModel.extend({
    baseId: 'userId',
    baseUrl: CONST.API + '/user/isLogin'
  });
  var FlyerHeader = BbaseView.extend({
    initialize: function () {
      this._super({
        template: `
          <div class="flyerBody" style="">
            <style>
              .member-login-btn{text-decoration: none;}
              .userExitText:hover{color: #6b6b6b; }
            </style>
            <div class="flyerHeader flyerShadow">
              <div class="area">
                <div class="logo">
                  <a href="#/manage">
                    <img bb-src="{{CONST 'HOST'}}/styles/default/img/manage/LOGO_2.png?v=201603020957">
                  </a>
                </div>
                <div class="navBar" bb-bbaseuitab="{viewId: 'navigator', cur: curNav, items: navItems, require:false,theme:'tab-ul-line', onChange: handleNavigatorChange}"></div>
                <div class="userIcon">
                    <div class="bg"></div>
                    <div class="icon"></div>
                    <div id="userPanel" class="userPanel">
                      <div class="userCenter">
                        <div class="userExit" bb-show="username">
                          <div class="userGreetingBox">
                            <div class="userName"><span bb-watch="username:html">{{username}}</span>，</div>
                            <div id="greetings" class="greetings">{{timeStr}}好!</div>
                          </div>
                          <div class="userExitBox">
                            <div class="userExitHover">
                              <div class="userExitImg"></div>
                              <div class="userExitText" bb-click="userExit">退出</div>
                            </div>
                          </div>
                        </div>
                        <div class="userExit" bb-show="!username">
                          <div class="userGreetingBox">
                            <div class="userName" style="max-width:120px;">{{timeStr}}好! 您还未登录</div>
                          </div>
                          <div class="userExitBox">
                            <div class="userExitHover">
                              <div class="userExitImg" style="background-position:-89px -509px;"></div>
                              <div class="userExitText" ><a href="#/member_login" class="member-login-btn">登录</a></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
<div class="messageIcon topBarBulletin-hasNew">
                <div class="bg"></div>
                <div class="icon"></div>
                <div id="messagePanel" class="messagePanel">
                  <div class="messLeft">
                    <div id="myMessage" bb-watch="msgType:class" class="leftBox {{#If msgType==='msg'}}leftClick{{/If}}" bb-click="showMessage('msg')">我的消息<div id="myMessageHasNew" class="messageHasNew"></div></div>
                    <div id="menuUpdate" bb-watch="msgType:class" class="leftBox hasNewUpdate {{#If msgType==='update'}}leftClick{{/If}}" bb-click="showMessage('update')">功能更新<div id="menuUpdateHasNew" class="messageHasNew" style="display: none;"></div></div>
                  </div>
                  <div class="messRight">
                    <div id="myMessagePanel" class="myMessagePanel" bb-show="msgType==='msg'">
                    <div class="newsList">
                      <a hidefocus="true" target="_blank"><span class="iconPoint">&nbsp;</span>资料整理中</a></div>
                    </div>
                    <div id="menuUpdatePanel" class="menuUpdatePanel" bb-show="msgType==='update'">
                    <div class="newsList">
                      <a hidefocus="true" href="javascript:;" target="_blank"><span class="iconPoint">&nbsp;</span>应用程序上线啦</a>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        `
      });
    },
    init: function(){
      var timeStr = "你";
      var hour = new Date().getHours();
      if (hour > 6 && hour < 12){
        timeStr = '上午';
      } else if (hour > 12 && hour < 18){
        timeStr = '下午';
      } else if (hour > 18 && hour < 24){
        timeStr = '晚上';
      }
      return {
        timeStr:timeStr,
        username: null,
        msgType: 'msg',
        curNav: location.hash,
        navItems: [
          {text: '简易教程', value: '#/teach'},
          {text: 'API', value: '#/api'},
          {text: '示例展示', value: '#/demo'},
          {text: 'Ui展示', value: '#/ui'},
          {text: '组件展示', value: '#/component'}
        ]
      }
    },
    showMessage: function (type) {
      this._set('msgType', type);
    },
    userExit: function () {
      SERVICE.logout();
    },
    login: function () {
      seajs.use(['BbaseJquery', 'MemberLogin'], function (BbaseJquery, MemberLogin) {
        BbaseApp.addRegion('MemberLogin', MemberLogin, {
          el: '#app-account'
        });
      });
    },
    handleNavigatorChange: function(item, init, a, b){
      if (!init){
        this._navigate(item.value, true);
      }
    },
    beforeRender: function () {
      var ctx = this;
      BbaseEst.off('accountRender').on('accountRender', function (flag, user) {
        CONST.USER = user || {};
        if (!CONST.USER.username){
          CONST.USER.username="";
        }
        ctx._set(CONST.USER);
        if (BbaseEst.isEmpty(CONST.USER.username)) {
          ctx.login();
        }
      });
      BbaseEst.off('login').on('login', function (flag, user) {
        BbaseEst.trigger('accountRender', user);
      });
      BbaseEst.trigger('accountRender', this.model.toJSON());
      BbaseEst.off('checkLogin').on('checkLogin', function () {
        SERVICE.initUser(UserModel).done(function (response) {
          if (!CONST.USER.username) {
            BbaseEst.trigger('accountRender', response.attributes.data);
            BbaseEst.trigger('login', response.attributes.data);
          }
        });
      });
    },
    afterRender: function () {
      var cur = 'UiApi';
      var items = [
        { text: 'API测试', moduleId: 'UiApi', oneRender: false },
        { text: '组件嵌套', moduleId: 'UiModule', oneRender: false }
      ];
      return;
      app.addRegion('testNav', Tab, {
        tpl: '<a href="javascript:;" class="tool-tip" data-title="{{text}}">{{text}}</a>', // 模版
        el: this.$('#test-nav'), // 插入点
        cur: cur, // 显示当前项内容
        theme: 'tab-ul-line', // 样式：目前有tab-ul-normal,tab-ul-text,tab-ul-btn,tab-ul-line
        path: 'moduleId', // 作用域字段
        toolTip: true,
        items: items
      });
    }
  });
  SERVICE.initUserTest(UserModel, true).done(function (result) {
    var router = BbaseBackbone.Router.extend(b_routes);
    new router();
    BbaseBackbone.history.start();
    BbaseApp.addView('FlyerHeader', new FlyerHeader({
      el: '#app-head',
      data: result.attributes.data || {}
    }));
  });

});
