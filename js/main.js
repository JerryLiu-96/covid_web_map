mapboxgl.accessToken =
'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/dark-v10',
zoom: 4, // starting zoom, united states is larger than japan, so zoom 4 is better
center: [-98, 38] // starting center
});

map.setProjection('albers');  //set the projection albers

const grades = [10, 1000, 100000],
  colors = ['rgb(208,209,230)', 'rgb(103,169,207)', 'rgb(1,108,89)'],
  radii = [1, 5, 15];
map.on('load', () => { 


map.addSource('covid', {
type: 'geojson',
data: 'assets/covid_count_processed.geojson'
});

map.addLayer({
'id': 'cases-point',
'type': 'circle',
'source': 'covid',
'minzoom': 4,
        'paint': {
            // increase the radii of the circle as the zoom level and dbh value increases
            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [{
                        zoom: 4,
                        value: grades[0]
                    }, radii[0]],
                    [{
                        zoom: 4,
                        value: grades[1]
                    }, radii[1]],
                    [{
                        zoom: 4,
                        value: grades[2]
                    }, radii[2]]
                ]
            },
            'circle-color': {
                'property': 'cases',
                'stops': [
                    [grades[0], colors[0]],
                    [grades[1], colors[1]],
                    [grades[2], colors[2]]
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.6
        }
    },
    'waterway-label'
);
// click on tree to view magnitude in a popup
map.on('click', 'cases-point', (event) => {
    new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`<strong>County:</strong> ${event.features[0].properties.county},${event.features[0].properties.state} <br> <strong>Case:</strong> ${event.features[0].properties.cases}`)
        .addTo(map);
});
});
// create legend
const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<strong>Cases</strong>'], vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
vbreak = grades[i];
// you need to manually adjust the radius of each dot on the legend 
// in order to make sure the legend can be properly referred to the dot on the map.
dot_radii = 2 * radii[i];
labels.push(
'<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
'px; height: ' +
dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
'</span></p>');

}
// add the data source
const source =
'<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times</a></p>';
// combine all the html codes.
legend.innerHTML = labels.join('') + source;