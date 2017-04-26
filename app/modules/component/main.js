Bbase.ROUTE['component'] = function () {
  seajs.use(['BbaseJquery', 'ComponentCenter'], function (BbaseJquery, ComponentCenter) {
    BbaseApp.addRegion('ComponentCenter', ComponentCenter, {
      el: '#app-main'
    });
  });
}
Bbase.MODULE['ComponentCenter'] = 'modules/component/controllers/ComponentCenter.js';

Bbase.MODULE['ComponentPhoto'] = 'modules/component/controllers/ComponentPhoto.js';
Bbase.MODULE['ComponentPhotoPick'] = 'modules/component/controllers/ComponentPhotoPick.js';
Bbase.MODULE['ComponentPhotoCrop'] = 'modules/component/controllers/ComponentPhotoCrop.js';

Bbase.MODULE['ComponentMusic'] = 'modules/component/controllers/ComponentMusic.js';
Bbase.MODULE['ComponentMusicPick'] = 'modules/component/controllers/ComponentMusicPick.js';

Bbase.MODULE['ComponentColor'] = 'modules/component/controllers/ComponentColor.js';
Bbase.MODULE['ComponentColorPick'] = 'modules/component/controllers/ComponentColorPick.js';
Bbase.MODULE['ComponentColorPanel'] = 'modules/component/controllers/ComponentColorPanel.js';


Bbase.MODULE['ComponentIcon'] = 'modules/component/controllers/ComponentIcon.js';
Bbase.MODULE['ComponentIconPick'] = 'modules/component/controllers/ComponentIconPick.js';