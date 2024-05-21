import { API_KEY, MAP_ID } from "../config"
import { useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, WindowInfo } from "@vis.gl/react-google-maps";

export default function MapReact() {
  const defCenter = { lat: 35.3241946, lng: 138.0303997 };
  const mainCities = [
    { name: "Tokyo", lat: 35.68152646705769, lng: 139.76838545853252 },
    { name: "Osaka", lat: 34.668609750638005, lng: 135.49808526112534 },
    { name: "Kyoto", lat: 35.011317032007454, lng: 135.7672398785833 },
  ]

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map mapId={MAP_ID} defaultCenter={defCenter} defaultZoom={8}>
          <AdvancedMarker position={mainCities[0]}>
            {/* <Pin background={"red"}/> */}
          </AdvancedMarker>
          <AdvancedMarker position={mainCities[1]}></AdvancedMarker>
          <AdvancedMarker position={mainCities[2]}></AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
}