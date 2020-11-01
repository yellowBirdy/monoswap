import React, {useState} from "react"     

import {getCombinationData} from "../../../flow/actions"


export default () => {
    const [combData, setCombData] = useState('NA')

    return <div>
        <button onClick={async () => setCombData(await getCombinationData())}>Show Comb Data</button>

        <p>Threre are {JSON.stringify(combData, null, 4)} combination(s) defined.</p>
    </div>
}