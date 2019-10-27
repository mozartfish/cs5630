/**
 * This script defines the table and its functionality as specified by the README
 */
class Table {
  /**
   * Constructor for the Table
   * @param {*} politicalData - the project data
   */
  constructor(politicalData) {
    /**
     * Instance variable for elements that will populate the table
     */
    this.tableElements = politicalData;
    /**
     * Instance variable that stores all the data
     */
    this.politicalData = politicalData;
    /**
     * Instance variable that stores all the column header values for use in sorting
     */
    this.tableHeaders = ["Phrase", "Frequency", "Percentages", "Total"];
    /**
     * Instance variable object that defines sizing for cells
     */
    this.cell = { width: 70, height: 20, buffer: 15 };
    /**
     * Instance variable that defines the height of the bars
     */
    this.bar = { height: 20 };
    /**
     * Category Scale
     */
    this.categoryScale = null;
    /**
     * Frequency Scale
     */
    this.frequencyScale = null;
    /**
     * Percentages Scale
     */
    this.percentagesScale = null;
    /**
     * Phrase Counter
     */
    this.phraseCounter = 0;
    /**
     * Frequency Counter
     */
    this.frequencyCounter = 0;
    /**
     * Percentages Counter
     */
    this.percentagesCounter = 0;
    /**
     * Total Counter
     */
    this.totalCounter = 0;
    /**
     * List for keeping track of categories
     */
    this.categoriesList = null;
    /**
     * Instance variable for indexing into the categories
     */
    this.category = "category";
    /**
     * Instance variable for indexing into the democrat speech percentages
     */
    this.democratSpeeches = "percent_of_d_speeches";
    /**
     * Instance variable for indexing into the republican speech percentages
     */
    this.republicanSpeeches = "percent_of_r_speeches";
  }
  /**
   * Function that sets up the table including headers that when clicked all for the table to be sorted by the chosen attribute
   */
  createTable() {
    // print the data
    console.log("the political data", this.politicalData);

    // Set that equal to this to use the anonymous functions and variables that have this on the front
    let that = this;

    // Determine the scales and axes for the Categories, Frequency and the Percentages
    // Frequency Scale
    let frequencyList = this.calculateFrequency(this.politicalData);
    let frequencyMin = d3.min(frequencyList);
    let frequencyMax = d3.max(frequencyList);
    console.log("frequency min", frequencyMin);
    console.log("frequency max", frequencyMax);
    this.frequencyScale = d3
      .scaleLinear()
      .domain([0.0, 1.0])
      .range([0, 2 * this.cell.width + 20])
      .nice();
    // Percentages Scale
    this.percentagesScale = d3
      .scaleLinear()
      .domain([-100, 100])
      .range([0, 2 * this.cell.width + 20])
      .nice();
    this.categoriesList = this.accessData(this.politicalData, this.category);
    console.log("categories", this.categoriesList);
    this.categoryScale = d3
      .scaleOrdinal()
      .domain(this.categoriesList)
      .range(d3.schemeTableau10); // color scheme chosen in honor of Pat Hanrahan for his amazing lectures during the 2019 Organick Lecture Series

    // Frequency X Axis
    let frequencyXAxis = d3.axisTop(this.frequencyScale).ticks(3);
    let frequencyAxisHeader = d3.select("#frequencyHeader");
    let frequencyAxisSVG = frequencyAxisHeader
      .append("svg")
      .attr("width", 2 * this.cell.width + this.cell.buffer + 90)
      .attr("height", this.cell.height + 10)
      .attr("id", "frequencyAxisSVG");
    let frequencyHeaderGroup = frequencyAxisSVG
      .append("g")
      .attr("transform", "translate(45," + (this.cell.buffer + 5) + ")")
      .call(frequencyXAxis);

    // Percentages X Axis
    let percentagesXAxis = d3
      .axisTop(this.percentagesScale)
      .ticks(5)
      .tickFormat(d => Math.abs(d));
    let percentagesAxisHeader = d3.select("#percentagesHeader");
    let percentagesAxisSVG = percentagesAxisHeader
      .append("svg")
      .attr("width", 2 * this.cell.width + this.cell.buffer + 90)
      .attr("height", this.cell.height + 10)
      .attr("id", "percentagesSVG");
    let percentagesGroup = percentagesAxisSVG
      .append("g")
      .attr("transform", "translate(45," + (this.cell.buffer + 5) + ")")
      .call(percentagesXAxis);

    // Remove the bar from the Frequency and Percentages Axes
    // Article on removing the bar for the axis: https://observablehq.com/@d3/line-with-missing-data
    // d3.selectAll(".domain").remove();
  }
  /**
   * Updates the table contents with a row for each element in the global variable tableElements
   */
  updateTable() {
    console.log("entered the update function");
    // define that so we can access functions and variable that have this on the front
    let that = this;

    // Create table rows
    let tableRows = d3
      .select("#tableBody")
      .selectAll("tr")
      .data(that.tableElements)
      .join("tr")
      .attr("id", d => d.phrase);

    // Add the names of the phrases
    let tableHeaderElements = tableRows
      .selectAll("th")
      .data(d => [d])
      .join("th");
    tableHeaderElements.html(d => d.phrase);

    // Add td elements for the remaining columns
    // lists for keeping track of objects of particular types
    let frequencyObjectList = [];
    let percentagesObjectList = [];
    let totalObjectList = [];

    let tdElements = tableRows
      .selectAll("td")
      .data(function(d) {
        // frequency objects
        let frequencyObject = {};
        let frequencyValue = d.total / 50;
        frequencyObject["frequency"] = frequencyValue;
        frequencyObject["name"] = "frequency";
        frequencyObject["visType"] = "bar";
        frequencyObject["category"] = d.category;
        // percentages objects
        let percentagesObject = {};
        percentagesObject["republican"] = d[that.republican];
        percentagesObject["democrat"] = d[that.democrat];
        percentagesObject["name"] = "percentages";
        percentagesObject["visType"] = "bar";
        // total objects
        let totalObject = {};
        totalObject["total"] = d.total;
        totalObject["name"] = "total";
        totalObject["visType"] = "text";

        // update lists
        frequencyObjectList.push(frequencyObject);
        percentagesObjectList.push(percentagesObject);
        totalObjectList.push(totalObject);

        return [frequencyObject, percentagesObject, totalObject];
      })
      .join("td")
      .attr("id", d => d.visType);
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
    // console.log("maxValue", maxValue);
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
    // console.log("minValue", minValue);
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
   * Function that calculates the word frequency for the data
   * @param {*} data - the data for the project
   */
  calculateFrequency(politicalData) {
    let frequencyList = [];
    politicalData.forEach(element => {
      let dataTotal = element.total;
      let totalFrequency = dataTotal / 50;
      frequencyList.push(totalFrequency);
    });
    return frequencyList;
  }
}
