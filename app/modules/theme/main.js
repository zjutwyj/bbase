Bbase.MODULE['ThemeCenter'] = 'modules/theme/controllers/ThemeCenter.js';
Bbase.ROUTE['theme'] = function () {
  seajs.use(['BbaseJquery', 'ThemeCenter'], function (BbaseJquery, ThemeCenter) {
    BbaseApp.addRegion('ThemeCenter', ThemeCenter, {
      el: '#app-main'
    });
  });
}
Bbase.MODULE['ThemeTable'] = 'modules/theme/controllers/ThemeTable.js';
Bbase.MODULE['ThemeTable01'] = 'modules/theme/controllers/ThemeTable01.js';



Bbase.MODULE['ThemeList'] = 'modules/theme/controllers/ThemeList.js';