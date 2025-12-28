// Check if listing geometry exists
if (listing.geometry && listing.geometry.coordinates) {
    // Leaflet expects [lat, lng], but MongoDB usually stores [lng, lat]. 
    // So we reverse the order:
    const lat = listing.geometry.coordinates[1]; 
    const lng = listing.geometry.coordinates[0];

    // 1. Initialize Map
    const map = L.map('map').setView([lat, lng], 9);

    // 2. Add Free Tile Layer (OpenStreetMap)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // 3. Add Marker
    const marker = L.marker([lat, lng]).addTo(map);
    
    // 4. Add Popup
    marker.bindPopup(`<b>${listing.location}</b><br>Exact location provided after booking.`).openPopup();
}