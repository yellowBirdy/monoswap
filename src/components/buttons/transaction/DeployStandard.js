import React from 'react'
import * as fcl from "@onflow/fcl"
import deployContract from "../../../flow/deploy_contract"
import standardContractUrl from "../../../cadence/contracts/NonFungibleToken_standard.cdc"

const deployNFTStandardContract = async () => {
    const deployTx = await deployContract(standardContractUrl);
  
    fcl.tx(deployTx).subscribe(txStatus => {
      if (fcl.tx.isExecuted(txStatus)) {
        console.log("NFT Standard Contract has been deployed");
      }
    });
  };


export default () => <button onClick={deployNFTStandardContract}>Deploy standard.</button>



