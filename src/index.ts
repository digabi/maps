import * as leaflet from 'leaflet'
import 'leaflet.tilelayer.fallback'
import { removeDebugLayer, addDebugLayer } from './debug'

interface CreateMapParams {
  container: string | HTMLElement
  mapUrl: string
  tileLayerOptions?: leaflet.TileLayerOptions
  mapOptions?: leaflet.MapOptions
}

const createMap = ({ container, mapUrl, tileLayerOptions, mapOptions }: CreateMapParams): leaflet.Map => {
  const state = { debug: false }
  const map = leaflet.map(container, mapOptions).setView([0, 0], 1)

  const layerOptions: leaflet.TileLayerOptions = {
    minZoom: 0,
    maxZoom: 9,
    attribution: 'YTL',
    ...tileLayerOptions
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

  leaflet.control.scale({ imperial: false }).addTo(map)

  return map
}

interface TerrainMapOptions {
  container: string | HTMLElement
  mapUrl: string
}

const createTerrainMap = (terrainMapOptions: TerrainMapOptions) => {
  const tileLayerOptions = {
    minZoom: 1,
    maxZoom: 6
  }

  const mapOptions = {
    crs: leaflet.CRS.Simple
  }

  const map = createMap({ ...terrainMapOptions, tileLayerOptions, mapOptions })

  const mapWidth = 512
  const mapHeight = 768
  const mapCenter = map.latLngToContainerPoint(map.getCenter())
  const centerViewPoint = mapCenter.add(new leaflet.Point(mapWidth / 2, mapHeight / 2))
  map.setView(map.containerPointToLatLng(centerViewPoint), 1, { animate: false })

  return map
}

export { createMap, createTerrainMap }
