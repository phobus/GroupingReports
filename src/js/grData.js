(function(window, document, gr, undefined) {
  'use strict';

  var DataGroup = function(groupBy, key, level) {
    this._data = {
      groupBy: groupBy,
      key: key,
      level: level,
      values: [],
      aggregate: {}
    };
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
        this._data.aggregate[column.name] = [data[column.name]];
      }
    }
    //push values
    this._data.values.push(data);
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
        this._data.aggregate[column.name].push(data[column.name]);
      }
    }
    //push values
    this._data.values.push(data);
  };

  DataGroup.prototype.reduce = function(aggregateColumns, virtualColumns) {
    var column;
    for (var i = 0, l = aggregateColumns.length; i < l; i++) {
      column = aggregateColumns[i];
      this._data.aggregate[column.name] = gr.Data.aggregation(column.aggregate, this._data.aggregate[column.name]);
    }

    for (var j = 0, m = virtualColumns.length; j < m; j++) {
      column = virtualColumns[j];
      this._data.aggregate[column.name] = column.fn(this._data.aggregate);
    }
    return this._data;
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

      var grouping = total ? ['__ALL__'].concat(groupBy) : groupBy;

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
          r[j]._data.values = this.groupingLoop(columns, aggregateColumns, virtualColumns, groupBy, r[j]._data.values, level + 1);
        }
        r[j] = r[j].reduce(aggregateColumns, virtualColumns);
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
