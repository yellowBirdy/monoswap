import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"


import get_balances from "../../cadence/scripts/get_account_balances.cdc"
import execute_script_factory from "../execute_script_factory"

export default async ({address}) => {
    const do_get_balances = await execute_script_factory(get_balances) 
    return await do_get_balances([
        fcl.arg(address, t.Address),
    ])
}