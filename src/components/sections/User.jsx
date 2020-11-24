import React from 'react'

import {Login, Logout} from "../buttons/user"
import {Install} from "../../pages/components/sections"


export default () => <div className="User">
    <div className="auth">  
        <p>Auth</p>
        <Login /> 
        <Logout />
        <Install />
    </div>
</div>