// core/keymap.js
var keymap = UE.keymap  = {
  'Backspace' : 8,
  'Tab' : 9,
  'Enter' : 13,

  'Shift':16,
  'Control':17,
  'Alt':18,
  'CapsLock':20,

  'Esc':27,

  'Spacebar':32,

  'PageUp':33,
  'PageDown':34,
  'End':35,
  'Home':36,

  'Left':37,
  'Up':38,
  'Right':39,
  'Down':40,

  'Insert':45,

  'Del':46,

  'NumLock':144,

  'Cmd':91,

  '=':187,
  '-':189,

  "b":66,
  'i':73,
  //回退
  'z':90,
  'y':89,
  //粘贴
  'v' : 86,
  'x' : 88,

  's' : 83,

  'n' : 78
};

// core/localstorage.js
//存储媒介封装
var LocalStorage = UE.LocalStorage = (function () {

  var storage = window.localStorage || getUserData() || null,
    LOCAL_FILE = 'localStorage';

  return {

    saveLocalData: function (key, data) {

      if (storage && data) {
        storage.setItem(key, data);
        return true;
      }

      return false;

    },

    getLocalData: function (key) {

      if (storage) {
        return storage.getItem(key);
      }

      return null;

    },

    removeItem: function (key) {

      storage && storage.removeItem(key);

    }

  };

  function getUserData() {

    var container = document.createElement("div");
    container.style.display = "none";

    if (!container.addBehavior) {
      return null;
    }

    container.addBehavior("#default#userdata");

    return {

      getItem: function (key) {

        var result = null;

        try {
          document.body.appendChild(container);
          container.load(LOCAL_FILE);
          result = container.getAttribute(key);
          document.body.removeChild(container);
        } catch (e) {
        }

        return result;

      },

      setItem: function (key, value) {

        document.body.appendChild(container);
        container.setAttribute(key, value);
        container.save(LOCAL_FILE);
        document.body.removeChild(container);

      },

      //// 暂时没有用到
      //clear: function () {
      //
      //    var expiresTime = new Date();
      //    expiresTime.setFullYear(expiresTime.getFullYear() - 1);
      //    document.body.appendChild(container);
      //    container.expires = expiresTime.toUTCString();
      //    container.save(LOCAL_FILE);
      //    document.body.removeChild(container);
      //
      //},

      removeItem: function (key) {

        document.body.appendChild(container);
        container.removeAttribute(key);
        container.save(LOCAL_FILE);
        document.body.removeChild(container);

      }

    };

  }

})();

(function () {

  var ROOTKEY = 'ueditor_preference';

  UE.Editor.prototype.setPreferences = function(key,value){
    var obj = {};
    if (utils.isString(key)) {
      obj[ key ] = value;
    } else {
      obj = key;
    }
    var data = LocalStorage.getLocalData(ROOTKEY);
    if (data && (data = utils.str2json(data))) {
      utils.extend(data, obj);
    } else {
      data = obj;
    }
    data && LocalStorage.saveLocalData(ROOTKEY, utils.json2str(data));
  };

  UE.Editor.prototype.getPreferences = function(key){
    var data = LocalStorage.getLocalData(ROOTKEY);
    if (data && (data = utils.str2json(data))) {
      return key ? data[key] : data
    }
    return null;
  };

  UE.Editor.prototype.removePreferences = function (key) {
    var data = LocalStorage.getLocalData(ROOTKEY);
    if (data && (data = utils.str2json(data))) {
      data[key] = undefined;
      delete data[key]
    }
    data && LocalStorage.saveLocalData(ROOTKEY, utils.json2str(data));
  };

})();
