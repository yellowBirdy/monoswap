import React from "react"
import {Link} from "react-router-dom"

export default () => {
    return (
        <nav>
            <ul style={{textAlign: "start", marginBlock:"unset"}}>
                <li style={{display: "inline-block", padding: "1em 4em", border: "grey 1px solid", margin: "auto auto auto 4em"}}>
                    <Link to="/">Swap</Link>
                </li>
          {/*
                <li style={{display: "inline-block"}}>
                    <Link to="/faucet">Faucet</Link>
                </li>
            */}
                <li style={{display: "inline-block", padding: "1em 4em", border: "grey 1px solid"}}>
                    <Link to="/sandbox">Sandbox</Link>
                </li>
            </ul>
        </nav>
    )
}