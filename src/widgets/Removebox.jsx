import React, {useState, useEffect} from "react"

import {Balance} from "../components/subcomponents"
import {TOKEN_NAMES, LP_TOKEN_NAME} from "../config"

import {sanitizeAmount} from "../utils"

import {useCurrentUser, usePrices, useBalances} from "../hooks"

import {removeLiquidity} from "../flow/actions"

import {Form}  from "../components/styled"



export default () => {

    const [actionUnderway, setActionUnderway] = useState(false)
    const [amount, setAmount] = useState(0)

    const currentUser = useCurrentUser()
    const prices = usePrices([amount]) //amount1 is bound to change with 
    const [ratio, setRatio] = useState(null)
    const balances = useBalances([amount])


    useEffect(()=>{
        prices[0] && setRatio(prices[0])
    },[amount])

    const doRemove = async () => {
        setActionUnderway(true)
        await removeLiquidity({amount})
        setTimeout(()=>setActionUnderway(false), 1000)
    }
    const amount0Out = 13.51
    const amount1Out = 21.23
    return   (
        <div>
            <h2> Remove Liquidity</h2>
            <p>Hello {currentUser && currentUser.addr}</p>
            <Balance name={`${TOKEN_NAMES[0]}-${TOKEN_NAMES[1]}_LP`} amount={balances[LP_TOKEN_NAME]} />

            {actionUnderway && <h3>AWAITING CONFIRMATION</h3>}
            <Form id="withdraw_liquiditybox-form" onSubmit={e=>{e.preventDefault(); doRemove()}} >
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>{LP_TOKEN_NAME} amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                        value={amount} onChange={e=>setAmount(sanitizeAmount(e.target.value))}></input>
                </label>
                <Balance name={LP_TOKEN_NAME} amount={balances[LP_TOKEN_NAME]} />
                
                <input type="submit" value="Remove Liquidity" style={{display:"block", width: "90%", margin:"auto"}} />

                <p style={{fontWeight: "bold"}}>0 to 1 ratio: {ratio && ratio.toFixed(3)}</p>
                <div>
                    <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "lightred"}}>LP amount out: {/*lpAmountOut*/}</p>
                </div>
            </Form>


        </div>
    )
}