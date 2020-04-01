import * as leaflet from 'leaflet'

interface CreateMapParams {
  container: string | HTMLElement
  mapUrl: string
  errorTileUrl?: string
}
const createMap = ({ container, mapUrl, errorTileUrl = '/error.png' }: CreateMapParams): leaflet.Map => {
  const map = leaflet.map(container).setView([0, 0], 1)

  const layerOptions: leaflet.TileLayerOptions = {
    minZoom: 0,
    maxZoom: 9,
    attribution: 'YTL',
    errorTileUrl
  }

  leaflet.tileLayer(mapUrl, layerOptions).addTo(map)

  return map
}

if (typeof module !== 'object') {
  ;(window as any).cheatMap = { createMap }
}

export { createMap }
