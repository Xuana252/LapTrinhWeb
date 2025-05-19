"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

const truckIcon = L.icon({
  iconUrl: "/images/truck.png", // Put this image in your public folder
  iconSize: [24, 24],
  className: "transparent-icon",
});

const warehouseIcon = L.icon({
  iconUrl: "/images/warehouse.png", // Put this image in your public folder
  iconSize: [24, 24],
  className: "transparent-icon",
});

const storeIcon = L.icon({
  iconUrl: "/images/store.png", // Put this image in your public folder
  iconSize: [24, 24],
  className: "transparent-icon",
});

const shopCoords = [10.87073364243067, 106.80293812043784];

// Helper component to add routing control to the map
const RoutingMachine = ({ toCoords, status }) => {
  const map = useMap();

  useEffect(() => {
    if (!toCoords) return;

    if (!map.getPane("customPane")) {
      map.createPane("customPane");
      map.getPane("customPane").style.zIndex = 450; // Higher than routing layer (usually ~600)
    }

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(shopCoords[0], shopCoords[1]),
        L.latLng(toCoords[0], toCoords[1]),
      ],
      routeWhileDragging: false,
      lineOptions: {
        styles: [
          { color: "green", weight: 6, opacity: 0.8 }, // Green route
        ],
      },
      show: false,

      createMarker: function (i, waypoint, n) {
        if (i === 0) {
          return L.marker(waypoint.latLng, { icon: storeIcon });
        } else if (i === n - 1) {
          return L.marker(waypoint.latLng, { icon: warehouseIcon });
        }
      },
    });

    let truckMarker;
    let bluePolyline;

    routingControl.on("routesfound", (e) => {
      const coords = e.routes[0].coordinates;
      let midIndex;
      if (["pending", "cancelled", "confirmed"].includes(status)) {
        midIndex = 0; // starting point
      } else if (status === "delivered") {
        midIndex = coords.length - 1; // destination point
      } else if (status === "shipped") {
        // random index between 1 and coords.length - 2 (not start or end)
        midIndex = Math.floor(Math.random() * (coords.length - 2)) + 1;
      } else {
        midIndex = Math.floor(coords.length / 2);
      }

      const mid = coords[midIndex];

      map.setView([mid.lat, mid.lng], map.getZoom());

      truckMarker = L.marker([mid.lat, mid.lng], { icon: truckIcon }).addTo(
        map
      );

      const partialRouteCoords = coords
        .slice(0, midIndex + 1)
        .map((c) => [c.lat, c.lng]);

      bluePolyline = L.polyline(partialRouteCoords, {
        color: "lime",
        weight: 4,
        opacity: 1,
        pane: "customPane",
      }).addTo(map);
      bluePolyline.bringToFront();
    });

    routingControl.addTo(map);

    return () => {
      map.removeControl(routingControl);
      if (truckMarker) map.removeLayer(truckMarker);
      if (bluePolyline) map.removeLayer(bluePolyline);
    };
  }, [toCoords, map]);

  return null;
};

const Map = ({ to, status }) => {
  const [toCoords, setToCoords] = useState(null);

  // Geocode function
  const geocode = async (address) => {
    if (!address) return null;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await res.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  };

  useEffect(() => {
    const fetchCoords = async () => {
      const toResult = await geocode(to);
      setToCoords(toResult);
    };
    fetchCoords();
  }, [to]);

  // Decide initial map center and zoom

  return (
    <div className="w-full h-[500px] overflow-hidden shadow rounded relative z-40">
      <MapContainer
        center={shopCoords}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors & CartoDB"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Add Routing if both coordinates exist */}
        {toCoords ? (
          <RoutingMachine toCoords={toCoords} status={status} />
        ) : (
          <>
            <Marker position={shopCoords} icon={storeIcon}>
              <Popup>Start</Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
