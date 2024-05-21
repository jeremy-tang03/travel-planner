import { API_KEY, MAP_ID } from "../config"
import { useState, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, WindowInfo, MapCameraChangedEvent } from "@vis.gl/react-google-maps";

const INITIAL_CAMERA = {
  center: { lat: 35.3241946, lng: 138.0303997 },
  zoom: 8
};
const mainCities =
{
  Tokyo: { lat: 35.68152646705769, lng: 139.76838545853252 },
  Osaka: { lat: 34.668609750638005, lng: 135.49808526112534 },
  Kyoto: { lat: 35.011317032007454, lng: 135.7672398785833 }
}


export default function MapReact() {
  const [camera, setCamera] = useState(INITIAL_CAMERA);
  const handleCameraChange = useCallback((e: MapCameraChangedEvent) => setCamera(e.detail), []);

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map mapId={MAP_ID} {...camera} onCameraChanged={handleCameraChange}>
          <AdvancedMarker position={mainCities.Tokyo}>
            {/* <Pin background={"red"}/> */}
          </AdvancedMarker>
          <AdvancedMarker position={mainCities.Osaka}></AdvancedMarker>
          <AdvancedMarker position={mainCities.Kyoto}></AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
}