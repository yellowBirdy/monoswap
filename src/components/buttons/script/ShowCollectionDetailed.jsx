import React, {useState} from "react"     

import {SelectAccount} from "../../subcomponents"
import {getCollectionDetailed} from "../../../flow/actions"


export default () => {
    const [NFT_data, setNFT_data] = useState({})
    const [targetAddress, setTargetAddress] = useState("")
    

    const getColDetailed = () => getCollectionDetailed({targetAddress})

    return <div>
        <button onClick={async ()=>setNFT_data(await getColDetailed())}>Show Collection</button>
        <SelectAccount onChange={e=>setTargetAddress(e.target.value)} value={targetAddress} />

            <p>User {targetAddress} tokens details: {Object.entries(NFT_data).map(JSON.stringify).join("\n")} </p>
    </div>
}

