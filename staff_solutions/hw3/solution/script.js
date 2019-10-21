/**
 *  Part I
 */
document.querySelector("#dataset").addEventListener("change", changeData);
document.querySelector("#random").addEventListener("change", changeData);

window.onload = changeData;
/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  // ****** TODO: PART II ******
  let barchart = document.querySelector("#aBarChart");
  let children = barchart.querySelectorAll("rect");
  children = Array.from(children);
  children.sort((a, b) => {
    return a.attributes.width.nodeValue - b.attributes.width.nodeValue;
  });
  children.forEach((c, i) => {
    c.attributes.transform.value = `translate(18, ${i * 20}) scale(-1,1)`;
    barchart.appendChild(c);
    addMouseHoverEvent(c);
  });
}

/**
 * Render the visualizations
 * @param data
 */
function update(data) {
  /**
   * D3 loads all CSV data as strings. While Javascript is pretty smart
   * about interpreting strings as numbers when you do things like
   * multiplication, it will still treat them as strings where it makes
   * sense (e.g. adding strings will concatenate them, not add the values
   * together, or comparing strings will do string comparison, not numeric
   * comparison).
   *
   * We need to explicitly convert values to numbers so that comparisons work
   * when we call d3.max()
   **/

  for (let d of data) {
    d.a = +d.a; //unary operator converts string to number
    d.b = +d.b; //unary operator converts string to number
  }

  // ****** TODO: PART III (you will also edit in PART V) ******

  let aScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.a)])
    .range([0, 200]);

  let bScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.b)])
    .range([200, 0]);

  //console.log(d3.max(data, d => d.b));

  // TODO: Select and update the 'a' bar chart bars
  let aBarChart = d3.select("#aBarChart");
  updateBarChart(aBarChart, data.map(d => d.a), aScale);

  // TODO: Select and update the 'b' bar chart bars
  let bBarChart = d3.select("#bBarChart");
  updateBarChart(bBarChart, data.map(d => d.b), bScale, true);

  // TODO: Select and update the 'a' line chart path using this line generator
  let aLineGenerator = d3
    .line()
    .x((d, i) => i)
    .y(d => d.a);
  let aLineChart = d3.select("#aLineChart");
  updateLineOrAreaChart(aLineChart, data, aLineGenerator, true);

  // TODO: Select and update the 'b' line chart path (create your own generator)
  let bLineChart = d3.select("#bLineChart");
  let bLineGenerator = d3
    .line()
    .x((d, i) => i)
    .y(d => d.b);
  updateLineOrAreaChart(bLineChart, data, bLineGenerator, true);

  // TODO: Select and update the 'a' area chart path using this area generator
  let aAreaGenerator = d3
    .area()
    .x((d, i) => i)
    .y0(0)
    .y1(d => d.a);

  let aAreaChart = d3.select("#aAreaChart");
  updateLineOrAreaChart(aAreaChart, data, aAreaGenerator);
  // TODO: Select and update the 'b' area chart path (create your own generator)
  let bAreaGenerator = d3
    .area()
    .x((d, i) => i)
    .y0(0)
    .y1(d => d.b);

  let bAreaChart = d3.select("#bAreaChart");
  updateLineOrAreaChart(bAreaChart, data, bAreaGenerator);
  // TODO: Select and update the scatterplot points

  let scatterPlot = d3.select("#scatterplot");
  updateScatterPlot(scatterPlot, data, aScale, bScale);

  let axisBottom = d3.axisBottom(aScale);
  d3.select("#x-axis").call(axisBottom);

  let axisLeft = d3.axisLeft(bScale);
  d3.select("#y-axis").call(axisLeft);
  //console.log(d3.select(".line-chart").node());
  //console.log(d3.select("#regression-line"));
  d3.select("#regression-line")
    .style("stroke-width", 1)
    .attr("x1", aScale(2))
    .attr("x2", aScale(16))
    .attr("y1", bScale(4))
    .attr("y2", bScale(11));
  // ****** TODO: PART IV ******
}

function updateBarChart(root, data, scale, right) {
  let rects = root.selectAll("rect").data(data);
  rects
    .join("rect")
    .attr("height", 18)
    .transition()
    .duration(1000)
    .style("opacity", 1)
    .attr("width", d => (right ? 300 - scale(d) : scale(d)))
    .attr("transform", (d, i) =>
      right ? `translate(0, ${i * 20})` : `translate(18, ${i * 20}) scale(-1,1)`
    );

  let bars = document.querySelectorAll("g.barChart > rect");
  bars.forEach(b => {
    addMouseHoverEvent(b);
  });
}

function addMouseHoverEvent(b) {
  b.addEventListener("mouseover", d => {
    b.className.baseVal = "hovered";
  });
  b.addEventListener("mouseout", d => {
    b.className.baseVal = b.className.baseVal.replace("hovered", "");
  });
}

function updateLineOrAreaChart(root, data, lineGen, isLine = false) {
  if (isLine) {
    root.datum(data).attr("d", lineGen);
    let totalLength = root.node().getTotalLength();
    root
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0);
  } else {
    root
      .datum(data)
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .attr("d", lineGen);
  }
}

function updateScatterPlot(root, data, xScale, yScale) {
  let circles = root.selectAll("circle").data(data);
  circles
    .join("circle")
    .transition()
    .duration(500)
    .style("opacity", 1)
    .attr("r", 5)
    .attr("cx", d => xScale(d.a))
    .attr("cy", d => yScale(d.b));

  circles
    .on("click", d => {
      console.log(`X: ${d.a.toFixed(2)}, Y:${d.b.toFixed(2)}`);
    })
    .html("")
    .append("title")
    .text(d => {
      return `Coordinates + Data: X = ${d.a.toFixed(2)}, Y = ${d.b.toFixed(2)}`;
    });
}

/**
 * Update the data according to document settings
 */
async function changeData() {
  //  Load the file indicated by the select menu
  let dataFile = document.getElementById("dataset").value;
  try {
    const data = await d3.csv("data/" + dataFile + ".csv");
    if (document.getElementById("random").checked) {
      // if random
      update(randomSubset(data)); // update w/ random subset of data
    } else {
      // else
      update(data); // update w/ full data
    }
  } catch (error) {
    console.log(error);
    alert("Could not load the dataset!");
  }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
  return data.filter(d => Math.random() > 0.5);
}
