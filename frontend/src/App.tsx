import React, { useState } from "react";
import { Profile } from "./route/Profile";
import { Homepage } from "./route/Homepage";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { UserDto } from "./api/dto/user.dto";
import { UserAPI } from "./api/user.api";
import ResponsiveAppBar from "./components/AppBar";

function App() {

    // Route handler
    const [route, setRoute] = React.useState('Homepage');

    const RouteHandler = (props: any) => {
      if (route === 'Profile') {
        return (
          <Profile 
            user={user}
            setUser={setUser}
            currentAvatar={currentAvatar}
            setCurrentAvatar={setCurrentAvatar}
          />
        )
      }

      else if (route === 'Homepage') {
        return (
          <Homepage />
        )
      }

      else {
        return (
          <h1>Path not defined</h1>
        )
      }
    }

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
      <RouteHandler />
    </div>
    </ThemeProvider>
  );
}

export default App;
