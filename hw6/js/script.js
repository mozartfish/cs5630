/**
 * Set up the SVG canvas for the swarm chart
 */
let chartView = d3.select("#chartView");
let chartSVG = chartView.append("svg");
chartSVG.attr("width", 900)
             .attr("height", 800)
             .attr("id", "chartSVG");


/**
 * Loads in the information for the visualization from words.json
 */
d3.json("/data/words.json").then(data => {
  //console.log(data);
  let swarmChart = new SWARMCHART(data);
  swarmChart.createChart();
});




