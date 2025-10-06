import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { createPortal } from "react-dom";

// import Marker from "./Marker";
// import Popup from "./Popup";

import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

const Popup = ({ map, activeFeature }) => {
  // a ref to hold the popup instance
  const popupRef = useRef();
  // a ref for an element to hold the popup's content
  const contentRef = useRef(document.createElement("div"));

  // instantiate the popup on mount, remove it on unmount
  useEffect(() => {
    if (!map) return;

    // create a new popup instance, but do not set its location or content yet
    popupRef.current = new mapboxgl.Popup({
      closeOnClick: false,
      offset: 20,
    });

    return () => {
      popupRef.current.remove();
    };
  }, []);

  // when activeFeature changes, set the popup's location and content, and add it to the map
  useEffect(() => {
    if (!activeFeature) return;

    popupRef.current
      .setLngLat(activeFeature.geometry.coordinates) // set its position using activeFeature's geometry
      .setHTML(contentRef.current.outerHTML) // use contentRef's `outerHTML` to set the content of the popup
      .addTo(map); // add the popup to the map
  }, [activeFeature]);

  // use a react portal to render the content to show in the popup, assigning it to contentRef
  return (
    <>
      {createPortal(
        <div className="portal-content">
          <table>
            <tbody>
              <tr>
                <td>
                  <strong>Time</strong>
                </td>
                <td>
                  {new Date(activeFeature?.properties.time).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Magnitude</strong>
                </td>
                <td>{activeFeature?.properties.mag}</td>
              </tr>
              <tr>
                <td>
                  <strong>Place</strong>
                </td>
                <td>{activeFeature?.properties.place}</td>
              </tr>
            </tbody>
          </table>
        </div>,
        contentRef.current
      )}
    </>
  );
};

const Marker = ({ map, feature, isActive, onClick }) => {
  const { geometry, properties } = feature;

  // a ref for the mapboxgl.Marker instance
  const markerRef = useRef(null);
  // a ref for an element to hold the marker's content
  const contentRef = useRef(document.createElement("div"));

  // instantiate the marker on mount, remove it on unmount
  useEffect(() => {
    markerRef.current = new mapboxgl.Marker(contentRef.current)
      .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
      .addTo(map);

    return () => {
      markerRef.current.remove();
    };
  }, []);

  return (
    <>
      {createPortal(
        <div
          onClick={() => onClick(feature)}
          style={{
            display: "inline-block",
            padding: "2px 15px",
            borderRadius: "50px",
            backgroundColor: isActive ? "#333" : "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            fontWeight: "bold",
            color: isActive ? "#fff" : "#333",
            textAlign: "center",
          }}
        >
          {properties.mag}
        </div>,
        contentRef.current
      )}
    </>
  );
};

function Map() {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  const [earthquakeData, setEarthquakeData] = useState();
  const [activeFeature, setActiveFeature] = useState();

  const getBboxAndFetch = useCallback(async () => {
    const bounds = mapRef.current.getBounds();

    try {
      const data = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&endtime=2024-01-30&minlatitude=${bounds._sw.lat}&maxlatitude=${bounds._ne.lat}&minlongitude=${bounds._sw.lng}&maxlongitude=${bounds._ne.lng}`
      ).then((d) => d.json());

      setEarthquakeData(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [124, -1.98],
      minZoom: 5.5,
      zoom: 5.5,
    });

    mapRef.current.on("load", () => {
      getBboxAndFetch();
    });

    mapRef.current.on("moveend", () => {
      getBboxAndFetch();
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  const handleMarkerClick = (feature) => {
    setActiveFeature(feature);
  };

  return (
    <>
      <div id="map-container" ref={mapContainerRef} />
      {mapRef.current &&
        earthquakeData &&
        earthquakeData.features?.map((feature) => {
          return (
            <Marker
              key={feature.id}
              map={mapRef.current}
              feature={feature}
              isActive={activeFeature?.id === feature.id}
              onClick={handleMarkerClick}
            />
          );
        })}
      {mapRef.current && (
        <Popup map={mapRef.current} activeFeature={activeFeature} />
      )}
    </>
  );
}

export default Map;
