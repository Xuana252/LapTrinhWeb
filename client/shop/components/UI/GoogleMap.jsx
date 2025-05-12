"use client";
import React, { useCallback, useRef, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  LoadScript,
} from "@react-google-maps/api";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { faMapPin } from "@node_modules/@fortawesome/free-solid-svg-icons";

const center = { lat: 10.870311037349744, lng: 106.80303153331938 }; // Los Angeles

const Map = ({ from, to }) => {
  const [directions, setDirections] = useState(null);

  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  // });

  const onLoad = useCallback(() => {
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Error fetching directions", result);
        }
      }
    );
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ height: "500px", width: "100%" }}
        center={center}
        zoom={7}
        onLoad={onLoad}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
  // ) : (
  //   <div className="animate-pulse rounded bg-on-background/20 w-full h-[500px] text-background flex items-center justify-center">
  //     <FontAwesomeIcon icon={faMapPin} />
  //   </div>
  // );
};

export default Map;
