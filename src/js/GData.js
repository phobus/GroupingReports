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
      var groups = {},
        l = data.length;
      for (var i = 0; i < l; i++) {
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
    groupAndAggregateBy: function(data, column, aggregate) {
      var a, groups = {},
        l = data.length,
        s = aggregate.length;
      for (var i = 0; i < l; i++) {
        var group = JSON.stringify(data[i][column]);
        if (group in groups) {
          for (var j = 0; j < s; j++) {
            a = aggregate[j].name;
            //buffer[a] += data[i][a];
            //http://stackoverflow.com/questions/10473994/javascript-adding-decimal-numbers-issue
            groups[group].aggregate[a] = +(groups[group].aggregate[a] + data[i][a]).toFixed(2);

          }
          groups[group].values.push(data[i]);
        } else {
          //var buffer = [];
          var buffer = {};
          for (var j = 0; j < s; j++) {
            a = aggregate[j].name;
            buffer[a] = data[i][a];
          }
          groups[group] = {
            grouping: column,
            key: data[i][column],
            values: [data[i]],
            aggregate: buffer
          };
        }
      }
      return this.arrayFromObject(groups);
    },
    grouping: function(data, grouping, aggregate) {
      return {
        aggregate: undefined,
        grouping: '__** {{ALL}} **__',
        key: 'Total',
        values: this._recursiveGrouping(data, grouping, aggregate, 0)
      };
    },

    _recursiveGrouping: function(data, grouping, aggregate, index) {
      var result = this.groupAndAggregateBy(data, grouping[index], aggregate),
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
