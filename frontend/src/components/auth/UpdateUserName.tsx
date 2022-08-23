import { Button } from "@mui/material";
import React from "react";
import { UserAPI } from "../../api/user.api";
import { SetUserContext } from "../../App";

export const UpdateUserName = () => {

    const setUser = React.useContext(SetUserContext)

    const [name, setName] = React.useState("");

    const handleInput = (e: any) => {
        setName(e.target.value);
    };

    const updateName = async () => {
        const resp = await UserAPI.updateName(name);
        if (resp) {
            setUser(resp);
        }
    };

    return (
        <>
            <input type="text" onChange={handleInput}></input>
            <Button onClick={updateName}>
                Choose name
            </Button>
        </>
    );
}