import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

import add_liquidity from "../../cadence/transactions/add_liquidity.cdc"

import execute_transaction_factory from "../execute_transaction_factory"


export default async ({amount0, amount1}) => {
    const do_add_liquidity = await execute_transaction_factory(add_liquidity)
    const args = [
        fcl.arg(amount0, t.UFix64),
        fcl.arg(amount1, t.UFix64)
    ]
    let addTx = await do_add_liquidity(args)
 

    fcl.tx(addTx).subscribe(txStatus => {
        if (fcl.tx.isExecuted(txStatus)) {
            console.log(`Adding liquidity  has been executed.`) 
        }
    })
}  