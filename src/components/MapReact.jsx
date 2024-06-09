import { API_KEY, MAP_ID } from "../config"
import { useRef, useState, useCallback, useEffect } from "react";
import {
  APIProvider, Map, AdvancedMarker, Pin, MapCameraChangedEvent,
  useMapsLibrary, useMap, ControlPosition, MapControl
} from "@vis.gl/react-google-maps";
import { getKey } from "../helper";
import { TextInput } from '@mantine/core';

const PlaceAutocompleteClassic = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address']
    };
    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <>
      <TextInput ref={inputRef} />
    </>
  );
};

const CustomMapControl = ({ controlPosition, onPlaceSelect }) => {
  return (
    <MapControl position={controlPosition}>
      <PlaceAutocompleteClassic onPlaceSelect={onPlaceSelect} />
    </MapControl>
  );
};

const MapHandler = ({ place, setCurrentMarker }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;
    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }
    if (place.geometry?.location) {
      const lat = (place.geometry?.location.lat)();
      const lng = (place.geometry?.location.lng)();
      setCurrentMarker(
        <AdvancedMarker key="currentMarker" position={{ lat: lat, lng: lng }}><Pin background={"red"} /></AdvancedMarker>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, place]);

  return null;
};

export default function MapReact({ pw, isPC }) {
  const INITIAL_CAMERA = {
    center: { lat: 35.3241946, lng: 138.0303997 },
    zoom: (isPC ? 8 : 6.3)
  };
  const mainCities = [
    { "name": "Tokyo", position: { lat: 35.68152646705769, lng: 139.76838545853252 } },
    { "name": "Osaka", position: { lat: 34.668609750638005, lng: 135.49808526112534 } },
    { "name": "Kyoto", position: { lat: 35.011317032007454, lng: 135.7672398785833 } }
  ]
  const [mapReady, setMapReady] = useState(false);
  const [camera, setCamera] = useState(INITIAL_CAMERA);
  const handleCameraChange = useCallback((e: MapCameraChangedEvent) => setCamera(e.detail), []);
  const citiesMarker = Object.values(mainCities).map(
    c => <AdvancedMarker key={c.name} position={c.position}><Pin background={"red"} /></AdvancedMarker>);
  const [apiKey, setApiKey] = useState(getKey(pw));
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);

  useEffect(() => pw ? () => { setApiKey(getKey(pw)) } : null, [pw]);
  useEffect(() => apiKey || apiKey != null || apiKey !== "" ? setMapReady(true) : setMapReady(false), [apiKey]);
  // fetch(`https://maps.google.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${apiKey}`).then(res => res.json()).then(data => {console.log(data.results[0].geometry.location)});

  return (
    <>
      {mapReady ?
        <APIProvider apiKey={apiKey} solutionChannel="" >
          <div style={{ height: "100vh", width: "100%" }}>
            <Map mapId={MAP_ID} {...camera} onCameraChanged={handleCameraChange} style={{ zIndex: 10 }} disableDefaultUI={true}>
              {citiesMarker}
              {currentMarker}
            </Map>
            <CustomMapControl
              controlPosition={ControlPosition.TOP}
              onPlaceSelect={setSelectedPlace}
            />
            <MapHandler place={selectedPlace} setCurrentMarker={setCurrentMarker} />
          </div>
        </APIProvider> : <></>}
    </>
  );
}