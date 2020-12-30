import React from 'react'
import {Input} from "../styled"
import {validNumericalInput} from "../../utils"


export default  ({value, handleChange, ...props}) => 
    <Input type="text" inputMode="decimal" bordered
           value={value} key="amountIn" 
           onChange={e=>validNumericalInput(e.target.value) && handleChange(e.target.value)} 
           {...props} >
    </Input>

