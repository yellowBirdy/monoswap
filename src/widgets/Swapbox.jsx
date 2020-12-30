import React, {useState, useEffect} from "react"

import {TOKEN_NAMES} from "../config"
import {getAmountOut, getAmountIn, swap} from "../flow/actions"
import {useCurrentUser, usePrices, useBalances} from "../hooks"
import {sanitizeAmount} from "../utils"
import {Downarrow} from "../visual"
import {Balance, Quantinfo, NumericInput}  from "../components/subcomponents"
import {Form, Label, Input, P, Container }  from "../components/styled"



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
    const [maxSlippage, setMaxSlippage] = useState(0.3)

    const currentUser = useCurrentUser()
    const prices      = usePrices([amountIn]) //changing amountOut triggers change in amoutIn as well 
    const balances    = useBalances([amountIn, currentUser])

    const outTokenIdx = ()=>(inTokenIdx+1)%2

    const handleAmountInChange = async (amountIn) => {
//TODO: move the line below (at least) to a Numerical INput component
        //if (amountIn !== "." && Number.isNaN(Number(amountIn))) return  // if emtpy 
        
        const sanitizedAmountIn = sanitizeAmount(amountIn)

        setAmountIn(amountIn)
        let inTokenName = IN_TOKEN_NAME[inTokenIdx]
        //setAmountOut(await getAmountOut({amountIn, inTokenName}))
        setAmountOut(await getAmountOut({amountIn:sanitizedAmountIn, inTokenName}))
        setLastEdited(LAST_EDITED_VALS.IN)
    }
    const handleAmountOutChange = async (amountOut) => {
        if (amountOut !== "." && Number.isNaN(Number(amountOut))) return  // if emtpy 
        
        const sanitizedAmountOut = sanitizeAmount(amountOut)
        
        setAmountOut(amountOut)
        let inTokenName = IN_TOKEN_NAME[inTokenIdx]
        setAmountIn(await getAmountIn({amountOut: sanitizedAmountOut, inTokenName}))
        setLastEdited(LAST_EDITED_VALS.OUT)
    }

    const getInTokenName = () => TOKEN_NAMES[inTokenIdx]
    const getOutTokenName = () => TOKEN_NAMES[outTokenIdx()]
    const getInBalance  = () => Number(balances[inTokenIdx])
    const getOutBalance = () => Number(balances[outTokenIdx()])
    
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
        let minAmountOut = String((amountIn*prices[inTokenIdx] * (1-maxSlippage)).toFixed(3))
        swap({inTokenName, amountIn, minAmountOut})
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
        <Container trans section>
            <Container trans centered>
                <h2> Swap</h2>
                <P>Hello {currentUser && currentUser.addr}</P>
            </Container>
            <Form id="swapbox-form-bitroot" onSubmit={e=>{e.preventDefault(); doSwap()}} >
                <Container chubby>
                    <Label>{TOKEN_NAMES[inTokenIdx]} amount:    
                        <NumericInput value={amountIn} handleChange={handleAmountInChange} />
                    </Label>
                    <Balance name={getInTokenName()} amount={getInBalance()} />
                    <Downarrow onClick={handleDirectionChange} />
                    <Label >{TOKEN_NAMES[outTokenIdx()]} amount:
                    <Input type="text" inputMode="decimal" bordered
                            value={amountOut} onChange={e=>handleAmountOutChange(e.target.value)}></Input>
                    </Label>
                    <Label><Input type="submit" bordered value="Swap"/></Label>
                    <Balance name={getOutTokenName()} amount={getOutBalance()} />

                    <Quantinfo label="Price" amount={Number(prices[outTokenIdx()])} />
                </Container>
                {inTokenIdx === 0 ?
                <Container formElement secondary>
                    <P style={{fontSize: "0.9em", fontFamily:"monospace"}}>Min Amount Out: {amountIn*prices[0] * (1-maxSlippage)}</P>
                    <P style={{fontSize: "0.9em", fontFamily:"monospace"}}>Price Impact: {((prices[0]*amountIn - amountOut)/(prices[0]*amountIn)).toFixed(3)}</P>
                    <P style={{fontSize: "0.9em", fontFamily:"monospace"}}>Max Slippage: {maxSlippage}</P>
                </Container> :
                <Container bordered>
                    <P style={{fontSize: "0.9em", fontFamily:"monospace"}}>Min Amount Out: {amountIn*prices[1] * (1-maxSlippage)}</P>
                    <P style={{fontSize: "0.9em", fontFamily:"monospace"}}>Price Impact: {((prices[1]*amountIn - amountOut)/(prices[1]*amountIn)).toFixed(3)}</P>
                    <P style={{fontSize: "0.9em", fontFamily:"monospace"}}>Max Slippage: {maxSlippage}</P>
                </Container>
                }
            </Form>

        </Container>
    )
}