import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidenav from "examples/Sidenav";

// Material Dashboard 2 PRO React contexts
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setDarkMode,
} from "context";

import { getMenu } from "routes";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
// import logoApp from "assets/img/logoApp.png";

import secureStorage from "libs/secureStorage";
// import { requestForToken, onMessageListener } from "firebaseinit";
// import Notification from "contents/Components/Notification";

function Layout() {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, sidenavColor, transparentSidenav, whiteSidenav, darkMode } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [user, setUser] = useState(null);

  const [show, setShow] = useState(false);
  const toggleSnackbar = () => setShow(!show);

  const navigate = useNavigate();
  const notifRef = useRef();

  // set theme dark && transparent
  useEffect(() => {
    // const user = secureStorage.getItem("user");
    const user = {
      name: "redha",
      email: "redha@gmail.com",
      roleId: 1,
    };

    if (!user) {
      navigate("/login");
    } else {
      // setTransparentSidenav(dispatch, false);
      // setWhiteSidenav(dispatch, true);
      // setDarkMode(dispatch, false);

      setWhiteSidenav(dispatch, false);
      setTransparentSidenav(dispatch, false);
      setUser(user);
      // requestForToken();
    }
  }, []);

  // // Message Listener
  // onMessageListener()
  //   .then((payload) => {
  //     toggleSnackbar();
  //     notifRef.current.setShow({
  //       color: "info",
  //       icon: "notifications",
  //       title: payload?.notification?.title,
  //       content: payload?.notification?.body,
  //       dateTime: "Beberapa detik yang lalu ",
  //       open: true,
  //       close: { toggleSnackbar },
  //     });
  //   })
  //   .catch((err) => console.log("failed: ", err));

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  return (
    <>
      <Sidenav
        color={sidenavColor}
        // brand={logoApp}
        brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
        brandName="ADYSA MARKETING"
        routes={user ? getMenu(user) : []}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      />
      {/* <Notification ref={notifRef} /> */}

      <Outlet />
    </>
  );
}

export default Layout;
