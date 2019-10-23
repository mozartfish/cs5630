/**
 * This script defines the swarm chart and its functionality as specified by the README
 */

/**
 * Class that defines a Chart Object
 */
class Chart {
  /**
   * Constructor for a Chart Object
   * @param {} politicalData - the data being visualized
   */
  constructor(politicalData) {
    /**
     * Instance variable that stores the data
     */
    this.politicalData = politicalData;
    /**
     * Object that defines the margins for the chart
     */
    this.margins = { top: 20, right: 30, bottom: 40, left: 30 };
    /**
     * Instance variable for storing the width for visualizing the swarm chart
     */
    this.width = 960 - this.margins.left - this.margins.right;
    /**
     * Instance variable for storing the height for visualizing the chart
     */
    this.height = 500 - this.margins.top - this.margins.bottom;
    /**
     * Scale for the political party axis
     */
    this.politicalScale = null;
    /**
     * Instance variable for indexing into the position property of the data
     */
    this.position = "position";
    /**
     * Instance variable for indexing into the sourceX property of the data
     */
    this.sourceX = "sourceX";
    /**
     * Instance variable for indexing into the sourceY property of the data
     */
    this.sourceY = "sourceY";
    /**
     * Instance variable for indexing into the category property of the data
     */
    this.category = "category";
    /**
     * Scale for coloring the circles based on the category
     */
    this.categoryScale = null;
    /**
     * Instance variable for indexing into the total property of the data
     */
    this.total = "total";
    /**
     * Instance variable for determining whether to open or close the individual data for the categories
     */
    this.toggleCounter = 0;
  }

  /**
   * Function that sets up the chart. Set up includes creating the scales, axis, and the svg for displaying the information.
   */
  createChart() {
    console.log("Entered the create chart function");
    console.log("The data is", this.politicalData);

    // Determine the min and max values for the political scale domain
    let politicalScaleMin = this.findMinValue(
      this.politicalData,
      this.position
    );
    let politicalScaleMax = this.findMaxValue(
      this.politicalData,
      this.position
    );

    // create the SVG
    let chartSVG = d3.select("#chartView").append("svg");
    chartSVG
      .attr("width", 2 * (this.width + this.margins.left + this.margins.right))
      .attr(
        "height",
        2 * (this.height + this.margins.top + this.margins.bottom)
      )
      .attr("id", "chartSVG");

    // create the scale for the political axis
    this.politicalScale = d3
      .scaleLinear()
      .domain([politicalScaleMin, politicalScaleMax])
      .range([0, this.width])
      .nice();

    // create the political party axis
    let politicalScaleXAxis = d3
      .axisTop(this.politicalScale)
      .tickFormat(d => Math.abs(d));

    // group for the svg and organizing stuff on the canvas
    let svgGroup = chartSVG.append("g").attr("class", "wrapper-group");

    // group for the Grouped by Topic Label
    let groupByTopicGroup = svgGroup.append("g")
                                    .attr("class", "groupByTopic")
                                    .attr("transform", "translate(45, 36)");

    // create the group by topic label 
    console.log("creating the group by topic text");
    groupByTopicGroup.append("text")
                     .text("Grouped by Topic");

    // group for the democrat party label
    let democrateGroup = svgGroup
      .append("g")
      .attr("class", "democrat")
      .attr("transform", "translate(40, 100)");

    // create the democrate title
    democrateGroup.append("text").text("Democrate Leaning");

    // group for the republic party label
    let republicanGroup = svgGroup
      .append("g")
      .attr("class", "republican")
      .attr("transform", "translate(700, 100)");

    // create the republican title
    republicanGroup.append("text").text("Republican Leaning");

    // append a group for the political axis
    svgGroup
      .append("g")
      .attr("transform", "translate(20,150)")
      .attr("class", "x-Axis")
      .call(politicalScaleXAxis);

    // Create a list (in the format of a set) for determining the domain for the category scale
    let categoriesList = this.accessData(this.politicalData, this.category);
    //console.log("The category list is", categoriesList);

    // create the category scale
    this.categoryScale = d3
      .scaleOrdinal()
      .domain(categoriesList)
      .range(d3.schemeTableau10); // color scheme chosen in honor of Pat Hanrahan after his inspiring lectures at the 2019 Organick Lecture Series
  }

  /**
   * Function for calculating the max value for different properties
   * @param {*} data - the project data
   * @param {*} attribute - a particular property of the data
   */
  findMaxValue(data, attribute) {
    let maxValueList = [];
    data.forEach(element => {
      let value = element[attribute];
      maxValueList.push(value);
    });
    let maxValue = d3.max(maxValueList);
    return maxValue;
  }

  /**
   * Function for calculating the min value for different properties
   * @param {*} data - the project data
   * @param {*} attribute - a particular property of the data
   */
  findMinValue(data, attribute) {
    let minValueList = [];
    data.forEach(element => {
      let value = element[attribute];
      minValueList.push(value);
    });
    let minValue = d3.min(minValueList);
    return minValue;
  }

  /**
   * Function for gathering the different properties of the data without duplicates
   * @param {*} data - the project data
   * @param {*} attribute - a particular property of the data
   */
  accessData(data, attribute) {
    let attributeValueSet = new Set();
    let attributeValueList = [];
    data.forEach(element => {
      let value = element[attribute];
      attributeValueSet.add(value);
    });
    attributeValueSet.forEach(element => {
      attributeValueList.push(element);
    });
    return attributeValueList;
  }

  /**
   * Function for drawing the the swarm chart
   */
  drawChart() {
    console.log("Entered the draw chart function");

    // create that to access the functions and variables that have this on the front
    let that = this;

    //console.log("The data in the draw chart function is", this.politicalData);
    console.log("calling the update chart method");
    that.updateChart(this.politicalData, this.toggleCounter);



  }


  updateChart(politicalData, toggleCounter)
  {
    console.log("entered the update function");
    console.log("the value of the data is", politicalData);
    console.log("the value of the toggle counter is", toggleCounter);

    // create scale for the circle size
    //console.log("creating the circleScale scale");
    const circleScale = d3
      .scaleLinear()
      .domain([
        d3.min(politicalData.map(d => +d.total)),
        d3.max(politicalData.map(d => +d.total))
      ])
      .range([3, 12]);

      let group = d3
      .select("#chartView")
      .select("#chartSVG")
      .select(".wrapper-group")
      .append("g");
    group.attr("class", "circle-group").attr("transform", "translate(18, 250)");

    let circles = group
      .selectAll("circle")
      .data(politicalData)
      .join("circle")
      .classed("bubbles", true)
      .attr("id", d => d.category);

      circles.attr("r", d => circleScale(d.total));
      if (toggleCounter === 0)
      {
        circles.attr("cx", d => d.sourceX);
        circles.attr("cy", d => d.sourceY);
      }

      circles.attr("fill", d => this.categoryScale(d.category));
  }
}
