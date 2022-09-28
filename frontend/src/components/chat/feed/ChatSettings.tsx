import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Menu from '@mui/material/Menu';
import Tooltip from "@mui/material/Tooltip";

interface ChatSettingsProps {
    handleOpenSettings: any
    handleCloseSettings: any
    settings: HTMLElement
  }

export const ChatSettings = ({handleOpenSettings, handleCloseSettings, settings}: ChatSettingsProps) => {

    
    return (
            <Box sx={{display:'flex', flexDirection: 'row-reverse', marginRight:'15px'}}>
            <Tooltip title="Settings">
                <IconButton onClick={handleOpenSettings} sx={{ p: 0 }}>
                    <SettingsIcon fontSize='large'/>
                </IconButton>
            </Tooltip>
            <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={settings}
            anchorOrigin={{
            vertical: "top",
            horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
            vertical: "top",
            horizontal: "right",
            }}
            open={Boolean(settings)}
            onClose={handleCloseSettings}
            >
                <div>LEAVE THE CHANNEL</div>
                {  true &&
                <div>PASWORD SETTINGS</div>
                }
            </Menu>
        </Box>

    );
}