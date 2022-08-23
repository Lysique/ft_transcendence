import { Button } from "@mui/material";
import React from "react";
import { UserAPI } from "../../api/user.api";
import { SetUserContext } from "../../App";

export const SetName = () => {

    const setUser = React.useContext(SetUserContext)

    

    const setName = async () => {
        const resp = await UserAPI.updateName('jean');
        const data = await UserAPI.getUserProfile();
        setUser(data);
    };

    return (
        <div>
            <Button onClick={setName}>
                MyButton
            </Button>
        </div>
    );
}