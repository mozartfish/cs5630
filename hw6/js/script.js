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

  // tooltip div
  container
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);
});
