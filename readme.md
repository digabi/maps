# Exam help maps

This is a tool used in [cheat.abitti.fi](https://cheat.abitti.fi) and in the exams to explore maps.

## How to use

To use cheat maps you need to fufill the peer dependency of leaflet by installing 1.6+ version.
Your project also needs to include the leaflet css file as mentioned in
[leaflet documentation](https://leafletjs.com/examples/quick-start/)

`yarn add @digabi/cheat-maps leaflet@~1.6`

```TypeScript
import { createMap } from '@digabi/cheat-maps'
import 'leaflet/dist/leaflet.css'

createMap({
  container: '#map-container',
  mapUrl: 'https://url.to.place.with.maps/{z}/{x}/{y}.png'
})
```

More indepth example can be found from the /public folder in this project.

## Development

After cloning the repository, the project can be run locally by following the steps below.

1. `yarn install`
2. `yarn start`

### Maps

You may test map tiles locally by creating a `maps` directory to the root of the project and adding your map tiles
there. You can then load them by editing the contents of the public directory. By default the project includes urls to
the same maps used in [cheat.abitti.fi](https://cheat.abitti.fi) and in the exams. These maps can currently be found
from the `aws` tabs.

### Abikit browser

Note that this project must work with the Abikit browser used in the exams. https://github.com/digabi/abikit-browser
