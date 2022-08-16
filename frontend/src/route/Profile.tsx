import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import { UserDto } from "../api/dto/user.dto";
import { UserAPI } from "../api/user.api";

export function Profile () {

    const [darkMode, setDarkMode] = React.useState(false);

    const theme = createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
      },
    });
  
    const handleToggle = () => {
      setDarkMode(!darkMode);
    };
    
    //  user state
    const [user, setUser] = React.useState<UserDto | null>();

    React.useEffect(() => {
    const fetchProfile = async () => {
        const data = await UserAPI.getUserProfile();
        setUser(data);
    }

    fetchProfile();
    }, [])

    return (
        <ThemeProvider theme={theme}>
        </ThemeProvider>
    );
}