const setupPage = () => {
  const awsUrl = 'https://s3.eu-north-1.amazonaws.com/maptiles-cheat.abitti.fi-cheat.abitti-prod'
  const maps = {
    '#local-fi': '/world/fi/{z}/{x}/{y}.png',
    '#local-sv': '/world/sv/{z}/{x}/{y}.png',
    '#aws-fi': `${awsUrl}/world/fi/{z}/{x}/{y}.png`,
    '#aws-sv': `${awsUrl}/world/sv/{z}/{x}/{y}.png`
  }

  const settings = {
    debug: false
  }

  const mapContainer = document.getElementById('map-container')
  let currentMap

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

    const mapUrl = maps[window.location.hash] || maps['#local-fi']

    currentMap = window.cheatMap.createMap({
      mapContainer,
      mapUrl,
      debug: settings.debug
    })

    if (oldLocation) {
      currentMap.setView(oldLocation.latLng, oldLocation.zoom)
    }
  }

  const toggleSetting = event => {
    const settingKey = event.target.getAttribute('data-setting-key')
    if (settingKey) {
      settings[settingKey] = !settings[settingKey]
      if (settings[settingKey]) {
        event.target.classList.add('active')
      } else {
        event.target.classList.remove('active')
      }
    }

    navigate()
  }

  navigate()
  window.addEventListener('hashchange', navigate)
  document.querySelectorAll('.control-panel button').forEach(button => button.addEventListener('click', toggleSetting))
}

const interval = setInterval(() => {
  if (!window.cheatMap) return
  setupPage()
  clearInterval(interval)
}, 100)
