/**
 * @description 用户登录
 * @class auth
 * @author yongjin<zjut_wyj@163.com> 2015/7/9
 */
seajs.use(['BbaseJquery', 'MemberHeader'], function (BbaseJquery, MemberHeader) {

  var UserModel = BbaseModel.extend({
    baseId: 'userId',
    baseUrl: CONST.API + '/user/isLogin'
  });

  SERVICE.initUserTest(UserModel, true).done(function (result) {
    var router = BbaseBackbone.Router.extend(b_routes);
    new router();
    BbaseBackbone.history.start();
    if (!result.attributes || !result.attributes.data){
      result.attirbutes = {
        data: {}
      }
    }
    BbaseApp.addView('MemberHeader', new MemberHeader({
      el: '#app-head',
      data: result.attributes.data || {}
    }));
  });

});
