import { findByPlaceholderText } from '@testing-library/react'
import React, {useState, useEffect} from 'react'
import {Tab} from 'semantic-ui-react'
import * as fcl from '@onflow/fcl' //TODO: change current user to a custom effect
//TODO import swap and get balances 
import {getAmountOut, getAmountIn, getAccBalances, getPrices} from '../../../flow/actions'
import {sanitizeAmount} from '../../../utils'

const TOKEN_NAMES = [
    "FauxFlow",
    "Bitroot"
]

const IN_TOKEN_NAME = [
    "FauxFlow",
    "Bitroot"
]
const OUT_TOKEN_NAME = [
    "Bitroot",
    "FauxFlow"
]
const LAST_EDITED_VALS = {
    IN: "IN",
    OUT: "OUT"
}



const panes = ({amountIn, handleAmountInChange, amountOut, handleAmountOutChange, balanceIn, balanceOut,price0, price1, swap})=>{ 

    return [
    {   
        menuItem: `Buy ${OUT_TOKEN_NAME[1]}`,
        render: () =>            
            <form id="swapbox-form-bitroot" onSubmit={e=>{e.preventDefault(); swap()}} style={{margin: "auto", width:"50%"}} >
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Flow amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                        value={amountIn} onChange={e=>handleAmountInChange(e.target.value)}></input>
                </label>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "lightblue"}}>{OUT_TOKEN_NAME[1]} Balance: {balanceIn}</p>
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Bitroot amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                    value={amountOut} onChange={e=>handleAmountOutChange(e.target.value)}></input>
                </label>
                <input type="submit" value="Swap" style={{display:"block", width: "90%", margin:"auto"}} />
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "lightblue"}}>{OUT_TOKEN_NAME[0]} Balance: {balanceOut}</p>
                <p style={{fontSize: "1.1em", fontFamily:"monospace", color: "teal"}}> Price: {price1}</p>
            </form>
    },{
        menuItem: `Buy ${OUT_TOKEN_NAME[0]}`,
        render: () =>            
            <form id="swapbox-form-flow" onSubmit={e=>{e.preventDefault(); swap()}} style={{margin: "auto", width:"50%"}} >
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Bitroot amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                        value={amountIn} onChange={e=>handleAmountInChange(e.target.value)} ></input>
                </label>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "lightblue"}}>{OUT_TOKEN_NAME[0]} Balance: {balanceIn}</p>

                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Flow amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                    value={amountOut} onChange={e=>handleAmountOutChange(e.target.value)}></input>
                </label>
                <input type="submit" value="Swap" style={{display:"block", width: "90%", margin:"auto"}} />
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "lightblue"}}>{OUT_TOKEN_NAME[1]} Balance: {balanceOut}</p>
                <p style={{fontSize: "1.1em", fontFamily:"monospace", color: "teal"}}> Price: {price0}</p>
            </form>
    }
]}
 
export default ({}) => {

    const [amountIn, setAmountIn]   = useState(0)
    const [amountOut, setAmountOut] = useState(0)
    const [balanceIn, setBalanceIn]   = useState(null)
    const [balanceOut, setBalanceOut] = useState(null)
    const [price0, setPrice0] = useState(null)
    const [price1, setPrice1] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [lastEdited, setLastEdited] = useState(null)
    const [activeTabIndex, setActiveTabIndex] = useState(0)
    const [maxSlippage, setMaxSlippage] = useState(0.1)
    const [minAmountOut, setMinAmountOut] = useState(null)

    const handleAmountInChange = async (amountIn) => {
        if (Number.isNaN(Number(amountIn))) return  // if emtpy 
        
        amountIn = sanitizeAmount(amountIn)

        setAmountIn(amountIn)
        let inTokenName = IN_TOKEN_NAME[activeTabIndex]
        setAmountOut(await getAmountOut({amountIn, inTokenName}))
        setLastEdited(LAST_EDITED_VALS.IN)
    }
    const handleAmountOutChange = async (amountOut) => {
        if (Number.isNaN(Number(amountOut))) return  // if emtpy 
        
        amountOut = sanitizeAmount(amountOut)
        setAmountOut(amountOut)
        let inTokenName = IN_TOKEN_NAME[activeTabIndex]
        setAmountIn(await getAmountIn({amountOut, inTokenName}))
        setLastEdited(LAST_EDITED_VALS.OUT)
    }

    const handleTabChange = (e, {activeIndex}) => {
        setActiveTabIndex(activeIndex)
        
        // switching trade direction: users last input moves to the other side of trade
        // and getAmout for the side without user input needs to be performed
        switch (lastEdited) {
            case LAST_EDITED_VALS.IN:
                setLastEdited(LAST_EDITED_VALS.OUT)
                break
            case LAST_EDITED_VALS.OUT:
                setLastEdited(LAST_EDITED_VALS.IN)
                break
        }
    }

    useEffect(()=>{
        fcl.currentUser()
            .subscribe(user=>setCurrentUser({...user}))
        
        const updPrices = async ()=>{
            let prices = await getPrices()
            setPrice0(prices[TOKEN_NAMES[0]])
            setPrice1(prices[TOKEN_NAMES[1]])
        }
        updPrices()

    }, [])
    useEffect( ()=>{
        if (!currentUser) return
        const updBalances = async () => {
            let balances = await getAccBalances({address: currentUser.addr})
            //TODO: switch balances to be keyd by "0/1" or Names instead of "In Out"
            setBalanceIn(balances.FauxFlow)
            setBalanceOut(balances.Bitroot)
        }
        updBalances()
    }, [currentUser])



    
    useEffect(()=>{
        switch (lastEdited) {
            case LAST_EDITED_VALS.OUT:
                handleAmountOutChange(amountIn)  
                break
            case LAST_EDITED_VALS.IN:
                handleAmountInChange(amountOut)
                break
        }
    },[activeTabIndex])

    const swap = () => {
        alert('swapin!')
        //send swap transaction
        //fcl.send etc
        //needs amount in , tokenInName (or both), min amount Out
        //1. Prepare the transaction action
    }
    return (
        <div>
            <p>Hello {currentUser && currentUser.addr}</p>
            <Tab 
                panes={panes({amountIn, handleAmountInChange, amountOut, handleAmountOutChange, balanceIn, balanceOut,
                    price0, price1, swap})} 
                activeIndex={activeTabIndex}
                onTabChange={handleTabChange}
            />
            {activeTabIndex === 0 ?
            <div>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "lightred"}}>Min Amount Out: {amountIn*price1 * (1-maxSlippage)}</p>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "black"}}>Slippage: {((price1*amountIn - amountOut)/(price1*amountIn)).toFixed(3)}</p>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "black"}}>Max Slippage: {maxSlippage}</p>
            </div> :
            <div>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "lightred"}}>Min Amount Out: {amountIn*price0 * (1-maxSlippage)}</p>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "black"}}>Slippage: {((price0*amountIn - amountOut)/(price0*amountIn)).toFixed(3)}</p>
                <p style={{fontSize: "0.9em", fontFamily:"monospace", color: "black"}}>Max Slippage: {maxSlippage}</p>
            </div>
            }

        </div>
    )
}