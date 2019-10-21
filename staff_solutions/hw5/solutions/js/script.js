    /**
     * Loads in the table information from fifa-matches-2018.json
     */
d3.json('data/fifa-matches-2018.json').then( data => {
    console.log(data);

    /**
     * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
     *
     */
    d3.csv("data/fifa-tree-2018.csv").then( csvData => {

        //Create a unique "id" field for each game
        csvData.forEach( (d, i) => {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(csvData);

        //Create Table Object and pass in reference to tree object (for hover linking)

        let table = new Table(data,tree);

        table.createTable();
        table.updateTable();
    });
});



// // // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches-2018.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
// d3.csv("data/fifa-matches-2018.csv").then( matchesCSV => {
//     //console.log('matchesCSV ', matchesCSV);

// //     /**
// //      * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
// //      *
// //      */
//     d3.csv("data/fifa-tree-2018.csv").then( treeCSV => {

// //     // ******* TODO: PART I *******

// // ========================== CUT ==========================================

//     let goalsMadeHeader = 'Goals Made';
//     let goalsConcededHeader = 'Goals Conceded';

//     /**json Object to convert between rounds/results and ranking value*/
//         rank = {
//             "Winner": 7,
//             "Runner-Up": 6,
//             'Third Place': 5,
//             'Fourth Place': 4,
//             'Semi Finals': 3,
//             'Quarter Finals': 2,
//             'Round of Sixteen': 1,
//             'Group': 0
//         };

//     //Define cols to aggregate values. All cols except 'opponent', 'team', and 'id'
//     let aggregateAttributes = d3.keys(matchesCSV[0]).filter( key => {
//         return key !== "Opponent" && key !== "Team" && key !== "id";
//     });

//     // let teamData = d3.nest()
//     // .key(d =>{
//     //     return d.Team;
//     // })
//     // .rollup( leaves =>{
//     //     return d3.sum(leaves,function(l){return l.Wins}); 
//     // })
//     // .entries(matchesCSV);

//     // console.log(teamData[0]);


//     //Aggregate data by Team.
//     let data = d3.nest()
//         .key( d => {
//             return d.Team;
//         })
//         .rollup( leaves => {
            // let out = {};
            // aggregateAttributes.forEach( attribute => {
            //     if (attribute === 'Result') {
            //         let maxIndex = d3.scan(leaves, (a, b) => {
            //             return rank[b[attribute]] - rank[a[attribute]];
            //         });
            //         out[attribute] = {
            //             'label': leaves[maxIndex][attribute],
            //             'ranking': rank[leaves[maxIndex][attribute]]
            //         };
            //     } else {
            //         out[attribute] = d3.sum(leaves, (d) => {
            //             return d[attribute];
            //         });
            //     }
            // });
            // out.TotalGames = leaves.length;
            // let games = leaves.sort((a, b) => {
            //     return rank[b.Result] - rank[a.Result];
            // });

//             //Iterate through games and create data in the right structure:
            // out.games = games.map(game =>{

            //     let value = {};
            //     // console.log(aggregateAttributes)
            //     //Create empty values stub;
            //     aggregateAttributes.forEach(attribute => {
            //         value[attribute] = '';
            //     });
//                 value.type = 'game'; //keep track that this is a game line.
//                 value[goalsMadeHeader] = game[goalsMadeHeader];
//                 value[goalsConcededHeader] = game[goalsConcededHeader];
//                 value.Opponent = game.Team;
//                 value.Result = {'label': game.Result, 'ranking': rank[game.Result]};

//                 return {'key': game.Opponent, 'value': value};


//             });
//             out.type = 'aggregate'; //keep track that this is an aggregate line.

//             return out;
//         })
//         .entries(matchesCSV);


//         //Create a unique "id" field for each game
//         treeCSV.forEach((d, i) => {
//             d.id = d.Team + d.Opponent + i;
//         });

//         console.log(data);

        // //Create Tree Object
        // let tree = new Tree();
        // tree.createTree(treeCSV);
        // //console.log("treeCSV ", treeCSV);

        // //Create Table Object and pass in reference to tree object (for hover linking)
        // let table = new Table(data,tree);
        // table.createTable();
        // table.updateTable();

// //========================= CUT ============================================================

//         });

// });
// // ********************** END HACKER VERSION ***************************
