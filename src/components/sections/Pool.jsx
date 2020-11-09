import React from 'react';

//import {DeployStandard, DeployNFT, Mint, MintCombination, SeedContract, Install} from "../buttons/transaction"
//import {ShowCollection, ShowItemData, ShowCombinationData, ShowCollectionDetailed} from  "../buttons/script"
//import {Install} from "../buttons/transaction"

import {GetAmountOut} from  "../buttons/script"

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