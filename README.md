# GroupingReports

Group json data by field/s name.
Creates a data table report with grouped rows and total line
Virtual columns

## optimizations:

* table-layout: fixed; ( Css )

> Table and column widths are set by the widths of table and col elements or by the width of the first row of cells. Cells in subsequent rows do not affect column widths.

> Under the "fixed" layout method, **the entire table can be rendered once the first table row has been downloaded and analyzed. This can speed up rendering time over the "automatic" layout method,** but subsequent cell content may not fit in the column widths provided. Any cell that has content that overflows uses the overflow property to determine whether to clip the overflow content.

> https://developer.mozilla.org/es/docs/Web/CSS/table-layout

* cloneNode for creating rows. Rows are cached for cloning.

TO DO

* requestAnimationFrame


https://github.com/phobus/GroupingReports.git
