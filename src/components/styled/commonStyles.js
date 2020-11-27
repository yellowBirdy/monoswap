import {css} from "styled-components"

const BG = {
    primary: "#212429",
    brightened: "#2c323d",
    darkened: "#111419",
    secondary: "#1d1f24"
}
const COLOR = {
    primary: "#fff",
    brightened: "#223b3b",
    darkened: "#c3c5cb",
    secondary: "#c3c5cb"
}


export const formElement = css`
    display: block; 
    width: 90%; 
    margin: auto;
`
export const centered = css`
    margin: auto;
    text-align: center;
`
export const chubby = css`
    border-radius: ${props=>props.chubby ? "1.9em" : "auto"};
    padding: ${props=>props.chubby ? "1em" : "auto" };  
`

export const bordered = css`
    border: ${props=>props.bordered ? `black solid 0.1px` : "none"}; 
    border-color:  ${props=>props.brightened ? BG.brightened :
                            props.darkened  ?  BG.darkened   :
                            props.secondary ?  BG.secondary  :
                                               BG.brightened};
    border-radius: .2em;
`

export default css`
    ${props=>props.formElement && formElement}
    ${props=>props.centered && centered}
    ${bordered}
    ${chubby}
    ${props=>props.root && css`background: linear-gradient(.15turn, ${BG.darkened}, ${BG.primary}, ${BG.brightened}, ${BG.brightened});`}
    background-color: ${props=>props.brightened ? BG.brightened :
                               props.darkened  ?  BG.darkened   :
                               props.secondary ?  BG.secondary  :
                               props.trans     ?  "inherit"     :
                                                  BG.primary};
    color: ${props=>props.brightened ? COLOR.brightened :
                    props.darkened  ?  COLOR.darkened   :
                    props.secondary ?  COLOR.secondary  :
                                       COLOR.primary};
    ${props=> props.section && css`margin: 6em auto;`}
`
