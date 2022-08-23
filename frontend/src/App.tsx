import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Profile } from "./route/Profile";
import { Homepage } from "./route/Homepage";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { UserDto } from "./api/dto/user.dto";
import { UserAPI } from "./api/user.api";
import ResponsiveAppBar from "./components/AppBar";
import { socket, WebsocketProvider } from "./contexts/WebsocketContext";
import { Websocket } from "./components/Websockets";

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
          {/* <Route path="/" element={<Homepage />} /> */}
        </Routes>
        <WebsocketProvider value={socket}>
          <Websocket />
        </WebsocketProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
