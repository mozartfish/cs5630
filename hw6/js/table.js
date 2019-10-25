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
        this.tableHeaders = ["Phrase", "Frequency", "Percentage", "Total"];

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

}