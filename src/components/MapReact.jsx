import { API_KEY, MAP_ID } from "../config"
import { useRef, useState, useCallback, useEffect } from "react";
import {
  APIProvider, Map, AdvancedMarker, Pin, MapCameraChangedEvent,
  useMapsLibrary, useMap, ControlPosition, MapControl
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from '@googlemaps/markerclusterer';
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

const Markers = ({ points }) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  const renderer = {
    render: ({ count, position }) =>
      // eslint-disable-next-line no-undef
      new google.maps.Marker({
        label: { text: String(count), color: "white", fontSize: "10px" },
        position,
        // adjust zIndex to be above other markers
        // eslint-disable-next-line no-undef
        zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
      }),
  };

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map, renderer });
    }
  }, [map]);

  // Update markers
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {points.map(point => (
        <AdvancedMarker
          position={point}
          key={point.key}
          ref={marker => setMarkerRef(marker, point.key)}>
          {/* <span className="tree">🌳</span> */}
          <Pin background={"red"} />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default function MapReact({ pw, data, isPC }) {
  const mainCities = [
    {
      name: "Tokyo", lat: 35.68152646705769, lng: 139.76838545853252,
      key: JSON.stringify({ name: "Tokyo", lat: 35.68152646705769, lng: 139.76838545853252 })
    },
    {
      name: "Osaka", lat: 34.668609750638005, lng: 135.49808526112534,
      key: JSON.stringify({ name: "Osaka", lat: 34.668609750638005, lng: 135.49808526112534 })
    },
    {
      name: "Kyoto", lat: 35.011317032007454, lng: 135.7672398785833,
      key: JSON.stringify({ name: "Kyoto", lat: 35.011317032007454, lng: 135.7672398785833 })
    }
  ]
  const [mapReady, setMapReady] = useState(false);
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
            <Map mapId={MAP_ID} defaultCenter={{ lat: 35.3241946, lng: 138.0303997 }} defaultZoom={(isPC ? 8 : 6.3)} style={{ zIndex: 10 }} disableDefaultUI={true}>
              <Markers points={mainCities} />
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