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
         * Set up the scales
         */
        this.scalePoliticalScale = null;
    }
    createChart() {
        
    }

}