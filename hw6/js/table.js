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
    this.tableHeaders = ["Frequency", "Percentages", "Total"];
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
    /**
     * Scale for republican speech percentages
     */
    this.republicanScale = null;
    /**
     * Scale for democrat speech percentages
     */
    this.democratScale = null;
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
    // Republican Scale
    this.republicanScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, this.cell.width + 10])
      .nice();
    // Democrat Scale
    this.democratScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, this.cell.width + 10])
      .nice();
    // Categories Scale
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
      .ticks(3)
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
    d3.selectAll(".domain").remove();

    // Click Functionality for the Phrase Header
    let politicalPhraseHeader = d3.selectAll("thead th").data(["Phrase"]);
    politicalPhraseHeader.on("click", function(d) {
      console.log("clicked the", d, "header");
      that.sortPhrases();
    });

    // Click Functionality for the rest of the headers
    let politicalTableHeaders = d3
      .selectAll("thead td")
      .data(this.tableHeaders);
    politicalTableHeaders.on("click", function(d) {
      console.log("clicked the ", d, "header!");
      that.sortPoliticalTableHeaders(d);
    });
  }
  /**
   * Function that sorts the Frequency, Percentages and Total Columns
   * @param {*} tableHeaderName
   */
  sortPoliticalTableHeaders(tableHeaderName) {
    // define tht so we can access function and variables that have this on the front
    let that = this;

    // Sort the Frequency
    if (tableHeaderName === "Frequency") {
      if (that.frequencyCounter === 0) {
        console.log("sort frequency in ascending order");
        that.tableElements.sort((a, b) =>
          d3.ascending(a.total / 50, b.total / 50)
        );
        that.frequencyCounter = 1;
      } else {
        console.log("sort frequency in descending order");
        that.tableElements.sort((a, b) =>
          d3.descending(a.total / 50, b.total / 50)
        );
        that.frequencyCounter = 0;
      }
    }

    // Sort the Total
    else if (tableHeaderName === "Total") {
      if (that.totalCounter === 0) {
        console.log("sort the total in ascending order");
        that.tableElements.sort((a, b) => a.total - b.total);
        that.totalCounter = 1;
      } else {
        console.log("sort the total in descending order");
        that.tableElements.sort((a, b) => b.total - a.total);
        that.totalCounter = 0;
      }
    }
    // Sort the Percentages
    // There are four cases for the percentages
    // 1) Counter = 0 => Sort republicans ascending
    // 2) Counter = 1 => Sort republicans descending
    // 3) Counter = 2 => Sort democrats ascending
    // 4) Counter = 3 => Sort democrats descending
    else {
      // In order to sort the percentages we have to sort by the area of the rectangles
      // The following blocks of code do this and modify the data set to sort by area of rectangles
      let democratRectangles = d3.selectAll("#democrat");
      let areaListDemocrat = [];
      democratRectangles.each(function() {
        let width = this.getAttribute("width");
        let height = this.getAttribute("height");
        let area = width * height;
        areaListDemocrat.push(area);
      });
      let republicanRectangles = d3.selectAll("#republican");
      let areaListRepublican = [];
      republicanRectangles.each(function() {
        let width = this.getAttribute("width");
        let height = this.getAttribute("height");
        let area = width * height;
        areaListRepublican.push(area);
      });
      for (let j = 0; j < this.tableElements.length; j++) {
        let currentObject = this.tableElements[j];
        currentObject["democratArea"] = areaListDemocrat[j];
        currentObject["republicanArea"] = areaListRepublican[j];
      }
      // console.log("table elements updated", that.tableElements);

      // Sort the Percentages by Area
      if (that.percentagesCounter === 0) {
        console.log("sorting the republicans in ascending order");
        that.tableElements.sort(
          (a, b) => a["republicanArea"] - b["republicanArea"]
        );
        that.percentagesCounter = 1;
      } else if (that.percentagesCounter === 1) {
        console.log("sorting the republicans in descending order");
        that.tableElements.sort(
          (a, b) => b["republicanArea"] - a["republicanArea"]
        );
        that.percentagesCounter = 2;
      } else if (that.percentagesCounter === 2) {
        console.log("sorting the democrats in ascending order");
        that.tableElements.sort(
          (a, b) => a["democratArea"] - b["democratArea"]
        );
        that.percentagesCounter = 3;
      } else {
        console.log("sorting the democrats in descending order");
        that.tableElements.sort(
          (a, b) => b["democratArea"] - a["democratArea"]
        );
        that.percentagesCounter = 0;
      }
    }
    that.updateTable();
  }

  /**
   * Function that sorts the Phrases
   */
  sortPhrases() {
    // define that so we can access functions and variables that have this on the front
    let that = this;

    console.log("entered the sort phrase function");

    if (that.phraseCounter === 0) {
      console.log("sort phrases in ascending order");
      that.tableElements.sort((a, b) => d3.ascending(a.phrase, b.phrase));
      that.phraseCounter = 1;
    } else {
      console.log("sort phrases in descending order");
      that.tableElements.sort((a, b) => d3.descending(a.phrase, b.phrase));
      that.phraseCounter = 0;
    }

    that.updateTable();
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
        frequencyObject["visType"] = "frequencybar";
        frequencyObject["category"] = d.category;
        // percentages objects
        let percentagesObject = {};
        percentagesObject["republican"] = d[that.republicanSpeeches];
        percentagesObject["democrat"] = d[that.democratSpeeches];
        percentagesObject["name"] = "percentages";
        percentagesObject["visType"] = "percentagesbar";
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

    console.log("Make some epic SVG plots!");

    // Bar Charts for Frequency Graphs
    let frequencyBarCharts = tdElements.filter(d => {
      return d.name === "frequency";
    });

    // Bind SVG elements to the objects selected objects
    frequencyBarCharts
      .selectAll("svg")
      .data(d => [d])
      .join("svg")
      .attr("id", "fBarSVG");

    // Set the properties of the svg
    let frequencyBarSVG = frequencyBarCharts
      .selectAll("svg")
      .attr("width", 2 * that.cell.width + that.cell.buffer + 90)
      .attr("height", that.cell.height + 10);

    // Add a group to the svgs
    let frequencyChartGroup = frequencyBarSVG
      .selectAll("g")
      .data(d => [d])
      .join("g")
      .attr("id", "fBarGroup");
    frequencyChartGroup.attr("transform", "translate(40," + 5 + ")");

    // Add rectangles
    let frequencyChartRectangles = frequencyChartGroup
      .selectAll("rect")
      .data(d => [d])
      .join("rect");

    frequencyChartRectangles
      .attr("x", 0.0)
      .attr("y", 8)
      .attr("width", d => that.frequencyScale(d.frequency))
      .attr("height", that.cell.height)
      .attr("fill", d => that.categoryScale(d.category));

    // Bar Charts for Percentages Graph
    let percentagesBarCharts = tdElements.filter(d => {
      return d.name === "percentages";
    });

    // Bind SVG elements to the objects selected objects
    percentagesBarCharts
      .selectAll("svg")
      .data(d => [d])
      .join("svg")
      .attr("id", "percentagesSVG");
    let percentagesBarSVG = percentagesBarCharts
      .selectAll("svg")
      .attr("width", 2 * that.cell.width + that.cell.buffer + 90)
      .attr("height", that.cell.height + 10);

    // // Republican Bars
    let percentagesBarRepublican = percentagesBarSVG
      .selectAll("rect")
      .data(d => [d])
      .join("rect")
      .attr("id", "republican");
    percentagesBarRepublican
      .attr("transform", "translate(43, 5)")
      .attr("x", 76)
      .attr("y", 8)
      .attr("width", d => that.republicanScale(d.republican))
      .attr("height", that.bar.height)
      .attr("fill", "#ff4d4d");

    // Add group for the democrats
    let democratGroup = percentagesBarSVG
      .selectAll("g")
      .data(d => [d])
      .join("g")
      .attr("id", "democratGroup");

    democratGroup.attr("transform", "translate(195, 5)" + "scale(-1, 1)");

    // Create rectangles for the democrats bar chart
    let percentagesBarDemocrat = democratGroup
      .selectAll("rect")
      .data(d => [d])
      .join("rect")
      .attr("id", "democrat")
      .attr("x", 76)
      .attr("y", 8)
      .attr("width", d => that.democratScale(d.democrat))
      .attr("height", that.bar.height)
      .attr("fill", "#3477eb");

    // Total Visualization
    let totalText = tdElements.filter(d => {
      return d.name === "total";
    });

    // bind text elements to total data
    totalText
      .selectAll("text")
      .data(d => [d])
      .join("text");

    // Set the properties of the text
    totalText
      .attr("width", that.cell.width)
      .attr("height", that.cell.height)
      .text(d => d.total)
      .attr("id", "totalText");
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
