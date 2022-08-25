import React from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../App";

const RouteProtect = ({ children }: any) => {

    const user = React.useContext(UserContext);

    if (!user) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default RouteProtect;