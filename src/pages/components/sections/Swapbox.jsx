import React, {useState} from 'react'
import {Tab} from 'semantic-ui-react'
import getYAmountOut from '../../../flow/actions/getAmountOut'

const SWAP_FUNCTION_NAMES = [
    "XtoY",
    "YtoX"
]
const IN_TOKEN_NAME = [
    "Flow",
    "Bitroot"
]
const LAST_EDITED_VALS = {
    IN: "IN",
    OUT: "OUT"
}



const panes = ({amountIn, setAmountIn, amountOut, setAmountOut, setLastEdited})=>{ 
    
    const handleAmountInChange = async (e) => {
        var amountIn = e.target.value
        if (amountIn  === "") return  // if emtpy 
        // for time being reformatting to have at least one decimal as a work around UFix64 bug
        amountIn = amountIn.match(/\.\d/) ? amountIn :     //has at least one decimal
            amountIn.match(/\.$/) ? `${amountIn}0`   :     //ends with a dot (typically after deleting from the "end")
            `${amountIn}.0`                                //no dot
        
        setAmountIn(amountIn)
        setAmountOut(await getYAmountOut({amountIn}))
        setLastEdited(LAST_EDITED_VALS.IN)
    }
    
    return [
    {   
        menuItem: "Buy Bitroot",
        render: () =>            
            <form id="swapbox-form-bitroot" onSubmit={e=>{e.preventDefault(); alert(e.target)}} style={{margin: "auto", width:"50%"}} >
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Flow amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                        value={amountIn} onChange={handleAmountInChange}></input>
                </label>
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Bitroot amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                    value={amountOut} onChange={e=>setAmountOut(e.target.value)}></input>
                </label>
                <input type="submit" value="Swap" style={{display:"block", width: "90%", margin:"auto"}} />
            </form>,
    },{
        menuItem: "Buy Flow",
        render: () =>            
            <form id="swapbox-form-flow" onSubmit={e=>{e.preventDefault(); alert(e.target)}} style={{margin: "auto", width:"50%"}} >
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Bitroot amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                        value={amountIn} onChange={e=>setAmountIn(e.target.value)} ></input>
                </label>
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Flow amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                    value={amountOut} onChange={e=>setAmountOut(e.target.value)}></input>
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
    const handleTabChange = (e, {activeIndex}) => {
        console.log("activeTab "+activeIndex);
        setActiveTabIndex(activeIndex)
    }

    return (
        <Tab 
            panes={panes({amountIn, setAmountIn, amountOut, setAmountOut, setLastEdited})} 
            activeIndex={activeTabIndex}
            onTabChange={handleTabChange}
        />
    )
}