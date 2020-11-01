import * as fcl from "@onflow/fcl"
import * as types from "@onflow/types"


import mintUrl from "../../cadence/admin_transactions/mint.cdc";
import execute_transaction_factory from "../execute_transaction_factory"

export default async ({formId = 0, targetAddress, cb}) => {
    const do_mint = await execute_transaction_factory(mintUrl)
    
    const mintTx = await do_mint([
        fcl.arg(formId, types.UInt32),
        fcl.arg(targetAddress, types.Address), 
    ])
    fcl.tx(mintTx).subscribe(txStatus => {
        if (fcl.tx.isExecuted(txStatus)) {
            console.log("SurvivalNFT has been minted for: "+targetAddress);
            if (typeof cb === "function") cb();
        }
    });
      
} 