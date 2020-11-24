import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

import xToY from "../cadence/transactions/swapXtoY.cdc"
import yToX from "../cadence/transactions/swapYtoX.cdc"

import execute_transaction_factory from "../execute_transaction_factory"


export default async ({inTokenName, amountIn, minAmountOut}) => {
    const do_xToY = await execute_transaction_factory(xToY)
    const do_yToX = await execute_transaction_factory(yToX)
    //TODO: crate args from amountIn, minAmountOut
    //TODO: refactor cadence code to single transaction code paramatrized with inTokenName
    const args = [
        fcl.arg(amountIn, t.UFix64),
        fcl.arg(minAmountOut, t.UFix64)
    ]
    let swapTx
    switch (inTokenName) {
        case "FauxFlow":
            swapTx = await do_xToY(args)
            break
        case "Bitroot":
            swapTx = await do_yToX(args)
            break
    }

    fcl.tx(swapTx).subscribe(txStatus => {
        if (fcl.tx.isExecuted(txStatus)) {
            console.log(`Swap of ${inTokenName} has been executed.`) //TODO: add amount out
        }
    })
}  