//get the endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//tutor told me to remove this. That it wasn't really necessary.
// fetch the json data and console log it
// d3.json(url).then(function(data) {
//     console.log(data);
// });

//create a function to return the top 10 OTUs found
function makePlots(testSubjectId) {
    d3.json(url).then((data) => {
        //get samples data
        let samples = data.samples;
        let sampleTestSubject = samples.filter(sampleObj => sampleObj.id == testSubjectId);
        let result = sampleTestSubject[0];
        // get metadata
        // let metadata = data.metadata
        // let metaDataTestSubject = samples.filter(sampleObj => bacteriaInfo.id == testSubjectId)
        
        let sample_values = result.sample_values;
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
    
        let yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        let barData = [{
            type: "bar",
            y: yticks,
            x: sample_values.slice(0,10).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            orientation: 'h'
        }];
        let layout = {
            title: "Top Ten Bacterial Cultures Found",
            margin: {t: 30},
        }
    Plotly.newPlot("bar", barData, layout);

    
        //create the bubble chart
        let bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values,
            }
        }];
        let bubbleLayout = {
            title: "Belly Button Sample",
        };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    })
}   

//Get metadata
function makeMetadata(testSubjectId) {
    d3.json(url).then((data) => {
        let metaData = data.metadata;
        let metaDataTestSubject = metaData.filter(bacteriaInfo => bacteriaInfo.id == testSubjectId);
        let resultMetaData = metaDataTestSubject[0];
        let panel = d3.select("#sample-metadata");
        panel.html("");
        for (key in resultMetaData) {
            panel.append("h6").text(`${key.toUpperCase()}: ${resultMetaData[key]}`);
        }
    })
}

//function that changes the metadata and the plots every time a new test subject is selected
function optionChanged(testSubjectId) {
    makePlots(testSubjectId);
    makeMetadata(testSubjectId);
}

// Initialize page
//create function for the dropdown
function init() {
    d3.json(url).then((data) => {
        let subjects = data.names;

        let dropDown = d3.select("#selDataset");
        for ( const id of subjects) {
            let newOption = dropDown.append("option");
            newOption.attr("value", id);
            newOption.text(id);
        }   
        //sets the first subject=940 to show up 
        let subjectOne = subjects[0];
        optionChanged(subjectOne); 
    })
}


init();


