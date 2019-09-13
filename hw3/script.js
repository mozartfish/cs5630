/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  // ****** TODO: PART II ******

  // list thatn contains the child nodes of the left bar chart
  let aBarList = document.getElementById("aBarChart").childNodes;

  // list that stores the widths of the bars
  let barChartWidthList = [];

  // collect all the widths associated with the left bar chart
  for (var i = 0; i < aBarList.length; i++)
  {
    let node = aBarList[i];
    if (node.localName === "rect")
    {
      let barWidth = node.getAttribute("width");
      barChartWidthList.push(barWidth);
    }
  }

  // sort the bar chart widths
  barChartWidthList.sort(function(a, b){return a - b;});

  // update the bar chart widths
  var counter = 0;
  for (var j = 0; j < aBarList.length; j++)
  {
    let node = aBarList[j];
    if (node.localName === "rect")
    {
      node.setAttribute("width", barChartWidthList[counter]);
      counter++;
    }
  }
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

  console.log(data);
  // Set up the scales
  // TODO: The scales below are examples, modify the ranges and domains to suit your implementation.
  
  // x scales
  let aScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.a)])
    .range([0, 140]);

    // y values scale
  let bScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.b)])
    .range([0, 140]);
  
    let bYScale= d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.b)])
    .range([140, 10]);

  // maps indexes to a certain value
  let iScale = d3
    .scaleLinear()
    .domain([12.0, 132.0])
    .range([100, 280]);

  // ****** TODO: PART III (you will also edit in PART V) ******

  // TODO: Select and update the 'a' bar chart bars
  
  // Prepare bar charts for modification based on data set
  // Select the left bar chart
  let leftBarChart = d3.select("#aBarChart");
  let leftBars = leftBarChart.selectAll("rect").data(data); // Update
  let leftBarsEnter = leftBars.enter().append("rect"); // Enter
  leftBars.exit().remove() // Exit
  leftBars = leftBarsEnter.merge(leftBars); // Merge

  // Modify Left Bar Attributes
  leftBars.attr("x", 0)
          .attr("y", (d, i) => i * 5)
          .attr("width", (d) => d.a)
          .attr("height", 3.0);

  // TODO: Select and update the 'b' bar chart bars
  // Prepare the bar charts for modification based on the data set
  let rightBarChart = d3.select("#bBarChart");
  let rightBars = rightBarChart.selectAll("rect").data(data); // Update
  let rightBarsEnter = rightBars.enter().append("rect"); // Enter
  rightBars.exit().remove() // Exit
  rightBars = rightBarsEnter.merge(rightBars); // Merge

  // Modify Right Bar Attributes
  rightBars.attr("x", 0)
           .attr("y", (d, i) => i * 5)
           .attr("width", (d) => d.b)
           .attr("height", 3.0)
           .attr("transform", "scale(20,5)");

  
                       

  // TODO: Select and update the 'a' line chart path using this line generator

  let aLineGenerator = d3
    .line()
    .x((d, i) => iScale(i))
    .y(d => aScale(d.a));

  let aLineChart = d3.select("#aLineChart");
  let updatedALineChart = aLineChart.attr("d", aLineGenerator(data))
                                   .attr("stroke-width", 1.0);

  // TODO: Select and update the 'b' line chart path (create your own generator)
  let bLineGenerator = d3
    .line()
    .x((d, i) => iScale(i))
    .y(d => bScale(d.b));

  let bLineChart = d3.select("#bLineChart");
  let updatedBLineChart = bLineChart.attr("d", bLineGenerator(data))
                                    .attr("stroke-width", 1.0);


  // TODO: Select and update the 'a' area chart path using this area generator
  let aAreaGenerator = d3
    .area()
    .x((d, i) => iScale(i))
    .y0(0)
    .y1(d => aScale(d.a));

  let aAreaChart = d3.select("#aAreaChart");
  let updateAAreaChart = aAreaChart.attr("d", aAreaGenerator(data));

  // TODO: Select and update the 'b' area chart path (create your own generator)
  let bAreaGenerator = d3
     .area()
     .x((d, i) => iScale(i))
     .y0(0)
     .y1(d => bScale(d.b));

  let bAreaChart = d3.select("#bAreaChart");
  let updateBAreaChart = bAreaChart.attr("d", bAreaGenerator(data));

  // TODO: Select and update the scatterplot points
  // Prepare the scatter plot axis
  let scatterplotXAxis = d3.select(".scatter-plot");
  let xAxis = d3.axisBottom();
  xAxis.scale(aScale);
  scatterplotXAxis.append("g")
                  .attr("transform", "translate(20,216) scale(1.3,1.2)")
                  .call(xAxis);

  let scatterplotYAxis = d3.select(".scatter-plot");
  let yAxis = d3.axisLeft();
  yAxis.scale(bYScale);
  scatterplotYAxis.append("g")
                  .attr("transform", "translate(20, 35) scale(1.05, 1.3)")
                  .call(yAxis);
  
  
  // Plot and update the points
  let circle = d3.select("#scatterplot");
  let circles = circle.selectAll("circle").data(data); // Update
  let circlesEnter = circles.enter().append("circle"); // Enter
  circles.exit().remove() // Exit
  circles = circlesEnter.merge(circles); // Merge


  circles.attr("cx", d => aScale(d.a))
         .attr("cy", d => -1 * bScale(d.b))
         .attr("r", 2.5)
         .on("click", function (d, i) { // D3 event for obtaining the coordinates of a data point when it is clicked
           console.log("X Coord: "+ d.a + " " + "Y Coord: " + d.b);
         });
  
  let regressionLine = d3.select("regression-line");
  regressionLine.attr("stroke-width", 1.5);


  // ****** TODO: PART IV ******

  // Mouse Events for Bar Chart
  let leftBarCharts = document.getElementById("aBarChart");
  let rightBarCharts = document.getElementById("bBarChart");

leftBarCharts.addEventListener("mouseover", function(event) {
  event.target.style.fill = "green";
  setTimeout(function() {
    event.target.style.fill = "";
  }, 800);
}, false);

  rightBarCharts.addEventListener("mouseover", function (event){
    event.target.style.fill = "turquoise";
    setTimeout(function() {
      event.target.style.fill = "";
    }, 800);
  }, false);
}

/**
 * Update the data according to document settings
 */
async function changeData() {
  //  Load the file indicated by the select menu
  //console.log("changeData has been called");
  let dataFile = document.getElementById("dataset").value;
  //console.log(dataFile);
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
