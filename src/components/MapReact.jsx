import { API_KEY, MAP_ID } from "../config"
import { useState, useCallback, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, WindowInfo, MapCameraChangedEvent, useMapsLibrary } from "@vis.gl/react-google-maps";
import { getApiKey } from "../helper";

const INITIAL_CAMERA = {
  center: { lat: 35.3241946, lng: 138.0303997 },
  zoom: 8
};
const mainCities =
  [
    { "name": "Tokyo", position: { lat: 35.68152646705769, lng: 139.76838545853252 } },
    { "name": "Osaka", position: { lat: 34.668609750638005, lng: 135.49808526112534 } },
    { "name": "Kyoto", position: { lat: 35.011317032007454, lng: 135.7672398785833 } }
  ]

export default function MapReact(props) {
  const [mapReady, setMapReady] = useState(false);
  const [camera, setCamera] = useState(INITIAL_CAMERA);
  const handleCameraChange = useCallback((e: MapCameraChangedEvent) => setCamera(e.detail), []);
  const citiesMarker = Object.values(mainCities).map(c => <AdvancedMarker key={c.name} position={c.position}><Pin background={"red"} /></AdvancedMarker>);
  const [apiKey, setApiKey] = useState(getApiKey(props.pw));

  useEffect(() => props.pw ? () => { setApiKey(getApiKey(props.pw)) } : null, [props.pw]);
  useEffect(() => apiKey ? setMapReady(true) : setMapReady(false), [apiKey]);

  return (
    <>
      {mapReady ?
        <APIProvider apiKey={apiKey}>
          <div style={{ height: "100vh", width: "100%" }}>
            <Map mapId={MAP_ID} {...camera} onCameraChanged={handleCameraChange} style={{ zIndex: 10 }}>
              {citiesMarker}
            </Map>
          </div>
        </APIProvider> : <></>}
    </>
  );
}