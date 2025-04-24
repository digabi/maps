import * as leaflet from 'leaflet';
import 'leaflet.tilelayer.fallback';
interface WorldMapOptions {
    container: string | HTMLElement;
    mapUrl: string;
    attribution?: string;
}
declare const createWorldMap: (worldMapOptions: WorldMapOptions) => leaflet.Map;
interface TerrainMapOptions {
    container: string | HTMLElement;
    mapUrl: string;
    attribution?: string;
}
declare const createTerrainMap: (terrainMapOptions: TerrainMapOptions) => leaflet.Map;
export { createTerrainMap, createWorldMap };
