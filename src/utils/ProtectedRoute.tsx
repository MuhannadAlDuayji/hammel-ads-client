import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";

interface Props {
    children: any;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const token = useSelector((state: any) => state.auth.token);
    const user = useSelector((state: any) => state.user.user);

    if (!token) {
        return <Navigate to={{ pathname: "/login" }} replace />;
    }

    return children;
};

export default ProtectedRoute;
