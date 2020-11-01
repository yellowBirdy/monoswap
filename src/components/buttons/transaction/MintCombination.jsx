import React, {useState} from "react"

import {mintCombination} from "../../../flow/actions"


export default () => {
    const [combinationId, setCombinationId] = useState(0)
    const [ingredientIds, setIngredientIds] = useState('')


    const isNumber = v=>!Number.isNaN(v)
    const mintSelected = async () => {
        mintCombination({combinationId, ingredientIds: ingredientIds.split(",").map(Number).filter(isNumber)});
    }
    //TODO: form selector should be dropdownish with form names as labels ..
    // .. form names and ids shold be read from chain by enchanced getCombinationData
    return (<div className="mintForm">
        <button onClick={mintSelected}>Mint</button>
        <label>combinationId (which kind of token)
            <input type="text" value={combinationId} onChange={e=>setCombinationId(Number(e.target.value))} ></input>
        </label>
        <label>ingredientIds
            <input type="text" value={ingredientIds} onChange={e=>setIngredientIds(e.target.value)} ></input>
        </label>
        <p>Selected ingredeintIds: {ingredientIds}</p>
    </div>)
}
