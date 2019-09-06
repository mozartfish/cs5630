// Global variable for keeping track of children for the position function
var leafNodeCounter;

/** Class representing a Tree. */
class Tree {

    // variable for keeping track of children for position
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
        
        //For debugging purposes
        // console.log(this.nodeList);

    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
        let rootNode = this.nodeList.find(theRootNode => theRootNode.parentName === "root");

        this.assignLevel(rootNode, 0);
        this.assignPosition(rootNode, 0);

        // For debugging purposes
        for (var g = 0; g < this.nodeList.length; g++)
        {
            let foo = this.nodeList[g];
            console.log("Name: " + foo.name);
            console.log ("Level: " + foo.level);
            console.log ("Position: " + foo.position);
        }

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

    }

}