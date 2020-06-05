import * as leaflet from 'leaflet'
import * as path from 'path'
import { createWorldMap, createTerrainMap } from '../src/index'

import 'leaflet/dist/leaflet.css'
import './index.css'

interface MapUrls {
  [key: string]: string
}

;(() => {
  if (!location.hash) location.hash = 'local-fi'

  const worldMapFi = '/world/fi/{z}/{x}/{y}.png'
  const worldMapSv = '/world/sv/{z}/{x}/{y}.png'
  const awsTest = 'https://s3.eu-north-1.amazonaws.com/maptiles-cheat.abitti.fi-cheat.abitti-test'
  const awsProd = 'https://s3.eu-north-1.amazonaws.com/maptiles-cheat.abitti.fi-cheat.abitti-prod'
  const maps: MapUrls = {
    '#local-fi': worldMapFi,
    '#local-sv': worldMapSv,
    '#aws-fi': path.join(awsProd, worldMapFi),
    '#aws-sv': path.join(awsProd, worldMapSv),
    '#aws-fi-test': path.join(awsTest, worldMapFi),
    '#aws-sv-test': path.join(awsTest, worldMapSv)
  }

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

    const mapUrl: string = maps[window.location.hash] || maps['#local-fi']

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

  const terrainMapUrl = '/maasto/{z}/{x}/{y}.png'
  const terrainContainer = document.getElementById('terrain-container')

  createTerrainMap({ container: terrainContainer!, mapUrl: terrainMapUrl })
})()
