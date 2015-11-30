(function(window, document, undefined) {
  'use strict';

  QUnit.module('GData');
  QUnit.test('GData groupig', function(assert) {
    var gd = Object.create(GData.prototype);
    assert.ok(window.GData, 'GData is ok');

    var obj = {
      text: 'testing'
    };
    var arr = ['testing'];
    assert.deepEqual(gd.toArray(obj), arr, "GData.toArray {text:'testing'} to ['testing']");

    var data = [1, 2, 3, 5, 8, 13, 21, 34];
    assert.deepEqual(gd.aggregate('sum', data), 87, "GData.aggregate 'sum' [1, 2, 3, 5, 8, 13, 21, 34] = 87 ");
    assert.deepEqual(gd.aggregate('avg', data), 10.875, "GData.aggregate 'avg' [1, 2, 3, 5, 8, 13, 21, 34] = 10.875");
    assert.deepEqual(gd.aggregate('max', data), 34, "GData.aggregate 'max' [1, 2, 3, 5, 8, 13, 21, 34] = 34");
    assert.deepEqual(gd.aggregate('min', data), 1, "GData.aggregate 'min' [1, 2, 3, 5, 8, 13, 21, 34] = 1");

    var config = {
      tableCssClass: 'gtable shadow-2dp',
      granTotal: true,
      columns: [{
        name: 'txt_id2',
        alias: 'txt_id2',
        cssClass: 'no-numeric',
        grouping: true
      }, {
        name: 'column1',
        alias: 'column1',
        aggregate: 'sum'
      }, {
        name: 'column2',
        alias: 'column2',
        aggregate: 'sum'
      }, {
        name: 'column3',
        alias: 'column3',
        aggregate: 'sum'
      }, {
        name: 'column4',
        alias: 'column4',
        aggregate: 'sum'
      }],
      grouping: ['txt_id0', 'txt_id1']
    };

    var json = [{
      "column1": 470.7,
      "column2": 381.61,
      "column3": 637.7,
      "column4": 284.81,
      "id0": 0,
      "txt_id0": "Minim minim",
      "id1": 0,
      "txt_id1": "Occaecat sunt officia aliqua.",
      "id2": 0,
      "txt_id2": "Irure ullamco officia cillum"
    }, {
      "column1": -827.99,
      "column2": 521.67,
      "column3": 42.9,
      "column4": -692.31,
      "id0": 0,
      "txt_id0": "Minim minim",
      "id1": 0,
      "txt_id1": "Occaecat sunt officia aliqua.",
      "id2": 1,
      "txt_id2": "Reprehenderit id"
    }, {
      "column1": -535.99,
      "column2": 41.06,
      "column3": 187.4,
      "column4": 297.05,
      "id0": 0,
      "txt_id0": "Minim minim",
      "id1": 0,
      "txt_id1": "Occaecat sunt officia aliqua.",
      "id2": 2,
      "txt_id2": "Commodo exercitation incididunt laborum."
    }, {
      "column1": 498.04,
      "column2": 93.65,
      "column3": 230.74,
      "column4": 394.24,
      "id0": 0,
      "txt_id0": "Minim minim",
      "id1": 1,
      "txt_id1": "Ea nulla id reprehenderit",
      "id2": 3,
      "txt_id2": "Proident, velit Ut occaecat"
    }, {
      "column1": -474.61,
      "column2": 189.66,
      "column3": 547.45,
      "column4": 384.37,
      "id0": 0,
      "txt_id0": "Minim minim",
      "id1": 1,
      "txt_id1": "Ea nulla id reprehenderit",
      "id2": 4,
      "txt_id2": "Sed quis irure deserunt"
    }, {
      "column1": -108.1,
      "column2": 942.4,
      "column3": -600.06,
      "column4": 751.05,
      "id0": 0,
      "txt_id0": "Minim minim",
      "id1": 2,
      "txt_id1": "Minim sed",
      "id2": 5,
      "txt_id2": "Sint aute incididunt"
    }, {
      "column1": -831.44,
      "column2": 539.62,
      "column3": 349.2,
      "column4": 8.28,
      "id0": 0,
      "txt_id0": "Minim minim",
      "id1": 2,
      "txt_id1": "Minim sed",
      "id2": 6,
      "txt_id2": "Consequat. quis"
    }, {
      "column1": 458.47,
      "column2": -735.09,
      "column3": -426.68,
      "column4": 502.38,
      "id0": 0,
      "txt_id0": "Minim minim",
      "id1": 2,
      "txt_id1": "Minim sed",
      "id2": 7,
      "txt_id2": "Reprehenderit reprehenderit nostrud dolor"
    }, {
      "column1": 363.62,
      "column2": -683.51,
      "column3": -310.82,
      "column4": 588.97,
      "id0": 1,
      "txt_id0": "Do in",
      "id1": 3,
      "txt_id1": "Dolore ad elit, deserunt",
      "id2": 8,
      "txt_id2": "Ea magna pariatur. velit"
    }, {
      "column1": 588.04,
      "column2": 532.43,
      "column3": 92.34,
      "column4": 641.03,
      "id0": 1,
      "txt_id0": "Do in",
      "id1": 3,
      "txt_id1": "Dolore ad elit, deserunt",
      "id2": 9,
      "txt_id2": "Dolore aliquip non"
    }, {
      "column1": 421.16,
      "column2": -2.79,
      "column3": 852.29,
      "column4": 306.14,
      "id0": 1,
      "txt_id0": "Do in",
      "id1": 4,
      "txt_id1": "Nostrud amet,",
      "id2": 10,
      "txt_id2": "In elit, incididunt"
    }, {
      "column1": 767.08,
      "column2": 769.13,
      "column3": 558.41,
      "column4": 645.7,
      "id0": 1,
      "txt_id0": "Do in",
      "id1": 4,
      "txt_id1": "Nostrud amet,",
      "id2": 11,
      "txt_id2": "Et laborum. eu"
    }, {
      "column1": 21.68,
      "column2": 719.16,
      "column3": 236.82,
      "column4": -668.71,
      "id0": 1,
      "txt_id0": "Do in",
      "id1": 4,
      "txt_id1": "Nostrud amet,",
      "id2": 12,
      "txt_id2": "Nisi exercitation et ad"
    }, {
      "column1": 631.88,
      "column2": 194.68,
      "column3": 633.46,
      "column4": 958.68,
      "id0": 1,
      "txt_id0": "Do in",
      "id1": 5,
      "txt_id1": "Excepteur culpa aliqua. officia",
      "id2": 13,
      "txt_id2": "Ut ipsum consequat. sint"
    }, {
      "column1": -661.95,
      "column2": 834.04,
      "column3": 459.07,
      "column4": -70.92,
      "id0": 1,
      "txt_id0": "Do in",
      "id1": 5,
      "txt_id1": "Excepteur culpa aliqua. officia",
      "id2": 14,
      "txt_id2": "Non ut"
    }, {
      "column1": 553.23,
      "column2": 920.99,
      "column3": 387.93,
      "column4": 263.17,
      "id0": 1,
      "txt_id0": "Do in",
      "id1": 5,
      "txt_id1": "Excepteur culpa aliqua. officia",
      "id2": 15,
      "txt_id2": "In exercitation magna consectetur"
    }];
    var result = [{
      "grouping": [
        "txt_id0",
        "txt_id1"
      ],
      "key": undefined,
      "values": [{
        "column1": 470.7,
        "column2": 381.61,
        "column3": 637.7,
        "column4": 284.81,
        "id0": 0,
        "id1": 0,
        "id2": 0,
        "txt_id0": "Minim minim",
        "txt_id1": "Occaecat sunt officia aliqua.",
        "txt_id2": "Irure ullamco officia cillum"
      }, {
        "column1": -827.99,
        "column2": 521.67,
        "column3": 42.9,
        "column4": -692.31,
        "id0": 0,
        "id1": 0,
        "id2": 1,
        "txt_id0": "Minim minim",
        "txt_id1": "Occaecat sunt officia aliqua.",
        "txt_id2": "Reprehenderit id"
      }, {
        "column1": -535.99,
        "column2": 41.06,
        "column3": 187.4,
        "column4": 297.05,
        "id0": 0,
        "id1": 0,
        "id2": 2,
        "txt_id0": "Minim minim",
        "txt_id1": "Occaecat sunt officia aliqua.",
        "txt_id2": "Commodo exercitation incididunt laborum."
      }, {
        "column1": 498.04,
        "column2": 93.65,
        "column3": 230.74,
        "column4": 394.24,
        "id0": 0,
        "id1": 1,
        "id2": 3,
        "txt_id0": "Minim minim",
        "txt_id1": "Ea nulla id reprehenderit",
        "txt_id2": "Proident, velit Ut occaecat"
      }, {
        "column1": -474.61,
        "column2": 189.66,
        "column3": 547.45,
        "column4": 384.37,
        "id0": 0,
        "id1": 1,
        "id2": 4,
        "txt_id0": "Minim minim",
        "txt_id1": "Ea nulla id reprehenderit",
        "txt_id2": "Sed quis irure deserunt"
      }, {
        "column1": -108.1,
        "column2": 942.4,
        "column3": -600.06,
        "column4": 751.05,
        "id0": 0,
        "id1": 2,
        "id2": 5,
        "txt_id0": "Minim minim",
        "txt_id1": "Minim sed",
        "txt_id2": "Sint aute incididunt"
      }, {
        "column1": -831.44,
        "column2": 539.62,
        "column3": 349.2,
        "column4": 8.28,
        "id0": 0,
        "id1": 2,
        "id2": 6,
        "txt_id0": "Minim minim",
        "txt_id1": "Minim sed",
        "txt_id2": "Consequat. quis"
      }, {
        "column1": 458.47,
        "column2": -735.09,
        "column3": -426.68,
        "column4": 502.38,
        "id0": 0,
        "id1": 2,
        "id2": 7,
        "txt_id0": "Minim minim",
        "txt_id1": "Minim sed",
        "txt_id2": "Reprehenderit reprehenderit nostrud dolor"
      }, {
        "column1": 363.62,
        "column2": -683.51,
        "column3": -310.82,
        "column4": 588.97,
        "id0": 1,
        "id1": 3,
        "id2": 8,
        "txt_id0": "Do in",
        "txt_id1": "Dolore ad elit, deserunt",
        "txt_id2": "Ea magna pariatur. velit"
      }, {
        "column1": 588.04,
        "column2": 532.43,
        "column3": 92.34,
        "column4": 641.03,
        "id0": 1,
        "id1": 3,
        "id2": 9,
        "txt_id0": "Do in",
        "txt_id1": "Dolore ad elit, deserunt",
        "txt_id2": "Dolore aliquip non"
      }, {
        "column1": 421.16,
        "column2": -2.79,
        "column3": 852.29,
        "column4": 306.14,
        "id0": 1,
        "id1": 4,
        "id2": 10,
        "txt_id0": "Do in",
        "txt_id1": "Nostrud amet,",
        "txt_id2": "In elit, incididunt"
      }, {
        "column1": 767.08,
        "column2": 769.13,
        "column3": 558.41,
        "column4": 645.7,
        "id0": 1,
        "id1": 4,
        "id2": 11,
        "txt_id0": "Do in",
        "txt_id1": "Nostrud amet,",
        "txt_id2": "Et laborum. eu"
      }, {
        "column1": 21.68,
        "column2": 719.16,
        "column3": 236.82,
        "column4": -668.71,
        "id0": 1,
        "id1": 4,
        "id2": 12,
        "txt_id0": "Do in",
        "txt_id1": "Nostrud amet,",
        "txt_id2": "Nisi exercitation et ad"
      }, {
        "column1": 631.88,
        "column2": 194.68,
        "column3": 633.46,
        "column4": 958.68,
        "id0": 1,
        "id1": 5,
        "id2": 13,
        "txt_id0": "Do in",
        "txt_id1": "Excepteur culpa aliqua. officia",
        "txt_id2": "Ut ipsum consequat. sint"
      }, {
        "column1": -661.95,
        "column2": 834.04,
        "column3": 459.07,
        "column4": -70.92,
        "id0": 1,
        "id1": 5,
        "id2": 14,
        "txt_id0": "Do in",
        "txt_id1": "Excepteur culpa aliqua. officia",
        "txt_id2": "Non ut"
      }, {
        "column1": 553.23,
        "column2": 920.99,
        "column3": 387.93,
        "column4": 263.17,
        "id0": 1,
        "id1": 5,
        "id2": 15,
        "txt_id0": "Do in",
        "txt_id1": "Excepteur culpa aliqua. officia",
        "txt_id2": "In exercitation magna consectetur"
      }]
    }];
    assert.deepEqual(gd.groupBy(json, config.grouping), result, 'GData.groupBy "' + config.grouping + '"');


    //assert.deepEqual(gd.groupAndAggregateBy(data, 'id1', aggregate), group, 'GData.groupBy "id1"');
  });

})(window, document);
