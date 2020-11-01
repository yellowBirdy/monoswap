import React, {useState} from 'react'

import {getLatestBlock} from "../../../flow/actions"


export default () => { 
    const [blockData, setBlockData] = useState('NA')

    const fetchLatestBlock = async () => setBlockData(await getLatestBlock())
    return (<div className="latestBlock">
        <button onClick={fetchLatestBlock}>Get letest block</button>
        <p>Latest Block Data: {blockData && JSON.stringify(blockData, null, 4 )}</p>
    </div>)
}