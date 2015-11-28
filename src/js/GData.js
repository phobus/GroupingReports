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

    groupBy: function(data, column) {
      var groups = {};
      for (var i = 0; i < data.length; i++) {
        //var group = JSON.stringify(fn(data[i]));
        var group = data[i][column];
        if (group in groups) {
          groups[group].values.push(data[i]);
        } else {
          groups[group] = {
            grouping: column,
            key: group,
            values: [data[i]]
          };
        }
      }
      return this.arrayFromObject(groups);
    },

    grouping: function(data, grouping, aggregate) {
      return {
        //grouping: undefined,
        //column: undefined,
        key: 'Total',
        values: this._recursiveGrouping(data, grouping, aggregate, 0)
      };
    },

    _recursiveGrouping: function(data, grouping, aggregate, index) {
      var result = this.groupBy(data, grouping[index]),
        l = result.length;
      if (index < grouping.length - 1) {
        for (var i = 0; i < l; i++) {
          result[i].values = this._recursiveGrouping(result[i].values, grouping, aggregate, index + 1);
        }
      }
      return result;
    },
  }

})(window, document);
