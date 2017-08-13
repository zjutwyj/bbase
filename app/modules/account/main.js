/*用户登录*/
Bbase.MODULE['MemberLogin'] = 'modules/account/controllers/MemberLogin.js';
Bbase.ROUTE['member_login'] = function () {
  seajs.use(['MemberLogin'], function (MemberLogin) {
    BbaseApp.addRegion('MemberLogin', MemberLogin, {
      el: '#app-account'
    });
  });
}

/*用户注册*/
Bbase.MODULE['MemberRegister'] = 'modules/account/controllers/MemberRegister.js';
Bbase.ROUTE['member_register'] = function () {
  seajs.use(['MemberRegister'], function (MemberRegister) {
    BbaseApp.addRegion('MemberRegister', MemberRegister, {
      el: '#app-account'
    });
  });
};

/*忘记密码*/
Bbase.MODULE['MemberPasswordForget'] = 'modules/account/controllers/MemberPasswordForget.js';
Bbase.ROUTE['member_password_forget'] = function () {
  seajs.use(['MemberPasswordForget'], function (MemberPasswordForget) {
    BbaseApp.addRegion('MemberPasswordForget', MemberPasswordForget, {
      el: '#app-account'
    });
  });
}

Bbase.MODULE['MemberHeader'] = 'modules/account/controllers/MemberHeader.js';
