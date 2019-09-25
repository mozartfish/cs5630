d3.csv("data/fifa-matches-2018.csv").then( matchesCSV => {
    teamData = d3.nest()
    .key(d =>{
        return d.Team;
    })
    .rollup( leaves =>{
        return d3.sum(leaves,function(l){return l.Wins}); 
    })
    .entries(allGames);

    console.log(teamData);
});

console.log("hello moto");