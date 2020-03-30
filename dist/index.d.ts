import * as leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
interface CreateMapParams {
    container: string | HTMLElement;
    mapUrl: string;
    errorTileUrl?: string;
    debug?: boolean;
}
declare const createMap: ({ container, mapUrl, errorTileUrl, debug }: CreateMapParams) => leaflet.Map;
export { createMap };
