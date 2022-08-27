import { Button } from "@mui/material";
import React from "react";
import { UserDto } from "../../api/dto/user.dto";
import { UserAPI } from "../../api/user.api";
import { SetUserContext } from "../../App";
import ValidationPopup from "../utils/ValidationPopup";

interface AddFriendButtonProps {
    visited: UserDto | null
}

export const AddFriendButton = ({visited}: AddFriendButtonProps) => {

    const setUser: Function = React.useContext(SetUserContext);

    const [openValidation, setOpenValidation] = React.useState<boolean>(false);
    const [validation, setValidation] = React.useState<boolean>(false);

    const handleOpenValidation = () => {
        setOpenValidation(true);
    }

    React.useEffect(() => {
        const addToFriend = async () => {
            if (visited) {
                const resp: UserDto | null = await UserAPI.addFriend(visited.id);
                setValidation(false);
                setUser(resp);
            }
        }
        if (validation === true) {
            addToFriend();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validation]);
    
    return (
        <>
        <Button onClick={handleOpenValidation}>
            Add friend
        </Button>

        <ValidationPopup 
            open={openValidation}
            setOpen={setOpenValidation}
            setValidation={setValidation}
            title={`Add ${visited?.name} to friend ?`}
            message={'This action will add the user to your friendlist.'}
        />

        </>
    );
}