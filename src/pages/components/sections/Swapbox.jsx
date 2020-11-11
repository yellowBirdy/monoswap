import React, {useState} from 'react'
import {Tab} from 'semantic-ui-react'
import {getAmountOut, getAmountIn} from '../../../flow/actions'
import {sanitizeAmount} from '../../../utils'

const SWAP_FUNCTION_NAMES = [
    "XtoY",
    "YtoX"
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



//const panes = ({amountIn, setAmountIn, amountOut, setAmountOut, setLastEdited, activeTabIndex})=>{ 
const panes = ({amountIn, handleAmountInChange, amountOut, handleAmountOutChange})=>{ 

    return [
    {   
        menuItem: `Buy ${OUT_TOKEN_NAME[0]}`,
        render: () =>            
            <form id="swapbox-form-bitroot" onSubmit={e=>{e.preventDefault(); alert(e.target)}} style={{margin: "auto", width:"50%"}} >
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Flow amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                        value={amountIn} onChange={e=>handleAmountInChange(e.target.value)}></input>
                </label>
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Bitroot amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                    value={amountOut} onChange={e=>handleAmountOutChange(e.target.value)}></input>
                </label>
                <input type="submit" value="Swap" style={{display:"block", width: "90%", margin:"auto"}} />
            </form>,
    },{
        menuItem: `Buy ${OUT_TOKEN_NAME[1]}`,
        render: () =>            
            <form id="swapbox-form-flow" onSubmit={e=>{e.preventDefault(); alert(e.target)}} style={{margin: "auto", width:"50%"}} >
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Bitroot amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                        value={amountIn} onChange={e=>handleAmountInChange(e.target.value)} ></input>
                </label>
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Flow amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                    value={amountOut} onChange={e=>handleAmountOutChange(e.target.value)}></input>
                </label>
                <input type="submit" value="Swap" style={{display:"block", width: "90%", margin:"auto"}} />
            </form>,
    }
]}
 
export default ({}) => {

    const [amountIn, setAmountIn]   = useState(0)
    const [amountOut, setAmountOut] = useState(0)
    const [lastEdited, setLastEdited] = useState(null)
    const [activeTabIndex, setActiveTabIndex] = useState(0)

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
                handleAmountOutChange(amountIn)  
                break
            case LAST_EDITED_VALS.OUT:
                setLastEdited(LAST_EDITED_VALS.IN)
                handleAmountInChange(amountOut)
                break
        }
    }
    return (
        <Tab 
            panes={panes({amountIn, handleAmountInChange, amountOut, handleAmountOutChange})} 
            activeIndex={activeTabIndex}
            onTabChange={handleTabChange}
        />
    )
}