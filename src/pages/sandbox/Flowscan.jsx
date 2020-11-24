import React from "react"

import {LatestBlock, GetAccount} from "../../components/buttons/flowscan"

export default () => <div className="flowscan">
    <p>Flowscan</p>
    <div className="portto">
        <LatestBlock />
        <GetAccount />
    </div>
</div>