function renderToggle(div, labelText) {
  div
    .append("text")
    .text(labelText)
    .classed("toggle-label", true);

  let toggleLabel = div.append("label").classed("switch", true);

  // checkbox for the toggle
  let checkBox = toggleLabel.append("input").attr("type", "checkbox");
  toggleLabel.append("span").classed("slider round", true);

  return checkBox;
}
function renderButton(div, labelText) {
  let button = div.append("button").text(labelText);
  button.classed("btn btn-outline-primary", true);
  button.style("margin-left", "20px");
  return button;
}
