import React, { useState } from "react";
const { Map: LeafletMap, TileLayer, Marker, Popup } = require("react-leaflet");

export default ({ lat = 60.170996, lng = 24.938674 }) => {
  return typeof window !== "undefined" ? (
    <div className="map-container">
      <LeafletMap center={[lat, lng]} zoom={17}>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </LeafletMap>
    </div>
  ) : null;
};
