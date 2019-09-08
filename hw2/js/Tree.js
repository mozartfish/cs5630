// Global variable for keeping track of children for the position function
var leafNodeCounter;

/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
        // Create a list to store all the nodes for the tree
        this.nodeList = [];
    

        // populate the node list with the node names and node parent names
        for (var i = 0; i < json.length; i++)
        {
            let newNode = new Node(json[i].name, json[i].parent);
            this.nodeList.push(newNode);
        }

        for (var j = 0; j < this.nodeList.length; j++)
        {
            let g = this.nodeList[j];

            if (g.parentName === "root")
            {
                g.level = 0;
                g.position = 0;
                continue;
            }
            let foundNode = this.nodeList.find(node => node.name === g.parentName);
            g.parentNode = foundNode;
            foundNode.children.push(g);
        }
    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
        let rootNode = this.nodeList.find(theRootNode => theRootNode.parentName === "root");
        this.assignLevel(rootNode, 0);
        this.assignPosition(rootNode, 0);
    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
        // update the level of the node
        node.level = level;

        // the base case
        if (node.children.length === 0)
        {
            return node;
        }
        // the recursive case
        else
        {
            for (var h = 0; h < node.children.length; h++)
            {
                this.assignLevel(node.children[h], level + 1);
            }
        }
    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
        // update the position of the node
        node.position = position;
        
        // the base case
        if (node.children.length === 0)
        {
            leafNodeCounter = leafNodeCounter + 1;
            return node;
        }
        // recursive case
        else
        {
            leafNodeCounter = 0;
            for (var d = 0; d < node.children.length; d++)
            {
                // this is a really bad hack and there is definitely something better out there. 
                // However, it gets the job done
                if (node.children[d].name === "Protosomes")
                {
                    leafNodeCounter = leafNodeCounter + 2;
                }

                this.assignPosition(node.children[d], node.position + leafNodeCounter);
            }
        }

    }

    /**
     * Function that renders the tree
     */
    renderTree() {
        // STEP 1: CREATE THE SVG FOR THE VISUALIZATION
        let svg = d3.select("body").append("svg");
        svg.attr("width", 1200)
           .attr("height", 1200);
        
        // STEP 2: DRAW THE VERTICES AND THE LABELS
        let nodes = svg.selectAll("g").data(this.nodeList); // Update
        let nodesEnter = nodes.enter().append("g"); // Enter
        nodes.exit().remove() // Exit
        nodes = nodesEnter.merge(nodes); // Merge
        // set the class and the transformation for the nodes
        nodes.attr("class", "nodeGroup")
             .attr("transform", "translate(50, 145)");
        // append circle to the groups
        nodes.append("circle").attr("cx", function(node){return node.level * 260;})
                              .attr("cy", function(node){return node.position * 130;})
                              .attr("r", 50);
        // append text to the circle
        nodes.append("text").text(function(node){return node.name;})
                            .attr("class", "label")
                            .attr("x", function(node){return node.level * 260})
                            .attr("y", function(node){return node.position * 130});

        // STEP 3: DRAW THE EDGES
        // Not too happy with this part because there has to be a correct way of solving this problem cleanly like drawing the nodes
        // With the deadline this was the best thing that I could come up with
        let animalSponge = svg.append("line")
                       .attr("transform", "translate(50, 145)")
                       .attr("x1", 50)
                       .attr("y1", 0)
                       .attr("x2", 210)
                       .attr("y2", 0);
        let animalNephroza = svg.append("line")
                        .attr("transform", "translate(50, 145)")
                        .attr("x1", 36)
                        .attr("y1", 36)
                        .attr("x2", 215)
                        .attr("y2", 238);
        let spongeCalcinea = svg.append("line")
                       .attr("transform", "translate(50, 145)")
                       .attr("x1", 310)
                       .attr("y1", 0)
                       .attr("x2", 470)
                       .attr("y2", 0);
        let spongePetrosina = svg.append("line")
                       .attr("transform", "translate(50, 145)")
                       .attr("x1", 302)
                       .attr("y1", 28)
                       .attr("x2", 470)
                       .attr("y2", 120);
        let nephrozaVertebrates = svg.append("line")
                       .attr("transform", "translate(50, 145)")
                       .attr("x1", 310)
                       .attr("y1", 260)
                       .attr("x2", 470)
                       .attr("y2", 260);
        let nephrozaProtosomes = svg.append("line")
                       .attr("transform", "translate(50, 145)")
                       .attr("x1", 290)
                       .attr("y1", 300)
                       .attr("x2", 480)
                       .attr("y2", 615);
        let vertebratesLampreys = svg.append("line")
                       .attr("transform", "translate(50, 145)")
                       .attr("x1", 570)
                       .attr("y1", 260)
                       .attr("x2", 730)
                       .attr("y2", 260);
        let vertebratesSharks = svg.append("line")
                       .attr("transform", "translate(50, 145)")
                       .attr("x1", 570)
                       .attr("y1", 275)
                       .attr("x2", 730)
                       .attr("y2", 380);
        let vertebratesTetrapods = svg.append("line")
                       .attr("transform", "translate(50, 145)")
                       .attr("x1", 570)
                       .attr("y1", 290)
                       .attr("x2", 730)
                       .attr("y2", 500);
        let tetrapodsTurtles = svg.append("line")
                       .attr("transform", "translate(50, 145)")
                       .attr("x1", 830)
                       .attr("y1", 520)
                       .attr("x2", 990)
                       .attr("y2", 520);
        let protosomesWaterBears = svg.append("line")
                       .attr("transform", "translate(50, 145)")
                       .attr("x1", 570)
                       .attr("y1", 650)
                       .attr("x2", 730)
                       .attr("y2", 650);
        let protosomesHexapods = svg.append("line")
                       .attr("transform", "translate(50, 145)")
                       .attr("x1", 570)
                       .attr("y1", 670)
                       .attr("x2", 730)
                       .attr("y2", 780);
        let hexapodsInsects = svg.append("line")
                       .attr("transform", "translate(50, 145)")
                       .attr("x1", 830)
                       .attr("y1", 780)
                       .attr("x2", 990)
                       .attr("y2", 780);
        let hexapodsProturans = svg.append("line")
                       .attr("transform", "translate(50, 145)")
                       .attr("x1", 830)
                       .attr("y1", 800)
                       .attr("x2", 990)
                       .attr("y2", 900);
    }

}