const data = [
  { name: "Top Level", parent: null },
  { name: "Level 2: A", parent: "Top Level" },
  { name: "Level 2: B", parent: "Top Level" },
  { name: "Child of A", parent: "Level 2: A" },
  { name: "Child of A", parent: "Level 2: A" }
];

const margin = { top: 20, right: 180, bottom: 30, left: 100 },
  width = 1000 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;

const svg = d3
  .select("#tree")
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right);

svg
  .append("rect")
  .classed("frame-rect", true)
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right);

const treeMap = d3.tree().size([height, width]);

const treeData = d3
  .stratify()
  .id(d => d.name)
  .parentId(d => d.parent)(data);

treeData.each(d => (d.name = d.id));

const hData = d3.hierarchy(treeData, d => d.children);
const nodes = treeMap(hData);

const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const links = g
  .selectAll(".link")
  .data(nodes.descendants().slice(1))
  .join("path")
  .classed("link", true)
  .attr(
    "d",
    d =>
      `M ${d.y}, ${d.x} C ${(d.y + d.parent.y) / 2}, ${d.x} ${(d.y +
        d.parent.y) /
        2}, ${d.parent.x} ${d.parent.y}, ${d.parent.x}`
  );

const node = g
  .selectAll(".node")
  .data(nodes.descendants())
  .join("g")
  .attr("class", d => `node ${d.children ? "node--internal" : "node--leaf"}`)
  .attr("transform", d => `translate(${d.y}, ${d.x})`);

node
  .append("circle")
  .attr("r", 10)
  .style("fill", "gray");

node
  .append("text")
  .attr("dy", "0.35em")
  .attr("x", d => (d.children ? -13 : 13))
  .style("text-anchor", d => (d.children ? "end" : "start"))
  .text(d => d.data.name);
