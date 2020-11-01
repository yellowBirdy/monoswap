import React, {useState} from "react"     

import {SelectAccount} from "../../subcomponents"
import {getIds} from "../../../flow/actions"


export default () => {
    const [NFT_ids, setNFT_ids] = useState([])
    const [targetAddress, setTargetAddress] = useState("")
    

    const getAccIds = () => getIds({targetAddress})

    return <div>
        <button onClick={async ()=>setNFT_ids(await getAccIds())}>Show Collection</button>
        <SelectAccount onChange={e=>setTargetAddress(e.target.value)} value={targetAddress} />

            <p>User {targetAddress} posses following tokens: {NFT_ids.join(", ")} </p>
    </div>
}