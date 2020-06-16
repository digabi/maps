import * as leaflet from 'leaflet';
import 'leaflet.tilelayer.fallback';
import { removeDebugLayer, addDebugLayer } from './debug';
const createMap = ({ container, mapUrl, tileLayerOptions, mapOptions }) => {
    const state = { debug: false };
    const map = leaflet.map(container, mapOptions).setView([0, 0], 1);
    const layerOptions = Object.assign({ minZoom: 0, maxZoom: 9, attribution: 'YTL' }, tileLayerOptions);
    leaflet.tileLayer.fallback(mapUrl, layerOptions).addTo(map);
    map.addEventListener('keypress', (event) => {
        const keyboardEvent = event.originalEvent;
        if (keyboardEvent.shiftKey && keyboardEvent.key === 'D') {
            if (state.debug) {
                state.debug = false;
                removeDebugLayer(map);
            }
            else {
                state.debug = true;
                addDebugLayer(map);
            }
        }
    });
    return map;
};
const createWorldMap = (worldMapOptions) => {
    const map = createMap(Object.assign({}, worldMapOptions));
    leaflet.control.scale({ imperial: false }).addTo(map);
    return map;
};
const createTerrainMap = (terrainMapOptions) => {
    const tileLayerOptions = {
        minZoom: 1,
        maxZoom: 6
    };
    const mapOptions = {
        crs: leaflet.CRS.Simple
    };
    const map = createMap(Object.assign(Object.assign({}, terrainMapOptions), { tileLayerOptions, mapOptions }));
    const mapWidth = 512;
    const mapHeight = 768;
    const mapCenter = map.latLngToContainerPoint(map.getCenter());
    const centerViewPoint = mapCenter.add(new leaflet.Point(mapWidth / 2, mapHeight / 2));
    map.setView(map.containerPointToLatLng(centerViewPoint), 1, { animate: false });
    return map;
};
export { createTerrainMap, createWorldMap };
//# sourceMappingURL=index.js.map