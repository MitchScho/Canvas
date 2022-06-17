// MAP FILE
//----------------------------------------------------------------------------------------------------
import { useState, useEffect, useRef} from "react";
//import { useMap } from 'react-leaflet/hooks'
import axios from "axios";
//import React, { useRef } from 'react';


// LEAFLET
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Control from "react-leaflet-custom-control";

// SCSS:
import "./styles.css";

// COMPONENTS FROM OUR APP:
import Routing from "./Router";
import DropDownMenu from "./components/DropDownMenu";
import DeletePointButton from "./components/DeletePointButton";
import Showcase from "./components/Showcase";
import LoggedInUserMessage from "./components/LoggedInUserMessage";
import SaveForm from "./components/SaveForm";

// MUI
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import LunchDiningRoundedIcon from "@mui/icons-material/LunchDiningRounded";
import StarIcon from "@mui/icons-material/Star";

//-----------------------------------------------------------------------------------------------------
// API KEY: (references our .env file)
const api = process.env.REACT_APP_API;
const GHKEY = process.env.GHKEY;
//-----------------------------------------------------------------------------------------------------

// MAP COMPONENT:
const Map = (props) => {
  const [latLong, setLatLong] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showShowcase, setShowShowcase] = useState(true);
  const [showcaseData, setshowcaseData] = useState([]);

  const instance = {
    waypoints: latLong,

    lineOptions: {
      styles: [{ color: "#ff69b4", weight: 7 }],
    },

    createMarker: function (i, start, n) {
      //for (i = 0; waypoint.length; i++){
      return L.marker(start.latLng, {
        opacity: 0,
      });
    },

    router: L.Routing.graphHopper("5e47f16c-3d8f-4b5f-883a-64f41af17262", {
      urlParameters: {
        vehicle: "bike",
      },
    }),

    // RoutingOptions - from leaflet-routing-machine
    routingOptions: {
      //If U-turns are allowed in this route
      allowUTurns: true,
    },

    // shows directions
    show: false,

    // adds way points by dragging
    addWaypoints: false,

    // move waypoints by dragging
    draggableWaypoints: false,

    // fits route to the screen
    fitSelectedRoutes: false,

    collapsible: true,
    routeWhileDragging: true,
    showAlternatives: false,
  };

  //-------------------------------------------------------------------------------------------
  // POST/INSERT NEW DRAWING FUNC:
  // -when called this func POSTS to the api server which then INSERTS to the DB

  const saveDrawing = async (name) => {
    try {
      await axios.post(`${api}/drawings`, { latLong, name });
    } catch (e) {
      return console.log(e);
    }
    setLatLong([]);
  };

  //-------------------------------------------------------------------------------------------
  // LOGIN AND LOG OUT FUNCTIONS:
  // -The function is called by onClick of Login button in the drop down menu. It makes an axios request to
  //   database for user. It sets the loggedIn state with the particular logged in user object
  const loginUser = async () => {
    try {
      const user = await axios.post(`${api}/users/login`);

      setLoggedIn(user.data);
      handleOnSetView()
    } catch (e) {
      return console.log(e);
    }
  };

  const logout = () => {
    setLoggedIn(false);
  };

  //----------------------------------------------------------------------------------------------------
  // REMOVE LAST POINT FUNC:
  // -called by onclick in removes last element in state array
  const removeLastPoint = () => {
    setLatLong((prev) => {
      return [...prev.slice(0, -1)];
    });
  };

  //----------------------------------------------------------------------------------------------------
  // MY COMPONENT FUNC: (REACT-LEAFLET)
  // -a method from within react-leaflet, that is the library for react-leaflet hooks
  function MyComponent() {
    // useMapEvents is a React Leaflet Hook
    useMapEvents({
      // var map reprsesents the event listener that create a point when a user clicks on the map
      // on-click event to save lat + lng
      click: (e) => {
        const { lat, lng } = e.latlng;

        // uses previous state and updates with new state
        setLatLong((prev) => [...prev, L.latLng(lat, lng)]);
      },
    });
    return null;
  }

  const handleClose = (event) => {
    if (showShowcase === true) {
      setShowShowcase(false);
    } else {
      setShowShowcase(true);
    }
  };

  //------------------------------------------------------------------------------------------------------

  // const disneyWorldLatLng = [28.3852, -81.5639];
  // const disneyLandLatLng = [33.8121, -117.9190];
  // const mapId = useRef();

//   /**
//    * handleOnSetView
//    */

  const handleOnSetView = () => {
    // console.log("Handle set View called");
    // const { current = {} } = mapId;
    // const { leafletElement: map } = current;

    // map.setView(disneyWorldLatLng, 14);
  }
  
  const handleFlyTo = () => {

    // console.log("handle flyTo called");

    // const { current = {} } = mapId;

    // //console.log(" mapRef", mapRef);

    // const { leafletElement: map } = current;

    // console.log("map in fly to", map);

    // map.flyTo(disneyLandLatLng, 14, { duration: 2});
}
//   const handleFlyTo = () => {
//     console.log("click for handle fly");
//     const { current = {} } = mapId;
//     //console.log(" mapRef", mapRef);
//     const { leafletElement: map } = current;
//     console.log("map in fly to", map);
//     map.flyTo([49.281, -123.135], 14, { duration: 2});
// }
//   const handleFlyTo = () => {
//     console.log("click for handle fly");
    
//     setLatLong((prev) => [...prev, L.latLong])
//     map.flyTo([49.281, -123.135], 14, { duration: 2});
// }

  //----------------------------------------------------------------------------------------------------

  useEffect(() => {
    const getShowcaseDrawings = async () => {
      try {
        const response = await axios.get(`${api}/showcase`);
        setshowcaseData(response.data);
      } catch (e) {
        return console.log(e);
      }
    };
    getShowcaseDrawings();
  }, []);

  //----------------------------------------------------------------------------------------------------
  // RENDER:
  return (
    <>
      <MapContainer
        
        doubleClickZoom={false}
        id="mapId"
        zoom={14}
        center={[49.281, -123.135]}
      >
        <Control prepend position="topleft">
          <img
            id="logo"
            height="30"
            src="Canvas_logo_updated3.png"
            position="top-left"
          ></img>
        </Control>


        <Control prepend position="topleft">
          {showShowcase && (
            <Showcase
              setLatLong={setLatLong}
              showcaseData={showcaseData}
              handleFlyTo={handleFlyTo}
            ></Showcase>
          )}
        </Control>

        <Control prepend position="topright">
          <DropDownMenu
            user={loggedIn}
            setLatLong={setLatLong}
            loginUser={loginUser}
            saveDrawing={saveDrawing}
          ></DropDownMenu>
        </Control>

        <Control>
          <div className="ShowcaseButton">
            <IconButton onClick={handleClose} aria-label="delete" size="large">
              <StarIcon fontSize="large" />
            </IconButton>
          </div>
        </Control>

        <Control>
          {loggedIn && (
            <LoggedInUserMessage
              setLoggedOut={logout}
              prepend
              position="center"
              name={loggedIn.name}
            />
          )}
        </Control>


        <Control prepend position="bottomleft">
          <div className="UndoAndSave">
            <DeletePointButton removeLastPoint={removeLastPoint}>
              Delete a Point
            </DeletePointButton>
            {loggedIn && <SaveForm saveDrawing={saveDrawing}></SaveForm>}
          </div>
        </Control>

        <MyComponent />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=JHPAACJynf7oMojiymA4"
        />
        <Routing instance={instance} />
      </MapContainer>
    </>
  );
};

//-----------------
export default Map;
