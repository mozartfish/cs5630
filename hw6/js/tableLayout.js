function generateTableLayout(div, tableTitle) {
  // Title for the table
  let title = div
    .append("h2")
    .text(tableTitle)
    .attr("id", "tableTitle");

  // the table
  let table = div.append("table").attr("id", "politicalTable");
  let thead = table.append("thead").attr("id", "thead");
  let tableRows = d3.select("#thead");
  tableRows.append("tr").attr("id", "labels");
  let phrase = d3
    .select("#labels")
    .append("th")
    .text("Phrase");
  let frequency = d3
    .select("#labels")
    .append("td")
    .text("Frequency")
    .attr("id", "headerName");
  frequency.append("span").classed("glyphicon glyphicon-sort", true);
  frequency.append("br");
  let percentages = d3
    .select("#labels")
    .append("td")
    .text("Percentages")
    .attr("id", "headerName");
  percentages.append("span").classed("glyphicon glyphicon-sort", true);
  percentages.append("br");
  let total = d3
    .select("#labels")
    .append("td")
    .text("Total")
    .attr("id", "headerName");
  total.append("span").classed("glyphicon glyphicon-sort", true);
  total.append("br");
  let tableHeaders = tableRows.append("tr").attr("id", "headers");
  let beginEmptyTD = tableHeaders.append("td");
  let frequencyHeader = tableHeaders.append("td").attr("id", "frequencyHeader");
  let percentagesHeader = tableHeaders
    .append("td")
    .attr("id", "percentagesHeader");
  let endEmptyTD = tableRows.append("td");

  let tbody = table.append("tbody").attr("id", "tableBody");
}
