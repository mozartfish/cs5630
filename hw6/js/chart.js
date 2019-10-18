/**
 * Constant for accessing the position property
 */
const position = "position";
/**
 * Constant for accesing the sourceX property
 */
const sourceX = "sourceX";
/**
 * Constant for accessing the sourceY property
 */
const sourceY = "sourceY";
/**
 * The margins for the visualization
 */
const swarmChartMargin = {top: 20, r: 30, bottom: 40, left:30},
      swarmChartWidth = 960 - swarmChartMargin.left - swarmChartMargin.right
      swarmChartHeight = 500 - swarmChartMargin.top - swarmChartMargin.bottom;

/**
 * The chart class. Defines a chart object that will be used to create the beeswarm chart
 */
class CHART{
    /**
     * Constructor for chart object
     */
    constructor(politicalData){
        /**
         * Scale for the political party x axis scale for the swarm chart
         */
        this.politicalPartyScale = null;

        /**
         * The data is loaded in as a json representation of a d3 force layout
         */
        this.chartData = politicalData;
        console.log("the data set is", politicalData);
    }

    /**
     * Function that creates a new chart object based on the data loaded
     */
    createChart(){
        console.group("entered the create chart function");

        /**
         * Function that calculates the min value for a particular property
         */
        function findMinValue(data, attribute){
            let minValueList = [];
            data.forEach(element => {
                let value = element[attribute];
                minValueList.push(value);
            });
            console.log("The min value list for", attribute, "is", minValueList);
            let minValue = d3.min(minValueList);
            console.log("The min value for", attribute, "is", minValue);
        }
        /**
         * Function that calculates the max value for a particular property
         */
        function findMaxValue(data, attribute){
            let maxValueList = [];
            data.forEach(element => {
                let value = element[attribute];
                maxValueList.push(value);
            });
            console.log("The max value list for", attribute, "is", maxValueList);
            let maxValue = d3.max(maxValueList);
            console.log("The min value for", attribute, "is", maxValue);
        }
        
        // Determine the min and max values for the domain for the political scale
        let politicalScaleMinValue = findMinValue(this.chartData, position);
        let politicalScaleMaxValue = findMaxValue(this.chartData, position);
    }
}