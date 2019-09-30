/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        // Maintain reference to the tree object
        //this.tree = null;
        this.tree = treeObject;

        /**List of all elements that will populate the table.*/
        // Initially, the tableElements will be identical to the teamData
        //this.tableElements = null;
        this.tableElements = teamData;

        ///** Store all match data for the 2018 Fifa cup */
        //this.teamData = null;
        this.teamData = teamData;

        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** Variables to be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';
        this.deltaGamesHeader = 'Delta Goals';
        //console.log(this.deltaGamesHeader);

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

        // ******* TODO: PART II *******
        /**
         * A helper function for finding the max value for scales.
         * The attribute refers to any of the properties associated with the country
         * @param {*}dataObject - dataset containing objects
         * @param {*} attribute - property of the objects in the data Object
         */
        function findMax(dataObject, attribute)
        {
            // List for storing all the objects associated with a particular property
            let objectValueList = [];
            dataObject.forEach(element => {
                let value = element.value[attribute];
                objectValueList.push(value);
            });
            console.log("the objectValueList for Max");
            console.log(objectValueList);
            let maxValue = d3.max(objectValueList);
            return maxValue;
        }

        /**
         * A helper function for finding the min value for scales.
         * The attribute refers to any of the properties associated with the country
         * @param {*} dataObject - dataset containing objects
         * @param {*} attribute - attributes that are part of the objects in the dataset
         */
        function findMin(dataObject, attribute)
        {
            // List for storing all the objects associated with a particular property
            let objectValueList = [];
            dataObject.forEach(element => {
                let value = element.value[attribute];
                objectValueList.push(value);                
            });
            console.log("the object valueList for Min");
            console.log(objectValueList);
            let minValue = d3.min(objectValueList);
            return minValue;
        }




        //Update Scale Domains
        console.log("The Scale Domains");
        console.log("Team Data");
       //console.log(this.teamData)
        console.log("finding the max value for the scale");
        let goalsMadeMaxValue = findMax(this.teamData, this.goalsMadeHeader);
        let goalsConcededMaxValue = findMax(this.teamData, this.goalsConcededHeader);
        let deltaGoalsMaxValue = findMax(this.teamData, this.deltaGamesHeader);

        
        console.log("The max value for goals conceded");
        console.log(goalsConcededMaxValue);
        console.log("The max value for goals made");
        console.log(goalsMadeMaxValue);
        console.log("The max value for delta goals")
        console.log(deltaGoalsMaxValue);
        
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

    };

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
