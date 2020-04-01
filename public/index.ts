import * as leaflet from 'leaflet'

import { createMap } from '../src/index'
import { DebugLayer } from './debug-layer'

import 'leaflet/dist/leaflet.css'
import './index.css'

interface Settings {
  [key: string]: boolean
}

interface MapUrls {
  [key: string]: string
}

;(() => {
  const awsUrl = 'https://s3.eu-north-1.amazonaws.com/maptiles-cheat.abitti.fi-cheat.abitti-prod'
  const maps: MapUrls = {
    '#local-fi': '/world/fi/{z}/{x}/{y}.png',
    '#local-sv': '/world/sv/{z}/{x}/{y}.png',
    '#aws-fi': `${awsUrl}/world/fi/{z}/{x}/{y}.png`,
    '#aws-sv': `${awsUrl}/world/sv/{z}/{x}/{y}.png`
  }

  const settings: Settings = {
    debug: false
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
    currentMap = createMap({ container: mapContainer, mapUrl })

    if (oldLocation) {
      currentMap.setView(oldLocation.latLng, oldLocation.zoom, { animate: false })
    }

    if (settings.debug) {
      currentMap.addLayer(new DebugLayer())
    }
  }

  const toggleSetting = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const settingKey = target.getAttribute('data-setting-key')

    if (settingKey) {
      settings[settingKey] = !settings[settingKey]

      if (settings[settingKey]) {
        target.classList.add('active')
      } else {
        target.classList.remove('active')
      }
    }

    navigate()
  }

  navigate()
  window.addEventListener('hashchange', navigate)
  document.querySelectorAll('.control-panel button').forEach(button => {
    ;(button as HTMLElement).addEventListener('click', toggleSetting)
  })
})()
