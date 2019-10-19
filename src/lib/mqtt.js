const mqtt = require("mqtt");
/* 
export function onMessage(message) {
  console.log(`Got message ${message}`);
  const data = JSON.parse(message);
  const vehicle = data.VP;
  if (!vehicle.lat || !vehicle.long) {
    console.info(`Skipping message ${message}`);
    return;
  }
  const position = [vehicle.lat, vehicle.long];
  const vehicleId = vehicle.veh;
  this.msgs++;

  const prevMarkerOrNull = this.markers[vehicleId];
  if (prevMarkerOrNull) {
    L.polyline([this.prevPositions[vehicleId], position], {
      color: "blue",
    }).addTo(this.map);
    // this.map.removeLayer(prevMarkerOrNull);
    prevMarkerOrNull.setLatLng(new L.LatLng(position[0], position[1]));
  } else {
    const marker = L.marker(position)
      .addTo(this.map)
      .bindPopup(
        `
              <pre>Bus ${vehicle.desi}, tst ${new Date(vehicle.tst)}</pre>
            `
      );
    this.markers[vehicleId] = marker;
  }
  this.prevPositions[vehicleId] = position;
} */

export function subscribeMqtt(onMessage) {
  // Hardcoded HSL bus routes
  const buses = [80, 82, 83];
  const destination = "Herttoniemi(M)";
  const topics = buses.map(
    num => `/hfp/v1/journey/ongoing/bus/+/+/10${num}/+/${destination}/#`
  );

  const subscribedTopics = [];

  const url = "wss://mqtt.hsl.fi";
  const mqtt_client = mqtt.connect(url);
  console.log(`Subscribing ${url}`);
  mqtt_client.on("connect", () => {
    console.log(`Connected to ${url}`);
    topics.forEach(topic => {
      mqtt_client.subscribe(topic);
      subscribedTopics.push(topic);
      console.log(`Subscribed to topic ${topic}`);
    });
  });
  mqtt_client.on("message", (topic, message) => {
    onMessage(message);
  });
  return () => {
    subscribedTopics.forEach(topic => {
      mqtt_client.unsubscribe(topic);
      console.log(`Unsubscribed from topic ${topic}`);
    });
  };
}
