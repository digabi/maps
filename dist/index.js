import * as leaflet from 'leaflet';
const createMap = ({ container, mapUrl, errorTileUrl = '/error.png' }) => {
    const map = leaflet.map(container).setView([0, 0], 1);
    const layerOptions = {
        minZoom: 0,
        maxZoom: 9,
        attribution: 'YTL',
        errorTileUrl
    };
    leaflet.tileLayer(mapUrl, layerOptions).addTo(map);
    return map;
};
if (typeof module !== 'object') {
    ;
    window.cheatMap = { createMap };
}
export { createMap };
//# sourceMappingURL=index.js.map