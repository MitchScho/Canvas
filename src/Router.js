// ROUTER COMPONENT:
//----------------------------------------------------------------------------------------------------------
import { useEffect } from "react";

import L from "leaflet";
import { useMap } from "react-leaflet";

import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "lrm-graphhopper";

//----------------------------------------------------------------------------------------------------------
// map.js passes state via the instance object
const Routing = ({ instance }) => {
  const onClickMarker = useMap();

  // -useEffect is responsible for managing side effects from components
  // -in this situation useEffect is watching for changes to either the map
  useEffect(() => {
    if (!onClickMarker) return;

    // OSRM routing
    const routingControl = L.Routing.control(instance).addTo(onClickMarker);

    // console.log(L.Routing);
    // console.log(instance);

    return () => onClickMarker.removeControl(routingControl);
  }, [onClickMarker, instance]);

  return null;
};

export default Routing;
