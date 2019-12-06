/**
 * Part 1. Load your data here. We recommend using
 * d3.json or d3.csv
 */

d3.json("data/words2.json").then(data => {
  // d3.csv('data/words.csv').then((data)=> {

  //USING D3.GROUPS TO GROUP DATA BY CATEGORY
  let groupData = d3.groups(data, d => d.category);
  //SORT BY LENGTH OF GROUP?

  let groupKeys = groupData.map((g, i) => {
    return { key: g[0], pos: i };
  });

  textBox();

  let wrapperDiv = d3
    .select("body")
    .append("div")
    .attr("id", "wrapper");

    let toolBar = wrapperDiv
    .append("div")
    .classed("toolbar", true);


  wrapperDiv
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  let chartDiv = wrapperDiv.append("div").attr("id", "bubble-chart");
  let tableDiv = wrapperDiv.append("div").attr("id", "table");
  
  let toggle = renderToggle(toolBar, "Grouped by Topic");
  toggle.attr("id", "separate");
  let table = new WordTable(tableDiv, groupKeys);

  function updateTable(selectedPoints) {
    table.updateTable(data, selectedPoints);
  }

  let bubbleChart = new BubbleChart(chartDiv, data, groupKeys, updateTable);

  table.updateTable(data);

  toggle.on("click", () => {
    bubbleChart.updateBubbleChart(toggle.node().checked);
  });
});

/**
 * Returns html that can be used to render the tooltip.
 * @param data
 * @returns {string}
 */
function tooltipRender(data) {
  //ADD FORMATTING TO THE PERCENTAGES TO AVOID LARGE DECIMAL VALUES
  let f = d3.format(".3f");

  let position =
    +data.position < 0
      ? `D+ ${Math.abs(f(+data.position))}`
      : `R+ ${f(+data.position)}`;
  let phrase = data.phrase.charAt(0).toUpperCase() + data.phrase.slice(1);
  let text = `<h3>${phrase}</h3> <h5>${position}%</h5> <h5> In ${Math.round(
    (data.total / 50) * 100
  )}% of speeches</h5>`;
  return text;
}
