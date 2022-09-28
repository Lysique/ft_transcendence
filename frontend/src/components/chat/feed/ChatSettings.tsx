import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Menu from '@mui/material/Menu';
import Tooltip from "@mui/material/Tooltip";
import { RoomDto } from 'api/chat.api';
import { WebsocketContext } from 'contexts/WebsocketContext';
import { Button } from '@mui/material';
import ValidationPopup from 'components/utils/ValidationPopup';

export const ChatSettings = ({room}: {room: RoomDto}) => {

    const [settings, setSettings] = React.useState<null | HTMLElement>(null);
    const socket = React.useContext(WebsocketContext);

    const handleCloseSettings = () => {
      setSettings(null);
    };
    const handleOpenSettings = (event: React.MouseEvent<HTMLElement>) => {
      setSettings(event.currentTarget);
    };

    const [openValidation, setOpenValidation] = React.useState<boolean>(false);
    const [validation, setValidation] = React.useState<boolean>(false);

    const onLeaveChannelClick = () => {
        setOpenValidation(true);
    };

    React.useEffect(() => {
        if (validation) {
            socket.emit('leaveRoom', { roomName: room.roomName })
        }
      }, [validation, socket]);
    
    return (
        <>
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
                <Button onClick={onLeaveChannelClick}>Leave room</Button>

                {true &&
                <div>PASSWORD SETTINGS</div>
                }
            </Menu>
        </Box>

        <ValidationPopup
            open={openValidation}
            setOpen={setOpenValidation}
            setValidation={setValidation}
            title={`Leave room ${room.roomName} ?`}
            message={'The room will be left and destroyed if you are the owner.'}
        />
        </>
    );
}