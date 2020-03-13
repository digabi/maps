import * as leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'

const map = leaflet.map('map-container').setView([0, 0], 1);
leaflet.tileLayer('/fi/{z}/{x}/{y}.png', { minZoom: 0, maxZoom: 9, attribution: 'YTL' }).addTo(map)
