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
  }

  /**
   * Function that sets up the chart. Set up includes creating the scales, axis, and the svg for displaying the information.
   */
  createChart() {
    console.log("Entered the create chart function");
    console.log("The data is", this.politicalData);

    // Determine the min and max values for the political scale domain
    let politicalScaleMin = this.findMinValue(this.politicalData, this.position);
    let politicalScaleMax = this.findMaxValue(this.politicalData, this.position);

    // create the SVG
    // console.log("creating the svg for the chart");
    let chartSVG = d3.select("#chartView").append("svg");
    chartSVG
      .attr("width", this.width + this.margins.left + this.margins.right)
      .attr("height", this.height + this.margins.top + this.margins.bottom)
      .attr("id", "chartSVG");
    
    // create a scale
    // console.log("creating the scale");
    // console.log("the value of politicalScaleMin is ", politicalScaleMin);
    // console.log("the value of politicalScaleMax is", politicalScaleMax);
    // console.log("the value of the width is", this.width);

    this.politicalScale = d3.scaleLinear()
                            .domain([politicalScaleMin, politicalScaleMax])
                            .range([0, this.width])
                            .nice();
    //console.log("the value of this.political scale is", this.politicalScale);

    // test the political scale
    // console.log("the mapping of", politicalScaleMin, "is", this.politicalScale(politicalScaleMin));
    // console.log("the mapping of", politicalScaleMax, "is", this.politicalScale(politicalScaleMax));

    // console.log("creating an axis");
    let politicalScaleXAxis = d3.axisTop(this.politicalScale)
                                .tickFormat(d => Math.abs(d));
                                // .tickFormat(function(d){
                                //   console.log("the value of d is", d);
                                //   return Math.abs(d);
                                // });

    // append a group to the svg for the scale
    // console.log("created an svg group");
    let svgGroup = chartSVG.append("g")
            .attr("class", "wrapper-group");

    svgGroup.append("g")
            .attr("transform", "translate(20,80)")
            .attr("class", "x-Axis")
            .call(politicalScaleXAxis);
    
     // Create a set containing all the categories
     let categoriesList = this.accessData(this.politicalData, this.category);
    //  console.log("The category list is", categoriesList);

    // create the category scale
    this.categoryScale = d3.scaleOrdinal()
                           .domain(categoriesList)
                           .range(["#00693e", "#ffff00", "#c8a2c8", "#ff0031", "#0080ff", "#ff4f00"]);
    
  }

  /**
   * Function for calculating the max value for different properties
   * @param {*} data - the project data
   * @param {*} attribute - a particular property of the data 
   */
  findMaxValue(data, attribute) 
  {
      let maxValueList = [];
      data.forEach(element => {
        let value = element[attribute];
        maxValueList.push(value);
      });
      //console.log("The max value list for", attribute, "is", maxValueList);
      let maxValue = d3.max(maxValueList);
      // console.log("The max value for", attribute, "is", maxValue);

      return maxValue;
  }
    
    /**
     * Function for calculating the min value for different properties
     * @param {*} data - the project data
     * @param {*} attribute - a particular property of the data
     */
    findMinValue(data, attribute) 
    {
      let minValueList = [];
      data.forEach(element => {
        let value = element[attribute];
        minValueList.push(value);
      });
      //console.log("The min value list for", attribute, "is", minValueList);
      let minValue = d3.min(minValueList);
      // console.log("The min value for", attribute, "is", minValue);

      return minValue;
    }

    /**
     * Function for gathering the different properties of the data without duplicates
     * @param {*} data - the project data
     * @param {*} attribute - a particular property of the data 
     */
    accessData(data, attribute)
    {
      let attributeValueSet = new Set();
      let attributeValueList = [];
      data.forEach(element => {
        let value = element[attribute];
        attributeValueSet.add(value);
      });

      attributeValueSet.forEach(element => {
        attributeValueList.push(element)
      });
      //console.log("The attribute value list is", attributeValueSet);
      //return attributeValueSet;
      return attributeValueList;
    }

  /**
   * Function for drawing the the swarm chart
   */
  drawChart()
  {
    console.log("Entered the draw chart function");

    // create that to access the functions and variables that have this on the front
    let that = this;

    console.log("The data in the draw chart function is", this.politicalData)

    // create scale for the circle size
    console.log("creating the circleScale scale");
    const circleScale = d3.scaleLinear()
                          .domain([d3.min(this.politicalData.map(d => +d.total)), d3.max(this.politicalData.map(d => +d.total))])
                          .range([3, 12]);
    
    // calculate the min and max for  source x
    console.log("calculating the min and max for source x");
    let sourceXMin = that.findMinValue(that.politicalData, that.sourceX);
    let sourceXMax = that.findMaxValue(that.politicalData, that.sourceX);

    let sourceYMin = that.findMinValue(that.politicalData, that.sourceY);
    let sourceYMax = that.findMaxValue(that.politicalData, that.sourceY);

    console.log("the value for sourceX min is", sourceXMin);
    console.log("the value for sourceX max is", sourceXMax);

    console.log("the value for sourceY min is", sourceYMin);
    console.log("the value for sourceY max is", sourceYMax);

    // create the circles
    console.log("create the circles");

    let group = d3.select("#chartView").select("#chartSVG").select(".wrapper-group");
    group.selectAll("circle")
         .data(that.politicalData)
         .join("circle")
         .attr("id", d => d.category);
  }
}
