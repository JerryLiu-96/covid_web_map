mapboxgl.accessToken =
'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/dark-v10',
zoom: 4, // starting zoom, united states is larger than japan, so zoom 4 is better
center: [-98, 38] // starting center
});

map.setProjection('albers');  //set the projection albers

const layers = [
    '0-9',
    '10-19',
    '20-49',
    '50-99',
    '100-199',
    '200-499',
    '500-999',
    '1000 and more'
];
const colors = [
    '#FFEDA070',
    '#FED97670',
    '#FEB24C70',
    '#FD8D3C70',
    '#FC4E2A70',
    '#E31A1C70',
    '#BD002670',
    '#80002670'
];

map.on('load', () => {
    map.addSource('covid_rate', {
        type: 'geojson',
        data: 'assets/covid_rate_processed.geojson'
        });
    map.addLayer({
        "id":"covid_rate_layer",
        "type":"fill",
        "source":"covid_rate",
        "paint":{
            "fill-color":[
                'step',
                ['get','rates'],
                '#FFEDA0',   // use color #FFEDA0
                10,          // if density < 10
    
                '#FED976',   // use color #FED976
                20,          // if 10 <= density < 20
    
               '#FEB24C',   // use color #FEB24C
               50,          // if 20 <= density < 50
    
               '#FD8D3C',   // use color #FD8D3C
               100,         // if 50 <= density < 100
    
               '#FC4E2A',   // use color #FC4E2A
               200,         // if 100 <= density < 200
    
              '#E31A1C',   // use color #E31A1C
              500,         // if 200 <= density < 500
    
             '#BD0026',   // use color #BD0026
             1000,        // if 500 <= density < 1000
    
             "#800026"    // use color #800026 if 1000 <= density
            ],
        'fill-outline-color': '#BBBBBB',
        'fill-opacity': 0.7,
        }
    });
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
        });
    map.on('mouseenter', 'covid_rate_layer', (event) => {
        map.getCanvas().style.cursor = 'pointer';
        
        popup.setLngLat(event.features[0].geometry.coordinates[0][0]).setHTML(`<strong>County:</strong> ${event.features[0].properties.county},${event.features[0].properties.state} <br> <strong>rate:</strong> ${event.features[0].properties.rates}`).addTo(map);
    });
    map.on('mouseleave', 'covid_rate_layer', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
        });
});

const legend = document.getElementById('legend');
legend.innerHTML = "<b>COVID Case Rate per 1000 population<br>(As of December 2020)</b><br><br>";


layers.forEach((layer, i) => {
                    const color = colors[i];
                    const item = document.createElement('div');
                    const key = document.createElement('span');
                    key.className = 'legend-key';
                    key.style.backgroundColor = color;

                    const value = document.createElement('span');
                    value.innerHTML = `${layer}`;
                    item.appendChild(key);
                    item.appendChild(value);
                    legend.appendChild(item);
                });
            


