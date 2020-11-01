import React, {useState} from "react"

import {seedContract} from "../../../flow/admin_actions"


export default () => {

    return (<div className="createForm">
        <button onClick={seedContract}>Seed Contract</button>
    </div>)
}
