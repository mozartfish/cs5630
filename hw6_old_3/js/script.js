/**
 * Define the margins for the chart visualization
 */
const chartMargin = { top: 20, right: 30, bottom: 40, left: 30 },
  chartWidth = 960 - chartMargin.left - chartMargin.right,
  chartHeight = 500 - chartMargin.top - chartMargin.bottom;

/**
 * Set up for the chart visualization
 */
let chartView = d3.select("#chartView");
let chartSVG = chartView.append("svg");
chartSVG.attr("width", chartWidth + chartMargin.left + chartMargin.right)
        .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
        .attr("id", "chartSVG");

/**
 * Load data for the visualization
 */
d3.json("/data/words.json").then(data => {
    //console.log(data)
    let swarmChart = new CHART(data);
    swarmChart.createChart();
})
