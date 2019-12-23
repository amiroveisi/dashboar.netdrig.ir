import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';

export default function AuthHandler(props)
{
    const [unauthorized, setUnauthorized] = useState(false);
    if (unauthorized) {
        return (
            <Redirect to="/login" />
        );
    }
    return(
        <React.Fragment>
            {props.children}
        </React.Fragment>
    )
}