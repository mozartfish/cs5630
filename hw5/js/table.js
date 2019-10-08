/** Class implementing the table. */
class Table {
  /**
   * Creates a Table Object
   */
  constructor(teamData, treeObject) {
    // Maintain reference to the tree object
    // this.tree = null;
    this.tree = treeObject;

    /**List of all elements that will populate the table.*/
    // Initially, the tableElements will be identical to the teamData
    // this.tableElements = null;
    this.tableElements = teamData;

    ///** Store all match data for the 2018 Fifa cup */
    // this.teamData = null;
    this.teamData = teamData;

    this.tableHeaders = [
      "Delta Goals",
      "Result",
      "Wins",
      "Losses",
      "TotalGames"
    ];

    /** letiables to be used when sizing the svgs in the table cells.*/
    this.cell = {
      width: 70,
      height: 20,
      buffer: 15 // the padding for cells
    };

    this.bar = {
      height: 20
    };

    /** Set variables for commonly accessed data columns*/
    this.goalsMadeHeader = "Goals Made";
    this.goalsConcededHeader = "Goals Conceded";

    /** Setup the scales*/
    this.goalScale = null;

    /** Used for games/wins/losses*/
    this.gameScale = null;

    /**Color scales*/
    /**For aggregate columns*/
    /** Use colors '#feebe2' and '#690000' for the range*/
    this.aggregateColorScale = null;

    /**For goal Column*/
    /** Use colors '#cb181d' and '#034e7b' for the range */
    this.goalColorScale = null;
  }

  /**
   * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
   * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
   *
   */
  createTable() {
    /**
     * Function for determining the max for a scale
     * @param {*} dataObject - dataset containing objects
     * @param {*} attribute - a particular property of the dataObject
     */
    function findMax(dataObject, attribute) {
      // List for storing all the object associated with the specified attribute
      let objectValueList = [];
      dataObject.forEach(element => {
        let value = element.value[attribute];
        objectValueList.push(value);
      });

      // console.log(attribute, "Max");
      // console.log(objectValueList);
      let maxValue = d3.max(objectValueList);

      return maxValue;
    }

    /**
     * Function for determining the min value for a scale
     * @param {*} dataObject - dataset containing objects
     * @param {*} attribute - a partciular property of the dataObject
     */
    function findMin(dataObject, attribute) {
      // List for storing all the objects associated with a particular property
      let objectValueList = [];
      dataObject.forEach(element => {
        let value = element.value[attribute];
        objectValueList.push(value);
      });
      // console.log(attribute, "Min");
      // console.log(objecValueList);
      let minValue = d3.min(objectValueList);

      return minValue;
    }

    // ******* TODO: PART II *******

    //Update Scale Domains

    // Create the axes

    //add GoalAxis to header of col 1.

    // ******* TODO: PART V *******

    // Set sorting callback for clicking on headers

    //Set sorting callback for clicking on Team header
    //Clicking on headers should also trigger collapseList() and updateTable().
  }

  /**
   * Updates the table contents with a row for each element in the global variable tableElements.
   */
  updateTable() {
    // ******* TODO: PART III *******
    //Create table rows
    //Append th elements for the Team Names
    //Append td elements for the remaining columns.
    //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'vis' :<'bar', 'goals', or 'text'>, 'value':<[array of 1 or two elements]>}
    //Add scores as title property to appear on hover
    //Populate cells (do one type of cell at a time )
    //Create diagrams in the goals column
    //Set the color of all games that tied to light gray
  }

  /**
   * Updates the global tableElements variable, with a row for each row to be rendered in the table.
   *
   */
  updateList(i) {
    // ******* TODO: PART IV *******
    //Only update list for aggregate clicks, not game clicks
  }

  /**
   * Collapses all expanded countries, leaving only rows for aggregate values per country.
   *
   */
  collapseList() {
    // ******* TODO: PART IV *******
  }
}
