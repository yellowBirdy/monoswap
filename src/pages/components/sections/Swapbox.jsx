import React from 'react'
import {Tab} from 'semantic-ui-react'


const panes = [
    {   
        menuItem: "Buy Bitroot",
        render: () =>            
            <form id="swapbox-form-bitroot" onSubmit={e=>{e.preventDefault(); alert(e.target)}} style={{margin: "auto", width:"50%"}} >
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Flow amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}></input>
                </label>
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Bitroot amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}></input>
                </label>
                <input type="submit" value="Swap" style={{display:"block", width: "90%", margin:"auto"}} />
            </form>,
    },{
        menuItem: "Buy Flow",
        render: () =>            
            <form id="swapbox-form-flow" onSubmit={e=>{e.preventDefault(); alert(e.target)}} style={{margin: "auto", width:"50%"}} >
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Bitroot amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}></input>
                </label>
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Flow amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}></input>
                </label>
                <input type="submit" value="Swap" style={{display:"block", width: "90%", margin:"auto"}} />
            </form>,
    }
]
 
export default ({}) => {
    return (
        <Tab panes={panes} />
    )
}