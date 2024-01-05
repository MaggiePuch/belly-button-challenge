//url for data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//create function for plot creation and demographic info/metadata
function updateData(selectedSample, data) {

    //filter data to selected sample
  let sampleData = data.samples.find(sample => sample.id === selectedSample);

  //create bar chart. use slice to only get the top 10 results. reverse to make them decending order.
  let barChart = [{
    x: sampleData.sample_values.slice(0, 10).reverse(),
    y: sampleData.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
    text: sampleData.otu_labels.slice(0, 10).reverse(),
    type: "bar",
    orientation: "h"
  }];

  //display bar chart
  Plotly.newPlot("bar", barChart);

  //create bubble chart
  let bubbleData = [{
    x: sampleData.otu_ids,
    y: sampleData.sample_values,
    text: sampleData.otu_labels,
    mode: 'markers',
    marker: {
      size: sampleData.sample_values,
      color: sampleData.otu_ids,
      colorscale: 'Earth'
    }
  }];

  //display bubble chart
  Plotly.newPlot('bubble', bubbleData);

  //demographic info populated using metadata in json
  let metadata = data.metadata.find(item => item.id === parseInt(selectedSample));
  let metadataPanel = d3.select("#sample-metadata");
  metadataPanel.html("");
  Object.entries(metadata).forEach(([label, info]) => {
    metadataPanel.append("p").text(`${label}: ${info}`);
  });
}

//d3 for data
d3.json(url).then(function(data) {
  console.log(data); 

  //dropdown menu with sample ids
  let dropdownMenu = d3.select("#selDataset");
  data.names.forEach(function(sample) {
    dropdownMenu.append("option").text(sample).property("value", sample);
  });

  //update plots based on selected id
  function newData(selectedSample) {
    updateData(selectedSample, data);
  }

  // Use the first sample to initialize the page
  newData(data.names[0]);
});