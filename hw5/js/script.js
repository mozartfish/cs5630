    /**
     * Loads in the table information from fifa-matches-2018.json
     */
// d3.json('data/fifa-matches-2018.json').then( data => {

//     /**
//      * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
//      *
//      */
//     d3.csv("data/fifa-tree-2018.csv").then(csvData => {

//         //Create a unique "id" field for each game
//         csvData.forEach( (d, i) => {
//             d.id = d.Team + d.Opponent + i;
//         });

//         //Create Tree Object
//         let tree = new Tree();
//         tree.createTree(csvData);

//         //Create Table Object and pass in reference to tree object (for hover linking)

//         let table = new Table(data,tree);

//         table.createTable();
//         table.updateTable();
//     });
// });



// // ********************** HACKER VERSION ***************************
/**
 * Loads in fifa-matches-2018.csv file, aggregates the data into the correct format,
 * then calls the appropriate functions to create and populate the table.
 *
 */


d3.csv("data/fifa-matches-2018.csv").then( matchesCSV => {
     // CONSTANTS FOR ACCESSING DATA FROM OBJECTS
     const GOALS_MADE = 'Goals Made';
     const GOALS_CONCEDED = 'Goals Conceded';
     const DELTA_GOALS = 'Delta Goals';
     const WINS = 'Wins';
     const LOSSES = 'Losses';
     const OPPONENT = 'Opponent';
    // An object for assign the ranking and the label for data objects
     let ranking = {
         "Group": 0,
         "Round 16" : 1,
         "Quarter Final" : 2,
         "Semi Finals" : 3,
         "Fourth Place" : 4,
         "Third Place" : 5,
         "Runner-Up" : 6,
         "Winner" : 7,
     }
     //console.log(ranking);
    let teamData = d3.nest()
                     .key(d => {
                         return d.Team;
                     })
                     .rollup(leaves => {
                          
                        let goalsMade = d3.sum(leaves, p => p[GOALS_MADE]);
                        let goalsConceded = d3.sum(leaves, p => p[GOALS_CONCEDED]);
                        let deltaGoals = d3.sum(leaves, p => p[DELTA_GOALS]);
                        let matchWins = d3.sum(leaves, p => p.Wins);
                        let matchLosses = d3.sum(leaves, p => p.Losses);

                        //  let retObj = {};
                        //  retObj['Wins'] = matchWins;
                        //  retObj['Losses'] = matchLosses;
                        //  retObj['Result'] = {'label': leaves};
                        //  return retObj;

                        // CREATE OBJECT FOR STORING MATCH INFORMATION
                        let dataObj = {};
                        dataObj[GOALS_MADE] = goalsMade;
                        dataObj[GOALS_CONCEDED] = goalsConceded;
                        dataObj[DELTA_GOALS] = deltaGoals;
                        dataObj[WINS] = matchWins;
                        dataObj[LOSSES] = matchLosses;


                        return dataObj;

                     })
                     .entries(matchesCSV);

    console.log(teamData);

    /**
     * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
     *
     */
//    d3.csv("data/fifa-tree-2018.csv").then( treeCSV => {

//     // ******* TODO: PART I *******


//       });

});
// ********************** END HACKER VERSION ***************************
