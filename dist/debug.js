"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDebugLayer = exports.removeDebugLayer = void 0;
const leaflet = require("leaflet");
const DebugLayer = leaflet.GridLayer.extend({
    createTile: (coords) => {
        const tile = document.createElement('div');
        tile.setAttribute('class', 'debug-tile');
        tile.style.outline = '1px solid black';
        tile.style.display = 'flex';
        tile.style.justifyContent = 'center';
        tile.style.alignItems = 'center';
        tile.style.flexDirection = 'column';
        tile.style.fontSize = '16px';
        tile.style.fontWeight = 'bold';
        const coordsContainer = document.createElement('div');
        coordsContainer.innerText = `x: ${coords.x}, y: ${coords.y}`;
        tile.appendChild(coordsContainer);
        return tile;
    },
});
const ZoomLevel = leaflet.Control.extend({
    onAdd: (map) => {
        map.getZoom();
        const textElement = document.createElement('div');
        textElement.setAttribute('id', `${map.getContainer().id}-zoom-level`);
        textElement.innerText = `Current zoom level: ${map.getZoom()}`;
        textElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        textElement.style.padding = '5px';
        textElement.style.color = '#FFF';
        textElement.style.fontWeight = 'bold';
        return textElement;
    },
});
let zoomLevel;
let debugLayer;
const onZoomEnd = (event) => {
    const map = event.target;
    const zoomInfo = document.getElementById(`${map.getContainer().id}-zoom-level`);
    if (zoomInfo) {
        const newZoom = map.getZoom();
        zoomInfo.innerText = `Current zoom level: ${newZoom}`;
    }
};
exports.removeDebugLayer = (map) => {
    if (zoomLevel) {
        map.removeControl(zoomLevel);
        map.removeEventListener('zoomend', onZoomEnd);
        zoomLevel = undefined;
    }
    if (debugLayer) {
        map.removeLayer(debugLayer);
        debugLayer = undefined;
    }
};
exports.addDebugLayer = (map) => {
    zoomLevel = new ZoomLevel({ position: 'topright' });
    debugLayer = new DebugLayer();
    map.addLayer(debugLayer);
    map.addControl(zoomLevel);
    map.addEventListener('zoomend', onZoomEnd);
};
//# sourceMappingURL=debug.js.map