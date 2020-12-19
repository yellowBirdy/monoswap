import React, {useState, useEffect} from "react"

import {Balance} from "../components/subcomponents"
import {TOKEN_NAMES, LP_TOKEN_NAME} from "../config"

import {sanitizeAmount} from "../utils"

import {useCurrentUser, usePrices, useBalances} from "../hooks"

import {removeLiquidity} from "../flow/actions"

import { P, Container, Form, Label, Input}  from "../components/styled"



export default () => {

    const [amount, setAmount] = useState(0)

    const currentUser = useCurrentUser()
    const prices = usePrices([amount]) //amount1 is bound to change with 
    const [ratio, setRatio] = useState(null)
    const balances = useBalances([amount])


    useEffect(()=>{
        prices[0] && setRatio(prices[1  ])
    },[amount])

    const doRemove = async () => {
        await removeLiquidity({amount})
    }
    const amount0Out = 13.51
    const amount1Out = 21.23
    return   (
        <Container trans section>
            <Container trans centered>
                <h2> Remove Liquidity</h2>
                <p>Hello {currentUser && currentUser.addr}</p>
            </Container>

            <Form id="withdraw_liquiditybox-form" onSubmit={e=>{e.preventDefault(); doRemove()}} >
            <Container chubby>
                <Label >{LP_TOKEN_NAME} amount:
                <Input type="numeric"  bordered
                        value={amount} onChange={e=>setAmount(sanitizeAmount(e.target.value))}></Input>
                </Label>
                <Balance name={LP_TOKEN_NAME} amount={Number(balances[LP_TOKEN_NAME])} />
                
                <Input type="submit" value="Remove Liquidity" bordered formElement />
                
                <P style={{fontWeight: "bold"}}>0 to 1 ratio: {ratio && ratio.toFixed(3)}</P>
            </Container>
            <Container secondary formElement>
                <P style={{fontSize: "0.9em", fontFamily:"monospace", color: "lightred"}}>{TOKEN_NAMES[0]}LP amount out: {/*lpAmountOut*/}</P>
                <P style={{fontSize: "0.9em", fontFamily:"monospace", color: "lightred"}}>{TOKEN_NAMES[1]}LP amount out: {/*lpAmountOut*/}</P>
            </Container>
            </Form>


        </Container>
    )
}