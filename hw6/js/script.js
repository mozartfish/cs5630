/**
 * This script is the driver script for the visualization
 */

/**
 * Load the data call the various scripts to generate the visualization
 */
d3.json("/data/words.json").then(data => {
  // console.log("The data", data);
  // Create new Chart Object
  let chart = new Chart(data);
  chart.createChart();
  chart.drawChart();
  // Create new Table Object
  let table = new Table(data);
  table.createTable();
  table.updateTable();
});
