(function(window, document, Gr, undefined) {
  'use strict';

  var GroupData = function(groupBy, key, level) {
    this.groupBy = groupBy || 'Gran Total';
    this.key = key || '__ALL__';
    this.level = level || 0;
    this.count = 0;

    this.values = [];
    this.aggregate = {};
  };

  GroupData.prototype.init = function(columns, data) {
    //init aggregate values
    for (var i = 0, l = columns.length, value; i < l; i++) {
      value = this.getValue(columns[i], data);
      this.aggregate[columns[i].name] = [value];
    }
    //push values
    this.values.push(data);
  };

  GroupData.prototype.push = function(columns, data) {
    //push aggregate values
    for (var i = 0, l = columns.length, value; i < l; i++) {
      value = this.getValue(columns[i], data);
      this.aggregate[columns[i].name].push(value);
    }
    //push values
    this.values.push(data);
  };

  //TO DO: column.virtual value can be cached
  GroupData.prototype.getValue = function(column, data) {
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

  GroupData.prototype.reduce = function(columns) {
    for (var i = 0, l = columns.length, column; i < l; i++) {
      column = columns[i];
      if (!column.virtual) {
        this.aggregate[columns[i].name] = Gr.Data.aggregation(column.aggregate, this.aggregate[column.name]);
      }
    }

    for (var i = 0, l = columns.length, column; i < l; i++) {
      column = columns[i];
      if (column.virtual) {
        this.aggregate[columns[i].name] = column.fn(this.aggregate);
      }
    }
  };

  Gr.Data = {
    grouping: function(columns, data, groupBy, level) {
      //level = level || 0;
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
          groups[group] = new GroupData(groupByColumn, dataRow[groupByColumn], level);
          groups[group].init(columns, dataRow);
        }
      }

      r = this.toArray(groups);
      for (var j = 0, m = r.length; j < m; j++) {
        if (level < groupBy.length - 1) {
          r[j].values = this.grouping(columns, r[j].values, groupBy, level + 1);
          r[j].count = r[j].values.length;
        }
        r[j].reduce(columns);
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
  }
})(window, document, window.Gr = window.Gr || {});
