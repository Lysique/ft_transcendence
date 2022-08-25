import React from "react";
import { UserContext } from "../../App";
import TwoFactAuth from "./TwoFactAuth";
import UsernameTaken from "./UsernameTaken";

const HomeProtect = ({ loggedIn, setLoggedIn, children }: any) => {

    const user = React.useContext(UserContext);

    return (
        <>
        {children}

        {
            user && !user.name?

            <UsernameTaken />

            : loggedIn && !user?

            <TwoFactAuth setLoggedIn={setLoggedIn}/>

            : ''
        }
      </>
    )
};

export default HomeProtect;