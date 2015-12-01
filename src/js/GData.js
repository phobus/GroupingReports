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

    createGroupingRow: function(aggregate) {
      var column, row = {};
      for (var i = 0, l = aggregate.length; i < l; i++) {
        column = aggregate[i];
        row[column.name] = [];
      }
      return row;
    },

    createTotal: function(data, aggregate) {
      var value, column, total = this.createGroupingRow(aggregate);

      for (var i = 0, l = data.length; i < l; i++) {
        for (var j = 0, s = aggregate.length; j < s; j++) {
          column = aggregate[j];
          if (column.virtual) {
            value = column.fn(data[i]);
          } else {
            value = data[i][column.name];
          }
          total[column.name].push(value);
        }
      }
      return total;
    },

    grouping: function(data, groupBy, aggregate) {
      var root = {
        //aggregate: {},
        grouping: '__** {{ALL}} **__',
        key: 'Total',
        values: this.recursiveGrouping(data, groupBy, aggregate, 0)
      };
      root.aggregate = this.createTotal(data, aggregate);
      return this.reduce([root], aggregate)[0];
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
          groups[group].values.push(data[i]);
        } else {
          groups[group] = {
            grouping: columnGroupBy,
            key: data[i][columnGroupBy],
            values: [data[i]],
            aggregate: this.createGroupingRow(aggregate)
          };
        }

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
      }
      return this.reduce(this.toArray(groups), aggregate);
    },

    reduce: function(data, aggregate) {
      var group, column;
      for (var i = 0, l = data.length; i < l; i++) {
        group = data[i];
        for (var j = 0, s = aggregate.length; j < s; j++) {
          column = aggregate[j];
          if (!column.virtual) {
            group.aggregate[column.name] = this.aggregation(column.aggregate, group.aggregate[column.name]);
          }
        }
        for (var j = 0, s = aggregate.length; j < s; j++) {
          column = aggregate[j];
          if (column.virtual) {
            group.aggregate[column.name] = column.fn(group.aggregate);
          }
        }
      }
      return data;
    },

    toArray: function(obj) {
      var arr = [];
      for (var i in obj) {
        arr.push(obj[i]);
      }
      return arr;
    }

  }

})(window, document);
