import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface Props {
    children: any;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const token = useSelector((state: any) => state.auth.token);

    if (!token) {
        return <Navigate to={{ pathname: "/login" }} replace />;
    }

    return children;
};

export default ProtectedRoute;
