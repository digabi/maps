import * as leaflet from 'leaflet';
import { removeDebugLayer, addDebugLayer } from './debug';
const createMap = ({ container, mapUrl, errorTileUrl = '/error.png' }) => {
    const state = { debug: false };
    const map = leaflet.map(container).setView([0, 0], 1);
    const layerOptions = {
        minZoom: 0,
        maxZoom: 9,
        attribution: 'YTL',
        errorTileUrl
    };
    leaflet.tileLayer(mapUrl, layerOptions).addTo(map);
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
export { createMap };
//# sourceMappingURL=index.js.map