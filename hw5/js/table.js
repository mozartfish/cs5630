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

        /** Store all the column header values for use in sorting*/
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

        /** Boolean for determining whether a particular column is sorted */
        this.isSorted = false;

        /**Counters for determining whether we should sort in ascending or descending order
        */
         this.TeamCounter = 0;
         this.DeltaGoalsCounter = 0;
         this.ResultCounter = 0;
         this.WinsCounter = 0;
         this.LossesCounter = 0;
         this.TotalGamesCounter = 0;
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {
        // Print the team data
        console.log("The team data", this.teamData);
        // ******* TODO: PART II *******

        // Set that equal to this to use the anonymous functions that belong to the cell object
        let that = this;

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
            let minValue = d3.min(dataList);
            return minValue;
        }

        // View the data
        // console.log("The team data", this.teamData);

        //Update Scale Domains
        // console.log("Update Scale Domain and Range");

        // Update Goal Scale Domain and Range
        // console.log("Updating the Goal Scale Domain and Range");
        let goalsMadeMax = findMax(this.teamData, this.goalsMadeHeader);
        let goalsConcededMax = findMax(this.teamData, this.goalsConcededHeader);
        let goalValuesList = [goalsMadeMax, goalsConcededMax];
        let goalScaleDomainMax = d3.max(goalValuesList);
        //console.log("The deltaGoals Min value is", deltaGoalsDomainMin);
        // console.log("Goals Made MAX = ", goalsMadeMax);
        // console.log("Goals Conceded MAX = ", goalsConcededMax);
        this.goalScale = d3.scaleLinear()
                           .domain([0, goalScaleDomainMax])
                           .range([0, 2 * this.cell.width + 20])
                           .nice();

        // Update Game Scale Domain and Range
        // console.log("Updating the Game Scale Domain and Range");
        let totalGamesDomainMax = findMax(this.teamData, "TotalGames");
        // console.log("TotalGames MAX = ", totalGamesMax);
        this.gameScale = d3.scaleLinear()
                           .domain([0, totalGamesDomainMax])
                           .range([0, this.cell.width])
                           .nice();

        // Update the Aggregate Color Scale Domain and Range
        // console.log("Updating the aggregate color scale domain and range");
        // Aggregate in this data refers to how the teams did overall across all their matches
        // 
        // so we use the total games for scaling the aggregate
        this.aggregateColorScale = d3.scaleLinear()
                                     .domain([0, totalGamesDomainMax])
                                     .range(['#feebe2', '#690000']);
        
        // Update the Goal Color Scale Domain and Range
        // console.log("Updating the goal color scale domain and range");
        // We use the delta goals to encode the difference between goals made and goals conceded
        // color choice was to find the smallest value for the min delta and the largest value for the max delta
        let deltaGoalsDomainMin = findMin(this.teamData, "Delta Goals");
        let deltaGoalsDomainMax = findMax(this.teamData, "Delta Goals");
        this.goalColorScale = d3.scaleLinear()
                                .domain([deltaGoalsDomainMin, deltaGoalsDomainMax])
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
        // console.log("setting up the sorting");
        // console.log("The value of isSorted is ", this.isSorted);

        // Articles on selecting nested elements using d3 and sorting elements using d3
        // https://bost.ocks.org/mike/nest/
        // https://observablehq.com/@d3/d3-ascending

        let matchTableHeaders = d3.selectAll("thead td")
                                  .data(this.tableHeaders);

        matchTableHeaders.on("click", function(d){
            console.log("clicked the ", d, " header");
            that.sortTableHeaders(d);
        })
        // Clicking on headers should also trigger collapseList() and updateTable().


        //Set sorting callback for clicking on Team header
        //Clicking on headers should also trigger collapseList() and updateTable().
        let matchTableTeamHeader = d3.selectAll("thead th")
                                      .data(["Team"]);

        matchTableTeamHeader.on("click", function(d){
            console.log("clicked the ", d, " header!");
            that.sortTeamHeaders();
        })
    }

    sortTableHeaders(tableHeaderName)
    {
        // define that so we can access functions that have this on the front
        let that = this;

        if (tableHeaderName === "Delta Goals")
        {
            if (this.DeltaGoalsCounter === 0)
            {
                console.log("sort goals in ascending order");
                this.tableElements.sort((a, b) => d3.ascending(a.value["Delta Goals"], b.value["Delta Goals"]));
                this.DeltaGoalsCounter = 1;
            }
            else
            {
                console.log("sort goals in descending order");
                this.tableElements.sort((a, b) => d3.descending(a.value["Delta Goals"], b.value["Delta Goals"]));
                this.DeltaGoalsCounter = 0;
            }
        }
        else if (tableHeaderName === "Result")
        {
            if (this.ResultCounter === 0)
            {
                console.log("sort results in ascending order");
                this.tableElements.sort((a, b) => d3.ascending(a.value["Result"].ranking, b.value["Result"].ranking));
                this.ResultCounter = 1;
            }
            else
            {
                console.log("sort results in descending order");
                this.tableElements.sort((a, b) => d3.descending(a.value["Result"].ranking, b.value["Result"].ranking));
                this.ResultCounter = 0;
            }
        }
        else if (tableHeaderName === "Wins")
        {
            if (this.WinsCounter === 0)
            {
                console.log("sort wins in ascending order");
                this.tableElements.sort((a, b) => d3.ascending(a.value["Wins"], b.value["Wins"]));
                this.WinsCounter = 1;
            }
            else
            {
                console.log("sort wins in descending order");
                this.tableElements.sort((a, b) => (d3.descending(a.value["Wins"], b.value["Wins"])));
                this.WinsCounter = 0;
            }
        }
        else if (tableHeaderName === "Losses")
        {
            if (this.LossesCounter === 0)
            {
                console.log("sort losses in ascending order");
                this.tableElements.sort((a, b) => d3.ascending(a.value["Losses"], b.value["Losses"]));
                this.LossesCounter = 1;
            }
            else
            {
                console.log("sort losses in descending order");
                this.tableElements.sort((a, b) => (d3.descending(a.value["Losses"], b.value["Losses"])));
                this.LossesCounter = 0;
            }
        }
        else
        {
            if (this.totalGamesCounter === 0)
            {
                console.log("sorting total games in ascending order");
                this.tableElements.sort((a, b) => d3.ascending(a.value["TotalGames"], b.value["TotalGames"]));
                this.totalGamesCounter = 1;
            }
            else
            {
                console.log("sort total games in descending order");
                this.tableElements.sort((a, b) => (d3.descending(a.value["TotalGames"], b.value["TotalGames"])));
                this.totalGamesCounter = 0;
            }
        }

        that.updateTable();
    }

    /**
     * Function that sorts the team names
     * @param {} data 
     */
    sortTeamHeaders()
    {
        // define that so we can access functions that have this on the front
        let that = this;

        console.log("entered the sort team headers function");

        // check if we need to sort in ascending or descending order
        if (this.teamCounter === 0)
        {
            console.log("sort team names in ascending order");

            this.tableElements.sort((a, b) => d3.ascending(a.key, b.key));
            this.teamCounter = 1;
        }
     
        else
        {
            console.log("sort team names in descending order");

            this.tableElements.sort((a, b) => d3.descending(a.key, b.key));
            this.teamCounter = 0;
        }

        that.updateTable();
    }
    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        // define that so we can access functions and variables that have this on the front
        let that = this;

        //Create table rows
        // console.log("Create table rows");
        let table = d3.select("#matchTable"); // select the table id
        let tableRows = table.select("tbody") // select the table body
                             .selectAll("tr") // select all the table rows
                             .data(that.tableElements) // bind the data to all the tr elements
                             .join("tr") // enter exit update
                             .attr("id", d => d.key);
        
        // Apply an event listener for the rows for highlighting the links in the tree
        console.log("Applying the event listener for the tree");
        tableRows.on("mouseover", d => that.tree.updateTree(d));
        tableRows.on("mouseout", d => that.tree.clearTree());

        //Append th elements for the Team Names
        // console.log("Append the th elements for the Team Names");
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
                return "game";
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
        // console.log("Append td elements for the remaining columns");

        // For debugging purposes
        let goalDataObjectList = [];
        let roundResultDataObjectList = [];
        let winsDataObjectList = [];
        let lossesDataObjectList = [];
        let totalGamesDataObjectList = [];
        let gamesDataObjectList = [];

        let tdElements = tableRows.selectAll("td")
                                  .data(function(d){
                                      // since each data category is unique, we can think of them as different kinds of objects
                                      // data returns an array where each element in that array is bound to a td where each td corresponds
                                      // to a specific kind of object related to a specific kind of column in the table
                                      
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
                                 .join("td")
                                 .attr("id", d => d.vis); // id for identifying the type of visualization

    
        // console.log("games List data", gamesDataObjectList);
        // console.log("goal column data", goalDataObjectList);
        // console.log("Round result column data", roundResultDataObjectList);
        // console.log("Wins column data", winsDataObjectList);
        // console.log("Losses column data", lossesDataObjectList);
        // console.log("totalGames column data", totalGamesDataObjectList);

        console.log("Make some epic SVG plots!");

        // Bar charts
        // console.log("setting up the bar charts for wins, losses and total games");
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
              .attr("height", that.cell.height);
        
        // Append rectangles to the svg
        let barRectangles = barSVG.selectAll("rect")
                                   .data(d => [d])
                                   .join("rect");

        // Set up the width, height and fill of the rectangles
        barRectangles.attr("width", d => that.gameScale(d.value))
                     .attr("height", that.bar.height)
                     .attr("fill", d => that.aggregateColorScale(Math.abs(d.value)));

        // Append the text for the bars to the SVG
        // We can't set the text in a  rectangle so we we append the text to the svg
        let barText = barSVG.selectAll("text")
                            .data(d => [d])
                            .join("text");

        // Set the x, y, text and class
        barText.attr("x", d => that.gameScale(d.value) - 10)
               .attr("y", that.cell.height / 2 + 6)
               .text(d => d.value)
               .classed("label", true);

        // Goal Charts
        // console.log("setting up the goal charts for the teams");
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
                     .attr("height", that.cell.height + 10);
        
        // Append a group to the svg to match the transformation of the bar axis
        let goalChartsGroup = goalChartsSVG.selectAll("g")
                                           .data(d => [d])
                                           .join("g");

        // Set up the transform of the group and other attributes
        goalChartsGroup.attr("transform", "translate(45," + 5 + ")");
        
        // Append rectangles to the Group
        let goalChartsRectangles = goalChartsGroup.selectAll("rect")
                                                  .data(d => [d])
                                                  .join("rect");

        // Set up the x, y, width and height values for the rectangles
        goalChartsRectangles.attr("x", function(d){
            // console.log("the value of d is", d);
            // startValues determines where we should start drawing the rectangles according to the goal information
            let startValueList = [d.value[that.goalsMadeHeader], d.value[that.goalsConcededHeader]];
            // console.log("the values in start value list are", startValueList);
            let startValue = d3.min(startValueList);
            // console.log("the value of start value is", startValue)
            return that.goalScale(startValue);
        })
         .attr("y", 8)
         .attr("width", d => that.goalScale(Math.abs(d.value["Delta Goals"])))
         .attr("height", that.cell.height - 10)
         .attr("fill", d => that.goalColorScale(d.value["Delta Goals"]))
         .classed("goalBar", true);
         
        // Goal Chart Circles
        // console.log("drawing the circles for the goal charts");

        // Append the circles to the goal charts group
        let goalChartsCircles = goalChartsGroup.selectAll("circle")
                                               .data(function(d){
                                                   // console.log("the data is", d);
                                                   let goalsMadeCircle = {};
                                                   goalsMadeCircle["name"] = "goalsMade";
                                                   goalsMadeCircle["value"] = d.value["Goals Made"];
                                                   goalsMadeCircle["delta"] = d.value["Delta Goals"];
                                                   let goalsConcededCircle = {};
                                                   goalsConcededCircle["name"] = "goalsConceded";
                                                   goalsConcededCircle["value"] = d.value["Goals Conceded"];
                                                   goalsConcededCircle["delta"] = d.value["Delta Goals"];
                                                   // console.log("the circles are", [goalsMadeCircle, goalsConcededCircle]);
                                                   return[goalsMadeCircle, goalsConcededCircle];
                                                   // return[1, 2]; // the number of circles created is depenedent on the number of data points
                                                                    // append won't work like earlier, so best solution is to make everything enter, exit, update
                                               })
                                               .join("circle")
                                               .attr("id", d => d.name)
                                               .classed("goalCircle", true); // id for identifying the type of circle

        // Set up the circle cx, cy, radius, and fill values and the 
        // for reference for determining the values for setting the cx, cy, and radius values
        // console.log("cell height", that.cell.height);
        // console.log("bar height", that.bar.height);
        goalChartsCircles.attr("cx", d => that.goalScale(d.value))
                         .attr("cy", (that.cell.height + 6) / 2)
                         .attr("fill", function(d){
                             // color matches with delta goals = 0 grey
                             if (d.delta === 0)
                             {
                                 return "#b1b1b1";
                             }
                             else if (d.name === "goalsMade")
                             {
                                return "#364e74";
                             }
                             else
                             {
                                 return "#be2714";
                             }
                         });

        // Apply the tool tip to the cells for goals made and goals conceded
        // console.log("Applying the tool tip");
        goalCharts.attr("title", function(d){
            return "Goals Made: " + d.value["Goals Made"] + "\n" + "Goals Conceded: " + d.value["Goals Conceded"];
        });

        // Rounds / Result 
        // console.log("Setting up the text for the rounds / result for the teams");
        let roundResultText = tdElements.filter((d) =>{
            return d.vis === "text";
        })

        // bind text elements to the td elements selected by roundResultText
        roundResultText.selectAll("text")
                       .data(d => [d])
                       .join("text");
        
        // Set the text value, width, and height
        roundResultText.attr("width", that.cell.width)
                       .attr("height", that.cell.height)
                       .text(d => d.value);

        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'vis' :<'bar', 'goals', or 'text'>, 'value':<[array of 1 or two elements]>}
        // The order is as follows: Team -> Text, Goals -> Goals, Round / Result -> Text, Wins -> Bar, Loss -> Bar, Total Games -> Bar                  
        
        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     * i refers to the index of a data element
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
