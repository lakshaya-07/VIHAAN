const defaultLocation = { lat: 28.644800, lng: 77.216721 }; // Sample Delhi coords

map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: defaultLocation,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
});
