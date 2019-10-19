import React, { useEffect, useState } from "react";
import Icon from "../assets/Bus-logo.svg";
import * as L from "leaflet";
import { subscribeMqtt } from "../lib/mqtt";
const { Map: LeafletMap, TileLayer, Marker, Popup } = require("react-leaflet");

const icon = new L.Icon({
  iconUrl: Icon,
  iconRetinaUrl: Icon,
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(20, 20),
  className: "leaflet-div-icon",
});

const defaultLatLng = [60.196195, 25.059663];
const defaultZoom = 17;

export default ({
  lat = defaultLatLng[0],
  lng = defaultLatLng[1],
  zoom = defaultZoom,
}) => {
  const [markers, setMarkers] = useState({});
  const [markerPosition, setMarkerPosition] = useState(null);

  const onMessage = message => {
    console.log(`Got message ${message}`);
    const data = JSON.parse(message);
    const vehicle = data.VP;
    if (!vehicle.lat || !vehicle.long) {
      console.info(`Skipping message ${message}`);
      return;
    }
    const position = [vehicle.lat, vehicle.long];
    const vehicleId = vehicle.veh;

    const markerPosition = position;
    setMarkerPosition(markerPosition);

    markers[vehicleId] = markerPosition;
    setMarkers(markers);
    // this.markers[vehicleId] = marker;
    // }
    // this.prevPositions[vehicleId] = position;
  };

  useEffect(() => {
    const unsubscribe = subscribeMqtt(onMessage);
    return () => unsubscribe();
  }, [onMessage]);

  return typeof window !== "undefined" ? (
    <div className="map-container">
      <LeafletMap center={[lat, lng]} zoom={zoom}>
        {/* <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        /> */}
        <TileLayer
          url="https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png"
          attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
          maxZoom={19}
          tileSize={512}
          zoomOffset={-1}
          id="hsl-map"
        />
        {Object.entries(markers).map(([vehicleId, marker]) => (
          <Marker icon={icon} position={marker} key={vehicleId}>
            <Popup>{vehicleId}</Popup>
          </Marker>
        ))}
      </LeafletMap>
    </div>
  ) : null;
};
