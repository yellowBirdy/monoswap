import React from "react"
import { Container } from "../components/styled"
import { Install } from "../components/subcomponents"

export default () => {
    return (
        <Container chubby centered style={{margin: "6em", padding: "3em"}}> 
            <Install />
        </Container>
    )
}