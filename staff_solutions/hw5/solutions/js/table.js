/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        this.tree = treeObject;
        /**List of all elements that will populate the table.*/
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice();

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** letiables to be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = d3.scaleLinear()
            .range([this.cell.buffer, 2 * this.cell.width - this.cell.buffer]);


        /** Used for games/wins/losses*/
        this.gameScale = d3.scaleLinear()
            .range([0, this.cell.width - this.cell.buffer]);

        /**Color scales*/
        /**For aggregate columns*/
        this.aggregateColorScale = d3.scaleLinear()
            .range(['#feebe2', '#690000']);


        /**For goal Column*/
        this.goalColorScale = d3.scaleQuantize()
            .domain([-1, 1])
            .range(['#cb181d', '#034e7b']);
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains
        this.goalScale.domain([0, d3.max(this.teamData, d => d3.max([d.value[this.goalsConcededHeader], d.value[this.goalsMadeHeader]]))]);
        this.gameScale.domain([0, d3.max(this.teamData, d => d.value.TotalGames)]);

        this.aggregateColorScale.domain(this.gameScale.domain());

        let sortedTableHeaders = this.tableHeaders.map(() => false);

        // Create the axes
        let xAxis = d3.axisTop()
            .scale(this.goalScale);

        //add GoalAxis to header of col 1.
        d3.select('#goalHeader')
            .append('svg')
            .attr('width', this.cell.width * 2)
            .attr('height', this.cell.height)
            .append('g')
            .attr("transform", "translate(" + 0 + "," + this.cell.height * 0.9 + ")")
            .call(xAxis);

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers
        d3.selectAll("thead td").data(this.tableHeaders).on("click", (k, i) => {
            let invert;
            if (sortedTableHeaders[i] === true) {
                sortedTableHeaders[i] = false;
                invert = true;
            } else {
                sortedTableHeaders = this.tableHeaders.map(() =>{
                    return false
                });
                sortedTableHeaders[i] = true;
                invert = false;
            }

            this.tableElements = this.tableElements.sort((a, b) =>{
                if (invert) {
                    let temp = b;
                    b = a;
                    a = temp;
                }

                if (k === 'Result') {
                    if (b.value[k].ranking === a.value[k].ranking) {
                        return a.key < b.key ? -1 : 1
                    } else {
                        return b.value[k].ranking - a.value[k].ranking;
                    }
                }
                else {
                    //Sort alphabetically in the case of a tie or Team Name
                    if (b.value[k] === a.value[k]) {
                        return a.key < b.key ? -1 : 1
                    } else
                        return b.value[k] - a.value[k];
                }
            });
            this.collapseList();
            this.updateTable();
        });

        //Set sorting callback for clicking on Team header
        d3.selectAll("thead th").data('Team').on("click", () => {
            this.tableElements = this.tableElements.sort((a, b) =>{
                return a.key < b.key ? -1 : 1
            });
            this.collapseList();
            this.updateTable();
        });
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows
        let tr = d3.select("tbody").selectAll("tr")
            .data(this.tableElements);

        tr.exit().remove();

        let trEnter = tr.enter().append("tr");

        //Team Names
        trEnter.append("th");

        tr = trEnter.merge(tr)
        
            .attr('class', d => d.value.type)
            .on("mouseover", d => this.tree.updateTree(d))
            .on("mouseout", (d, i) => this.tree.clearTree())
            .on("click", (d, i) => this.updateList(i));
        tr.select("th")
            .text(d => d.value.type === 'aggregate' ? d.key : 'x' + d.key);


        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        let td = tr.selectAll("td")
            .data(d => {
                return this.tableHeaders.map((k, i) => {
                    if (i === 0) { //for the first column, you need a 2 element array
                        return {
                            'type': d.value.type,
                            'vis': 'goals',
                            'value': [d.value[this.goalsMadeHeader], d.value[this.goalsConcededHeader]]
                        }
                    }
                    else if (k === 'Result') {
                        return {'type': d.value.type, 'vis': 'text', 'value': d.value[k]}
                    }
                    else {
                        return {'type': d.value.type, 'vis': 'bars', 'value': d.value[k]}
                    }
                });
            });

        td.exit().remove();

        let tdEnter = td.enter().append("td");

        let svgEnter = tdEnter.filter(d => {
            return d.vis !== 'text'
        })
            .append("svg");

        td = tdEnter.merge(td);

        let svg = td.select("svg")
            .attr("width", d => d.vis === 'bars' ? this.cell.width : 2 * this.cell.width)
            .attr("height", this.cell.height);

        //Add scores as title property to appear on hover
        td.filter(d => {
            return d.vis === 'goals'
        })
            .attr("title", d => {
                return ['Goals Scored:' + d.value[0] + ' Goals Conceded: ' + d.value[1]]
            });

        //Populate table
        // let gameColumnsEnter = svgEnter.filter(function (d) {
        //     return d.type == 'aggregate' && d.vis == 'bars';
        // });

        let gameColumnsEnter = svgEnter.filter(d => {
            return d.vis === 'bars';
        });

        let gameColumns = svg.filter(d => {
            return d.vis === 'bars';
        });

        gameColumnsEnter.append("rect");
        gameColumns.select("rect")
            .attr("height", this.bar.height)
            .attr("width", d => {
                return d.value ? this.gameScale(d.value) : 0;
            })
            .attr("fill", d => {
                return this.aggregateColorScale(d.value);
            });

        gameColumnsEnter.append("text");

        gameColumns.select("text")
            .attr("x", d => d.value ? this.gameScale(d.value) : 0)
            .attr("y", this.cell.height / 2)
            .attr("dy", ".35em");

        gameColumns.select("text")
            .attr("dx", d => {
                return d.value > 1 ? -3 : 0
            })
            .attr("text-anchor", d => {
                return d.value > 0 ? 'end' : 'start'
            });

        gameColumns.select("text")
            .classed('label', true)
            .text(d => {
                return d.value;
            });


        let roundColumnsEnter = td.filter(d =>{
            return d.vis === 'text';
        });
        let roundColumns = td.filter(d => {
            return d.vis === 'text';
        });

        roundColumns
            .text(function (d) {
                return (d.value.label)
            });


        //Create diagrams in the goals column
        let goalColumnsEnter = svgEnter.filter(d => {
            return d.vis === 'goals';
        });
        let goalColumns = svg.filter(d => {
            return d.vis === 'goals';
        });


        goalColumnsEnter.append("rect");
        goalColumns.select("rect")
            .attr("height", d => {
                return d.type === 'aggregate' ? 13 : 5
            })
            .attr("width", d => Math.abs(this.goalScale(d.value[0]) - this.goalScale(d.value[1])))
            .attr('x', d => {return this.goalScale(d3.min(d.value)) - 5})
            .attr('y', d => d.type === 'aggregate' ? this.cell.height / 2 - 13 / 2 : this.cell.height / 2 - 5 / 2)
            .attr('fill', d => this.goalColorScale(d.value[0] - d.value[1]));

        goalColumns.select("rect")
            .classed('goalBar', true);

        goalColumnsEnter.append("circle")
            .classed('first goalCircle', true);
        goalColumns.select("circle.first")
            .attr("cx", d => {
                return this.goalScale(d.value[0]) - 5;
            })
            .attr('cy', this.cell.height / 2)
            .attr("stroke", this.goalColorScale.range()[1])
            .attr('fill', d => {
                return d.type === 'game' ? 'white' : this.goalColorScale.range()[1]
            });

        goalColumnsEnter.append("circle")
            .classed('second goalCircle', true);
        goalColumns.select("circle.second")
            .attr("cx", d => {
                return this.goalScale(d.value[1]) - 5;
            })
            .attr('cy', this.cell.height / 2)
            .attr("stroke", this.goalColorScale.range()[0])
            .attr('fill', d => {
                return d.type === 'game' ? 'white' : this.goalColorScale.range()[0]
            });


        //Set the color of all games that tied to light gray
        goalColumns.filter(d => {
            return d.value[0] === d.value[1]
        })
            .selectAll('circle')
            .attr('stroke', 'gray')
            .attr('fill', d => {
                return d.type === 'game' ? 'white' : 'gray'
            });
    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
        let nextRow;
        //Only update list for aggregate clicks, not game clicks
        if (this.tableElements[i].value.type === 'aggregate') {
            if (i === this.tableElements.length - 1) {
                nextRow = i;
            }
            else {
                nextRow = i + 1;
            }

            if (this.tableElements[nextRow].value.type === 'game') {
                this.tableElements.splice(i + 1, this.tableElements[i].value.games.length);
            }
            else {
                this.tableElements[i].value.games.forEach((game, j) => {
                    this.tableElements.splice(i + 1 + j, 0, game);
                });
            }
            this.updateTable();
        }
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        // ******* TODO: PART IV *******
        let i = this.tableElements.length;
        while (i--) {
            //check if game line, remove
            if (this.tableElements[i].value.type === 'game')
                this.tableElements.splice(i, 1);
        }

    }


}
