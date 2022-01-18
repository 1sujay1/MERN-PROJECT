import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function withRouter(Child) {
    return (props) => {
        const location = useLocation();
        const navigate = useNavigate();
        const urlParams = useParams();
        return <Child {...props} urlParams={urlParams} navigate={navigate} location={location} />;
    }
}