import React, { useEffect } from "react";
import { subscribeMqtt } from "../lib/mqtt";
const { Map: LeafletMap, TileLayer } = require("react-leaflet");

const onMessage = msg => {
  const parsed = JSON.parse(msg);
  if (!parsed.VP) {
    return;
  }
  console.log(`Got position: ${JSON.stringify(parsed.VP)}`);
};

const defaultLatLng = [60.196195, 25.059663];
const defaultZoom = 17;

export default ({
  lat = defaultLatLng[0],
  lng = defaultLatLng[1],
  zoom = defaultZoom,
}) => {
  useEffect(() => {
    const unsubscribe = subscribeMqtt(onMessage);
    return () => unsubscribe();
  }, []);

  return typeof window !== "undefined" ? (
    <div className="map-container">
      <LeafletMap center={[lat, lng]} zoom={zoom}>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </LeafletMap>
    </div>
  ) : null;
};
