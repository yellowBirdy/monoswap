import * as fcl from "@onflow/fcl"
import * as types from "@onflow/types"

import {NFTAddress} from "../../config"

import mintUrl from "../../cadence/transactions/mint_combination.cdc";
import execute_transaction_factory from "../execute_transaction_factory"

export default async ({combinationId = 0, ingredientIds, adminAddress = NFTAddress, cb}) => {
    if (!ingredientIds) return console.log("Can't mint combination without ingredients.")
    console.log(ingredientIds)
    const do_mint = await execute_transaction_factory(mintUrl)
    
    const mintTx = await do_mint([
        fcl.arg(combinationId, types.UInt32),
        fcl.arg(ingredientIds, types.Array(types.UInt64)),
        fcl.arg(adminAddress, types.Address)
    ])
    fcl.tx(mintTx).subscribe(txStatus => {
        if (fcl.tx.isExecuted(txStatus)) {
            if (typeof cb === "function") cb()
          console.log("SurvivalNFT Combination has been minted");
        }
    });
      
} 