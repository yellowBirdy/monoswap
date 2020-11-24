import React from "react"
import {Link} from "react-router-dom"

export default () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Swap</Link>
                </li>
          {/*
                <li>
                    <Link to="/faucet">Faucet</Link>
                </li>
            */}
                <li>
                    <Link to="/sandbox">Sandbox</Link>
                </li>
            </ul>
        </nav>
    )
}