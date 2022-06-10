import React from "react";
import {
  MapContainer,
  TileLayer,
  MapConsumer,
  useMapEvents,
} from "react-leaflet";
// example from sandbox (non-react)
//import RoutineMachine from "./RoutineMachine";
import L from "leaflet";
import icon from "./marker";
// our react component
import Routing from "./RoutingTest";

const Map = (props) => {
  const [latLang, setLatLang] = React.useState([
    L.latLng(49.281, -123.135),
    L.latLng(49.285, -123.131),
  ]);
  const instance = {
    waypoints: latLang,
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }],
    },
    // shows directions
    show: true,
    // adds way points by dragging
    addWaypoints: false,
    routeWhileDragging: true,
    // move waypoints by dragging
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false,
  };

  // MyComponent is a method from within react-leaflet, that is the library for react-leaflet hooks
  function MyComponent() {
    // useMapEvents is a React Leaflet Hook
    const map = useMapEvents({
      // var map reprsesents the event listener that create a point when a user clicks on the map
      // on-click event to save lat + lng
      click: (e) => {
        const { lat, lng } = e.latlng;
        console.log("🎲 ~ e.latlng", e.latlng);

        // uses previous state and updates with new state
        setLatLang((prev) => [...prev, L.latLng(lat, lng)]);

        // adds marker to map according to lat, lng
        //L.marker([lat, lng], { icon }).addTo(map);
      },
    });
    return null;
  }
  return (
    <MapContainer
      doubleClickZoom={false}
      id="mapId"
      zoom={14}
      center={[49.281, -123.135]}
    >
      <MyComponent />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=JHPAACJynf7oMojiymA4"
      />
      <Routing instance={instance} />
    </MapContainer>
  );
};

export default Map;
