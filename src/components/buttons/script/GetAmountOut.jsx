import React, {useState} from "react"     

import {getAmountOut} from "../../../flow/actions"


export default () => {
    const [amountIn, setAmountIn]   = useState(0)
    const [amountOut, setAmountOut] = useState(0)

    return <div>
        <label>Amout in
        <input type="numeric" value={amountIn} onChange={e=>setAmountIn(e.target.value)}></input>
        </label>
        <button onClick={async ()=>setAmountOut(await getAmountOut({amountIn}))}>Get Amount Out</button>
        <p>Amount out: {amountOut}</p>
        
    </div>
}