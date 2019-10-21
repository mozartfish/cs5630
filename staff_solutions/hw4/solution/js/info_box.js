/** Data structure for the data associated with an individual country. */
class InfoBoxData {
    /**
     *
     * @param country name of the active country
     * @param region region of the active country
     * @param indicator_name the label name from the data category
     * @param value the number value from the active year
     */
    constructor(country, region, indicator_name, value) {
        this.country = country;
        this.region = region;
        this.indicator_name = indicator_name;
        this.value = value;
    }
}

/** Class representing the highlighting and selection interactivity. */
class InfoBox {
    /**
     * Creates a InfoBox Object
     * @param data the full data array
     */
    constructor(data) {
        // ++++++++ BEGIN CUT +++++++++++
        this.data = data;
        let label = d3.select('#country-detail').append('div').classed('label', true).append('div').classed('inner-div', true);
        d3.select('#country-detail').append('div').classed('stats', true);
        label.append('i');
        label.append('text').classed('country-header', true);
        label.append('span').append('text');
        // ++++++++ END CUT +++++++++++
    }

    /**
     * Renders the country description
     * @param activeCountry the IDs for the active country
     * @param activeYear the year to render the data for
     */
    updateTextDescription(activeCountry, activeYear) {
        // ******* TODO: PART 4 *******
        // Update the text elements in the infoBox to reflect:
        // Selected country, region, population and stats associated with the country.
        /*
         * You will need to get an array of the values for each category in your data object
         * hint: you can do this by using Object.values(this.data)
         * you will then need to filter just the activeCountry data from each array
         * you will then pass the data as paramters to make an InfoBoxData object for each category
         *
         */

        // ++++++++ BEGIN CUT +++++++++++
        let dataArray = Object.values(this.data);

        let statData = dataArray.map(d => {
            let stat = d.filter(d => d.geo.toUpperCase() === activeCountry.id)[0];
            return new InfoBoxData(stat.country, activeCountry.region, stat.indicator_name, stat[activeYear]);
        });
        const view = d3.select('#country-detail');
        let list = d3.select('#country-detail').select('.stats');
        let label = d3.select('.stats');
        let countryHeader = d3.select('#country-detail').select('.label').select('.inner-div');

        countryHeader.select('i')
            .attr('class', () => statData[0].region)
            .classed('fas fa-globe-asia', true);

        d3.select('.country-header').text(' ' + statData[0].country);

        label.select('span').select('text').text(statData[0].region.charAt(0).toUpperCase() + statData[0].region.slice(1));

        let statDiv = list.selectAll('.stat').data(statData);
        statDiv.exit().remove();

        let statEnter = statDiv.enter().append('div').classed('stat', true);
        statEnter.append('text').classed('stat-text', true);
        statEnter.append('span').append('text').classed('stat-value', true);
        statDiv = statEnter.merge(statDiv);

        statDiv.select('.stat-text').text(d => textFormater(d));
        statDiv.select('.stat-value').text(d => new Intl.NumberFormat().format(d.value));

        function textFormater(d) {
            return d.indicator_name.charAt(0).toUpperCase() + d.indicator_name.slice(1) + ": ";
        }

        view.style('opacity', 1);
        // ++++++++ END CUT +++++++++++
    }

    /**
     * Removes or makes invisible the info box
     */
    clearHighlight() {
        // ++++++++ BEGIN CUT +++++++++++
        d3.select('#country-detail').style('opacity', 0);
        // ++++++++ END CUT +++++++++++
    }

}