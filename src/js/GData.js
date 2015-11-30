(function(window, document, undefined) {
  'use strict';

  var GData = function() {}
  window['GData'] = GData;

  var _id = 0;

  function getId() {
    return _id++;
  }

  GData.prototype = {
    _afn: {

      'sum': function(x) {
        var sum = 0;
        for (var i = 0, l = x.length; i < l; i++) {
          sum += x[i];
        }
        if (sum == sum >> 0) {
          return sum;
        }
        return sum.toFixed(2);
      },

      'avg': function(x) {
        var sum = 0;
        for (var i = 0, l = x.length; i < l; i++) {
          sum += x[i];
        }
        return sum / x.length;
      },

      'max': function(x) {
        return Math.max.apply(null, x);
      },

      'min': function(x) {
        return Math.min.apply(null, x);
      },

      'undefined': function(data, type) {
        return 'aggregation ' + type;
      }

    },

    aggregation: function(type, data) {
      return (this._afn[type] || this._afn['undefined'])(data, type);
    },

    grouping: function(data, groupBy, aggregate) {
      return {
        aggregate: {},
        grouping: '__** {{ALL}} **__',
        key: 'Total',
        values: this.recursiveGrouping(data, groupBy, aggregate, 0)
      };
    },

    recursiveGrouping: function(data, groupBy, aggregate, index) {
      var group, result = this.groupAndAggregate(data, groupBy[index], aggregate);
      if (index < groupBy.length - 1) {
        for (var i = 0, l = result.length; i < l; i++) {
          group = result[i];
          group.values = this.recursiveGrouping(group.values, groupBy, aggregate, index + 1);
        }
      }
      return result;
    },

    groupAndAggregate: function(data, columnGroupBy, aggregate) {
      var value, column, groups = {};
      for (var i = 0, l = data.length; i < l; i++) {
        var group = JSON.stringify(data[i][columnGroupBy]);
        if (group in groups) {
          //append to group
          for (var j = 0, s = aggregate.length; j < s; j++) {
            column = aggregate[j];
            if (column.virtual) {
              value = column.fn(data[i]);
              data[i][column.name] = value;
            } else {
              value = data[i][column.name];
            }
            groups[group].aggregate[column.name].push(value);
          }
          groups[group].values.push(data[i]);
        } else {
          //new group
          var buffer = {};
          for (var j = 0, s = aggregate.length; j < s; j++) {
            column = aggregate[j];
            if (column.virtual) {
              value = column.fn(data[i]);
              data[i][column.name] = value;
            } else {
              value = data[i][column.name];
            }
            buffer[column.name] = [value];
          }
          groups[group] = {
            grouping: columnGroupBy,
            key: data[i][columnGroupBy],
            values: [data[i]],
            aggregate: buffer
          };
        }
      }
      return this.reduce(groups, aggregate);
    },

    reduce: function(obj, aggregate) {
      var group, column, arr = [];
      for (var i in obj) {
        group = obj[i];
        for (var j = 0, l = aggregate.length; j < l; j++) {
          column = aggregate[j];
          if (!column.virtual) {
            group.aggregate[column.name] = this.aggregation(column.aggregate, group.aggregate[column.name]);
          }
        }
        for (var j = 0, l = aggregate.length; j < l; j++) {
          column = aggregate[j];
          if (column.virtual) {
            group.aggregate[column.name] = column.fn(group.aggregate);
          }
        }
        arr.push(group);
      }
      return arr;
    }

  }

})(window, document);
