
const coordinates = window.listingCoordinates;
const mapContainer = document.getElementById("map");
const validCoordinates =
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    coordinates.every(Number.isFinite) &&
    Math.abs(coordinates[0]) <= 180 &&
    Math.abs(coordinates[1]) <= 90;

if (!validCoordinates) {
    console.error("Cannot display map: this listing has no valid coordinates.");
    mapContainer.textContent = "Map unavailable: location coordinates are missing.";
} else if (!window.mapToken) {
    console.error("Cannot display map: the Mapbox access token is missing.");
    mapContainer.textContent = "Map unavailable: Mapbox is not configured.";
} else {
    mapboxgl.accessToken = window.mapToken;
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: coordinates,
        zoom: 9
    });

    map.on("error", (event) => {
        console.error("Mapbox failed to load the map:", event.error);
    });

    const marker = new mapboxgl.Marker({color: "red"})
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<h5>${window.listingTitle}</h5><h4>Location: ${coordinates[1]}, ${coordinates[0]}</h4>`))
        .addTo(map);
}
