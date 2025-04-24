"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDebugLayer = exports.removeDebugLayer = void 0;
const leaflet = __importStar(require("leaflet"));
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
const removeDebugLayer = (map) => {
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
exports.removeDebugLayer = removeDebugLayer;
const addDebugLayer = (map) => {
    zoomLevel = new ZoomLevel({ position: 'topright' });
    debugLayer = new DebugLayer();
    map.addLayer(debugLayer);
    map.addControl(zoomLevel);
    map.addEventListener('zoomend', onZoomEnd);
};
exports.addDebugLayer = addDebugLayer;
//# sourceMappingURL=debug.js.map