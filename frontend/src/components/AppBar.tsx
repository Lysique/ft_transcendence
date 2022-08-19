import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";
import { UserAPI } from "../api/user.api";
import { UserDto } from "../api/dto/user.dto";
import { Link } from "react-router-dom";
import defaultAvatar from '../default_avatar/profile_image.jpeg';

interface ResponsiveAppBarProps {
  handleToggle: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
  user: UserDto | null
  setUser: any
}

const ResponsiveAppBar = ({ handleToggle, user, setUser }: ResponsiveAppBarProps) => {
  const theme = useTheme();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // UserMenu

  //  Login / logout
  async function Logout(props: any) {
    handleCloseUserMenu();
    UserAPI.logout();
    setUser(null);
  }
  
  const LoginButton = () => {
    return (
      <MenuItem 
        key="Login"
        href={`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/auth/login`}
        component="a"
      >
        <Typography textAlign="center">Login</Typography>
      </MenuItem>
   );
  };

  const ProfileRedirect = () => {
    return (
      <MenuItem 
        key="Profile"
        component={Link}
        to="/profile"
        onClick={handleCloseUserMenu}
      >
        <Typography textAlign="center">Profile</Typography>
      </MenuItem>
   );
  };

  const HomepageRedirect = () => {
    return (
      <MenuItem 
        key="Homepage"
        component={Link}
        to="/"
        onClick={handleCloseUserMenu}
      >
        <Typography textAlign="center">Home</Typography>
      </MenuItem>
   );
  };

  function LogoutButton() {
    return (
      <MenuItem 
        key="Logout" 
        onClick={Logout}
        component={Link}
        to="/"
      >
        <Typography textAlign="center">Logout</Typography>
      </MenuItem>
    );
  }
  
  function LoginControl(props: any) {
    const settings = user != null? loggedInSettings: loggedOutSettings;

    return (
      <div>
      {settings.map((setting) => (
        setting.onClick
      ))}
      </div>
    );
  }

  const pages = ["Play now", "Chat with friends"];
  const loggedInSettings = [{
    name: "Logout",
    onClick: LogoutButton()
  }, {
    name: "Profile",
    onClick: ProfileRedirect()
  }, {
    name: "Homepage",
    onClick: HomepageRedirect()
  }];

  const loggedOutSettings = [{
    name: "Login",
    onClick: LoginButton()
  }, {
    name: "Homepage",
    onClick: HomepageRedirect()
  }];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
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
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            PING-PONG
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box textAlign="center">
            <IconButton sx={{ mr: 3 }} onClick={handleToggle} color="inherit">
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Update settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Remy Sharp"
                  src={defaultAvatar}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
            <LoginControl />
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
