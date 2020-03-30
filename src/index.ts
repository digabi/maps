import * as leaflet from 'leaflet'
import { DebugLayer } from './debug-layer'

import 'leaflet/dist/leaflet.css'

interface CreateMapParams {
  container: string | HTMLElement
  mapUrl: string
  minZoom: number
  maxZoom: number
  errorTileUrl: string
  debug: boolean
}
const createMap = ({
  container = 'map-container',
  mapUrl = '/fi/{z}/{x}/{y}.png',
  minZoom = 0,
  maxZoom = 9,
  errorTileUrl = '/error.png',
  debug = false
}: CreateMapParams): leaflet.Map => {
  const map = leaflet.map(container).setView([0, 0], 1)

  const layerOptions: leaflet.TileLayerOptions = {
    minZoom,
    maxZoom,
    attribution: 'YTL',
    errorTileUrl
  }

  leaflet.tileLayer(mapUrl, layerOptions).addTo(map)

  if (debug) {
    map.addLayer(new DebugLayer())
  }

  return map
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
