import React from "react"
import {Link} from "react-router-dom"
import {Login} from "../components/subcomponents"

export default () => {
    return (
        <nav style={{display: "flex"}}>
            <ul style={{textAlign: "start", marginBlock:"unset", width: "70%"}}>
            {    <li style={{display: "inline-block", padding: "1em 4em", border: "grey 1px solid", margin: "auto auto auto 4em"}}>
                    <Link to="/">Swap</Link>
                </li>
            }
          {
                <li style={{display: "inline-block", padding: "1em 4em", border: "grey 1px solid", margin: "auto auto auto 4em"}}>
                    <Link to="/install">Install</Link>
                </li>
            }
                {/*
                <li style={{display: "inline-block", padding: "1em 4em", border: "grey 1px solid"}}>
                    <Link to="/sandbox">Sandbox</Link>
                </li>
                */}       
            </ul>
            <Login/>
        </nav>
    )
}