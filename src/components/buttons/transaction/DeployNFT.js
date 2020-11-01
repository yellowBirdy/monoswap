import React from 'react'
import * as fcl from "@onflow/fcl"
import deployContract from "../../../flow/deploy_contract"
import standardContractUrl from "../../../cadence/contracts/SurvivalNFT.cdc"

const NFTStandardAddress = "0x01cf0e2f2f715450"

const deployNFTContract = async () => {
    const deployTx = await deployContract(standardContractUrl, {
        query: "0xNFTStandardAddress", 
        "0xNFTStandardAddress": NFTStandardAddress
    });
  
    fcl.tx(deployTx).subscribe(txStatus => {
      if (fcl.tx.isExecuted(txStatus)) {
        console.log("NFT Contract has been deployed");
      }
    });
  };


export default () => <button onClick={deployNFTContract}>Deploy NFT</button>



