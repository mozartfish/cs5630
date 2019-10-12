/** Class implementing the tree view. */
class Tree {
  /**
   * Creates a Tree Object
   */
  constructor() {}

  /**
   * Creates a node/edge structure and renders a tree layout based on the input data
   *
   * @param treeData an array of objects that contain parent/child information.
   */
  createTree(treeData) {
    // ******* TODO: PART VI *******

    // console.log("View the Tree data", treeData);

    // Test Case for how to access data from tree

    // let element1 = treeData[0];
    // let element1ParentGame = element1.ParentGame;
    // let foo = treeData[element1ParentGame];
    // let fooID = foo.id;
    // console.log("The element located at element1 Parent Game index is", foo);
    // console.log("The id of foo is", fooID);
    // console.log("The Parent Game of element 1 is", element1.ParentGame);

    // A function for generating lists for looking at the data
    function GenerateList(data, attribute)
    {
      let attributeList = [];
      data.forEach(element => {
        let value = element[attribute]
        attributeList.push(value);
      });
      return attributeList;
    }

    // lists for looking at the data
    let parentGameList = GenerateList(treeData, "ParentGame");
    let teamNameList = GenerateList(treeData, "Team");
    let teamIDList = GenerateList(treeData, "id");
    let winsList = GenerateList(treeData, "Wins");
    let lossesList = GenerateList(treeData, "Losses");
    // console.log("The parent game list for the tree", parentGameList);
    // console.log("The team list for the tree", teamNameList);
    // console.log("The Team ID List for the tree", teamIDList);
    // console.log("The Wins List. Wins are represented by 1 and losses are represented by 0", winsList);
    // console.log("The Losses List. Losses are represented by 1 and wins are represented by 0", lossesList);

    // Test case for exploring bugs with accessing parentGame ids

    // let getRekt = treeData.length - 1;
    // let barB = treeData[getRekt].ParentGame;
    // console.log("the value of get rekt is", getRekt);
    // // console.log("The value of barB's parentGame is", barB);
    // // console.log("The id of barB's parent is", treeData[barB].id); // treeData[barB] is undefined so an error message is thrown
    //                                                                  // this explains all the weird D3 error messages
    // if (treeData[barB] === undefined)
    // {
    //   console.log("the value is undefined");
    //   console.log("get rekt");
    // }

    // The following examples were used for understanding how to render trees and how to set up trees in d3
    // https://observablehq.com/@d3/collapsible-tree
    // https://observablehq.com/@d3/d3-stratify
    // https://codepen.io/kirangadhave/pen/QWLoYML
    // https://bl.ocks.org/d3noob/e7e37cfe0e8763cb0915dee33cc2a24b
    // http://bl.ocks.org/d3noob/8375092

    //Create a tree and give it a size() of 800 by 300.
    let gameTree = d3.tree().size([800, 300]);

    let root = d3.stratify()
                 .id(d => d.id)
                 .parentId(function(d){
                   if (treeData[d.ParentGame] === undefined)
                   {
                     return "";
                   }
                   else
                   {
                     return treeData[d.ParentGame].id;
                   }
                 })
                 (treeData);

    // Set up the tree hierarchy
    // console.log("Setting up the tree hierarchy");
    const hData = d3.hierarchy(root, d => d.children);
    const nodes = gameTree(hData);

    // An SVG and group already exists in the HTML file and use those for rendering the tree
    // SVG Dimensions: Width = 500 Height = 900
    // Group id: "tree"
    // Dimensions of cells for layout
    // console.log("added in the dimensions of the cells");
    const cellWidth = 70;
    const cellHeight = 20;
    const cellBuffer = 15;

    // Transform the tree group for rendering the tree such that the tree doesn't overlap with the table
    const treeGroup = d3.select("#tree")
                      .attr("transform", "translate(" + (cellWidth + 50) + "," + cellHeight + ")");
  
    // Set up the links for the tree
    // console.log("setting up the links for the tree");
    const links = treeGroup.selectAll(".link")
                           .data(nodes.descendants().slice(1))
                           .join("path")
                           .classed("link", true)
                           .attr("d", function(d){
                             return "M" + d.y + "," + d.x
                                + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                                + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                                + " " + d.parent.y + "," + d.parent.x;
                           });

    // Add nodes to the links
   // console.log("adding nodes to the tree");
    // List for storing data objects for debugging
    let dataObjectList = [];
    const node = treeGroup.selectAll(".node")
                          .data(nodes.descendants())
                          .join("g")
                          .attr("class", function(d){
                            // update dataObjectList
                            dataObjectList.push(d);

                            // the properties of the data are stored in a property called data
                            // to access the properties we have to use .data.data which makes zero sense but somehow
                            // allows access to the wins, team, losses properties etc
                            // according to the data lists for wins and losses, wins and losses are represented with boolean values
                            // 1 - Team won the game 0 - Team lost the game
                            // To assign the class we can pick a property (Wins or Losses) and assign a class based on the value
                            let matchResult = "";
                            if (d.data.data.Wins === "1")
                              matchResult = " winner";
                            else
                              matchResult = " loser";
                            return "node" + matchResult;
                          })
                          .attr("transform", function(d){
                            return "translate(" + d.y + "," + d.x + ")";
                          });
    // For debugging

    // console.log("The dataObject list", dataObjectList);
    // let foo = dataObjectList[0];
    // console.log("the value of foo is", foo);
    // let fooDataObject = foo.data.data.Wins;
    // console.log("The value of foo's data Object is", fooDataObject);

    // Add circles to the nodes in the tree
    // console.log("adding circles to the nodes")
    node.append("circle")
        .attr("r", 10);
    
    // Append the text with the country name
    // console.log("Appending the text that contains the country name");
    node.append("text")
        .attr("dy", "0.6em")
        .attr("x", d => (d.children ? -13 : 13))
        .style("text-anchor", d => (d.children ? "end" : "start"))
        .text(d => d.data.data.Team);
  }

  /**
   * Updates the highlighting in the tree based on the selected team.
   * Highlights the appropriate team nodes and labels.
   *
   * @param row a string specifying which team was selected in the table.
   */
  updateTree(row) {
    // ******* TODO: PART VII *******
    console.log("entered the tree update");
    console.log("the row selected is", row.key);

    let treeLinks = d3.select("#tree").selectAll("path.link");
    let treeNodes = d3.select("#tree").selectAll("g.node").selectAll("text");

    // Aggregate Rows and Game Rows have different types of highlighting

    // Aggregate Row Highlighting
    if (row.value.type === "aggregate")
    {
      // Update the tree links
      console.log("updating the tree links");
      treeLinks.each(function(d)
      {
        if (d.data.data.Team === row.key)
        {
          //console.log(this);
          d3.select(this).classed("selected", true);
        }
      });

      // Update the tree nodes
      console.log("updating the tree nodes");

      treeNodes.each(function(d){
        if (d.data.data.Team === row.key)
        {
          //console.log("the value of this is", this);
          d3.select(this).classed("selectedLabel", true);
        }
      })
    }
    
  }
  /**
   * Removes all highlighting from the tree.
   */
  clearTree() {
    // ******* TODO: PART VII *******
    // You only need two lines of code for this! No loops!
    console.log("exited the tree");
    d3.select("#tree").selectAll("path.link").classed("selected", false);
    d3.select("#tree").selectAll("g.node").selectAll("text").classed("selectedLabel", false);




  }
}
