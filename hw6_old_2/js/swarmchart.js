/**
 * Some constants for properties that will be used a lot
 */
const position = "position";
const sourceX = "sourceX";
const sourceY = "sourceY";

/**
 * The margins for the visualization
 */
const swarmChartMargin = { top: 20, right: 30, bottom: 40, left: 30 },
  swarmChartWidth = 960 - swarmChartMargin.left - swarmChartMargin.right;
swarmChartHeight = 500 - swarmChartMargin.top - swarmChartMargin.bottom;

class SWARMCHART {
  /**
   * Create a swarmChart object
   */
  constructor(politicalData) {
    /**
     * A force json file that contains all the information for the swarm chart
     */
    this.chartData = politicalData;
    console.log("the data set is", politicalData);

    /**
     * Scales
     */
    this.politicalScale = null;
  }
  createChart() {
    console.log("entered the create chart function");
    // helper function for finding the min value
    function findMinValue(data, attribute) {
      let minValueList = [];
      data.forEach(element => {
        let value = element[attribute];
        minValueList.push(value);
      });
      console.log("The min value list is", minValueList);
      let minValue = d3.min(minValueList);
      console.log("The min value is", minValue);
    }
    // helper function for finding the max value
    function findMaxValue(data, attribute) {
      let maxValueList = [];
      data.forEach(element => {
        let value = element[attribute];
        maxValueList.push(value);
      });
      console.log("The max value list is", maxValueList);
      let maxValue = d3.max(maxValueList);
      console.log("The max value is", maxValue);
    }

    let politicalScaleMinValue = findMinValue(this.chartData, position);
    let politicalScaleMaxValue = findMaxValue(this.chartData, position);

    // make the scale
    this.politicalScale = d3
      .scaleLinear()
      .domain([politicalScaleMinValue, politicalScaleMaxValue])
      .range([0, swarmChartWidth])
      .nice();

    let politicalScaleXAxis = d3.axisTop(this.politicalScale);

    let chartSVG = d3.select("#chartSVG");
    let politicalScaleGroup = chartSVG.append("g");
    console.log(politicalScaleGroup.node());
    politicalScaleGroup
      .attr("transform", "translate(0,50)")
      .call(politicalScaleXAxis);
  }
}
