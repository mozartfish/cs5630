/**
 * This script defines the table and its functionality as specified by the README
 */
class Table{

    /**
     * Constructor for the table object
     * @param {} politicalData - the data for the project
     */
    constructor(politicalData)
    {
        /**
         * Instance variable for storing the table data
         */
        this.tableData = politicalData;

        /**
         * Instance variable for storing the table headers
         */
        this.tableHeaders = ["Phrase", "Frequency", "Percentages", "Total"];

        /**
         * Object for defining how to size the svgs in the table cells
         */
        this.cell = {"width":150, "height": 20, "buffer": 15};

        /**
         * Instance variable for defining the size of the bars for the table
         */
        this.bar = {"height": 20};

        /**
         * Scale for the categories
         */
        this.categoryScale = null;

        /**
         * Scale for the frequency
         */
        this.frequencyScale = null;

        /**
         * Scale for the percentages
         */
        this.percentagesScale = null;

        /**
         * Counter for sorting the phrases in ascending or descending order
         */
        this.phraseCounter = 0;

        /**
         * Counter fo sorting the frequency in ascending or descending order
         */
        this.frequencyCounter = 0;

        /**
         * Counter for sorting the percentages in ascending or descending order
         */
        this.percentagesCounter = 0;

        /**
         * Counter for sorting the total in ascending or descending order
         */
        this.totalCounter = 0;
/**
     * Instance variable for keeping track of the categories
     */
    this.categoriesList = null;
        /**
     * Instance variable for indexing into the category property of the data
     */
    this.category = "category";
    /**
     * Instance variable used for keeping track of the democrat speeches
     */
    this.democratSpeeches = "percent_of_d_speeches";
    /**
     * Instant variable used for keeping track of the republican speeches
     */
    this.republicanSpeeches = "percent_of_r_speeches";
    }
    /**
     * Function that sets up the table. Set up includes creating the scales, axes, and svgs for the categories.
     */
    createTable()
    {
        console.log("entered the create table function");
        console.log("the value of the data for the table is", this.tableData);

        // create the scale for the frequency
        let frequencyList = this.calculateFrequency(this.tableData);
        let frequencyListMin = d3.min(frequencyList);
        let frequencyListMax = d3.max(frequencyList);

        this.frequencyScale = d3.scaleLinear()
                                .domain([0.0, frequencyListMax])
                                .range([this.cell.buffer,  this.cell.width + this.cell.buffer])
                                .nice();
        
        let frequencySVG = d3.select("#frequencyHeader")
                              .append("svg")
                              .attr("width", this.cell.width + 2 * this.cell.buffer + 60)
                              .attr("height", this.cell.height)
                              .attr("id", "frequencySVG");
        let frequencyGroup = frequencySVG.append("g")
                                         .attr("transform", "translate(5, 21)");
        let frequencyAxis = d3.axisTop(this.frequencyScale).ticks(3);
        frequencyGroup.call(frequencyAxis);

        this.percentagesScale = d3.scaleLinear()
                                  .domain([-100, 100])
                                  .range([15, 300])
                                  .nice();
        let percentagesSVG = d3.select("#percentagesHeader")
                               .append("svg")
                               .attr("width", this.cell.buffer + 2 * this.cell.width + this.cell.buffer + 100)
                               .attr("height", this.cell.height)
                               .attr("id", "percentagesSVG");

        let percentagesGroup = percentagesSVG.append("g")
                                             .attr("transform", "translate(40, 21)");
        let percentagesAxis = d3.axisTop(this.percentagesScale).ticks(5).tickFormat(d => Math.abs(d));
        percentagesGroup.call(percentagesAxis);

           // Create a list (in the format of a set) for determining the domain for the category scale
    this.categoriesList = this.accessData(this.tableData, this.category);
    console.log("categoryList", this.categoriesList);

    console.log(this.frequencyScale(0.5));

    // create the category scale
    this.categoryScale = d3
    .scaleOrdinal()
    .domain(this.categoriesList)
    .range(d3.schemeTableau10); // color scheme chosen in honor of Pat Hanrahan after his inspiring lectures at the 2019 Organick Lecture Series
    }

    updateTable()
    {
        console.log("entered the updateTable function");

        // define that so we can access functions and variables that have this on the front
        let that = this;

        // create table rows
        let table = d3.select("#politicalTable");
        let tableRows = table.select("tbody")
                             .selectAll("tr")
                             .data(that.tableData)
                             .join("tr")
                             .attr("id", d => d.phrase);
        
        // add the element names
        let tableHeaderElements = tableRows.selectAll("th")
                                           .data(d => [d])
                                           .join("th")
                                           .classed("phraseNames", true);
        tableHeaderElements.html(function(d){
            return d.phrase;
        })

        // for debugging purposes
        let frequencyObjectList = [];
        let percentagesObjectList = [];
        let totalObjectList = [];

        // add all the table data elements
        let tdElements = tableRows.selectAll("td")
                                  .data(function(d){
                                      // Frequency Column
                                      let frequencyObject = {};
                                      let frequencyValue = d.total / 50;
                                      frequencyObject["frequency"] = frequencyValue;
                                      frequencyObject["name"] = "frequency";
                                      frequencyObject["visType"] = "bar";
                                      frequencyObject["category"] = d.category;

                                      // Percentages Column
                                      let percentagesObject = {};
                                      percentagesObject["democrat"] = d[that.democratSpeeches];
                                      percentagesObject["republican"] = d[that.republicanSpeeches];
                                      percentagesObject["name"] = "percentages";
                                      percentagesObject["visType"] = "bar"
                                     
                                      
                                      // Total Column
                                      let totalObject = {};
                                      totalObject["total"] = d.total;
                                      totalObject["name"] = "total"
                                      totalObject["visType"] = "text";

                                      frequencyObjectList.push(frequencyObject);
                                      percentagesObjectList.push(percentagesObject);
                                      totalObjectList.push(totalObject);

                                      return[frequencyObject, percentagesObject, totalObject];
                                  })
                                  .join("td")
                                  .attr("id", d => d.visType);
        
    console.log("frequencyObjectlist", frequencyObjectList);
    console.log("percentagesObjectList", percentagesObjectList);
    console.log("totalObjectList", totalObjectList);

    console.log("make some EPIC charts");

    // bart charts for the frequency
    let frequencyCharts= tdElements.filter((d) => {
        return d.name === "frequency";
    });

    // bind svg to the selected elements
    frequencyCharts.selectAll("svg")
                        .data(d => [d])
                        .join("svg");

    
    let frequencySVG = frequencyCharts.selectAll("svg");
    frequencySVG.attr("width", that.cell.width + 2 * that.cell.buffer + 60)
                .attr("height", that.cell.height);

    let frequencyRectangles = frequencySVG.selectAll("rect")
                                          .data(d => [d])
                                          .join("rect");
    frequencyRectangles.attr("width", d => that.frequencyScale(d.frequency))
                       .attr("height", that.bar.height)
                       .attr("fill", d => that.categoryScale(d.category))
                       .attr("transform", "translate(15, 0)");


        // bart charts for the frequency
        let percentageChartsRepublican= tdElements.filter((d) => {
            return d.name === "percentages";
        });

        percentageChartsRepublican.selectAll("svg")
                        .data(d => [d])
                        .join("svg");
        
       let percentageSVG = percentageChartsRepublican.selectAll("svg");
       percentageSVG.attr("width", that.cell.buffer + 2 * that.cell.width + that.cell.buffer + 10)
                    .attr("height", that.cell.height)
                    .attr("id", "percentageSVG");



        let percentageRect = percentageSVG.selectAll("rect")
                                          .data(function(d){
                                              let republican = {};
                                            //   republican["speech"] =
                                            // console.log("the value of d is", d["republican"]);

                                            republican["rspeech"] = d["republican"];

                                            return [republican];
                                          })
                                          .join("rect");
            percentageRect.attr("width", d => that.percentagesScale(d["rspeech"]) / 4)
                          .attr("height", that.bar.height)
                          .attr("fill", "red")
                          .attr("transform", "translate(200, 0)")
                          .classed("republican", true);
        
        let democratRectangles = d3.selectAll("#percentageSVG")
                                    .append("rect");
            democratRectangles.attr("width", d => that.percentagesScale(d["democrat"]) / 4)
                              .attr("height", that.bar.height)
                              .attr("fill", "blue")
                              .attr("transform", "translate(130, 0)");
            
        let totalText= tdElements.filter((d) => {
            return d.name === "total";
        });

        totalText.selectAll("text")
                 .data(d => [d])
                 .join("text");
        
        totalText.attr("width", that.cell.width)
                 .attr("height", that.cell.height)
                 .text(d => d.total);
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
    console.log("maxValue", maxValue);
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
    console.log("minValue", minValue);
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
   * Rounding function article: https://www.jacklmoore.com/notes/rounding-in-javascript/
   * @param {} value - the number to be rounded 
   * @param {*} decimals - the decimal place we want to round to 
   */
  round(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  }
  /**
   * Function that calculates the word frequency for the data
   * @param {*} data - the data for the project
   */
  calculateFrequency(data)
  {
    let frequencyList = [];
    data.forEach(element => {
        let dataTotal = element.total;
        let totalFrequency = dataTotal / 50;
        frequencyList.push(totalFrequency);
    });
    return frequencyList;
  }

}