import React from "react"

import User from "./User.jsx"
import Flowscan from "./Flowscan.jsx"
import Pool from "./Pool.jsx"

export default () => {
    return (       
        <div className="interactions"> 
            <User />
            <Flowscan />
            <Pool />
        </div>)
}