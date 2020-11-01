import * as fcl from "@onflow/fcl"
import * as types from "@onflow/types"

import formUrl from "../../cadence/admin_transactions/seedContract.cdc";
import execute_transaction_factory from "../execute_transaction_factory"

export default async ({fields}) => {
    const NFTAddress = "0x179b6b1cb6755e31"
    const do_seed_contract = await execute_transaction_factory(formUrl, {
        query: /(0xNFTAddress)/g,
        "0xNFTAddress": NFTAddress
    })
    const seed_contractTx = await do_seed_contract();
    fcl.tx(seed_contractTx).subscribe(txStatus => {
        if (fcl.tx.isExecuted(txStatus)) {
          console.log("SurvivalNFT form has been created, name: ");
        }
    });
      
} 