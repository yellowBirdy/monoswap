import React, {useState} from "react"

import {mint} from "../../../flow/admin_actions"
import {SelectAccount} from "../../subcomponents"


export default () => {
    const [selectedAccount, setSelectedAccount] = useState("")
    const [formId, setFormId] = useState(0)


    const mintSelected = async () => {
        mint({formId, targetAddress: selectedAccount});
    }
    //TODO: form selector should be dropdownish with form names as labels ..
    // .. form names and ids shold be read from chain by enchanced getCombinationData
    return (<div className="mintForm">
        <button onClick={mintSelected}>Mint</button>
        <SelectAccount onChange={e=>setSelectedAccount(e.target.value)} value={selectedAccount} />
        <label>formId (which kind of token)
            <input type="text" value={formId} onChange={e=>setFormId(Number(e.target.value))} ></input>
        </label>
    </div>)
}
