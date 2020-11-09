import React from "react"

import {User, Flowscan, Pool} from "../components/sections"

export default () => {
    return (       
        <div className="interactions"> 
            <User />
            <Flowscan />
            <Pool />
        </div>)
}