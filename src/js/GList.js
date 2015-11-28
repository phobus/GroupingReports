(function(window, document, undefined) {
  'use strict';

  var GList = function(config) {}
  window['GList'] = GList;

  GList.prototype = {
    render: function(data, fn) {
      var gd = Object.create(GData.prototype);
      data = gd.groupBy(data, fn);
      var ul = document.createElement('ul');
    }
  }
})(window, document);
