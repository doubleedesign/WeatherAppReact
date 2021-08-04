import React, {Fragment} from "react";

import "./_Alert.scss";

export default function Alert(props) {

    return (
        <div className={`alert alert--${props.type}`}>
            <p>{props.message}</p>
        </div>
    )
}
