import React from "react"
import Quantinfo from "./Quantinfo"

export default  ({name, amount}) => <Quantinfo balance amount={amount} label={`Balance of ${name}`}></Quantinfo> 
