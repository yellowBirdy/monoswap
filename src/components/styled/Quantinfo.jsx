import React from "react"
import styled from "styled-components"

export default styled.p`
    font-size: 0.9em;
    font-family: monospace sans-serif;
    color: ${props=>props.balance ? "lightblue" : "black"}
`