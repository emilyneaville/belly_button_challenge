// url to belly button json
url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to input data into dropdown menu
function init() {

    // Fetch the json data
    d3.json(url).then((data) => {

        // Print data to console
        console.log(data);

        // Select the dropdown menu
        let dropdownMenu = d3.select("#selDataset");
        
        // Console log which subject id is selected to confirm it works
        let dataset = dropdownMenu.property("value");
        console.log(dataset)

        // Extract the names from the data
        let names = data.names;

        // Put the names into the dropdown menu
        names.forEach((name) => {
            dropdownMenu
                .append("option")
                .text(name)
                .property("value");

        // Use the first sample to build the initial panel
        let firstSample = names[0];
        buildDemoPanel(firstSample);

        });
    });
};

// Build the demographic information panel
function buildDemoPanel(selectedId) {

    // Fetch the json data
    d3.json(url).then((data) => {

        // Filter the data for the object with the desired sample ID
        let id = data.metadata.filter(sample => sample.id == selectedId);

        // Select the demographic info panel using d3
        let demographicPanel = d3.select("#sample-metadata");
        
        // Clear the demographic info panel after each selection
        demographicPanel.html("");

        // Append the demographic info to the panel for the selected id
        // Use Object.entries to add each key:value pair of the metadata to the panel, then append a new tag for each key:value pair
        Object.entries(id[0]).forEach(([key, value]) => {
            demographicPanel.append("h5").text(`${key}: ${value}`);
        
        });
    });
};

// Build a function to handle the change event
function optionChanged(newSample) {
    // Fetch new data each time a new sample id is selected
    buildDemoPanel(newSample);
    buildCharts(newSample);

};
// Build the charts
function buildCharts(subjectId) {
    
    // Fetch the json data
    d3.json(url).then((data) => {
        
        // Filter the samples in the data for the desired subject to get data from
        let samples = data.samples.filter(sample => sample.id == subjectId);
        
        // Create a variable that holds the first sample in the array
        let filteredSample = samples[0];

        // Create variables that hold the otu_ids, otu_labels, and sample_values of the first sample
        // Slice the first 10 OTUs for plotting
        // .map() to add "OTU" to the id
        // Reverse the array to accomodate Plotly's defaults
        let barIds = filteredSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let barLabels = filteredSample.otu_labels;
        let barValues = filteredSample.sample_values.slice(0, 10).reverse();

        // Create the trace for the bar chart
        let barData = [{
            x: barValues,
            y: barIds,
            text: barLabels,
            type: "bar",
            orientation: "h"
        }];

        // Apply a layout to the bar chart
        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            xaxis: {title: "Sample Value"},
            height: 500,
            width: 700
        };

        // Render the bar chart to the div tag with id "bar"
        Plotly.newPlot("bar", barData, barLayout);

    }); 
};

// Initialize the dashboard
init();
