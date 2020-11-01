import React from "react"
import {Link} from "react-router-dom"

export default () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Play</Link>
                </li>
            </ul>
            <ul>
                <li>
                    <Link to="/admin">Admin</Link>
                </li>
            </ul>
            <ul>
                <li>
                    <Link to="/sandbox">Sandbox</Link>
                </li>
            </ul>
        </nav>
    )
}