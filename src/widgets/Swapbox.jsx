import React, {useState, useEffect} from "react"

import {TOKEN_NAMES} from "../config"
import {getAmountOut, getAmountIn, swap} from "../flow/actions"
import {useCurrentUser, usePrices, useBalances} from "../hooks"
import {sanitizeAmount} from "../utils"
import {Downarrow} from "../visual"
import {Balance}  from "../components/subcomponents"
import {Form, Label, Input, P, Bordered }  from "../components/styled"



const IN_TOKEN_NAME = TOKEN_NAMES

const LAST_EDITED_VALS = {
    IN: "IN",
    OUT: "OUT"
}


export default ({}) => {

    const [amountIn, setAmountIn]   = useState(0)
    const [amountOut, setAmountOut] = useState(0)
    const [lastEdited, setLastEdited] = useState(null)
    const [inTokenIdx, setInTokenIdx] = useState(0)
    const [maxSlippage, setMaxSlippage] = useState(0.1)
    const [swapUnderway, setSwapUnderway] = useState(false)

    const currentUser = useCurrentUser()
    const prices      = usePrices([amountIn]) //changing amountOut triggers change in amoutIn as well 
    const balances    = useBalances([amountIn, currentUser])

    const outTokenIdx = ()=>(inTokenIdx+1)%2

    const handleAmountInChange = async (amountIn) => {
        if (Number.isNaN(Number(amountIn))) return  // if emtpy 
        
        amountIn = sanitizeAmount(amountIn)

        setAmountIn(amountIn)
        let inTokenName = IN_TOKEN_NAME[inTokenIdx]
        setAmountOut(await getAmountOut({amountIn, inTokenName}))
        setLastEdited(LAST_EDITED_VALS.IN)
    }
    const handleAmountOutChange = async (amountOut) => {
        if (Number.isNaN(Number(amountOut))) return  // if emtpy 
        
        amountOut = sanitizeAmount(amountOut)
        setAmountOut(amountOut)
        let inTokenName = IN_TOKEN_NAME[inTokenIdx]
        setAmountIn(await getAmountIn({amountOut, inTokenName}))
        setLastEdited(LAST_EDITED_VALS.OUT)
    }

    const getInTokenName = () => TOKEN_NAMES[inTokenIdx]
    const getOutTokenName = () => TOKEN_NAMES[outTokenIdx()]
    const getInBalance  = () => balances[inTokenIdx]
    const getOutBalance = () => balances[outTokenIdx()]
    
    useEffect(()=>{
        switch (lastEdited) {
            case LAST_EDITED_VALS.OUT:
                handleAmountOutChange(amountIn)  
                break
            case LAST_EDITED_VALS.IN:
                handleAmountInChange(amountOut)
                break
        }
    },[inTokenIdx])

    const doSwap = async () => {
        //checking for too much slippage  //TODO: computeSlippage function, requires indexable prices 
        let slippage = 0.0000
        if ( slippage > maxSlippage) return alert("Too little liquidity, consider swapping less or adjusting slippage tolerance")
        //send swap transaction
        let inTokenName = getInTokenName() 
        let minAmountOut = String((amountIn*prices[1] * (1-maxSlippage)).toFixed(3))

        setSwapUnderway(true)
        console.log(swap({inTokenName, amountIn, minAmountOut}))
        setSwapUnderway(false)
    }

    const handleDirectionChange = (e) => {

        setInTokenIdx(outTokenIdx())

        switch (lastEdited) {
            case LAST_EDITED_VALS.IN:
                setLastEdited(LAST_EDITED_VALS.OUT)
                break
            case LAST_EDITED_VALS.OUT:
                setLastEdited(LAST_EDITED_VALS.IN)
                break
        }
    }

    return (
        <div>
            <P>Hello {currentUser && currentUser.addr}</P>
            {swapUnderway && <h1>AWAITING CONFIRMATION</h1>}
            <Form id="swapbox-form-bitroot" onSubmit={e=>{e.preventDefault(); doSwap()}} >
                <Label>{TOKEN_NAMES[inTokenIdx]} amount:
                <Input type="numeric"  
                        value={amountIn} onChange={e=>handleAmountInChange(e.target.value)}></Input>
                </Label>
                <Balance name={getInTokenName()} amount={getInBalance()} />
                <Downarrow onClick={handleDirectionChange} />
                <Label >{TOKEN_NAMES[outTokenIdx()]} amount:
                <Input type="numeric" value={amountOut} onChange={e=>handleAmountOutChange(e.target.value)}></Input>
                </Label>
                <Label><Input type="submit" value="Swap"/></Label>
                <Balance name={getOutTokenName()} amount={getOutBalance()} />

                <P style={{fontSize: "1.1em", fontFamily:"monospace", color: "teal"}}> Price: {prices[outTokenIdx()]}</P>
                {inTokenIdx === 0 ?
                <Bordered>
                    <P style={{fontSize: "0.9em", fontFamily:"monospace", color: "lightred"}}>Min Amount Out: {amountIn*prices[1] * (1-maxSlippage)}</P>
                    <P style={{fontSize: "0.9em", fontFamily:"monospace", color: "black"}}>Slippage: {((prices[1]*amountIn - amountOut)/(prices[1]*amountIn)).toFixed(3)}</P>
                    <P style={{fontSize: "0.9em", fontFamily:"monospace", color: "black"}}>Max Slippage: {maxSlippage}</P>
                </Bordered> :
                <Bordered>
                    <P style={{fontSize: "0.9em", fontFamily:"monospace", color: "lightred"}}>Min Amount Out: {amountIn*prices[0] * (1-maxSlippage)}</P>
                    <P style={{fontSize: "0.9em", fontFamily:"monospace", color: "black"}}>Slippage: {((prices[0]*amountIn - amountOut)/(prices[0]*amountIn)).toFixed(3)}</P>
                    <P style={{fontSize: "0.9em", fontFamily:"monospace", color: "black"}}>Max Slippage: {maxSlippage}</P>
                </Bordered>
                }
            </Form>

        </div>
    )
}