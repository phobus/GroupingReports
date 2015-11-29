(function(window, document, undefined) {
  'use strict';

  var dataGenerator = {
    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    randomNumber: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomAmount: function() {
      var n = Math.floor((Math.random() * (100 - 100000 + 1)) + 100) / 100;
      return this.randomNumber(0, 99) < 75 ? n : n * -1;
    },

    randomText: function() {
      this.arrText = this.arrText || this.loremIpsum.split(' ');
      var output = [],
        s = this.randomNumber(2, 4),
        l = this.arrText.length - 1;
      for (var i = 0; i < s; i++) {
        var r = this.randomNumber(0, l);
        output.push(this.arrText[r]);
      }
      output[0] = output[0][0].toUpperCase() + output[0].slice(1);
      return output.join(' ');
    },
    loremIpsum: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    generate: function(args, fn) {
      args = args || [
        [6, 9],
        [10, 18],
        [1, 10]
      ];
      data = [];
      this.createNode([], 0, args, data, fn);
      return data;
    },
    createNode: function(ids, level, args, data, fn) {
      if (level < args.length) {
        var l = this.randomNumber(args[level][0], args[level][1]);
        for (var i = 0; i < l; i++) {
          if (ids[level]) {
            ids[level][0]++;
            ids[level][1] = this.randomText();
          } else {
            ids[level] = [0, this.randomText()];
          }

          this.createNode(ids, level + 1, args, data, fn);
        }
      } else {
        var obj = fn(),
          l = ids.length;
        for (var i = 0; i < l; i++) {
          obj['id' + i] = ids[i][0];
          obj['txt_id' + i] = ids[i][1];
        }
        data.push(obj);
      }
    }
  }

  window['dataGenerator'] = dataGenerator;

})(window, document);
