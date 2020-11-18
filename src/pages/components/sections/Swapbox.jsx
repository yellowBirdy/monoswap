import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
//import {Tab} from 'semantic-ui-react'
import * as fcl from '@onflow/fcl' //TODO: change current user to a custom effect

import {getAmountOut, getAmountIn, getAccBalances, getPrices, swap} from '../../../flow/actions'
import {sanitizeAmount} from '../../../utils'
import {Downarrow} from '../../../assets'

const TOKEN_NAMES = [
    "FauxFlow",
    "Bitroot"
]

const IN_TOKEN_NAME = TOKEN_NAMES
const OUT_TOKEN_NAME = [
    "Bitroot",
    "FauxFlow"
]
const LAST_EDITED_VALS = {
    IN: "IN",
    OUT: "OUT"
}
const Balance = styled.p`
    font-size: 0.9em;
    font-family: monospace sans-serif;
    color: ${props=>props.low ? "red" : "lightblue"}
`


export default ({}) => {

    const [amountIn, setAmountIn]   = useState(0)
    const [amountOut, setAmountOut] = useState(0)
    const [balances, setBalances] = useState([null, null])
    const [prices, setPrices] = useState([null, null])
    const [currentUser, setCurrentUser] = useState(null)
    const [lastEdited, setLastEdited] = useState(null)
    const [inTokenIdx, setInTokenIdx] = useState(0)
    const [maxSlippage, setMaxSlippage] = useState(0.1)
    //const [minAmountOut, setMinAmountOut] = useState(null)
    const [swapUnderway, setSwapUnderway] = useState(false)

    const outTokenIdx = ()=>(inTokenIdx+1)%2

    const handleAmountInChange = async (amountIn) => {
        if (Number.isNaN(Number(amountIn))) return  // if emtpy 
        
        amountIn = sanitizeAmount(amountIn)

        setAmountIn(amountIn)
        let inTokenName = IN_TOKEN_NAME[/*activeTabIndex*/inTokenIdx]
        setAmountOut(await getAmountOut({amountIn, inTokenName}))
        setLastEdited(LAST_EDITED_VALS.IN)
    }
    const handleAmountOutChange = async (amountOut) => {
        if (Number.isNaN(Number(amountOut))) return  // if emtpy 
        
        amountOut = sanitizeAmount(amountOut)
        setAmountOut(amountOut)
        let inTokenName = IN_TOKEN_NAME[/*activeTabIndex*/inTokenIdx]
        setAmountIn(await getAmountIn({amountOut, inTokenName}))
        setLastEdited(LAST_EDITED_VALS.OUT)
    }

    const getInTokenName = () => IN_TOKEN_NAME[/*activeTabIndex*/inTokenIdx]

   
    // fetch 
    useEffect(()=>{
        fcl.currentUser()
            .subscribe(user=>setCurrentUser({...user}))
        
        const updPrices = async ()=>{
            let prices = await getPrices()
            setPrices([prices[TOKEN_NAMES[0]], prices[TOKEN_NAMES[1]]])
        }
        updPrices()

    }, [amountIn])

    // fetch token balances
    useEffect( ()=>{
        if (!currentUser) return
        const updBalances = async () => {
            let balances = await getAccBalances({address: currentUser.addr})
            setBalances([balances[TOKEN_NAMES[0]], balances[TOKEN_NAMES[1]]])
        }
        updBalances()
    }, [currentUser, amountIn])



    
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
            <p>Hello {currentUser && currentUser.addr}</p>
            {swapUnderway && <h1>AWAITING CONFIRMATION</h1>}
            <form id="swapbox-form-bitroot" onSubmit={e=>{e.preventDefault(); doSwap()}} style={{margin: "auto", width:"50%"}} >
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>{TOKEN_NAMES[inTokenIdx]} amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                        value={amountIn} onChange={e=>handleAmountInChange(e.target.value)}></input>
                </label>
                <Balance>{TOKEN_NAMES[inTokenIdx]} Balance: {balances[inTokenIdx]}</Balance>
                <Downarrow onClick={handleDirectionChange} />
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>{TOKEN_NAMES[outTokenIdx()]} amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                    value={amountOut} onChange={e=>handleAmountOutChange(e.target.value)}></input>
                </label>
                <input type="submit" value="Swap" style={{display:"block", width: "90%", margin:"auto"}} />
                <Balance>{TOKEN_NAMES[outTokenIdx()]} Balance: {balances[outTokenIdx()]}</Balance>
                <p style={{fontSize: "1.1em", fontFamily:"monospace", color: "teal"}}> Price: {prices[outTokenIdx()]}</p>
            </form>
            {inTokenIdx === 0 ?
            <div>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "lightred"}}>Min Amount Out: {amountIn*prices[1] * (1-maxSlippage)}</p>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "black"}}>Slippage: {((prices[1]*amountIn - amountOut)/(prices[1]*amountIn)).toFixed(3)}</p>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "black"}}>Max Slippage: {maxSlippage}</p>
            </div> :
            <div>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "lightred"}}>Min Amount Out: {amountIn*prices[0] * (1-maxSlippage)}</p>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "black"}}>Slippage: {((prices[0]*amountIn - amountOut)/(prices[0]*amountIn)).toFixed(3)}</p>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "black"}}>Max Slippage: {maxSlippage}</p>
            </div>
            }

        </div>
    )
}