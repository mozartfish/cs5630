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

    console.log("View the Tree data");
    console.log(treeData);

    //Create a tree and give it a size() of 800 by 300.
    let gameTree = d3.tree().size([800, 300]);

    // Test Case for how to access data using ParentGame
    let element1 = treeData[0];
    let element1ParentGame = element1.ParentGame;
    let foo = treeData[element1ParentGame];
    let fooID = foo.id;
    console.log("The element located at element1 Parent Game index is", foo);
    console.log("The id of foo is", fooID);
    console.log("The Parent Game of element 1 is", element1.ParentGame);

    let list = [];
    let root = d3.stratify()
    .id(d => d.id)
    .parentId(function(d){
      if (d.ParentGame === "undefined")
      {
        return treeData[d.ParentGame].id;
      }
      else
      {
        return " ";
      }
    })
    // .parentId(d => d.ParentGame ? treeData[d.ParentGame].id : '')
    (treeData);
 
    // let root = d3.stratify()
    //              .id(d => d.id)
    //              .parentId(function(d)
    //              {
    //                  // France is the only country which has no parent game
    //                  // Thus if we do a treeData lookup at the index we get an undefined
    //                  // which we resolve with saying that it's the root node from the picture
    //                  if (d.ParentGame === "undefined")
    //                  {
    //                      return "root";
    //                  }
    //                  else
    //                  {
    //                      return treeData[d.ParentGame].id;
    //                  }
    //              });

    // const hData = d3.hierarchy(treeData, d => d.children);
    // const nodes = gameTree(hData);

    // let treeGroup = d3.select("#tree")
    //                   .attr("transform", "translate(100, 0)");
    // let links = treeGroup.selectAll(".link")
    //                      .data(nodes.descendants().slice(1))
    //                      .join("path")
    //                      .classed("link", true)
    //                      .attr("d", function(d)
    //                      {
    //                         return "M" + d.y + "," + d.x
    //                         + "C" + (d.y + d.parent.y) / 2 + "," + d.x
    //                         + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
    //                         + " " + d.parent.y + "," + d.parent.x;
    //                      })
    // let node = treeGroup.selectAll(".node")
    //                     .data(nodes.descendants())
    //                     .join("g")
    //                     .attr("class", d => "node" + (d.Wins === "1" ? " winner" : " loser"))
    //                     .attr("transform", d => "translate(" + d.y + "," + d.x + ")");
    // node.append("circle")
    //     .attr("r", 10);
  }

  /**
   * Updates the highlighting in the tree based on the selected team.
   * Highlights the appropriate team nodes and labels.
   *
   * @param row a string specifying which team was selected in the table.
   */
  updateTree(row) {
    // ******* TODO: PART VII *******
  }

  /**
   * Removes all highlighting from the tree.
   */
  clearTree() {
    // ******* TODO: PART VII *******
    // You only need two lines of code for this! No loops!
  }
}
