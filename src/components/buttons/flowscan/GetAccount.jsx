import React, {useState} from 'react'

import {getAccData} from '../../../flow/actions'


export default () => { 
    const [address, setAddress] = useState('')
    const [accountData, setAccountData] = useState(null)


    const fetchAccData = async () => {
        setAccountData(await getAccData(address))
    }

    return (<div className="latestBlock">
        <button onClick={fetchAccData}>Get acc data</button>
        <input type="text" onChange={e=>setAddress(e.target.value)} value={address} />
        <p>Acc: {accountData && JSON.stringify(accountData, null, 4)}</p>
    </div>)
}