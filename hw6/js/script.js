/**
 * This script is the driver script for the visualization
 */
d3.json("/data/words.json").then(data => {
  console.log("The data", data);

  // container for layout
  let container = d3
    .select("body")
    .append("div")
    .attr("id", "container");

  // tool bar div
  let toolBar = container.append("div").classed("toolbar", true);
  renderToggle(toolBar, "Group by Topic");

  // info panel
  infoPanel();

  // set up divs for the main views
  let chartDiv = container.append("div").attr("id", "bubble-chart");
  let tableDiv = container.append("div").attr("id", "table");

  // set up the table layout
  generateTableLayout(tableDiv, "n-Gram Table");
  // tooltip div
  container
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);
  
  // set up the table
  let table = new Table(data);
  table.createTable();
  table.updateTable();
});
