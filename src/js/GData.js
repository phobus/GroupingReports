(function(window, document, undefined) {
  'use strict';

  /**
   *  Grouping arrays
   *  http://codereview.stackexchange.com/questions/37028/grouping-elements-in-array-by-multiple-properties
   */
  var GData = function() {}
  window['GData'] = GData;

  GData.prototype = {
    arrayFromObject: function(obj) {
      var arr = [];
      for (var i in obj) {
        arr.push(obj[i]);
      }
      return arr;
    },

    groupBy: function(list, fn) {
      var groups = {};
      for (var i = 0; i < list.length; i++) {
        var group = JSON.stringify(fn(list[i]));
        if (group in groups) {
          groups[group].push(list[i]);
        } else {
          groups[group] = [list[i]];
        }
      }
      return this.arrayFromObject(groups);
    }
  }

})(window, document);
