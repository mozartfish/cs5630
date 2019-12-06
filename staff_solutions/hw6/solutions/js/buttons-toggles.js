function renderToggle(div, labelText) {
  div
    .append("text")
    .text(labelText)
    .classed("toggle-text", true);
  let label = div.append("label").classed("switch", true);

  let check = label.append("input").attr("type", "checkbox");
  label.append("span").classed("slider round", true);
  return check;
}

function renderButton(div, labelText) {
  let button = div.append("button").text(labelText);
  button.classed("btn btn-outline-primary", true);
  button.style("margin-left", "20px");

  return button;
}
