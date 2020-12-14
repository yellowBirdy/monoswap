import styled from "styled-components"
import {formElement} from "./commonStyles"

export default styled.p`
    ${formElement}
    font-size: 0.9em;
    font-family: monospace sans-serif;
    color: ${props=>props ? "lightblue" : "black"}
`