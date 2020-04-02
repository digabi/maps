import * as leaflet from 'leaflet';
interface CreateMapParams {
    container: string | HTMLElement;
    mapUrl: string;
    errorTileUrl?: string;
}
declare const createMap: ({ container, mapUrl, errorTileUrl }: CreateMapParams) => leaflet.Map;
export { createMap };
