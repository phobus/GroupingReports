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
      this._aggregate = this.columns.filter(function(o, i) {
        if (o.aggregate) {
          return true;
        }
        return false;
      });

      var gd = Object.create(GData.prototype);
      data = gd.grouping(data, this.grouping, this._aggregate);

      var table = this.renderTable(data);

      this.container.appendChild(table);
    },
    renderTable: function(data) {
      var table = document.createElement('table'),
        thead = document.createElement('thead'),
        tbody = document.createElement('tbody');

      table.className = this.tableCssClass;

      //create table header
      var cell, row = document.createElement('tr'),
        l = this.columns.length,
        column;
      var ctrl = document.createElement('td');
      row.appendChild(ctrl);
      ctrl.style.width = "30px";
      for (var i = 0; i < l; i++) {
        column = this.columns[i];
        cell = document.createElement('th');
        cell.innerHTML = column.alias;
        if (column.cssClass) {
          cell.classList.add(column.cssClass);
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
      var cell, row = document.createElement('tr'),
        column, l = this.columns.length;
      var ctrl = document.createElement('td');
      row.appendChild(ctrl);
      if (node.values) {
        row.classList.add('total');
        // grouping rows
        for (var i = 0; i < l; i++) {
          column = this.columns[i];
          cell = document.createElement('td');
          if (column.aggregate && node.aggregate) {
            cell.innerHTML = node.aggregate[column.name];
          } else {
            cell.innerHTML = node.key;
          }
          if (column.cssClass) {
            cell.classList.add(column.cssClass);
          }
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
        // Data rows
        for (var i = 0; i < l; i++) {
          column = this.columns[i];
          cell = document.createElement('td');
          cell.innerHTML = node[column.name];
          if (column.cssClass) {
            cell.classList.add(column.cssClass);
          }
          row.appendChild(cell);
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
