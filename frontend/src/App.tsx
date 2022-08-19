import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Profile } from "./route/Profile";
import { Homepage } from "./route/Homepage";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { UserDto } from "./api/dto/user.dto";
import { UserAPI } from "./api/user.api";
import ResponsiveAppBar from "./components/AppBar";

function App() {

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

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <div className="App">
      <ResponsiveAppBar
        handleToggle={handleToggle}
        user={user}
        setUser={setUser}
        currentAvatar={currentAvatar}
      />
      <Routes>
          <Route path="/profile" element={<Profile 
              user={user}
              currentAvatar={currentAvatar}
            />} />
          <Route path="/" element={<Homepage />} />
      </Routes>
    </div>
    </ThemeProvider>
  );
}

export default App;
