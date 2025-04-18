document.addEventListener("DOMContentLoaded", async () => {
    const rideId = localStorage.getItem("rideId");
    if (!rideId) return;

    try {
        const doc = await db.collection("rides").doc(rideId).get();
        if (doc.exists) {
            const data = doc.data();
            document.getElementById("rideInfo").innerText =
                `Pickup: ${data.pickup}\nDestination: ${data.destination}\nType: ${data.rideType}`;
        }
    } catch (error) {
        console.error("Error loading ride data:", error);
    }
});

// Initialize the map when the page loads
let map;
let markers = [];

function initMap() {
    // Example coordinates (you should replace these with actual coordinates)
    const center = { lat: 28.7041, lng: 77.1025 }; // Delhi coordinates

    // Create the map
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 14,
        disableDefaultUI: true,
        styles: [
            {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#333333' }]
            },
            {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#e0e0e0' }]
            }
        ]
    });

    // Add sample cab markers
    const cabLocations = [
        { lat: 28.7041, lng: 77.1025 },
        { lat: 28.7051, lng: 77.1035 },
        { lat: 28.7031, lng: 77.1015 },
        { lat: 28.7061, lng: 77.1045 },
        { lat: 28.7021, lng: 77.1005 }
    ];

    // Create and add markers for each cab
    cabLocations.forEach(location => {
        const marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: {
                url: 'images/cab-icon.png', // You'll need to create this icon
                scaledSize: new google.maps.Size(32, 32)
            }
        });
        markers.push(marker);
    });
}

// Initialize map when the page loads
window.addEventListener('load', initMap);

// Handle quick access buttons
document.querySelectorAll('.location-button').forEach(button => {
    button.addEventListener('click', () => {
        // Handle location selection
        const location = button.textContent.trim();
        document.querySelector('.search-input input').value = location;
    });
});

// Handle time selector
document.querySelector('.time-selector').addEventListener('click', () => {
    // Add time selection functionality here
    console.log('Time selector clicked');
});
