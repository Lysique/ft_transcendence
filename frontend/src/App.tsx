import React, { useState } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { UserDto } from "./api/dto/user.dto";
import { UserAPI } from "./api/user.api";
import ResponsiveAppBar from "./components/AppBar";
import { RouteHandler } from "./components/RouteHandler";

function App() {

    // Route handler
    const [route, setRoute] = React.useState('Homepage');

  //  Dark/ligh mode
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  //  Check if user is logged in to prevent errors
  
  //  User state
  const [user, setUser] = React.useState<UserDto | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const data = await UserAPI.getUserProfile();
      setUser(data);
    }

    fetchProfile();
  }, [])

  //  User profile pic
  const [currentAvatar, setCurrentAvatar] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCurrentAvatar = async () => {
      const data = await UserAPI.getCurrentAvatar();
      setCurrentAvatar(data);
    }

    fetchCurrentAvatar();
  }, [user])

  React.useEffect(() => {
  }, [currentAvatar])

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <div className="App">
      <ResponsiveAppBar
        handleToggle={handleToggle}
        user={user}
        setUser={setUser}
        currentAvatar={currentAvatar}
        setRoute={setRoute}
      />
      <RouteHandler 
        handleToggle={handleToggle}
        user={user}
        setUser={setUser}
        route={route}
        setRoute={setRoute}
        currentAvatar={currentAvatar}
        setCurrentAvatar={setCurrentAvatar}
      />
    </div>
    </ThemeProvider>
  );
}

export default App;
