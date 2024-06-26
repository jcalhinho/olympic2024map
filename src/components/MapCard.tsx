
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import L, { LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";


//import { MapContext, MapContextProps } from "../../../constants/MapContext";
// import youicon from "../../../assets/epingle.png";
// import markericon from "../../../assets/broche-de-localisation.png";
import { t } from "i18next";


const Map = () => {
  // Extracting context variables
  // const { positionOrigin, listSource, locationEnabled,setLocationEnabled } = React.useContext(
  //   MapContext
  // ) as MapContextProps;



  // Ref for accessing Leaflet map instance
  const mapRef = useRef<L.Map>(null);

  // Creating Leaflet icons for markers
  const YouIcon = new L.Icon({
   // iconUrl: youicon,
    iconSize: [36, 36],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  const MarkerIcon = new L.Icon({
   // iconUrl: markericon,
    iconSize: [36, 36],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Function to calculate map bounds based on markers
  // const getMapBounds = () => {
  //   if (!listSource || listSource.length === 0) {
  //     return null;
  //   }

  //   const bounds = L.latLngBounds(
  //     listSource.map((marker) => [marker.latitude, marker.longitude])
  //   );
  //   return bounds;
  // };
const GlobalProbe = () => {
  const { center, zoom } = calculateCenterAndZoom();
    mapRef.current?.flyTo(center, zoom);
}
  // Effect to update map center and zoom when listSource changes
  useEffect(() => {
    const { center, zoom } = calculateCenterAndZoom();
    mapRef.current?.flyTo(center, zoom);
  }, [
    // listSource,
    // locationEnabled
  ]);

  // Function to handle zooming out to the world view
  const handleZoomOut = () => {
    if (mapRef.current) {
      const worldCoordinates: LatLngLiteral = { lat: 0, lng: 0 };
      const worldZoom = window.innerWidth <= 2300 ? 1.5 : 2.5 ;

      mapRef.current.flyTo(worldCoordinates, worldZoom);
    }
  };

  // Function to calculate center and zoom based on map bounds
  const calculateCenterAndZoom = () => {
   // setLocationEnabled!(true)
   // const bounds = getMapBounds();
 //   if (
     // bounds 
     // && 
    //  mapRef.current) {
     // const center = bounds.getCenter();
    //  const numberOfSources = listSource ? listSource.length : 0;

      // let zoom = 13;
      // if (numberOfSources === 1) {
      //   zoom = 13;
      // } else if (numberOfSources >= 2) {
      //  // zoom = mapRef.current.getBoundsZoom(bounds) - 0.2;
      // }

    //  return { center, zoom };
   // }

    // Default values if bounds are not available
    return { center: { lat: 48.85341, lng: 2.3488 }, zoom: 13 };
  };

  // Function to fly to a specific marker on the map
  const flyToMarker = (marker: LatLngLiteral) => {
    mapRef.current && mapRef.current.flyTo(marker, 13);
  };
 
  // Render the component
  return (
    <div className="h-full w-screen flex justify-center items-center">
     

      <div className="leaflet-container h-2/3 w-2/3 flex justify-center items-center drop-shadow-md rounded">
        {/* {locationEnabled && ( 
          // MapContainer for Leaflet map*/}
          <MapContainer
            center={calculateCenterAndZoom().center}
            zoom={calculateCenterAndZoom().zoom}
            ref={mapRef}
          >
            {/* TileLayer for map background */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Marker for user's position */}
            {/* {positionOrigin && (
              <Marker position={positionOrigin} icon={YouIcon}>
                <Popup>{t("youhere")}</Popup>
              </Marker>
            )}

            {/* Markers for listSource items */}
            {/* {listSource?.map((marker, index) => (
              <Marker
                icon={MarkerIcon}
                key={index}
                position={{ lat: marker.latitude, lng: marker.longitude }}
              >
                <Popup>{marker.source_prettyname}</Popup>
              </Marker>
            ))} */} 
          </MapContainer>
        {/* )} */}
      </div>
    </div>
  );
};

export default Map;
