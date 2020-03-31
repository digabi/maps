import * as leaflet from 'leaflet'
import './debug-layer.css'

export const DebugLayer = leaflet.GridLayer.extend({
  createTile: (coords: leaflet.Coords) => {
    const tile = document.createElement('div')
    tile.className = 'debug-info-tile'

    const zoomContainer = document.createElement('div')
    zoomContainer.innerText = `Zoom: ${coords.z}`
    const coordsContainer = document.createElement('div')
    coordsContainer.innerText = `x: ${coords.x}, y: ${coords.y}`

    tile.appendChild(zoomContainer)
    tile.appendChild(coordsContainer)

    return tile
  }
})
