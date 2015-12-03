/**
 *
 *
 */
(function(window, document, Gr, undefined) {
  'use strict';

  var baseConfig = {
    /** @type {String} table css classes */
    cssClass: 'gr-table gr-shadow-2dp',

    /** @type {Number} collapse level */
    collapseLevel: 1,

    /** @type {Object} tree left padding */
    tree: {
      padding: 24,
      unit: 'px'
    },

    /** @type {Object} gran total: top or bottom */
    total: {
      alias: 'Total',
      position: 'bottom'
    },

    /** @type {Array} [description] */
    columns: [],

    /** @type {Array} [description] */
    groupBy: []
  };

  /**
   * Hierarchy Table
   * @constructor
   * @param  string element id name for container DOM element
   * @param  json config
   */
  var GTable = function(element, config) {
    this.container = element;

    var defaultConfig = Gr.clone(baseConfig);
    Gr.extend(defaultConfig, config);

    this.config = defaultConfig;
  };
  window.GRTable = GTable;

  GTable.prototype.CssClasses = {
    HIDDEN: 'gr-hidden',
    TOTAL: 'gr-total',
    CONTROL: 'gr-control',
    ARROW_BOTTOM: 'gr-arrow-bottom',
    ARROW_RIGHT: 'gr-arrow-right'
  };

  GTable.prototype.render = function(data) {
    var aggregateColumns = this.config.columns.filter(function(o, i) {
      return o.aggregate || o.virtual || false;
    });

    //this.config.groupBy.unshift('__ALL__');
    var r = Gr.Data.grouping(aggregateColumns, data, this.config.groupBy, 0);
    console.log(r);
  };

})(window, document, window.Gr = window.Gr || {});
