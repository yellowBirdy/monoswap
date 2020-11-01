import React from 'react';

import {DeployStandard, DeployNFT, Mint, MintCombination, SeedContract, Install} from "../buttons/transaction"
import {ShowCollection, ShowItemData, ShowCombinationData, ShowCollectionDetailed} from  "../buttons/script"

export default () => <div className="NFT">
    <div className="contracts">
        <p>Contracts</p>
        <DeployStandard />
        <DeployNFT />
        <SeedContract />
    </div>
    <div className="transactions">
        <p>Trans</p>
        <Install />
        <Mint />
        <MintCombination />
    </div>
    <div className="scripts">
        <p>Scripts</p>
        <ShowCollection />
        <ShowItemData />
        <ShowCombinationData />
        <ShowCollectionDetailed />

    </div>
</div>