Bbase.MODULE['ThemeCenter'] = 'modules/theme/controllers/ThemeCenter.js';
Bbase.ROUTE['theme'] = function () {
  seajs.use(['ThemeCenter'], function (ThemeCenter) {
    BbaseApp.addRegion('ThemeCenter', ThemeCenter, {
      el: '#app-main'
    });
  });
}
Bbase.MODULE['ThemeTable'] = 'modules/theme/controllers/ThemeTable.js';
Bbase.MODULE['ThemeTable01'] = 'modules/theme/controllers/ThemeTable01.js';
Bbase.MODULE['ThemeTable02'] = 'modules/theme/controllers/ThemeTable02.js';



Bbase.MODULE['ThemeList'] = 'modules/theme/controllers/ThemeList.js';
Bbase.MODULE['ThemeList01'] = 'modules/theme/controllers/ThemeList01.js';
Bbase.MODULE['ThemeList02'] = 'modules/theme/controllers/ThemeList02.js';

Bbase.MODULE['ThemeTree'] = 'modules/theme/controllers/ThemeTree.js';
Bbase.MODULE['ThemeTree01'] = 'modules/theme/controllers/ThemeTree01.js';



Bbase.MODULE['ThemeForm'] = 'modules/theme/controllers/ThemeForm.js';
Bbase.MODULE['ThemeFormButton01'] = 'modules/theme/controllers/ThemeFormButton01.js';
Bbase.MODULE['ThemeFormInput01'] = 'modules/theme/controllers/ThemeFormInput01.js';