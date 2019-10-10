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
        this.teamData = teamData;

        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** variables to be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15 // padding
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

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

        // A set of helper functions to determine the max and min for scales
        function findMax(data, attribute)
        {
            // List for storing the particular attribute associated with each object in the data
            let dataList = [];
            data.forEach(element => {
                let value = element.value[attribute];
                dataList.push(value);
            });
            //  console.log(attribute, "MAX");
            //  console.log(dataList);
             let maxValue = d3.max(dataList);
             return maxValue;
        }

        // View the data
        console.log("The data");
        console.log(this.teamData);

        //Update Scale Domains
        // console.log("Update Scale Domain and Range");

        // Update Goal Scale Domain and Range
        // console.log("Updating the Goal Scale Domain and Range");
        let goalsMadeMax = findMax(this.teamData, this.goalsMadeHeader);
        let goalsConcededMax = findMax(this.teamData, this.goalsConcededHeader);
        // console.log("Goals Made MAX = ", goalsMadeMax);
        // console.log("Goals Conceded MAX = ", goalsConcededMax);
        this.goalScale = d3.scaleLinear()
                           .domain([0, goalsMadeMax])
                           .range([0, 2 * this.cell.width + 20])
                           .nice();


        // Update Game Scale Domain and Range
        // console.log("Updating the Game Scale Domain and Range");
        let totalGamesMax = findMax(this.teamData, "TotalGames");
        // console.log("TotalGames MAX = ", totalGamesMax);
        this.gameScale = d3.scaleLinear()
                           .domain([0, totalGamesMax])
                           .range([0, 2 * this.cell.width + 20])
                           .nice();

        // Update the Aggregate Color Scale Domain and Range
        // console.log("Updating the aggregate color scale domain and range");
        // Aggregate in this data refers to how the teams did overall across all their matches
        // so we use the total games for scaling the aggregate
        this.aggregateColorScale = d3.scaleLinear()
                                     .domain([0, totalGamesMax])
                                     .range(['#feebe2', '#690000']);
        
        // Update the Goal Color Scale Domain and Range
        // console.log("Updating the goal color scale domain and range");
        this.goalColorScale = d3.scaleLinear()
                                .domain([0, goalsMadeMax])
                                .range(['#cb181d', '#034e7b']);
        
        // Create the axes
        // console.log("Create the axes");
        let goalScaleXAxis = d3.axisTop().scale(this.goalScale);

        //add GoalAxis to header of col 1.
        // console.log("Add GoalAxis to header of col 1");
        let goalAxisHeader = d3.select("#goalHeader");
        // Set up the SVG for the axis
        let goalAxisHeaderSVG = goalAxisHeader.append("svg")
                                              .attr("width", 4 * this.cell.width + 20)
                                              .attr("id", "goalAxisSVG")
                                              .attr("height", 3 * this.cell.height);
        // Set up the group for the axis
        let goalAxisHeaderGroup = goalAxisHeaderSVG.append("g")
                                                   .attr("id", "goalXAxis")
                                                   .attr("transform", "translate(70," + this.cell.height + ")")
                                                   .call(goalScaleXAxis);
                                                   
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
        // console.log("Create table rows");
        let table = d3.select("#matchTable"); // select the table id
        let tableRows = table.select("tbody") // select the table body
                             .selectAll("tr") // select all the table rows
                             .data(this.tableElements) // bind the data to all the tr elements
                             .join("tr"); // enter exit update

        //Append th elements for the Team Names
        // console.log("Append the th elements for the Team Names");
        let tableHeaderTeamNames = tableRows.selectAll("th")
                                            .data(d => [d]) // bind each th element to 1 value (adding 1 th to the tr from table rows)
                                            .join("th"); // enter exit update

        // Add the name of the countries
        // there are two kinds of countries => Aggregate Countries and Game Countries which represent the two different kinds of rows
        // update the row names according to the type of row
        tableHeaderTeamNames.attr("class", function(d){
            if (d.value.type === "aggregate")
            {
                return "aggregate";
            }
            else
            {
                return "games";
            }
        })
        tableHeaderTeamNames.html(function(d){
            if (d.value.type === "aggregate")
            {
                return d.key;
            }
            else
            {
                return "x" + d.key;
            }
        });

        //Append td elements for the remaining columns. 
        console.log("Append td elements for the remaining columns");
        let goalDataObjectList = [];
        let roundResultDataObjectList = [];
        let winsDataObjectList = [];
        let lossesDataObjectList = [];
        let totalGamesDataObjectList = [];

        // A helper function for creating td elements

        // lists for viewing the game objects
        let gamesList = [];
        let tdElements = tableRows.selectAll("td")
                                  .data(function(d){
                                      // since each data category is unique, we can think of them as specific data types
                                      // data returns an array where each element in that array is bound to a td
                                      gamesList.push(d.value.games);

                                      // goals data category
                                      let goalsData = {};
                                      // stores the goals made, conceded and delta
                                      let goalsDataProperties = {};
                                      goalsDataProperties["Goals Made"] = d.value["Goals Made"];
                                      goalsDataProperties["Goals Conceded"] = d.value["Goals Conceded"];
                                      goalsDataProperties["Delta Goals"] = d.value["Delta Goals"];
                                      goalsData["type"] = d.value.type;
                                      goalsData["vis"] = "goals";
                                      goalsData["value"] = goalsDataProperties;

                                      // Round Result category
                                      let roundResultData = {};
                                      roundResultData["type"] = d.value.type;
                                      roundResultData["vis"] = "text";
                                      roundResultData["value"] = d.value.Result.label;

                                      //Wins Category
                                      let winsData = {};
                                      winsData["type"] = d.value.type;
                                      if (d.value.type === "game")
                                      {
                                          winsData["vis"] = "";
                                      }
                                      else
                                      {
                                          winsData["vis"] = "bars";
                                      }
                                      winsData["value"] = d.value.Wins;

                                      // Losses Category
                                      let lossesData ={};
                                      lossesData["type"] = d.value.type;
                                      if (d.value.type === "game")
                                      {
                                          lossesData["vis"] = "";
                                      }
                                      else
                                      {
                                          lossesData["vis"] = "bars";
                                      }
                                      lossesData["value"] = d.value.Losses;

                                      // Total Games Category
                                      let totalGamesData = {};
                                      if (d.value.type === "game")
                                      {
                                          totalGamesData["type"] = "";
                                          totalGamesData["vis"] = "";
                                          totalGamesData["value"] = "";
                                      }
                                      else
                                      {
                                          totalGamesData["type"] = d.value.type;
                                          totalGamesData["vis"] = "bars";
                                          totalGamesData["value"] = d.value.TotalGames;
                                      }

                                      // for debugging purposes
                                      goalDataObjectList.push(goalsData);
                                      roundResultDataObjectList.push(roundResultData);
                                      winsDataObjectList.push(winsData);
                                      lossesDataObjectList.push(lossesData);
                                      totalGamesDataObjectList.push(totalGamesData);
                                    // return [1, 2, 3, 4];
                                    
                                
                                    //console.log("printing out the result array", [goalsData, roundResultData, winsData, lossesData, totalGamesData])
                                    return [goalsData, roundResultData, winsData, lossesData, totalGamesData];
                                  })
                                 .join("td");
        // console.log("gamesList Data", gamesList);
        // console.log("goal column data", goalDataObjectList);
        // console.log("Round result column data", roundResultDataObjectList);
        // console.log("Wins column data", winsDataObjectList);
        // console.log("Losses column data", lossesDataObjectList);
        // console.log("totalGames column data", totalGamesDataObjectList);
   
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'vis' :<'bar', 'goals', or 'text'>, 'value':<[array of 1 or two elements]>}
        // The order is as follows: Team -> Text, Goals -> Goals, Round / Result -> Text, Wins -> Bar, Loss -> Bar, Total Games -> Bar                  
        
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
