import React from "react"
import { install } from "../flow/actions"
//TODO: use state to keep track of tx result and show result

export default () => {
    return (
        <div>
            <button onClick={install}>Install</button>
        </div>
    )
}