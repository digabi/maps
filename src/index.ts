import * as leaflet from 'leaflet'
import 'leaflet.tilelayer.fallback'
import { removeDebugLayer, addDebugLayer } from './debug'

interface CreateMapParams {
  container: string | HTMLElement
  mapUrl: string
  errorTileUrl?: string
}

const createMap = ({ container, mapUrl, errorTileUrl = '/error.png' }: CreateMapParams): leaflet.Map => {
  const state = { debug: false }
  const map = leaflet.map(container).setView([0, 0], 1)

  const layerOptions: leaflet.TileLayerOptions = {
    minZoom: 0,
    maxZoom: 9,
    attribution: 'YTL',
    errorTileUrl
  }
  ;(leaflet.tileLayer as any).fallback(mapUrl, layerOptions).addTo(map)

  map.addEventListener('keypress', (event: leaflet.LeafletKeyboardEvent) => {
    const keyboardEvent = event.originalEvent
    if (keyboardEvent.shiftKey && keyboardEvent.key === 'D') {
      if (state.debug) {
        state.debug = false
        removeDebugLayer(map)
      } else {
        state.debug = true
        addDebugLayer(map)
      }
    }
  })

  return map
}

export { createMap }
