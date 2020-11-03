import React from 'react'



export default ({}) => {
    return (
        <div>
            <form id="swapbox-form" onSubmit={e=>{e.preventDefault(); alert(e.target)}} style={{margin: "auto", width:"50%"}} >
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Flow amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}></input>
                </label>
                <label style={{display:"block", width: "90%", margin:"auto", textAlign:"center"}}>Bitroot amount:
                <input type="numeric"  style={{display:"block", width:"100%"}}></input>
                </label>
                <input type="submit" value="Swap" style={{display:"block", width: "90%", margin:"auto"}} />
            </form>
        </div>
    )
}