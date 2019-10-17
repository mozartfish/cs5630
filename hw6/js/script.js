/**
 * Loads in the information for the visualization from words.json
 */
d3.json("/data/words.json").then(data => {
  //console.log(data);

  let swarmChart = new SWARMCHART(data);
});
