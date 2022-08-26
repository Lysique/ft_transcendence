import React from "react";
import { UserContext } from "../../App";

const RouteProtect = ({ children }: any) => {

    const user = React.useContext(UserContext);

    if (!user) {
        return '';
    }
    return children;
};

export default RouteProtect;