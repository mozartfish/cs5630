let filePath =
  "https://raw.githubusercontent.com/lhcb/opendata-project/master/Data/nobel.csv";

d3.csv(filePath).then((d, i) => {
  let data = d
    .filter(
      f => f["Residence"] != "No Data" && f["Role/Affiliate"] != "No Data"
    )
    .slice(0, 20);
  console.log("data", data);
  let columnKeys = d3.keys(data[0]).map(k => {
    return { head: k, sorted: false };
  });

  // create table
  let table = d3.select("#table-wrap").append("table");
  table.append("thead");
  table.append("tbody");

  //bind data to our rows and cells. draw up that table
  drawTable(data, columnKeys);

  // // Add a new entry with slice///
  // // uncomment below to see the new entry
  // let lastEntry = d[d.length - 1];
  // let addedEntry = addEntry(lastEntry, data);
  // console.log(addedEntry);
  // // We can add a new entry to our table with slice()
  // drawTable(addedEntry, columnKeys);
});

function addEntry(entry, bodyData) {
  console.log("entry", entry);
  console.log("data we want to add entry to", bodyData);
  bodyData.splice(1, 0, entry);

  return bodyData;
}

function drawTable(bodyData, headerData) {
  let table = d3.select("#table-wrap").select("table");
  // create table header
  let headers = table
    .select("thead")
    .selectAll("th")
    .data(headerData)
    .join("th")
    .text(d => d.head)
    .classed("reverse_resize", d => d.sorted);

  // create table body
  let tableRows = table
    .select("tbody")
    .selectAll("tr")
    .data(bodyData)
    .join("tr");

  let cells = tableRows
    .selectAll("td")
    .data(d => {
      console.log("before using d3.entries: ", d);
      console.log("after using d3.entries: ", d3.entries(d));
      return d3.entries(d);
    })
    .join("td");

  cells.html(d => d.value);

  headers.on("click", (d, i) => {
    if (d.sorted === false) {
      let newData = bodyData.sort((a, b) => {
        return a[d.head] < b[d.head] ? -1 : 1;
      });
      d.sorted = true;
      drawTable(newData, headerData);
    } else {
      let newData = bodyData.sort((a, b) => {
        return a[d.head] > b[d.head] ? -1 : 1;
      });
      d.sorted = false;
      drawTable(newData, headerData);
    }
  });
}
