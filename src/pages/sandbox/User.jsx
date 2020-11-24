import React from 'react'

import {Login, Logout} from "../../components/buttons/user"
import {Install} from "../../widgets"


export default () => <div className="User">
    <div className="auth">  
        <p>Auth</p>
        <Login /> 
        <Logout />
        <Install />
    </div>
</div>