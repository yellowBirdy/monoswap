import React from "react"
import {Quantinfo} from "../styled"

export default  ({label, amount}) => <Quantinfo >{label}: {!!amount && amount !== NaN && amount.toFixed(3)}</Quantinfo> 
