(function(window, document, undefined) {
  'use strict';

  var GTable = function(element, config) {
    this.container = document.getElementById(element);

    config = config || {};

    this.granTotal = config.granTotal;
    this.tableCssClass = config.tableCssClass || 'gtable';

    this.columns = config.columns || {};

    this.grouping = config.grouping || [];
  }
  window['GTable'] = GTable;

  GTable.prototype = {
    render: function(data, fn) {
      var gd = Object.create(GData.prototype);
      data = gd.grouping(data, this.grouping);

      var table = this.renderTable(data);

      this.container.appendChild(table);
    },
    renderTable: function(data) {
      var table = document.createElement('table'),
        thead = document.createElement('thead'),
        tbody = document.createElement('tbody');

      table.className = this.tableCssClass || 'gtable';

      //create table header
      var cell, row = document.createElement('tr'),
        l = this.columns.length,
        column;
      for (var i = 0; i < l; i++) {
        column = this.columns[i];
        cell = document.createElement('th');
        cell.innerHTML = column.alias;
        if (column.cssClass) {
          cell.className = column.cssClass;
        }
        row.appendChild(cell);
      }
      thead.appendChild(row);
      table.appendChild(thead);

      //create table body
      this.renderDataRow(tbody, data);
      table.appendChild(tbody);

      return table;
    },
    renderDataRow: function(tbody, node) {
      this._aggregate = this.columns.filter(function(o, i) {
          if(o.aggregate){
            return true;
          }
          return false;
      });

      if (node.values) {
        // grouping rows
        var cell, row = document.createElement('tr'),
          l = this._aggregate.length;

        // grouping key cell
        cell = document.createElement('td');
        cell.innerHTML = node.key;
        cell.className = 'no-numeric';
        row.appendChild(cell);

        for (var i = 0; i < l; i++) {
          cell = document.createElement('td');
          cell.innerHTML = node.aggregate ? node.aggregate[this._aggregate[i]] : '';
          row.appendChild(cell);
        }
        // grouping rows event
        row.addEventListener('click', this.dataRowClickHandler.bind(this));
        row.dataset.grouping = node.grouping;
        tbody.appendChild(row);

        // grouping values
        l = node.values.length;
        for (var k = 0; k < l; k++) {
          this.renderDataRow(tbody, node.values[k]);
        }
      } else {
        var cell, row = document.createElement('tr'),
          l = this.columns.length;
        for (var i = 0; i < l; i++) {
          cell = document.createElement('td');
          cell.innerHTML = node[this.columns[i].name];
          row.appendChild(cell);
          if (i == 0) {
            cell.className = 'no-numeric';
          }
        }
        tbody.appendChild(row);
      }
    },
    dataRowClickHandler: function(event) {
      var row = event.target.parentNode.nextSibling;
      var data = event.target.parentNode.dataset;
      var collapse = !row.classList.contains('hidden');
      while (row) {
        if (row.dataset.grouping == data.grouping) {
          break;
        }
        if (collapse) {
          row.classList.add('hidden');
        } else {
          row.classList.remove('hidden');
        }

        row = row.nextSibling;
      }
    }
  }

})(window, document);
