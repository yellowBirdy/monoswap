import React from "react"
import { install } from "../flow/actions"
import { Container } from "../components/styled"
//TODO: use state to keep track of tx result and show result

export default () => {
    return (
        <Container chubby centered style={{margin: "6em", padding: "3em"}}> 
            <button onClick={install}>Install Bitroot and LP token Vaults</button>
        </Container>
    )
}