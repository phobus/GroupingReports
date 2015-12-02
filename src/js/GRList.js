(function(window, document, undefined) {
  'use strict';

  var GRList = function(config) {};
  window['GRList'] = GRList;

  GRList.prototype = {
    render: function(data, fn) {
      //var gd = Object.create(GData.prototype);
      //data = gd.groupBy(data, fn);
      var ul = document.createElement('ul');
    }
  };
  

  var crono = {
    data: {},
    start: function(name) {
      this.data[name] = {
        start: new Date().getTime(),
        stop: undefined,
        time: function() {
          return this.stop - this.start;
        }
      };
    },
    stop: function(name, length) {
      this.data[name].stop = new Date().getTime();
      if (name == 'render') {
        console.log('Finish ' + name + ' ' + length + ' rows in ' + this.data[name].time());
        console.log(length + '/' + this.data[name].time() + ' = ' + (length / this.data[name].time()));
      } else {
        console.log('Finish ' + name + ' in ' + this.data[name].time());
      }
    }
  };
  window['crono'] = crono;
})(window, document);
