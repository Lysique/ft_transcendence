import { PersonSearch } from "@mui/icons-material";
import { Autocomplete, IconButton, styled, Toolbar } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import React from "react";
import { CreateRoomDialog } from "./CreateRoomDialog";
import { WhiteBorderTextField } from "components/utils/WhiteBorderTextField";
import { JoinRoomDialog } from "./JoinRoomDialog";
import { ChatAPI } from "api/chat.api";

const SearchPersonn = styled('div')(({ theme }) => ({
    color: 'primary',
    backgroundColor: 'primary',
    paddingLeft: 0,
    borderRadius: 1,
  }));
  
export const JoinCreateRoomBar = ({
    currentRooms,
    handleChangeChannel
}: any) => {

    const roomNames = ['Room1', 'Room2'];
    const [allRooms, setAllRooms] = React.useState<string[]>(roomNames);

    React.useEffect(() => {
        
        const fetchRoomNames = async() => {
            const resp: {rooms: string[]} = await ChatAPI.getAllRoomNames();
            setAllRooms(resp.rooms);
        }

        fetchRoomNames();
    }, []);

    const [openJoinRoom, setOpenJoinRoom] = React.useState<boolean>(false);
    const [roomToJoin, setRoomToJoin]= React.useState<string>('');

    const joinRoomHandler = (roomName: string) => {
        const idx = currentRooms.findIndex((room: { roomName: string; }) => {
            return room.roomName === roomName;
        });
        if (idx !== -1) {
            handleChangeChannel(null, idx);
        }
        else {
            setOpenJoinRoom(true);
            //  With optional password
            setRoomToJoin(roomName);
        }
    }

    const keyPress = (event: any): void => {
        if (event.keyCode === 13)
        {
            joinRoomHandler(event.target.value);
        }
    }

    const handleClick = (event: any, value: string, reason: any) => {
        joinRoomHandler(value);
    }

    const [openCreateRoom, setOpenCreateRoom] = React.useState<boolean>(false);


    const onAddClick = () => {
        setOpenCreateRoom(true);
    }

    const handleCloseCreateRoom = () => {
        setOpenCreateRoom(false);
    }

    return (
    <>

    <SearchPersonn>
    <Toolbar>

        <PersonSearch/>
        
        <Autocomplete
            sx={{  width:180, mr:2, paddingLeft:'10px' }}
            disableClearable
            freeSolo
            onChange={handleClick}
            options={allRooms}
            renderInput={(params) => (
                <>
                <WhiteBorderTextField
                    {...params}
                    onKeyDown={keyPress}
                    label="...search"
                    InputProps={{
                        ...params.InputProps,
                    }}
                />
                </>
            )}
        />

        <IconButton onClick={onAddClick}>
            <AddIcon />
        </IconButton>

    </Toolbar>

    </SearchPersonn>

    <CreateRoomDialog
        open={openCreateRoom}
        onClose={handleCloseCreateRoom}
    />

    <JoinRoomDialog 
        open={openJoinRoom}
        roomName={roomToJoin}
        setOpen={setOpenJoinRoom}
    />

    </>
    )
}