/**
 * This script is the driver script for the visualization
 */

/**
 * Load the data call the various scripts to generate the visualization
 */
d3.json("/data/words.json").then(data => {
  console.log("The data", data);
  // Outer most div that contains all the sub divs for the different views
  let containerDiv = d3
    .select("body")
    .append("div")
    .attr("id", "container");

  containerDiv
    .append("div")
    .append("div")
    .classed("menu", true);

  //  // Create new Table Object
  //  let table = new Table(data);
  //  table.createTable();
  //  table.updateTable();
  // // Create new Chart Object
  // let chart = new Chart(data, table);
  // chart.createChart();
  // chart.drawChart();
});
