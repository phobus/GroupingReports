# GroupingReports

http://phobus.github.io/GroupingReports/

Group json data by field/s name.
Creates a data table report with grouped rows and total line
Virtual columns

## optimizations:

* table-layout: fixed;
> the entire table can be rendered once the first table row has been downloaded and analyzed. This can speed up rendering time over the "automatic" layout method
> https://developer.mozilla.org/es/docs/Web/CSS/table-layout

* cloneNode for creating rows. Less repetitive procesing.
* requestAnimationFrame
* collapseLevel hide details rows

* requestAnimationFrame

## example config:
```javascript
var config = {
  columns: [{
    name: 'txt_id2',
    alias: 'txt_id2',
    cssClass: 'gr-no-numeric',
    grouping: true
  }, {
    name: 'column1',
    alias: 'column1',
    aggregate: 'sum',
    width: '12%'
  }, {
    name: 'column2',
    alias: 'column2',
    aggregate: 'sum',
    width: '12%'
  }, {
    virtual: true,
    name: 'virtual1',
    alias: 'virtual1',
    fn: function(columns) {
      return (columns.column1 / columns.column2) * 100;
    },
    width: '12%'
  }],
  groupBy: ['txt_id0', 'txt_id1']
};
<<<<<<< HEAD
```
=======
>>>>>>> raf
