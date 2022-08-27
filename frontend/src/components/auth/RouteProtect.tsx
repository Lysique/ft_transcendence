import React from "react";
import { UserDto } from "../../api/dto/user.dto";
import { UserContext } from "../../App";

interface RouteProtectProps {
    children: JSX.Element
}

const RouteProtect = ({ children }: RouteProtectProps) => {

    const user: UserDto | null = React.useContext(UserContext);

    if (!user) {
        return <>''</>;
    }
    return <>{children}</>;
};

export default RouteProtect;