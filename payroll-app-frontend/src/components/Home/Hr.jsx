import React from 'react'
import Dashboard from './Dashboard/Dashboard';
import { isAuthenticated } from '../../utils/auth';
import Login from '../login/Login';

const Hr = () => {
    if(!isAuthenticated){
        return <Navigate to={<Login/>}/>
    }
    return(
        <div>
            <Dashboard/>
        </div>
    )
}

export default Hr;