mapboxgl.accessToken = 'pk.eyJ1IjoiaWJyYWhpbW11c3RhZmExIiwiYSI6ImNsOGtqMmkybDA3emIzb2xqcmVianBxamcifQ.gzEDLml708usSfHE0mztMA';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: campgroundLocation.geometry.coordinates, // center position [lng, lat]
    zoom: 10, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-right');


// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat(campgroundLocation.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 30 })
            .setHTML(
                `<h3>${campgroundLocation.title}</h3><p>${campgroundLocation.location}</p>`
            )   
    )
    .addTo(map);

