function infoPanel() {
  let boldText = `At the beginning of the year,`;
  let text = `each governor lays out their policy priorities in their version of the State of the Union address — a 
  “state of the state” address. The team at 538 conducted a text analysis of all 50 governors’ 2019 state 
    of the state speeches to see what issues were talked about the most and whether there were differences 
    between what Democratic and Republican governors were focusing on. `;

  let infoDiv = d3.select("#header-wrap").append("div");
  infoDiv
    .style("opacity", 0)
    .classed("infoDiv", true)
    .transition()
    .delay(700)
    .style("opacity", 1);

  infoDiv
    .append("span")
    .append("text")
    .attr("opacity", 0)
    .text(boldText)
  infoDiv.append("text").text(text);
}
