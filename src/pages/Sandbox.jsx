import React from "react"

import {User, NFT, Flowscan} from "../components/sections"

export default () => {
    return (       
        <div className="interactions"> 
            <User />
            <NFT />
            <Flowscan />
        </div>)
}