import { Button } from "@mui/material";
import React from "react";
import { UserAPI } from "../../api/user.api";


interface ProfileProps {
    setUser: any
}

export const SetName = ({
    setUser,

}: ProfileProps) => {

    const setName = async () => {
        const resp = await UserAPI.updateName('jean');
        console.log(resp);
        // const data = await UserAPI.getUserProfile();
        // setUser(data);
    };

    return (
        <div>
            <Button onClick={setName}>
                MyButton
            </Button>
        </div>
    );
}