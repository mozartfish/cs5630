/**
 * Data structure for the data associated with an individual country.
 * the CountryData class will be used to keep the data for drawing your map.
 * You will use the region to assign a class to color the map!
 */
class CountryData {
    /**
     *
     * @param type refers to the geoJSON type- countries are considered features
     * @param properties contains the value mappings for the data
     * @param geometry contains array of coordinates to draw the country paths
     * @param region the country region
     */
    constructor(type, id, properties, geometry, region) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
        this.region = region;
    }
}

/** Class representing the map view. */
class Map {

    /**
     * Creates a Map Object
     *
     * @param data the full dataset
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     */
    constructor(data, updateCountry) {
        // ******* TODO: PART I *******
        this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
        this.nameArray = data.population.map(d => d.geo.toUpperCase());
        this.populationData = data.population;
        this.updateCountry = updateCountry;
    }

    /**
     * Renders the map
     * @param world the json data with the shape of all countries and a string for the activeYear
     */
    drawMap(world) {
        //note that projection is global!

        // ******* TODO: PART I *******

        // Draw the background (country outlines; hint: use #map-chart)
        // Make sure to add a graticule (gridlines) and an outline to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

        // You need to match the country with the region. This can be done using .map()
        // We have provided a class structure for the data called CountryData that you should assign the paramters to in your mapping

        // ++++++++ BEGIN CUT +++++++++++
        let that = this;
        d3.select('#country-detail').style('opacity', 0);
        let geojson = topojson.feature(world, world.objects.countries);

        let countryData = geojson.features.map(d => {
            let index = this.nameArray.indexOf(d.id);
            let regiondata = index > -1 ? this.populationData[index].region : 'none';
            return new CountryData(d.type, d.id, d.properties, d.geometry, regiondata);
        });

        let path = d3.geoPath()
            .projection(this.projection);

        let map = d3.select('#map-chart').append('svg');

        map.append("defs").append("path")
            .datum({ 'type': "Sphere" })
            .attr("id", "sphere")
            .attr("d", path);

        map.append("use")
            .attr("class", "stroke")
            .attr("xlink:href", "#sphere");

        map.append("use")
            .attr("class", "fill")
            .attr("xlink:href", "#sphere");

        let countries = map.selectAll('path')
            .data(countryData)
            .enter().append('path')
            .attr('d', path)
            .attr('id', (d) => d.id)
            .attr('class', (d) => d.region)
            .classed('countries', true);


        countries.on('click', function(d) {
            let countryID = { id: d.id, region: d.region };
            that.clearHighlight();
            that.updateCountry(countryID);
        });

        // Add graticule to the map
        let graticule = d3.geoGraticule();

        let grat = map
            .append('path')
            .datum(graticule)
            .classed('graticule', true)
            .attr('d', path)
            .attr('fill', 'none');

        map.insert("path", ".graticule")
            // map.insert("path", '.test')
            .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
            .attr("class", "boundary")
            .attr("d", path);

        // ++++++++ END CUT +++++++++++
    }

    /**
     * Highlights the selected conutry and region on mouse click
     * @param activeCountry the country ID of the country to be rendered as selected/highlighted
     */
    updateHighlightClick(activeCountry) {
        // ******* TODO: PART 3*******
        // Assign selected class to the target country and corresponding region
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for countries/regions, you can use
        // d3 selection and .classed to set these classes on here.
        //
        // ++++++++ BEGIN CUT +++++++++++
        this.clearHighlight();
        //highlight map
        let countries = d3.select('#map-chart').selectAll('.countries');
        let regions = countries.filter(c => c.region === activeCountry.region).classed('selected-region', true);
        let mapTarget = countries.filter(c => c.id === activeCountry.id).classed('selected-country', true);
        // ++++++++ END CUT +++++++++++
    }

    /**
     * Clears all highlights
     */
    clearHighlight() {
        // ******* TODO: PART 3*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes off here.

        // ++++++++ BEGIN CUT +++++++++++
        d3.select('#map-chart').selectAll('.selected-country').classed('selected-country', false);
        d3.select('#map-chart').selectAll('.selected-region').classed('selected-region', false);
        d3.select('#map-chart').selectAll('.hidden').classed('hidden', false);
        // ++++++++ END CUT +++++++++++
    }
}
