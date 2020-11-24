import React from 'react';


import {GetAmountOut} from  "../../components/buttons/script"

export default () => <div className="NFT">
    <h2>Pool</h2>

    <div className="transactions">
        <p>Transactions</p>
    </div>
    <div className="scripts">
        <p>Scripts</p>
        <GetAmountOut />
    </div>
</div>