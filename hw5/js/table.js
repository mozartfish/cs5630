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

        // A set of helper functions to determine the min and max value for scales and encoding
        function findMax(data, attribute)
        {
            // List for storing the particular attribute associated with each object in the data
            let dataList = [];
            data.forEach(element => {
                let value = element.value[attribute];
                dataList.push(value);
            });
            // console.log(attribute, "MAX");
            // console.log("Max Value Data List", dataList);
             let maxValue = d3.max(dataList);
             return maxValue;
        }

        function findMin(data, attribute)
        {
            // List for stroing the particular attribute associated with each object in the data
            let dataList = [];
            data.forEach(element => {
                let value = element.value[attribute];
                dataList.push(value);
            });

            // console.log(attribute, "MIN");
            // console.log("Min Value Data List", dataList);
            let minValue = d3.minValue(dataList);
            return minValue;
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
        let goalValuesList = [goalsMadeMax, goalsConcededMax];
        let goalScaleDomainMax = d3.max(goalValuesList);
        // console.log("Goals Made MAX = ", goalsMadeMax);
        // console.log("Goals Conceded MAX = ", goalsConcededMax);
        this.goalScale = d3.scaleLinear()
                           .domain([0, goalScaleDomainMax])
                           .range([0, 2 * this.cell.width + 20])
                           .nice();

        // Update Game Scale Domain and Range
        // console.log("Updating the Game Scale Domain and Range");
        let totalGamesMax = findMax(this.teamData, "TotalGames");
        // console.log("TotalGames MAX = ", totalGamesMax);
        this.gameScale = d3.scaleLinear()
                           .domain([0, totalGamesMax])
                           .range([0, this.cell.width])
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
                                .domain([0, goalScaleDomainMax])
                                .range(['#cb181d', '#034e7b']);
        
        // Create the axes
        // console.log("Create the axes");
        let goalScaleXAxis = d3.axisTop().scale(this.goalScale);

        //add GoalAxis to header of col 1.
        // console.log("Add GoalAxis to header of col 1");
        let goalAxisHeader = d3.select("#goalHeader");
        // Set up the SVG for the axis
        let goalAxisHeaderSVG = goalAxisHeader.append("svg")
                                              .attr("width", 2 * this.cell.width + this.cell.buffer + 90)
                                              .attr("id", "goalAxisSVG")
                                              .attr("height", this.cell.height + 10);
        // Set up the group for the axis
        let goalAxisHeaderGroup = goalAxisHeaderSVG.append("g")
                                                   .attr("id", "goalXAxis")
                                                   .attr("transform", "translate(45," + (this.cell.buffer + 5) + ")")
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
        // To access functions that belong to this (scale functions and other properties that belong to this)
        // we use that to represent this
        let that = this;

        //Create table rows
        // console.log("Create table rows");
        let table = d3.select("#matchTable"); // select the table id
        let tableRows = table.select("tbody") // select the table body
                             .selectAll("tr") // select all the table rows
                             .data(that.tableElements) // bind the data to all the tr elements
                             .join("tr")
                             .attr("id", d => d.key); // enter exit update

        //Append th elements for the Team Names
        console.log("Append the th elements for the Team Names");
        let tableHeaderElements= tableRows.selectAll("th")
                                          .data(d => [d]) // return array of size one for the column
                                          .join("th"); // bind th to each data element returned

        // Add the name of the countries
        // there are two kinds of countries => Aggregate Countries and Game Countries which represent the two different kinds of rows
        // update the row names according to the type of row
        tableHeaderElements.attr("class", function(d){
            if (d.value.type === "aggregate")
            {
                return "aggregate";
            }
            else
            {
                return "games";
            }
        })
        tableHeaderElements.html(function(d){
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

        // For debugging purposes
        let goalDataObjectList = [];
        let roundResultDataObjectList = [];
        let winsDataObjectList = [];
        let lossesDataObjectList = [];
        let totalGamesDataObjectList = [];
        let gamesDataObjectList = [];

        let tdElements = tableRows.selectAll("td")
                                  .data(function(d){
                                      // since each data category is unique, we can think of them as specific data types
                                      // data returns an array where each element in that array is bound to a td
                                      
                                      // update the gamesDataObjectList
                                      gamesDataObjectList.push(d.value.games);

                                      // goals Column
                                      let goalsData = {};
                                      // stores the goals made, conceded and delta
                                      let goalsDataProperties = {};
                                      goalsDataProperties["Goals Made"] = d.value["Goals Made"];
                                      goalsDataProperties["Goals Conceded"] = d.value["Goals Conceded"];
                                      goalsDataProperties["Delta Goals"] = d.value["Delta Goals"];
                                      goalsData["type"] = d.value.type;
                                      goalsData["vis"] = "goals";
                                      goalsData["value"] = goalsDataProperties;

                                      // Round Result Column
                                      let roundResultData = {};
                                      roundResultData["type"] = d.value.type;
                                      roundResultData["vis"] = "text";
                                      roundResultData["value"] = d.value.Result.label;

                                      // Wins Column
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

                                      // Losses Column
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

                                      // Total Games Column
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

        // Add an id to all the elements
        tdElements.attr("id", d => d.vis);
    
        // console.log("games List data", gamesDataObjectList);
        // console.log("goal column data", goalDataObjectList);
        // console.log("Round result column data", roundResultDataObjectList);
        // console.log("Wins column data", winsDataObjectList);
        // console.log("Losses column data", lossesDataObjectList);
        // console.log("totalGames column data", totalGamesDataObjectList);

        console.log("Make some epic SVG plots!");

        // Bar charts
        console.log("setting up the bar charts for wins, losses and total games");
        // select all elements whose vis value is bars
        let barCharts = tdElements.filter((d) =>{
            return d.vis === "bars";
        })
        // bind svg elements to the td elements selected by the bar charts
        barCharts.selectAll("svg")
                 .data(d => [d])
                 .join("svg");

        // modify the SVG width and height       
        let barSVG = barCharts.selectAll("svg");
        barSVG.attr("width", that.cell.width)
              .attr("height", that.cell.height)
              .attr("id", "barChartsSVG");
        
        // Append rectangles to the svg
        let barRectangles = barSVG.append("rect");

        // Set up the width, height and fill of the rectangles
        barRectangles.attr("width", d => that.gameScale(d.value))
                     .attr("height", that.bar.height)
                     .attr("fill", d => that.aggregateColorScale(Math.abs(d.value)));

        // Append the text for the bars to the SVG
        // We can't set the text in a  rectangle so we we append the text to the svg
        let barText = barSVG.append("text");

        // Set the x, y, text and class
        barText.attr("x", d => that.gameScale(d.value) - 10)
               .attr("y", that.cell.height / 2 + 6)
               .text(d => d.value)
               .classed("label", true);

        // Goal Charts
        console.log("setting up the goal charts for the teams");
        // select all elements whose vis value is goals
        let goalCharts = tdElements.filter((d) =>{
            return d.vis === "goals";
        })

        // bind svg elements to the td elements selected by goal charts
        let goalChartsSVG = goalCharts.selectAll("svg")
                                      .data(d => [d])
                                      .join("svg");
        
        // Set up the width and height of the svg
        // these values should match the goal axis svg values because we will use that for analysis
        goalChartsSVG.attr("width", 2 * that.cell.width + this.cell.buffer + 90)
                     .attr("height", that.cell.height + 10)
                     .attr("id", "goalChartsSVG");
        
        // Append a group to the svg to match the transformation of the bar axis
        let goalChartsGroup = goalChartsSVG.append("g");

        // Set up the transform of the group and other attributes
        goalChartsGroup.attr("transform", "translate(45," + 5 + ")")
                       .attr("id", "goalChartsGroupTransform");
        
        // Append rectangles to the Group
        let goalChartsRectangles = goalChartsGroup.append("rect");

        // Set up the x, y, width and height values for the rectangles
        goalChartsRectangles.attr("x", function(d){
            // console.log("the value of d is", d);
            let startValueList = [d.value[that.goalsMadeHeader], d.value[that.goalsConcededHeader]];
            // console.log("the values in start value list are", startValueList);
            let startValue = d3.min(startValueList);
            // console.log("the value of start value is", startValue)
            return that.goalScale(startValue);
        })
         .attr("y", 8)
         .attr("width", function(d){
             console.log("original value of delta goals", d.value["Delta Goals"]);
             console.log("absolute value of delta goals", Math.abs(d.value["Delta Goals"]));
             console.log("the result of applying the goalScale to the width", that.goalScale(Math.abs(d.value["Delta Goals"])));
             return that.goalScale(Math.abs(d.value["Delta Goals"]));
         })
        //  .attr("width", d => that.goalScale(Math.abs(d.value["Delta Goals"])))
         .attr("height", that.cell.height - 14);
        
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
