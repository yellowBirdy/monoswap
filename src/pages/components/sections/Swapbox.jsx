import React, {useState} from 'react'
import {Tab} from 'semantic-ui-react'

const SWAP_FUNCTION_NAMES = [
    "XtoY",
    "YtoX"
]
const IN_TOKEN_NAME = [
    "Flow",
    "Bitroot"
]
const panes = ({amountIn, setAmountIn, amountOut, setAmountOut})=>{ return [
    {   
        menuItem: "Buy Bitroot",
        render: () =>            
            <form id="swapbox-form-bitroot" onSubmit={e=>{e.preventDefault(); alert(e.target)}} style={{margin: "auto", width:"50%"}} >
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Flow amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}
                        value={amountIn} onChange={e=>setAmountIn(e.target.value)}></input>
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
    const [lastEdited, setLastEdited] = useState(0)
    const [activeTabIndex, setActiveTabIndex] = useState(0)
    const handleTabChange = (e, {activeIndex}) => {
        console.log("activeTab "+activeIndex);
        setActiveTabIndex(activeIndex)
    }

    return (
        <Tab 
            panes={panes({amountIn, setAmountIn, amountOut, setAmountOut})} 
            activeIndex={activeTabIndex}
            onTabChange={handleTabChange}
        />
    )
}