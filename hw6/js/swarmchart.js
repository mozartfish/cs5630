/**
 * Some constants for properties that will be used a lot
 */
const position = "position";
const sourceX = "sourceX";
const sourceY = "sourceY";

class SWARMCHART{
    /**
     * Create a swarmChart object
     */
    constructor(politicalData){
        /**
         * A force json file that contains all the information for the swarm chart
         */
        this.chartData = politicalData;
        console.log("the data set is", politicalData);


        /**
         * Scales
         */
        this.scalePoliticalScale = null;
    }
    createChart() {
        console.log("entered the create chart function");
        // helper function for finding the min value
        function findMinValue(data, attribute)
        {
            let minValueList =[];
            data.forEach(element => {
                let value = element[attribute];
                minValueList.push(value);
            });
            console.log("The min value list is", minValueList);
            let minValue = d3.min(minValueList);
            console.log("The min value is", minValue);
        }
        // helper function for finding the max value
        function findMaxValue(data, attribute)
        {
            let maxValueList = [];
            data.forEach(element => {
                let value = element[attribute];
                maxValueList.push(value);
            });
            console.log("The max value list is", maxValueList);
            let maxValue = d3.max(maxValueList);
            console.log("The max value is", maxValue); 
        }
        findMinValue(this.chartData, position);
        findMaxValue(this.chartData, position);

        
    }

}