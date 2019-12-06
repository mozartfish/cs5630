class WordTable {
  constructor(div, groupKeys) {
    this.div = div;

    //SCALES FOR COLOR//
    this.colorScale = d3
      .scaleOrdinal()
      .domain(groupKeys.map(k => k.key))
      .range(d3.schemeSet2);

    this.svg = this.div.append("svg");

    this.table = this.svg.append("g").classed("table", true);
    this.table.append("g").classed("tbody", true);
    this.table
      .append("g")
      .classed("thead", true)
      .attr("transform", "translate(0, 15)");

    this.sorter = null;
  }

  sortData(data, key) {
    let sorted = [...data].sort((a, b) => {
      if (this.sorter === key) {
        if (key === "frequency" || key === "total") {
          return +b.total - +a.total;
        } else if (key === "percentages") {
          
          let sumA = ((+a.percent_of_d_speeches) + (+a.percent_of_r_speeches)) + .01;
          let sumB = ((+b.percent_of_d_speeches) + (+b.percent_of_r_speeches));
          return sumA - sumB;
         
        } else {
          return a[key] < b[key] ? -1 : 1;
        }
      } else {
        if (key === "frequency" || key === "total") {
          return +a.total - +b.total;
        } else if (key === "percentages") {
          let sumA = ((+a.percent_of_d_speeches) + (+a.percent_of_r_speeches)) + .01;
          let sumB = ((+b.percent_of_d_speeches) + (+b.percent_of_r_speeches));
          return sumB - sumA;
        } else {
          return a[key] > b[key] ? -1 : 1;
        }
      }
    });
    this.sorter = key;
    return sorted;
  }

  updateTable(data, selectedTerms = []) {

    let demMax = d3.max(data.map(d => +d.percent_of_d_speeches))
    let repMax = d3.max(data.map(d => +d.percent_of_r_speeches))
    let overAllMax = d3.max([demMax, repMax])

    ///FORMATTING DATA///

    let formattedData = data
      .filter(d =>
        selectedTerms.length > 0 ? selectedTerms.includes(d.phrase) : true
      )
      .map(d => {
        return {
          phrase: d.phrase,
          frequency: { group: d.category, freq: d.total / 50 },
          percentages: {
            dem: +d.percent_of_d_speeches,
            rep: +d.percent_of_r_speeches
          },
          total: d.total
        };
      });

    let headerData = d3.keys(formattedData[0]);

    let tableW = 500;
    let cellH = 20;

    let sizeDict = {
      phrase: 120,
      frequency: 130, //(tableW - (maxWordSpace + 40))/2.5,
      percentages: 160, //(tableW - (maxWordSpace + 40))/1.5,
      total: 80
    };

    let padding = 2.5;

    this.svg.attr("height", data.length * cellH);

    ////SVG TABLE IMPLEMENTATION///

    function moveCell(value, index) {
      if (value === "frequency") {
        return `translate(${sizeDict.phrase + padding}, 0)`;
      }
      if (value === "percentages") {
        return `translate(${sizeDict.phrase +sizeDict.frequency + (padding*2)}, 0)`;
      } else if (value === "total") {
        return `translate(${sizeDict.phrase +sizeDict.frequency + sizeDict.percentages + (padding*3)}, 0)`;
      } else {
        return `translate(0, 0)`;
      }
    }

    function sizeCell(value) {
      return sizeDict[value];
    }

    ///TABLE HEADER///
    let tableHead = this.table.select(".thead");

    let th = tableHead
      .selectAll("g.th")
      .data(headerData)
      .join("g")
      .classed("th", true);
    th.attr("transform", (d, i) => moveCell(d, i));

    th.selectAll("rect")
      .data(d => [d])
      .join("rect")
      .attr("width", d => sizeCell(d))
      .attr("height", cellH * 2)
      .attr("y", -12);

    th.selectAll("text")
      .data(d => [d])
      .join("text")
      .text(d => d.charAt(0).toUpperCase() + d.slice(1))
      .style("text-anchor", "middle")
      .style("font-weight", "700")
      .attr("transform", d => {
        return `translate(${sizeDict[d] / 2}, 5)`;
      });

    th.on("click", (d, i) => {
      let sorted = this.sortData(data, d);
      this.updateTable(sorted);
    });

    let freqX = d3
      .scaleLinear()
      .range([0, 110])
      .domain([0, 1])
      .clamp(true);

    let percX = d3
      .scaleLinear()
      .range([5, (136/2)-2])
      .domain([0, 100])
      .clamp(true);

    let percXAxis = d3
      .scaleLinear()
      .range([0, 136])
      .domain([-100, 100])
      .clamp(true);

    let percentageHeader = th
      .filter(d => d === "percentages")
      .append("g")
      .call(
        d3
          .axisTop(percXAxis)
          .ticks(3)
          .tickFormat(x => `${Math.abs(x)}`)
      );

    percentageHeader.attr("transform", d => `translate(11,27)`);
    percentageHeader.select("path").attr("stroke", "none");

    let frequencyHeader = th
      .filter(d => d === "frequency")
      .append("g")
      .call(d3.axisTop(freqX).ticks(3));
    frequencyHeader.attr("transform", d => `translate(9,27)`);
    frequencyHeader.select("path").attr("stroke", "none");

    ///TABLE BODY///
    let tableBod = this.table.select(".tbody");
    tableBod.attr("transform", `translate(0, ${cellH * 2})`);

    let rows = tableBod
      .selectAll("g.tr")
      .data(formattedData)
      .join("g")
      .classed("tr", true);
    rows.attr("transform", (d, i) => `translate(0,${cellH * i})`);

    let cells = rows
      .selectAll("g.td")
      .data(d => d3.entries(d))
      .join("g")
      .classed("td", true);
    cells.attr("transform", (d, i) => moveCell(d.key, i));

    cells
      .selectAll("rect.background")
      .data(d => [d])
      .join("rect")
      .classed("background", true)
      .attr("width", d => sizeCell(d.key))
      .attr("height", cellH);

    cells
      .filter(d => {
        return d.key === "phrase";
      })
      .selectAll("text")
      .data(d => [d])
      .join("text")
      .text(d => d.value)
      .attr("transform", "translate(5, 15)");


    cells
    .filter(d => {
      return d.key === "total";
    })
    .selectAll("text")
    .data(d => [d])
    .join("text")
    .text(d => d.value)
    .style('text-anchor', 'middle')
    .attr("transform", "translate(40, 15)");

    let percentageCell = cells.filter(d => d.key === "percentages");

    let politicalGroups = percentageCell
      .selectAll("g.pol-group")
      .data(d => d3.entries(d.value))
      .join("g")
      .attr("class", d => `${d.key} pol-group`);

    politicalGroups.attr("transform", "translate(5, 0)");

    let polRect = politicalGroups
      .selectAll("rect")
      .data(d => {
        return [d];
      })
      .join("rect");

    polRect.attr("width", d => {
      return (percX(d.value));
    });
    polRect.attr("height", cellH);
    polRect.attr("transform", d => {
      if (d.key === "rep") {
        return `translate(${percX.range()[1] + 8}, 0)`;
      } else {
        return `translate(${(percX.range()[1] - percX(d.value)) + 8}, 0)`;
      }
    });

    let groupFreq = cells
      .filter(d => d.key === "frequency")
      .selectAll("rect.frequency")
      .data(d => {
        return [d];
      })
      .join("rect")
      .classed("frequency", true);

    groupFreq.attr("x", 7);

    groupFreq
      .attr("fill", d => {
        return this.colorScale(d.value.group);
      })
      .attr("width", d => {
        return freqX(d.value.freq) - 3;
      })
      .attr("height", cellH);
  }
}
