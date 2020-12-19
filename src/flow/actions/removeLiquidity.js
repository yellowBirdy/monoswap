import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

import withdraw_liquidity from "../cadence/transactions/withdraw_liquidity.cdc"

import execute_transaction_factory from "../execute_transaction_factory"


export default async ({amount}) => {
    const do_withdraw_liquidity = await execute_transaction_factory(withdraw_liquidity)
    const args = [
        fcl.arg(amount, t.UFix64)
    ]
    let withdrawTx = await do_withdraw_liquidity(args)

}  