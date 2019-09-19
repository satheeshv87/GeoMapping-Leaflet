// Data URL
let dataurl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Create Light map
let lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.light",
    accessToken: API_KEY
})
// Create layer group
let layers = {
    lightearthquake: new L.layerGroup()
};

// Initialize map
let initmap = L.map('map', {
    center: [40, -100],
    zoom: 4,
    layers: [
        lightMap,
        layers.lightearthquake
    ]
})

function plotsize(mag) {return mag * 20000}

// function to get color based on magnitude
function getcolor(mag) {
    return mag >= 5 ? '#F06B6B':
           mag >= 4 ? '#F0A76B':
           mag >= 3 ? '#F3BA4D':
           mag >= 2 ? '#F3DB4D':
           mag >= 1 ? '#E1F34D':
           '#B7F34D';
}

// Function to draw circles on the map
function buildMarker(features) {

    features.forEach(feature=>{

        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            fillColor: getcolor(feature.properties.mag),
            fillOpacity: .65,
            color: "#999999",
            weight: 1,
            radius: plotsize(feature.properties.mag)
        }).bindPopup('<p><b>Where</b>: ' + feature.properties.place + '</p><p><b>When</b>:' + new Date(feature.properties.time) + '</p>' + '<p><b>Richter</b>: ' + feature.properties.mag)
        .addTo(layers.lightearthquake);
    });
};

// get data and apply functions created above
d3.json(dataurl).then(function(data){

    buildMarker(data.features)

    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
        let div = L.DomUtil.create('div', 'legend');
        let labels = [' 0 - 1 ', ' 1 - 2 ', ' 2 - 3 ', ' 3 - 4 ', ' 4 - 5 ', ' 5 + ']
        let colors = ['#B7F34D', '#E1F34D', '#F3DB4D', '#F3BA4D', '#F0A76B', '#F06B6B']
        for (let i = 0; i < colors.length; i++){
            
            div.innerHTML +=
                '<div><li id = "legend" style="background-color:' + colors[i] + '">&nbsp</li>' + labels[i] + '</div>';
        }
        return div;
    }    
    legend.addTo(initmap);
    
});