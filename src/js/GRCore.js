(function(window, document, undefined) {
  'use strict';

  var Gr = function() {};
  window['Gr'] = Gr;

  var defaultConfig = {
    title: 'Grouping Report',
    fullWitch: true
  };

  Gr.extend = function(base) {
    var extensionObject;
    for (var i = 1, l = arguments.length; i < l; i++) {
      extensionObject = arguments[i];
      for (var key in extensionObject) {
        if (extensionObject.hasOwnProperty(key)) {
          base[key] = extensionObject[key];
        }
      }
    }
  };

  Gr.clone = function(obj) {
    var objClone = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        objClone[key] = obj[key];
      }
    }
    return objClone;
  };

})(window, document);
