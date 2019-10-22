/**
 * This script defines the swarm chart and its functionality as specified by the README
 */

/**
 * Class that defines a Chart Object
 */
class Chart 
{
  /**
   * Constructor for a Chart Object
   * @param {} politicalData - the data being visualized
   */
  constructor(politicalData) 
  {
    /**
     * instance variable that stores the data
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
  }

  createChart() 
  {
    console.log("Entered the create chart function");
    console.log("The data is", this.politicalData);

    // create the svg for the chart
    console.log("creating the svg for the chart");

    let chartSVG = d3.select("#chartView");
    chartSVG.append("svg")
            .attr("width", this.width + this.margins.left + this.margins.right)
            .attr("height", this.height + this.margins.top + this.margins.bottom)
            .attr("id", "chartSVG");


    /**
     * Function that determines the min value for a particular attribute of the data
     * @param {*} data - the project data
     * @param {*} attribute - a particular property of the data
     */
    function findMinValue(data, attribute)
    {
        let minValueList = [];
        data.forEach(element => {
            let value = element[attribute];
            minValueList.push(value); 
        });
        console.group("The min value list for", attribute, "is", minValueList);
        let minValue = d3.min(minValueList);
        console.log("The min value for", attribute, "is", minValue);
    }

    /**
     * Function that determines the max value for a particular attribute of the data
     * @param {} data - the project data
     * @param {*} attribute - a particular property of the data
     */
    function findMaxValue(data, attribute)
    {
        let maxValueList = [];
        data.forEach(element => {
            let value = element[attribute];
            maxValueList.push(value);
        });
        console.log("The max value list for", attribute, "is", maxValueList);
        let maxValue = d3.max(maxValueList);
        console.log("The max value for", attribute, "is", maxValue);
    }

    // Determine the min and max values for the political scale domain
    let politicalScaleMin = findMinValue(this.politicalData, this.position);
    let politicalScaleMax = findMaxValue(this.politicalData, this.position);
  }
}
