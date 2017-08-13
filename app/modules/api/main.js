Bbase.MODULE['ApiCenter'] = 'modules/api/controllers/ApiCenter.js';
Bbase.ROUTE['api'] = function () {
  seajs.use(['ApiCenter'], function (ApiCenter) {
    BbaseApp.addRegion('ApiCenter', ApiCenter, {
      el: '#app-main'
    });
  });
}
