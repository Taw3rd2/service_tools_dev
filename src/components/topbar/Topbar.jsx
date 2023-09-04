import { useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firestore.utils";

import { useNavigate } from "react-router-dom";

import {
  Brightness4,
  Brightness7,
  CalendarMonth,
  HomeRepairService,
  People,
  Queue,
  Settings,
  Widgets,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "../../global_style/style.css";

const Topbar = ({ authUser, colorMode }) => {
  const theme = useTheme();
  let navigate = useNavigate();
  const btnRef = useRef();

  const [isDropDownopen, setDropDownOpen] = useState(false);

  const handleLogOut = () => {
    console.log("Logout triggered!");
    signOut(auth).then(() => {
      console.log("Sign out successful");
      navigate("/");
    });
  };

  const links = [
    {
      name: "Customers",
      path: "/homepage",
      key: 0,
      icon: <People />,
    },
    { name: "Schedule", path: "/schedule", key: 1, icon: <CalendarMonth /> },
    // {
    //   name: "Maintenance",
    //   path: "/maintenance",
    //   key: 2,
    //   icon: <Build />,
    // },
    {
      name: "Parts",
      path: "/parts_catalog",
      key: 3,
      icon: <Widgets />,
    },
    {
      name: "Equipment",
      path: "/equipment_catalog",
      key: 4,
      icon: <Queue />,
    },
    {
      name: "Services",
      path: "/services_catalog",
      key: 5,
      icon: <HomeRepairService />,
    },
    { name: "Settings", path: "/settings", key: 6, icon: <Settings /> },
    // { name: "Accounting", link: "/accounting", key: 6 },
  ];

  const getDisplayName = (user) => {
    if (authUser && authUser.displayName) {
      return authUser.displayName;
    } else if (authUser && authUser.email) {
      return authUser.email;
    } else {
      return "";
    }
  };

  return (
    <div className="topbarContainer noPrint">
      <div className="topbarLeft">
        <span className="topbarLogo">Service Tools</span>
      </div>
      <div className="topbarCenter">
        {(authUser !== null && authUser.displayName) ||
        (authUser !== null && authUser.email) ? (
          links.map((link) => (
            <button
              key={link.key}
              onClick={() => navigate(link.path)}
              className="standardButton"
            >
              {link.icon}
              <span className="iconSeperation">{link.name}</span>
            </button>
          ))
        ) : (
          <div />
        )}
      </div>
      <div className="topbarRight">
        <div className="topbarDropdown">
          <div
            ref={btnRef}
            className="topbarUser"
            onClick={() => setDropDownOpen(!isDropDownopen)}
          >
            {getDisplayName(authUser)}
          </div>

          {isDropDownopen && (
            <div className="topbarDropdownContent">
              <div
                className="topbarDropdownLink"
                onClick={() => handleLogOut()}
              >
                Log Out
              </div>
            </div>
          )}
        </div>
        <IconButton onClick={() => colorMode.toggleColorMode()} color="inherit">
          {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </div>
    </div>
  );
};

export default Topbar;
