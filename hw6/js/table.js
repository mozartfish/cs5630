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
        this.cell = {"width": 70, "height": 20, "buffer":15};

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
    }

    /**
     * Function that sets up the table. Set up includes creating the scales, axes, and svgs for the categories.
     */
    createTable()
    {
        console.log("entered the create table function");
        console.log("the value of the data for the table is", this.tableData);

        // create the scale for the frequency
        console.log("creating the frequency scale");

        let frequencyList = this.calculateFrequency(this.tableData);
        let frequencyListMin = d3.min(frequencyList);
        let frequencyListMax = d3.max(frequencyList);
        console.log("the frequency list is", frequencyList);
        console.log("frequency list min", frequencyListMin);
        console.log("frequency list max", frequencyListMax);

        this.frequencyScale = d3.scaleLinear()
                                .domain([0.0, frequencyListMax])
                                .range([this.cell.buffer, 2 * this.cell.width - this.cell.buffer]);
       

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