import * as leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface CreateMapParams {
  container: string | HTMLElement
  mapUrl: string
  minZoom: number
  maxZoom: number
  errorTileUrl: string
}
const createMap = ({
  container = 'map-container',
  mapUrl = '/fi/{z}/{x}/{y}.png',
  minZoom = 0,
  maxZoom = 9,
  errorTileUrl = '/error.png'
}: CreateMapParams) => {
  const map = leaflet.map(container).setView([0, 0], 1)

  const layerOptions: leaflet.TileLayerOptions = {
    minZoom,
    maxZoom,
    attribution: 'YTL',
    errorTileUrl
  }

  leaflet.tileLayer(mapUrl, layerOptions).addTo(map)
}

declare global {
  interface Window {
    cheatMap: any
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = { createMap }
} else {
  window.cheatMap = { createMap }
}
