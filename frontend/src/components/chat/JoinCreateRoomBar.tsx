import { PersonSearch } from "@mui/icons-material";
import { Autocomplete, IconButton, styled, Toolbar } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import React from "react";
import { CreateRoomDialog } from "./CreateRoomDialog";
import { WhiteBorderTextField } from "components/utils/WhiteBorderTextField";

const SearchPersonn = styled('div')(({ theme }) => ({
    color: 'primary',
    backgroundColor: 'primary',
    paddingLeft: 0,
    borderRadius: 1,
  }));
  
export const JoinCreateRoomBar = () => {

    const roomNames = ['Room1', 'Room2'];
    const [allRooms, setAllRooms] = React.useState<string[] | null>(null);

    React.useEffect(() => {
        
        const fetchRoomNames = async() => {
            //  Api.fetchRoomNames
            setAllRooms(null);
        }

        fetchRoomNames();

    }, []);

    const keyPress = (event: any): void => {
        if (event.keyCode === 13)
        {
            console.log(event.target.value + ' searched!')
        }
    }

    const handleClick = (event: any, value: string, reason: any) => {
        //  Todo: Join room dialog -> password after first dialog
        console.log(value + ' clicked!')
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
            options={roomNames}
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

    </>
    )
}