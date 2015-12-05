(function(window, document, gr, undefined) {
  'use strict';

  gr.clone = function(obj) {
    var objClone = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        objClone[key] = obj[key];
      }
    }
    return objClone;
  };

  gr.extend = function(base) {
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

  gr.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(cb) {
      return window.setTimeout(cb, 1000 / 60);
    };
    
  var lastId = 0;
  gr.uniqueId = function() {
    return ++lastId;
  };

})(window, document, window.gr = window.gr || {});
