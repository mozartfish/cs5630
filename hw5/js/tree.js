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

    //Create a tree and give it a size() of 800 by 300.
    let gameTree = d3.tree().size([800, 300]);

    // Applying Kiran's advice on a test case

    console.log("View the Tree data");
    console.log(treeData);
    // let element1 = treeData[0];
    // let element1ParentGame = element1.ParentGame;
    // let foo = treeData[element1ParentGame];
    // let fooID = foo.id;
    // console.log("The element located at element1 Parent Game index is", foo);
    // console.log("The id of foo is", fooID);
    //console.log("The Parent Game of element 1 is", element1.ParentGame);

    let root = d3.stratify()
                 .id(d => d.id)
                 .parentId(function(d)
                 {
                     // France is the only country which has no parent game
                     // Thus if we do a treeData lookup at the index we get an undefined
                     // which we resolve with saying that it's the root node from the picture
                     if (d.ParentGame === "undefined")
                     {
                         return "root";
                     }
                     else
                     {
                         return treeData[d.ParentGame].id;
                     }
                 })
    //Add nodes and links to the tree.
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
