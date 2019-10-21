/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******

        let tree = d3.tree()
            .size([800, 300]);
        // debug
        //console.log("treeData" , treeData);

        let root = d3.stratify()
            .id(d => d.id)
            .parentId(d => d.ParentGame ? treeData[d.ParentGame].id : '')
            (treeData);

        tree(root);

        let g = d3.select("#tree").attr("transform", "translate(80,0)");

        let link = g.selectAll(".link")
            .data(root.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function (d) {
                return "M" + d.y + "," + d.x
                    + "C" + (d.parent.y + 20) + "," + d.x
                    + " " + (d.parent.y + 20) + "," + d.parent.x
                    + " " + d.parent.y + "," + d.parent.x;
            });

        let node = g.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", function (d) {
                return "node" + (d.data.Wins === "1" ? " winner" : " loser");
            })
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        node.append("circle")
            .attr("r", 5);

        node.append("text")
            .attr("dy", 3)
            .attr("x", (d) => d.children ? -8 : 8)
            .style("text-anchor", d => d.children ? "end" : "start")
            .text((d) => d.data.Team);
    };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {

        // ******* TODO: PART VII *******
        let team = row.key;
        let opponent = row.value.Opponent;

        let linkSelection, nodeSelection;

        if (row.value.type === 'aggregate') {
            linkSelection = d3.selectAll('.link')
                .filter(function (d) {
                    return d.data.Team === team && d.data.Wins === "1"
                });
            nodeSelection = d3.selectAll('.node text')
                .filter(function (d) {
                    return d.data.Team === team
                });
        }
        else {
            linkSelection = d3.selectAll('.link')
                .filter(function (d) {
                    return (d.data.Team === team && d.data.Opponent === opponent) | (d.data.Team === opponent && d.data.Opponent === team)
                });
            nodeSelection = d3.selectAll('.node text')
                .filter(function (d) {
                    return (d.data.Team === team && d.data.Opponent === opponent) | (d.data.Team === opponent && d.data.Opponent === team)
                });
        }
        linkSelection.classed('selected', true);
        nodeSelection.classed('selectedLabel', true);
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        d3.selectAll('.link').classed('selected', false);
        d3.selectAll('.node text').classed('selectedLabel', false);
    }
}
