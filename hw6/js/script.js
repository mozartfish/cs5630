/**
 * This script is the driver script for the visualization
 */

/**
 * Load in the information for the swarm chart
 */
d3.json("/data/words.json").then(data => {
  console.log("The data", data);

  // Create new Chart Object
  let chart = new Chart(data);
  chart.createChart();
});
