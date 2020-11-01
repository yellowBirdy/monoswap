import React from 'react'

import {Login, Logout} from "../buttons/user"


export default () => <div className="User">
    <div className="auth">  
        <p>Auth</p>
        <Login /> 
        <Logout />
    </div>
</div>