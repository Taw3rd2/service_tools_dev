import { useState } from "react";
import { auth } from "../../firebase/firestore.utils";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  CalendarMonth,
  HomeRepairService,
  People,
  Queue,
  Settings,
  Widgets,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

const Navbar = ({ authUser }) => {
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOut = () => {
    console.log("Logout triggered!");
    handleCloseUserMenu();
    signOut(auth).then(() => {
      console.log("Sign out successful");
      navigate("/");
    });
  };

  const userMenu = ["Log Out"];
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

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h4"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Service Tools
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {authUser !== null &&
                authUser.displayName &&
                links.map((link) => (
                  <MenuItem key={link.key} onClick={() => navigate(link.path)}>
                    <Typography textAlign="center">{link.name}</Typography>
                  </MenuItem>
                ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Service Tools
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {authUser &&
              authUser.displayName &&
              links.map((link) => (
                <Button
                  key={link.key}
                  onClick={() => navigate(link.path)}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {link.name}
                </Button>
              ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Log Out">
              <Typography
                variant="h5"
                noWrap
                onClick={handleOpenUserMenu}
                sx={{
                  ml: 2,
                  display: { xs: "none", md: "flex" },
                  fontWeight: 700,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {authUser && authUser.displayName && authUser.displayName}
              </Typography>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userMenu.map((setting) => (
                <MenuItem key={setting} onClick={handleLogOut}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
