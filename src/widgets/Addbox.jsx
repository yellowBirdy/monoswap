import React, {useState, useEffect} from "react"

import {Balance} from "../components/subcomponents"
import {TOKEN_NAMES, LP_TOKEN_NAME} from "../config"

import {sanitizeAmount} from "../utils"

import {useCurrentUser, usePrices, useBalances} from "../hooks"

import {addLiquidity} from "../flow/actions"
import {Form, P, Container, Input, Label}  from "../components/styled"



export default () => {

    const [amount0, setAmount0] = useState(0)
    const [amount1, setAmount1] = useState(0)

    const currentUser = useCurrentUser()
    const prices = usePrices([amount0]) //amount1 is bound to change with 
    const [ratio, setRatio] = useState(null)
    const balances = useBalances([amount0])


    useEffect(()=>{
        prices[0] && setRatio(prices[1])
    },[amount0, amount1])

    const handleAmount0Change = async (amount0) => {
        if (Number.isNaN(Number(amount0))) return  // if emtpy 
        
        amount0 = sanitizeAmount(amount0)
    
        setAmount0(amount0)
        setAmount1(sanitizeAmount(String((amount0 * prices[0]).toFixed(4))))  //cast to string so both are string, as UFix64 deprecates numerical input
    }
    const handleAmount1Change = async (amount1) => {
        if (Number.isNaN(Number(amount1))) return  // if emtpy 
        
        amount1 = sanitizeAmount(amount1)
        setAmount1(amount1)
        setAmount0(sanitizeAmount(String((amount1 * prices[1]).toFixed(4))))  //cast to string so both are string, as UFix64 deprecates numerical input
    }

    const doAdd = async () => {
        await addLiquidity({amount0, amount1})
    }
    const lpAmountOut = 13.51
    return   (
        <Container trans section>
            <Container trans centered>
                <h2> Add Liquidity</h2>
                <p>Hello {currentUser && currentUser.addr}</p>
            </Container>

            <Form id="liquiditybox-form-bitroot" onSubmit={e=>{e.preventDefault(); doAdd()}} >
                <Container chubby>
                    <Label >{TOKEN_NAMES[0]} amount:
                    <Input type="numeric"  bordered
                            value={amount0} onChange={e=>handleAmount0Change(e.target.value)}></Input>
                    </Label>
                    <Balance name={TOKEN_NAMES[0]} amount={Number(balances[0])} />
                    <p style={{display:"inline-block", width:"100%", textAlign:"center"}}>AND</p>
                    <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>{TOKEN_NAMES[1]} amount:
                    <Input type="numeric" bordered 
                        value={amount1} onChange={e=>handleAmount1Change(e.target.value)}></Input>
                    </label>
                   <Balance name={TOKEN_NAMES[1]} amount={Number(balances[1])} />

                   <Label><Input type="submit" value="Add Liquidity" bordered /></Label>
                </Container>
                <Container secondary formElement>
                    <P style={{fontWeight: "bold"}}>0 to 1 ratio: {ratio && ratio.toFixed(3)}</P>
                    <P style={{fontSize: "0.9em", fontFamily:"monospace"}}> amount out: {lpAmountOut}</P>
                    <Balance name={LP_TOKEN_NAME} amount={Number(balances[LP_TOKEN_NAME])} />
                </Container> 
            </Form>


        </Container>
    )
}