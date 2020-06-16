import * as leaflet from 'leaflet'
import * as path from 'path'
import { createWorldMap, createTerrainMap } from '../src/index'

import 'leaflet/dist/leaflet.css'
import './index.css'

enum MapType {
  World,
  Terrain
}

const getMapUrl = (type: MapType) => {
  const awsTest = 'https://s3.eu-north-1.amazonaws.com/maptiles-cheat.abitti.fi-cheat.abitti-test'
  const awsProd = 'https://s3.eu-north-1.amazonaws.com/maptiles-cheat.abitti.fi-cheat.abitti-prod'

  let mapPath = '/world/fi/{z}/{x}/{y}.png'
  if (type === MapType.Terrain) {
    mapPath = '/terrain/{z}/{x}/{y}.png'
  } else if (window.location.hash.includes('-sv')) {
    mapPath = '/world/sv/{z}/{x}/{y}.png'
  }

  switch (window.location.hash) {
    case '#aws-fi':
    case '#aws-sv':
      return path.join(awsProd, mapPath)
    case '#aws-fi-test':
    case '#aws-sv-test':
      return path.join(awsTest, mapPath)
    case '#local-fi':
    case '#local-sv':
    default:
      return mapPath
  }
}
;(() => {
  if (!location.hash) location.hash = 'local-fi'

  const mapContainer = document.getElementById('map-container')
  let currentMap: leaflet.Map

  const navigate = () => {
    const oldTab = document.querySelector('nav .active')
    if (oldTab) oldTab.classList.remove('active')
    const newTab = document.querySelector(`nav [href="${window.location.hash}"]`)
    if (newTab) newTab.classList.add('active')

    let oldLocation
    if (currentMap) {
      oldLocation = {
        latLng: currentMap.getBounds().getCenter(),
        zoom: currentMap.getZoom()
      }

      currentMap.remove()
    }

    const mapUrl = getMapUrl(MapType.World)

    if (mapContainer === null) {
      console.error('Map container not found')
      return
    }

    currentMap = createWorldMap({ container: mapContainer, mapUrl })

    if (oldLocation) {
      currentMap.setView(oldLocation.latLng, oldLocation.zoom, { animate: false })
    }
  }

  navigate()
  window.addEventListener('hashchange', navigate)

  const terrainContainer = document.getElementById('terrain-container')
  createTerrainMap({ container: terrainContainer!, mapUrl: getMapUrl(MapType.Terrain) })
})()
