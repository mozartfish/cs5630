/**
 * This script defines the swarm chart and its functionality as specified by the README
 */
/**
 * Class that defines a Chart Object
 */
class Chart {
  /**
   * Constructor a Chart Object
   * @param {*} politicalData - the data used in the project
   * @param {*} table - a reference to the table
   */
  constructor(politicalData, table) {
    /**
     * Instance variable that stores the data
     */
    this.politicalData = politicalData;
    /**
     * Instance variable that stores a reference to the table
     */
    this.table = table;
    /**
     * Object that defines the margins for the chart
     */
    this.margins = { top: 20, right: 30, bottom: 40, left: 30 };
    /**
     * Instance variable for storing the width for visualizing the swarm chart
     */
    this.width = 960 - this.margins.left - this.margins.right;
    /**
     * Instance variable for storing the height for visualizing the chart
     */
    this.height = 500 - this.margins.top - this.margins.bottom;
    /**
     * Scale for the political party axis
     */
    this.politicalScale = null;
    /**
     * Instance variable for indexing into the position property of the data
     */
    this.position = "position";
    /**
     * Instance variable for indexing into the sourceX property of the data
     */
    this.sourceX = "sourceX";
    /**
     * Instance variable for indexing into the sourceY property of the data
     */
    this.sourceY = "sourceY";
    /**
     * Instance variable for indexing into the category property of the data
     */
    this.category = "category";
    /**
     * Scale for coloring the circles based on the category
     */
    this.categoryScale = null;
    /**
     * Instance variable for indexing into the total property of the data
     */
    this.total = "total";
    /**
     * Instance variable for determining whether to open or close the individual data for the categories
     */
    this.toggleCounter = 0;
    /**
     * Instance variable for keeping track of the categories
     */
    this.categoriesList = null;
    /**
     * Instance variable for when the toggle is triggered
     */
    this.toggleSwitch = false;
  }

  /**
   * Function that sets up the chart. Set up includes creating the scales, axis, and the svg for displaying the information.
   */
  createChart() {
    // console.log("Entered the create chart function");
    // console.log("The data is", this.politicalData);

    // Determine the min and max values for the political scale domain
    let politicalScaleMin = this.findMinValue(
      this.politicalData,
      this.position
    );
    let politicalScaleMax = this.findMaxValue(
      this.politicalData,
      this.position
    );

    // create the SVG
    let chartSVG = d3.select("#chartView").append("svg");
    chartSVG
      .attr("width", 2 * (this.width + this.margins.left + this.margins.right))
      .attr(
        "height",
        2 * (this.height + this.margins.top + this.margins.bottom)
      )
      .attr("id", "chartSVG");

    // create the scale for the political axis
    this.politicalScale = d3
      .scaleLinear()
      .domain([politicalScaleMin, politicalScaleMax])
      .range([0, this.width])
      .nice();

    // create the political party axis
    let politicalScaleXAxis = d3
      .axisTop(this.politicalScale)
      .tickFormat(d => Math.abs(d));

    // group for the svg and organizing stuff on the canvas
    let svgGroup = chartSVG.append("g").attr("class", "wrapper-group");

    // group for the Grouped by Topic Label
    let groupByTopicGroup = svgGroup
      .append("g")
      .attr("class", "groupByTopic")
      .attr("transform", "translate(45, 36)");

    // create the group by topic label
    // console.log("creating the group by topic text");
    groupByTopicGroup.append("text").text("Grouped by Topic");

    // group for the democrat party label
    let democrateGroup = svgGroup
      .append("g")
      .attr("class", "democratTitle")
      .attr("transform", "translate(40, 100)");

    // create the democrate title
    democrateGroup.append("text").text("Democrate Leaning");

    // group for the republic party label
    let republicanGroup = svgGroup
      .append("g")
      .attr("class", "republicanTitle")
      .attr("transform", "translate(700, 100)");

    // create the republican title
    republicanGroup.append("text").text("Republican Leaning");

    // append a group for the political axis
    svgGroup
      .append("g")
      .attr("transform", "translate(20,150)")
      .attr("class", "x-Axis")
      .call(politicalScaleXAxis);

    // get rid of the bar on top of the numbers for the axis
    // Article on removing the bar for the axis: https://observablehq.com/@d3/line-with-missing-data
    d3.select(".x-Axis")
      .select(".domain")
      .remove();

    // Create a list (in the format of a set) for determining the domain for the category scale
    this.categoriesList = this.accessData(this.politicalData, this.category);
    //console.log("The category list is", categoriesList);

    // create the category scale
    this.categoryScale = d3
      .scaleOrdinal()
      .domain(this.categoriesList)
      .range(d3.schemeTableau10); // color scheme chosen in honor of Pat Hanrahan after his inspiring lectures at the 2019 Organick Lecture Series
  }

  /**
   * Function for calculating the max value for different properties
   * @param {*} data - the project data
   * @param {*} attribute - a particular property of the data
   */
  findMaxValue(data, attribute) {
    let maxValueList = [];
    data.forEach(element => {
      let value = element[attribute];
      maxValueList.push(value);
    });
    let maxValue = d3.max(maxValueList);
    // console.log("maxValue", maxValue);
    return maxValue;
  }

  /**
   * Function for calculating the min value for different properties
   * @param {*} data - the project data
   * @param {*} attribute - a particular property of the data
   */
  findMinValue(data, attribute) {
    let minValueList = [];
    data.forEach(element => {
      let value = element[attribute];
      minValueList.push(value);
    });
    let minValue = d3.min(minValueList);
    // console.log("minValue", minValue);
    return minValue;
  }

  /**
   * Function for gathering the different properties of the data without duplicates
   * @param {*} data - the project data
   * @param {*} attribute - a particular property of the data
   */
  accessData(data, attribute) {
    let attributeValueSet = new Set();
    let attributeValueList = [];
    data.forEach(element => {
      let value = element[attribute];
      attributeValueSet.add(value);
    });
    attributeValueSet.forEach(element => {
      attributeValueList.push(element);
    });
    return attributeValueList;
  }

  /**
   * Function for drawing the the swarm chart
   */
  drawChart() {
    // console.log("Entered the draw chart function");

    // create that to access the functions and variables that have this on the front
    let that = this;
    // console.log("calling the update chart method");

    // scale for the circle size
    const circleScale = d3
      .scaleLinear()
      .domain([
        d3.min(that.politicalData.map(d => +d.total)),
        d3.max(that.politicalData.map(d => +d.total))
      ])
      .range([3, 12]);

    // group for the chart line
    let lineGroup = d3
      .select("#chartView")
      .select("#chartSVG")
      .select(".wrapper-group")
      .append("g");
    lineGroup.attr("class", "line-group");
    lineGroup.attr("transform", "translate(17, 244)");

    let xyBrushGroup = d3
      .select(".wrapper-group")
      .append("g")
      .attr("transform", "translate(10, 160)")
      .classed("brush", true);

    // Groups for the different brushes
    // Swarm Group Brush
    let swarmBrushGroup = d3
      .select(".wrapper-group")
      .append("g")
      .attr("transform", "translate(8, 160)")
      .attr("id", "swarmBrushGroup")
      .classed("brush", true);
    // Economic Group Brush
    let economicBrushGroup = d3
      .select(".wrapper-group")
      .append("g")
      .attr("transform", "translate(10, 160)")
      .attr("id", "economicBrushGroup")
      .classed("brush", true);
    // Energy Group Brush
    let energyBrushGroup = d3
      .select(".wrapper-group")
      .append("g")
      .attr("transform", "translate(10, 290)")
      .attr("id", "energyBrushGroup")
      .classed("brush", true);
    // Crime Group Brush
    let crimeBrushGroup = d3
      .select(".wrapper-group")
      .append("g")
      .attr("transform", "translate(10, 420)")
      .attr("id", "crimeBrushGroup")
      .classed("brush", true);
    // Education Group Brush
    let educationBrushGroup = d3
      .select(".wrapper-group")
      .append("g")
      .attr("transform", "translate(10, 560)")
      .attr("id", "educationBrushGroup")
      .classed("brush", true);
    // Health Group Brush
    let healthBrushGroup = d3
      .select(".wrapper-group")
      .append("g")
      .attr("transform", "translate(10, 690)")
      .attr("id", "healthBrushGroup")
      .classed("brush", true);
    // Mental Health Group Brush
    let mentalHealthBrushGroup = d3
      .select(".wrapper-group")
      .append("g")
      .attr("transform", "translate(10, 830)")
      .attr("id", "mentalHealthBrushGroup")
      .classed("brush", true);

    // line for the chart
    let chartLine = lineGroup.append("line");
    chartLine
      .attr("x1", 412.5)
      .attr("y1", -80)
      .attr("x2", 412.5)
      .attr("y2", 35)
      .attr("stroke", "black")
      .attr("id", "chartLine")
      .classed("swarmLine", true);

    // group for the circles
    let circleGroup = d3
      .select("#chartView")
      .select("#chartSVG")
      .select(".wrapper-group")
      .append("g");
    circleGroup
      .attr("class", "circle-group")
      .attr("transform", "translate(-6, 224)");
    // create the div for the tooltip
    // Tooltip div article: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
    let div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // circles encoding the data
    let circles = circleGroup
      .selectAll("circle")
      .data(that.politicalData)
      .join("circle")
      .classed("swarm", true)
      .attr("id", d => d.category);
    circles.attr("r", d => circleScale(d.total));
    circles.attr("cx", d => d.sourceX);
    circles.attr("cy", d => d.sourceY);
    circles.attr("fill", d => this.categoryScale(d.category));
    circles
      .on("mouseover", function(d) {
        // Rounding article: https://www.jacklmoore.com/notes/rounding-in-javascript/
        /**
         * Function that rounds numbers to a specified decimal place
         * @param {} value - the number to be rounded
         * @param {*} decimals - the decimal place to round to
         */
        function round(value, decimals) {
          return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
        }
        // Democrat
        if (d.position < 0) {
          let totalFrequency = round((d.total / 50) * 100, 4);
          div
            .transition()
            .duration(200)
            .style("opacity", 0.9);
          div
            .html(
              '<text id="categoryName">' +
                d.phrase +
                "</text>" +
                "<br/>" +
                '<text id="politicalDifference">' +
                "D+ " +
                round(Math.abs(d.position), 4) +
                "%" +
                "</text>" +
                "<br/>" +
                '<text id="totalFrequency">' +
                "In " +
                totalFrequency +
                "% of speeches" +
                "</text>"
            )
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");

          // highlight the circle that was selected
          let circleSelected = d3.select(this);
          circleSelected.attr("stroke-width", 2).attr("stroke", "black");
        }
        // Republican
        else {
          let totalFrequency = round((d.total / 50) * 100, 4);

          div
            .transition()
            .duration(200)
            .style("opacity", 0.9);
          div
            .html(
              '<text id="categoryName">' +
                d.phrase +
                "</text>" +
                "<br/>" +
                '<text id="politicalDifference">' +
                "R+ " +
                round(Math.abs(d.position), 4) +
                "%" +
                "</text>" +
                "<br/>" +
                '<text id="totalFrequency">' +
                "In " +
                totalFrequency +
                "% of speeches" +
                "</text>"
            )
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");

          // highlight the circle that was selected
          let circleSelected = d3.select(this);
          circleSelected.attr("stroke-width", 2).attr("stroke", "black");
        }
      })
      .on("mouseout", function() {
        div
          .transition()
          .duration(500)
          .style("opacity", 0);
        // remove the selected circle fill
        let circleSelected = d3.select(this);
        circleSelected.attr("stroke", "none");
      });

    // Make the brush
    let activeBrush = null;
    let activeBrushNode = null;
    const brushGroups = d3.selectAll(".brush");
    brushGroups.each(function() {
      const selectionThis = this;
      const selection = d3.select(this);
      const brush = d3
        .brushX()
        .extent([[0, 0], [900, 130]])
        .on("start", function() {
          if (activeBrush && selection !== activeBrushNode) {
            activeBrushNode.call(activeBrush.move, null);
          }
          activeBrush = brush;
          activeBrushNode = selection;
        })
        .on("brush", brushed);
      selection.call(brush);
    });

    // function for brushing
    function brushed() {
      // store the selection
      const selection = d3.select(this);
      // remove the brush if the  circles are clicked
      let selectionCircles = d3.select(".circle-group");
      selectionCircles.on("click", function() {
        console.log("clicked the circles");
        selection.call(activeBrush.move, null);
      });
      let toggleChange = d3.select("input");
      toggleChange.on("change", function(){
        selection.call(activeBrush.move, null);
        if (that.toggleCounter === 0) {
          that.toggleCounter = 1;
          that.updateChart(that.toggleCounter);
        } else {
          that.toggleCounter = 0;
          that.updateChart(that.toggleCounter);
        }
      });

      // if (!d3.event.sourceEvent || !d3.event.selection) {
      //   return;
      // }
      // let circleSelection = d3.event.selection.map(circleScale.invert);
      // console.log("circle selection", circleSelection);

      console.log("brushing");
    }

    // group for the labels
    let categoryGroup = d3
      .select("#chartView")
      .select("#chartSVG")
      .select(".wrapper-group")
      .append("g")
      .attr("transform", "translate(0, -890)")
      .attr("id", "category-wrapper");

    // add the economic label
    let economicGroup = categoryGroup.append("g");
    economicGroup
      .attr("transform", "translate(" + that.margins.right + ", 180)")
      .classed("economicGroup", true);
    let economyText = economicGroup.append("text");
    economyText.text("Economy/Fiscal Issues").classed("categoryLabel", true);

    // add the energy label
    let energyGroup = categoryGroup.append("g");
    energyGroup
      .attr("transform", "translate(" + that.margins.right + ", 305)")
      .classed("energyGroup", true);
    let energyText = energyGroup.append("text");
    energyText.text("Energy/Environment").classed("categoryLabel", true);

    // add the crime label
    let crimeGroup = categoryGroup.append("g");
    crimeGroup
      .attr("transform", "translate(" + that.margins.right + ", 440)")
      .classed("crimeGroup", true);
    let crimeText = crimeGroup.append("text");
    crimeText.text("Crime/Justice").classed("categoryLabel", true);

    // add the education label
    let educationGroup = categoryGroup.append("g");
    educationGroup
      .attr("transform", "translate(" + that.margins.right + ", 580)")
      .classed("educationGroup", true);
    let educationText = educationGroup.append("text");
    educationText.text("Education").classed("categoryLabel", true);

    // add the health label
    let healthGroup = categoryGroup.append("g");
    healthGroup
      .attr("transform", "translate(" + that.margins.right + ", 710)")
      .classed("healthGroup", true);
    let healthText = healthGroup.append("text");
    healthText.text("Health Care").classed("categoryLabel", true);

    // add the mental health label
    let mentalHealthGroup = categoryGroup.append("g");
    mentalHealthGroup
      .attr("transform", "translate(" + that.margins.right + ", 850)")
      .classed("mentalHealthGroup", true);
    let mentalHealthText = mentalHealthGroup.append("text");
    mentalHealthText
      .text("Mental Health/Substance Abuse")
      .classed("categoryLabel", true);

    // click functionality for the toggle
    // Article on using checkboxes with d3: https://bl.ocks.org/johnnygizmo/3d593d3bf631e102a2dbee64f62d9de4
    // Article on checkboxes: https://developer.mozilla.org/en-US/docs/Archive/Mozilla/XUL/checkbox
    let toggleSwitch = d3.select("#toggle");
    toggleSwitch.on("change", function() {
      if (that.toggleCounter === 0) {
        that.toggleCounter = 1;
        that.updateChart(that.toggleCounter);
      } else {
        that.toggleCounter = 0;
        that.updateChart(that.toggleCounter);
      }
    });
  }

  /**
   * Function that updates the chart based on the toggle selection
   * @param {*} toggleCounter - a counter for keeping track of the toggle selection
   */
  updateChart(toggleCounter) {
    // set that to this to access functions and variables that have this on the front
    let that = this;
    that.toggleSwitch = false;

    // this statement executes the swarmchart view
    if (toggleCounter === 0) {
      // update the chart line
      let swarmLine = d3.select("#chartLine");
      swarmLine
        .transition()
        .duration(500)
        .attr("y2", 35);
      swarmLine.classed("categoryLine", false);
      swarmLine.classed("swarmLine", true);

      // update the chart circles
      let swarmCircles = d3.selectAll("circle");
      swarmCircles
        .transition()
        .duration(500)
        .attr("cx", d => d.sourceX)
        .attr("cy", d => d.sourceY);
      swarmCircles.classed("category", false);
      swarmCircles.classed("swarm", true);

      // update the labels group
      let swarmLabels = d3.select("#category-wrapper");
      swarmLabels
        .transition()
        .duration(300)
        .attr("transform", "translate(0, -3000)");
      swarmLabels.classed("categoryLabels", false);
      swarmLabels.classed("swarmLabels", true);
    }
    // this statement executes the expanded category chart view
    else {
      // update the chart line
      let categoryLine = d3.select("#chartLine");
      categoryLine
        .transition()
        .duration(500)
        .attr(
          "y2",
          2 * (that.height + that.margins.top + that.margins.bottom) - 348
        );
      categoryLine.classed("swarmLine", false);
      categoryLine.classed("categoryLine", true);

      // update the chart circle
      let categoryCircles = d3.selectAll("circle");
      categoryCircles
        .transition()
        .duration(500)
        .attr("cx", d => d.moveX)
        .attr("cy", d => d.moveY);
      categoryCircles.classed("swarm", false);
      categoryCircles.classed("category", true);

      // group for all the labels for the data
      // console.log("the categories list", that.categoriesList);

      // update the labels group
      let categoryLabels = d3.select("#category-wrapper");
      categoryLabels
        .transition()
        .duration(300)
        .attr("transform", "translate(0, 5)");
      categoryLabels.classed("swarmLabels", false);
      categoryLabels.classed("categoryLabels", true);
    }
  }
}
