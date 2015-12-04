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

TO DO

* requestAnimationFrame
