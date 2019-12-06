class BubbleChart {
  constructor(div, data, groupKeys, updateTable) {
    /*
     Dimensions for chart
     */
    this.totalWidth = 900;
    this.height = 750;
    this.margin = { x: 50, y: 100 };
    this.updateTable = updateTable;
    this.activeBrush = null;
    this.activeBrushNode = null;

    this.data = data;
    const xPosArr = this.data.map(d => d.sourceX);
    xPosArr.push(...this.data.map(d => d.x));
    const minXPos = d3.min(xPosArr);
    const maxXPos = d3.max(xPosArr);

    let difMax = d3.max(data.map(d => d.position));
    let difMin = d3.min(data.map(d => d.position));

    this.groupKeys = groupKeys;
    //SO WE CAN SEE THE DIFFERENCES IN POLARITY ON THE SAME SCALE,
    //TAKE THE MIN AND MAX AND GET THE MAX VALUE FOR THAT.
    //USE POS AND NEG OF THAT VALUE FOR DOMAIN.
    let overallMax = d3.max([Math.abs(difMin), difMax]);

    //SCALE FOR X POSITION//
    // this.xScale = d3
    //   .scaleLinear()
    //   .domain([0 - overallMax, overallMax])
    //   .range([0, this.width - this.margin.x / 2])
    //   .clamp(true);

    // //SCALE FOR Y POSITION//
    // this.yScale = d3
    //   .scaleLinear()
    //   .domain([0, this.groupKeys.length - 1])
    //   .range([0, this.height - this.margin.y]);

    // this.runSimulation(data);
    //ADD BUTTON FOR STORY//
    // renderButton(d3.select('#wrapper').select('.toolbar'), 'Show Extremes', this.data, this.circleScale, circles);

    const minY = d3.min(this.data, d => d["sourceY"]);
    const maxY = d3.max(this.data, d => d["sourceY"]);

    this.width = maxXPos - minXPos;

    //SCALE FOR X POSITION//
    this.xScale = d3
      .scaleLinear()
      .domain([difMin, overallMax])
      .range([minXPos, maxXPos])
      .nice();
    //SCALE FOR Y POSITION//
    this.yScale = d3
      .scaleLinear()
      .domain([0, this.groupKeys.length])
      .range([0, this.height]);

    this.groupedData = {};
    this.groupKeys.forEach(group => {
      this.groupedData[group.key] = this.data.filter(
        d => d.category === group.key
      );
    });

    this.svg = div.append("svg");

    this.svg
      .attr("height", this.height + 2 * this.margin.y)
      .attr("width", this.width + 2 * this.margin.x);

    this.plot = this.svg
      .append("g")
      .classed("main-plot-area", true)
      .attr(
        "transform",
        `translate(${this.margin.x / 2}, ${this.margin.y / 2})`
      );

    this.centerLine = this.plot
      .append("g")
      .attr("transform", `translate(${this.xScale(0)}, 0)`)
      .append("line")
      .classed("center-line", true);

    this.topAxisGroup = this.plot.append("g").classed("top-axis-group", true);

    this.topAxisGroup
      .append("g")
      .append("text")
      .text("Republican Leaning")
      .classed("political-label republican", true)
      .attr("transform", `translate(${this.width},0)`); //('.political-label')

    this.topAxisGroup
      .append("g")
      .append("text")
      .text("Democratic Leaning")
      .classed("political-label democrat", true)
      .attr("transform", `translate(0,0)`); //('.political-label')

    this.topAxis = this.topAxisGroup
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${20})`);

    this.swarmPlotGroup = this.plot
      .append("g")
      .classed("swarm-plot", true)
      .attr("transform", "translate(0, 45)");

    //SCALES FOR COLOR AND CIRCLE SIZE
    this.colorScale = d3
      .scaleOrdinal()
      .domain(this.groupKeys.map(k => k.key))
      .range(d3.schemeSet2);

    const minCircleSize = 3;
    const maxCircleSize = 12;

    this.circleScale = d3
      .scaleLinear()
      .domain([
        d3.min(data.map(d => +d.total)),
        d3.max(data.map(d => +d.total))
      ])
      .range([minCircleSize, maxCircleSize]);

    //GETTING OVERALL MIN AND MAX FOR SCALES//

    this.swarmGroupHeight =
      Math.abs(minY - maxY) + 2 * this.circleScale.range()[1];

    // this.runSimulation(data);

    this.storyButton = renderButton(
      d3.select("#wrapper").select(".toolbar"),
      "Show Extremes"
    );

    this.updateBubbleChart(d3.select("#separate").node().checked);

    this.swarmPlotGroup
      .append("g")
      .attr("id", "circle-wrap")
      .attr("transform", "translate(0, 100)");

    this.updateBubbleChart(d3.select("#separate").node().checked);
  }
  /*
runSimulation(data){

  runSimulation(data) {
    let that = this;
    //SIMULATION PART
    let simulation = d3
      .forceSimulation()
      .nodes(data)
      .force("x", d3.forceX(d => that.xScale(d.position)).strength(1))
      .force("y", d3.forceY().strength(1))
      .force(
        "collision",
        d3.forceCollide().radius(d => that.circleScale(d.total))
      );

    for (
      let i = 0,
        n = Math.ceil(
          Math.log(simulation.alphaMin()) /
            Math.log(1 - simulation.alphaDecay())
        );
      i < n;
      ++i
    ) {
      simulation.tick();
    }
    simulation.on('end', firstCallback(data));

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    function firstCallback(data){

        let newData = data.map(d=> {
            d.sourceX = d.x;
            d.sourceY = d.y;
            return d
        });
        //SECOND SIMULATION
        simulation = d3.forceSimulation().nodes(newData)
            .force('x', d3.forceX(d => that.xScale(d.position)).strength(1))
            .force('y', d3.forceY().y( d => {
                let move = that.groupKeys.filter(g=> g.key === d.category)[0].pos;
                return that.yScale(move);
            }))
            .force('collision', d3.forceCollide().radius( d => that.circleScale(d.total)))

            for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
                simulation.tick();
            }
            simulation.on('end', secondCallback(newData));
    }

    function secondCallback(test){
        //ASSIGN NEW POSITIONS TO GLOBAL DATA
        that.data = test.map(d=> {
        let move = that.groupKeys.filter(g=> g.key === d.category)[0].pos;
            d.moveX = d.x;
            d.moveY = d.y;
            //THIS IS TO MAKE EACH GROUP SEPARATE FOR BRUSHES
            d.correctedY = d.y - that.yScale(move);
            return d
        });

      //  console.log(JSON.stringify(that.data))
      //  console.log(that.data)
    }

}

      console.log(that.data);
    }
  }

  /**
   * Updates the bubble chart
   * @param {Boolean} separate
   * @param {*} data
   */
  updateBubbleChart(separate) {
    let instance = this;

    const swarmTransition = d3.transition().duration(500);

    let xAxis = d3
      .axisBottom()
      .scale(this.xScale)
      .tickFormat(x => `${Math.abs(x)}`)
      .ticks(12);
    this.topAxis.call(xAxis);

    if (separate) {
      this.centerLine
        .transition(swarmTransition)
        .attr("y1", 50)
        .attr("y2", this.height + 20)
        .style("stroke", "black");
    } else {
      this.centerLine
        .transition(swarmTransition)
        .attr("y1", 50)
        .attr("y2", 170)
        .style("stroke", "black");
    }

    let data = [this.data];
    if (separate) data = this.groupKeys;

    let swarmGroups = this.swarmPlotGroup
      .selectAll(".swarm-group")
      .data(data)
      .join(
        enter =>
          enter
            .append("g")
            .classed("swarm-group", true)
            .attr("transform", "translate(0,0)")
            .call(enter =>
              enter
                .transition(swarmTransition)
                .attr(
                  "transform",
                  (d, i) => `translate(0,${i * this.swarmGroupHeight})`
                )
            ),
        update =>
          update
            .attr("transform", "translate(0,0)")
            .call(update =>
              update
                .transition(swarmTransition)
                .attr(
                  "transform",
                  (d, i) => `translate(0,${i * this.swarmGroupHeight})`
                )
            ),
        exit =>
          exit.lower().call(exit =>
            exit
              .transition(swarmTransition)
              .attr("transform", `translate(0,${0})`)
              .remove()
          )
      );

    const swarmCircleGroups = swarmGroups
      .selectAll(".circ-group")
      .data(d => [d])
      .join("g")
      .classed("circ-group", true)
      .attr("transform", `translate(0,${this.swarmGroupHeight / 2})`);

    const circles = swarmCircleGroups
      .selectAll("circle")
      .data(d => (separate ? this.groupedData[d.key] : d), d => d.phrase);

    circles.join(
      enter =>
        enter
          .append("circle")
          .style("opacity", 0)
          .style("fill", d => this.colorScale(d.category))
          .attr("cx", d => (!separate ? d.x : d.sourceX))
          .attr("cy", d => (!separate ? d.correctedY : d.sourceY))
          .attr("r", d => this.circleScale(+d.total))
          .style("stroke", "black")
          .style("stroke-width", "0.8px")
          .on("mouseover", (d, i, n) => {
            //SHOW DATA IN TOOLTIP
            d3.select("#tooltip")
              .transition()
              .duration(200)
              .style("opacity", 0.9);
            d3.select("#tooltip")
              .html(tooltipRender(d) + "<br/>")
              .style("left", d3.event.pageX + 5 + "px")
              .style("top", d3.event.pageY - 28 + "px");
            //HIGHLIGHT CIRCLE
            d3.select(n[i])
              .style("stroke", "black")
              .style("stroke-width", 3);
          })
          .on("mouseout", function(d, i, n) {
            d3.select("#tooltip")
              .transition()
              .duration(500)
              .style("opacity", 0);
            //REMOVE CIRCLE HIGHLIGHT
            d3.select(n[i])
              .style("stroke", "black")
              .style("stroke-width", 0.3);
          })
          .call(enter =>
            enter
              .transition(swarmTransition)
              .delay(separate ? 0 : 154.5)
              .duration(separate ? 5 : 150.5)
              .style("opacity", 1)
              .transition(swarmTransition)
              .attr("cx", d => (separate ? d.x : d.sourceX))
              .attr("cy", d => (separate ? d.correctedY : d.sourceY))
          ),
      update =>
        update
          .style("stroke", "black")
          .style("stroke-width", "0.8px")
          .on("mouseover", (d, i, n) => {
            //SHOW DATA IN TOOLTIP
            d3.select("#tooltip")
              .transition()
              .duration(200)
              .style("opacity", 0.9);
            d3.select("#tooltip")
              .html(tooltipRender(d) + "<br/>")
              .style("left", d3.event.pageX + 5 + "px")
              .style("top", d3.event.pageY - 28 + "px");
            //HIGHLIGHT CIRCLE
            d3.select(n[i])
              .style("stroke", "black")
              .style("stroke-width", 3);
          })
          .on("mouseout", function(d, i, n) {
            d3.select("#tooltip")
              .transition()
              .duration(500)
              .style("opacity", 0);
            //REMOVE CIRCLE HIGHLIGHT
            d3.select(n[i])
              .style("stroke", "black")
              .style("stroke-width", 0.3);
          })
          .call(update =>
            update
              .transition(swarmTransition)
              .attr("cx", d => (separate ? d.x : d.sourceX))
              .attr("cy", d => (separate ? d.correctedY : d.sourceY))
              .style("fill", d => this.colorScale(d.category))
              .attr("r", d => this.circleScale(+d.total))
              .style("opacity", 1)
          ),
      exit =>
        exit
          .attr("cx", d => (separate ? d.x : d.sourceX))
          .attr("cy", d => (separate ? d.correctedY : d.sourceY))
          .remove()
    );

    const textGroups = swarmGroups
      .selectAll(".group-label")
      .data(d => [d])
      .join("g")
      .classed("group-label", true);

    textGroups
      .selectAll("text")
      .data(d => [d])
      .join("text")
      .classed("category-label", true)
      .text(d => {
        return d.key ? d.key.charAt(0).toUpperCase() + d.key.slice(1) : "";
      });

    const OVERALL = "overall";

    swarmGroups
      .selectAll(".brush")
      .data(d => [d])
      .join("g")
      .classed("brush", true)
      .each(function(d) {
        const selectionThis = this;
        const selection = d3.select(selectionThis);

        const brush = d3
          .brushX()
          .extent([
            [0, 10],
            [instance.totalWidth, instance.swarmGroupHeight - 10]
          ])
          .on("start", function(event) {
            if (
              instance.activeBrush &&
              selection !== instance.activeBrushNode
            ) {
              instance.activeBrushNode.call(instance.activeBrush.move, null);
            }
            instance.activeBrush = brush;
            instance.activeBrushNode = selection;
          })
          .on("brush", function(event) {
            const brushSelection = d3.brushSelection(selectionThis);
            if (!brushSelection) return;
            const [x1, x2] = brushSelection;

            const swarmGroup = d3.select(selectionThis.parentNode);

            swarmCircleGroups
              .selectAll("circle")
              .classed("background-circle", true);

            const filteredGroups = swarmGroup
              .selectAll("circle")
              .filter(d =>
                separate
                  ? d.x >= x1 && d.x <= x2
                  : d.sourceX >= x1 && d.sourceX <= x2
              )
              .classed("background-circle", false);

            instance.updateTable(filteredGroups.data().map(d => d.phrase));
          })
          .on("end", function(event) {
            const brushExtents = d3.brushSelection(selectionThis);
            if (!brushExtents) {
              swarmCircleGroups
                .selectAll("circle")
                .classed("background-circle", false);
              instance.updateTable(instance.data.map(d => d.phrase));
            }
          });

        selection.call(brush);
      });

    swarmCircleGroups.raise();
    this.centerLine.raise();

    this.storyButton.on("click", () => {
      //HIGHLIGHT EXTREMES ON SEPARATION//
      //COMMENTED THIS OUT TO NOT INTERFERE WITH BRUSH WORK
      circles
        .transition()
        .on(
          "end",
          highlightExtreme(
            this.data,
            this.circleScale,
            swarmCircleGroups.selectAll("circle")
          )
        );
    });
  }
}
