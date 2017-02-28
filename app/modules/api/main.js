Bbase.MODULE['ApiCenter'] = 'modules/api/controllers/ApiCenter.js';
Bbase.ROUTE['api'] = function () {
  seajs.use(['BbaseJquery', 'ApiCenter'], function (BbaseJquery, ApiCenter) {
    BbaseApp.addRegion('ApiCenter', ApiCenter, {
      el: '#app-main'
    });
  });
}
