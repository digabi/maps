import * as path from 'path';
import { createWorldMap, createTerrainMap } from '../src/index';
import 'leaflet/dist/leaflet.css';
import './index.css';
var MapType;
(function (MapType) {
    MapType[MapType["World"] = 0] = "World";
    MapType[MapType["Terrain"] = 1] = "Terrain";
})(MapType || (MapType = {}));
const getMapUrl = (type) => {
    const awsTest = 'https://s3.eu-north-1.amazonaws.com/maptiles-cheat.abitti.fi-cheat.abitti-test';
    const awsProd = 'https://s3.eu-north-1.amazonaws.com/maptiles-cheat.abitti.fi-cheat.abitti-prod';
    let mapPath = '/world/fi/{z}/{x}/{y}.png';
    if (type === MapType.Terrain) {
        mapPath = '/terrain/{z}/{x}/{y}.png';
    }
    else if (window.location.hash.includes('-sv')) {
        mapPath = '/world/sv/{z}/{x}/{y}.png';
    }
    switch (window.location.hash) {
        case '#aws-fi':
        case '#aws-sv':
            return path.join(awsProd, mapPath);
        case '#aws-fi-test':
        case '#aws-sv-test':
            return path.join(awsTest, mapPath);
        case '#local-fi':
        case '#local-sv':
        default:
            return mapPath;
    }
};
let maps = [];
const navigate = () => {
    const oldTab = document.querySelector('nav .active');
    if (oldTab)
        oldTab.classList.remove('active');
    const newTab = document.querySelector(`nav [href="${window.location.hash}"]`);
    if (newTab)
        newTab.classList.add('active');
    maps = maps.map(({ leafletMap, type, containerId }) => {
        const oldLocation = {
            latLng: leafletMap.getBounds().getCenter(),
            zoom: leafletMap.getZoom()
        };
        leafletMap.remove();
        const mapContainer = document.getElementById(containerId);
        const mapParameters = { container: mapContainer, mapUrl: getMapUrl(type) };
        const newMap = type === MapType.World ? createWorldMap(mapParameters) : createTerrainMap(mapParameters);
        newMap.setView(oldLocation.latLng, oldLocation.zoom, { animate: false });
        return {
            leafletMap: newMap,
            type,
            containerId
        };
    });
};
(() => {
    if (!location.hash)
        location.hash = 'local-fi';
    const terrainContainer = document.getElementById('terrain-container');
    const worldContainer = document.getElementById('map-container');
    maps = [
        {
            leafletMap: createWorldMap({ container: worldContainer, mapUrl: getMapUrl(MapType.World) }),
            type: MapType.World,
            containerId: 'map-container'
        },
        {
            leafletMap: createTerrainMap({ container: terrainContainer, mapUrl: getMapUrl(MapType.Terrain) }),
            type: MapType.Terrain,
            containerId: 'terrain-container'
        }
    ];
    window.addEventListener('hashchange', navigate);
    const oldTab = document.querySelector('nav .active');
    if (oldTab)
        oldTab.classList.remove('active');
    const newTab = document.querySelector(`nav [href="${window.location.hash}"]`);
    if (newTab)
        newTab.classList.add('active');
})();
//# sourceMappingURL=index.js.map