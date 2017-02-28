/*用户登录*/
Bbase.MODULE['MemberLogin'] = 'modules/account/controllers/MemberLogin.js';
Bbase.ROUTE['member_login'] = function () {
  seajs.use(['BbaseJquery', 'MemberLogin'], function (BbaseJquery, MemberLogin) {
    BbaseApp.addRegion('MemberLogin', MemberLogin, {
      el: '#app-account'
    });
  });
}

/*用户注册*/
Bbase.MODULE['MemberRegister'] = 'modules/account/controllers/MemberRegister.js';
Bbase.ROUTE['member_register'] = function () {
  seajs.use(['BbaseJquery', 'MemberRegister'], function (BbaseJquery, MemberRegister) {
    BbaseApp.addRegion('MemberRegister', MemberRegister, {
      el: '#app-account'
    });
  });
};

/*忘记密码*/
Bbase.MODULE['MemberPasswordForget'] = 'modules/account/controllers/MemberPasswordForget.js';
Bbase.ROUTE['member_password_forget'] = function () {
  seajs.use(['BbaseJquery', 'MemberPasswordForget'], function (BbaseJquery, MemberPasswordForget) {
    BbaseApp.addRegion('MemberPasswordForget', MemberPasswordForget, {
      el: '#app-account'
    });
  });
}
