import * as leaflet from 'leaflet'
import { DebugLayer } from './debug-layer'

import 'leaflet/dist/leaflet.css'

interface CreateMapParams {
  container: string | HTMLElement
  mapUrl: string
  errorTileUrl?: string
  debug?: boolean
}
const createMap = ({ container, mapUrl, errorTileUrl = '/error.png', debug = false }: CreateMapParams): leaflet.Map => {
  const map = leaflet.map(container).setView([0, 0], 1)

  const layerOptions: leaflet.TileLayerOptions = {
    minZoom: 0,
    maxZoom: 9,
    attribution: 'YTL',
    errorTileUrl
  }

  leaflet.tileLayer(mapUrl, layerOptions).addTo(map)

  if (debug) {
    map.addLayer(new DebugLayer())
  }

  return map
}

if (typeof module !== 'object') {
  ;(window as any).cheatMap = { createMap }
}

export { createMap }
