
import React from 'react'
import * as fcl from "@onflow/fcl"

export default () => <button onClick={
        ()=>{console.log('logging out'); 
        fcl.unauthenticate()}}>
            Log out
    </button>          
