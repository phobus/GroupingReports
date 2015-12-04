(function(window, document, gr, undefined) {
  'use strict';

  var DataGroup = function(groupBy, key, level) {
    this.groupBy = groupBy || 'Gran Total';
    this.key = key || '__ALL__';
    this.level = level || 0;
    this.count = 0;

    this.values = [];
    this.aggregate = {};
  };

  DataGroup.prototype.init = function(columns, data) {
    //init aggregate values
    for (var i = 0, l = columns.length, column; i < l; i++) {
      column = columns[i];
      if (column.virtual) {
        // store virtual column in data
        data[column.name] = column.fn(data);
      } else {
        // store data in aggregate
        this.aggregate[column.name] = [data[column.name]];
      }
    }
    //push values
    this.values.push(data);
  };

  DataGroup.prototype.push = function(columns, data) {
    //push aggregate values
    for (var i = 0, l = columns.length, column; i < l; i++) {
      column = columns[i];
      if (column.virtual) {
        // store virtual column in data
        data[column.name] = column.fn(data);
      } else {
        // store data in aggregate
        this.aggregate[column.name].push(data[column.name]);
      }
    }
    //push values
    this.values.push(data);
  };

  DataGroup.prototype.getValue = function(column, data) {
    var value;
    if (column.virtual) {
      value = column.fn(data);
      // store virtual column in data
      data[column.name] = value;
    } else {
      value = data[column.name];
    }
    return value;
  };

  DataGroup.prototype.reduce = function(aggregateColumns, virtualColumns) {
    var column;
    for (var i = 0, l = aggregateColumns.length; i < l; i++) {
      column = aggregateColumns[i];
      this.aggregate[column.name] = gr.Data.aggregation(column.aggregate, this.aggregate[column.name]);
    }

    for (var j = 0, m = virtualColumns.length; j < m; j++) {
      column = virtualColumns[j];
      this.aggregate[column.name] = column.fn(this.aggregate);
    }
  };

  gr.Data = {
    grouping: function(columns, groupBy, data, total) {
      var avColumns = [],
        aggregateColumns = [],
        virtualColumns = [],
        column;
      for (var i = 0, l = columns.length; i < l; i++) {
        column = columns[i];
        if (column.aggregate || column.virtual) {
          avColumns.push(column);
        }
        if (column.aggregate) {
          aggregateColumns.push(column);
        }
        if (column.virtual) {
          virtualColumns.push(column);
        }
      }

      var grouping;
      if (total) {
        grouping = ['__ALL__'].concat(groupBy);
      } else {
        grouping = groupBy;
      }

      return this.groupingLoop(avColumns, aggregateColumns, virtualColumns, grouping, data, 0);
    },

    groupingLoop: function(columns, aggregateColumns, virtualColumns, groupBy, data, level) {
      level = level || 0;
      var r, dataRow, group, groups = {},
        groupByColumn = groupBy[level];

      //loop data
      for (var i = 0, l = data.length; i < l; i++) {
        dataRow = data[i];
        //unique group value
        group = JSON.stringify(dataRow[groupByColumn]);
        if (group in groups) {
          // add vaues to grouping
          groups[group].push(columns, dataRow);
        } else {
          // new grouing
          groups[group] = new DataGroup(groupByColumn, dataRow[groupByColumn], level);
          groups[group].init(columns, dataRow);
        }
      }

      r = this.toArray(groups);
      for (var j = 0, m = r.length; j < m; j++) {
        if (level < groupBy.length - 1) {
          //Grouping childs
          r[j].values = this.groupingLoop(columns, aggregateColumns, virtualColumns, groupBy, r[j].values, level + 1);
          r[j].count = r[j].values.length;
        }
        r[j].reduce(aggregateColumns, virtualColumns);
      }
      return r;
    },

    toArray: function(obj) {
      var arr = [];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          arr.push(obj[key]);
        }
      }
      return arr;
    },

    afn: {
      sum: function(x) {
        var sum = 0;
        for (var i = 0, l = x.length; i < l; i++) {
          sum += x[i];
        }
        return sum;
      },
      avg: function(x) {
        var sum = 0;
        for (var i = 0, l = x.length; i < l; i++) {
          sum += x[i];
        }
        return sum / x.length;
      },
      max: function(x) {
        return Math.max.apply(null, x);
      },
      min: function(x) {
        return Math.min.apply(null, x);
      }
    },

    aggregation: function(type, data) {
      return (this.afn[type] || this.afn['undefined'])(data, type);
    }
  };

})(window, document, window.gr = window.gr || {});
