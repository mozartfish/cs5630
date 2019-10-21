/** Class representing a Tree. */
class Tree {
  /**
     *  Creates a Tree Object
     *  Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     *  note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json object with name and parent fields
     */
    constructor(json) {
        // Create an array of newly instantiated node objects
        this.nodes = json.map(n => {
            return new Node(n.name, n.parent);
        });

        // Iterate through array and populate with parentNodes
        //	note: may be integrated into buildTree()
        this.nodes.forEach(node => {
            node.parentNode = this.nodes.find(n => {
                return n.name === node.parentName;
            });
        });
    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {

        // Populate children
        this.nodes.forEach(n => {	
            console.log("n", n)			// for each node
            if (n.parentNode !== undefined) { 	// if parentNode exists
                n.parentNode.addChild(n); 		// add node as child to parentNode
            }
        });

        // Find root
        let root = this.nodes.find(n => {
            return !n.parentNode;
        });

        // Assign levels and positions to each node, starting at root
        this.assignLevel(root, 0);
        this.assignPosition(root, 0);

        // For generating nodeStructure image
        // console.log(this.nodes[2]);

        // For generating wrong image
        // this.nodes.filter(n => n.level === 3).forEach(n => n.position = n.position-2)
    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
        // Assign level
        node.level = level;

        // Recursively call assignLevel on this node's children;
        node.children.forEach(n => {
            this.assignLevel(n, level + 1);
        });
    }

    /**
     * Recursive function that assign positions to each node
     */
    // Better Solution
    assignPosition(node, position) {
        node.position = position;
        if (node.children.length === 0) return ++position;

        node.children.forEach((child) => {
            position = this.assignPosition(child, position);
        });

        return position;
    }

    // Alternative Longer Reference Solution
    // assignPosition(node, position) {

    //     if (node.children.length > 0) { // If the node has children...
    //         // Recursively call assignPosition on the node's children
    //         node.children.forEach((child) => {

    //             let specifiedPosition = position;
    //             let availablePosition = Math.max(...this.nodes.filter(n => {
    //                     return n.level === child.level;
    //                 })
    //                     .map(n => {
    //                         return n.position;
    //                     })
    //             ) + 1;

    //             specifiedPosition > availablePosition ?
    //                 this.assignPosition(child, specifiedPosition)
    //                 : this.assignPosition(child, availablePosition);

    //         });

    //         // Set node position to minima of children's positions
    //         node.position = Math.min(...node.children.map(n => {
    //             return n.position;
    //         }));
    //     }
    //     else { // Else... (dealing w/ leaf node)
    //         // Set specified position
    //         node.position = position;
    //     }

    // }

    /**
     * Function that renders the tree
     */
    renderTree() {
        // ----------- Custom -----------
        // Convenience structure for updating variables (not required)
        let custom_vars = {
            x_scale: 160,
            y_scale: 100,
            x_offset: 50,
            y_offset: 50,
            radius: 43
        };

        // ----------- Initalize SVG -----------
        // Create svg if it doesn't already exist										(!) Lab Discussion 1 -- Explain why this check exists
        let svg = d3.select('#container');

        if (svg.size() === 0) {
            svg = d3.select('body')
                .append('svg')
                .attr('id', 'container');
        }

        // Style svg
        svg.attr('width', 1200)
            .attr('height', 1200);

        // ----------- Render Edges -----------

        // Old D3V4(Update) Selection	
        /*												(!) Lab Discussion 2 -- Update, Enter, Exit Loop
        let allEdges = svg.selectAll('line')
            .data(this.nodes.filter(n => {
                return n.parentNode;
            }));*/

        // New (Enter) Selection
        //let newEdges = allEdges.enter()
        //    .append('line');

        // Get rid of extra elements
        //allEdges.exit().remove();

        // Merge existing and new selections
        //allEdges = newEdges.merge(newEdges);
        //------end old d3V4 update-----//

        ///New d3V5 data binding///
        let allEdges = svg.selectAll('line')
        .data(this.nodes.filter(n => {
            return n.parentNode;
        })).join('line');

        // Compare to:
        // 		let allEdges = newEdges.enter().append("line").merge(allEdges););

        // Update properties according to data
        allEdges.attr('x1', n => {
            return n.level * custom_vars.x_scale + custom_vars.x_offset;
        })
            .attr('x2', n => {
                return n.parentNode.level * custom_vars.x_scale + custom_vars.x_offset;
            })
            .attr('y1', n => {
                return n.position * custom_vars.y_scale + custom_vars.y_offset;
            })
            .attr('y2', n => {
                return n.parentNode.position * custom_vars.y_scale + custom_vars.y_offset;
            });

        /**
         *  This is an update to for the homework, designed to provide more experience
         *  with nesting structures...  -- required for full credit
         *                                                                             */
        // ----------- Render Nodes (Full Credit) -----------
        //Existing(Update) Selection
        let allNodeGroups = svg.selectAll('.nodeGroup')
            .data(this.nodes).join('g').classed('nodeGroup', true);

        //Old D3V5 (Enter) Selection---------
        // let allNodeGroups = svg.selectAll('.nodeGroup')
        // .data(this.nodes)
        // let newNodeGroups = allNodeGroups.enter()
        //    .append('g');

        //Get rid of extra nodes
        // allNodeGroups.exit().remove();

        // Merge existing and new selections
        //allNodeGroups = newNodeGroups.merge(allNodeGroups);

        //END OLD ENTER EXIT MERGE D3V4

        // Update properties according to data											(!) Lab Discussion 3 -- Judicious Use of Groups, SVG Order importance
        allNodeGroups
            .attr("transform", d => {
                    return "translate("
                        + (d.level * custom_vars.x_scale + custom_vars.x_offset) // x position
                        + ","
                        + (d.position * custom_vars.y_scale + custom_vars.y_offset) // y position
                        + ")"
                }
            );

        // -- Add circles to each group
        allNodeGroups.append("circle")
            .attr("r", custom_vars.radius);

        // -- Add text to each group
        allNodeGroups.append("text")
            .attr("class", "label")
            .text(d => {
                return d.name.toUpperCase()
            }); //d.level+","+d.position

        //*/

        /**
         *  This version of the code does not use groups --
         *    will garner partial credit
         *                                                      *
        // ----------- Render Nodes (Partial Credit) -----------
        // Existing(Update) Selection
        let allNodes = svg.selectAll('circle')
            .data(this.nodes);

        // New (Enter) Selection
        let newNodes = allNodes.enter()
            .append('circle');

        // Get rid of extra nodes
        // allNodes.exit().remove();

        // Merge existing and new selections
        allNodes = newNodes.merge(allNodes)

        // Update properties according to data
        allNodes.attr('cx', n => { 
            return n.level * custom_vars.x_scale + custom_vars.x_offset;
        })
            .attr('cy', n => {
                return n.position * custom_vars.y_scale + custom_vars.y_offset;
            })
            .attr('r', custom_vars.radius);

        // ----------- Render Labels -----------
        // Existing(Update) Selection
        let allLabels = svg.selectAll('text')
            .data(this.nodes);

        // New (Enter) Selection
        let newLabels = allLabels.enter()
            .append('text')
            .attr('class','label');

        // Get rid of extra nodes
        // allLabels.exit().remove();

        // Merge existing and new selections
        allLabels = newLabels.merge(allLabels);

        // Update properties according to data
        allLabels.attr('x', n => {
            return n.level * custom_vars.x_scale + custom_vars.x_offset;
        })
            .attr('y', n => {
                return n.position * custom_vars.y_scale + custom_vars.y_offset; 
            })
            .text( n => { 
                return  n.name.toUpperCase() 
            });
        //*/

    }

}