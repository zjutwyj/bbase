Bbase.MODULE['TeachCenter'] = 'modules/teach/controllers/TeachCenter.js';
Bbase.ROUTE['teach'] = function () {
  seajs.use(['BbaseJquery', 'TeachCenter'], function (BbaseJquery, TeachCenter) {
    BbaseApp.addRegion('TeachCenter', TeachCenter, {
      el: '#app-main'
    });
  });
}
Bbase.TEMPLATE['template/readme'] = function(require, exports, module) {
  module.exports = require('README.html');
}
