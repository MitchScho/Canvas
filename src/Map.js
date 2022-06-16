// MAP FILE
//----------------------------------------------------------------------------------------------------
import { useState } from "react";
import axios from "axios";

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

// API KEY: (references our .env file)
const api = process.env.REACT_APP_API;

//-----------------------------------------------------------------------------------------------------

// MAP COMPONENT:
const Map = (props) => {
  const [latLong, setLatLong] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showShowcase, setShowShowcase] = useState(true);

  const instance = {
    waypoints: latLong,
    lineOptions: {
      styles: [{ color: "#ff69b4", weight: 7 }],
    },

    // RoutingOptions - from leaflet-routing-machine
    routingOptions: {
      //If U-turns are allowed in this route
      allowUTurns: true,
    },
    // shows directions
    show: false,

    collapsible: true,
    // allowUTurn: true,
    // adds way points by dragging
    addWaypoints: false,
    routeWhileDragging: true,
    // move waypoints by dragging
    draggableWaypoints: false,
    // fits route to the screen
    fitSelectedRoutes: false,
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
        {/* <Control prepend position="topleft">
          <img id="logo" src="Canvas_Logo.png" width="200" height="300"></img>
        </Control> */}

        <Control>
          <div className="ShowcaseButton">
            <IconButton onClick={handleClose} aria-label="delete" size="large">
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </div>
        </Control>

        <Control>
          <DropDownMenu
            user={loggedIn}
            setLatLong={setLatLong}
            loginUser={loginUser}
            saveDrawing={saveDrawing}
          ></DropDownMenu>
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

        <Control prepend position="topleft">
          {showShowcase && <Showcase setLatLong={setLatLong}></Showcase>}
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
