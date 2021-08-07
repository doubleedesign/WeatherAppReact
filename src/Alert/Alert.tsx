import React, {Fragment} from "react";
import "./_Alert.scss";

export interface AlertProps {
    type: string;
    message: string
}

export const Alert: React.FC<AlertProps> = function(
    props: {
        type: string;
        message: string;
    }) {

    return (
        <div className={`alert alert--${props.type}`}>
            <p>{props.message}</p>
        </div>
    )
}

export default Alert;