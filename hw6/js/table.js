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