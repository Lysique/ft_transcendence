import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Profile } from "./route/Profile";
import { Homepage } from "./route/Homepage";
import { UserDto } from "./api/dto/user.dto";
import { UserAPI } from "./api/user.api";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import ResponsiveAppBar from "./components/AppBar";

function App() {
  /* Dark/light mode */
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  useEffect(() => {
    const themeType = localStorage.getItem("dark") || "dark";
    if (themeType === "dark") {
      setDarkMode(true);
    }
  }, []);

  const handleToggle = () => {
    localStorage.setItem("dark", darkMode ? "light" : "dark");
    setDarkMode(!darkMode);
  };

  /* User state */
  const [user, setUser] = React.useState<UserDto | null>();

  React.useEffect(() => {
    const fetchProfile = async () => {
      const data = await UserAPI.getUserProfile();
      setUser(data);
    };

    fetchProfile();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <ResponsiveAppBar
          handleToggle={handleToggle}
          user={user}
          setUser={setUser}
        />
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
