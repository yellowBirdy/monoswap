import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

//import get_amount_in from "../cadence/scripts/get_x_amount_in.cdc";
import get_amount_in from "../cadence/scripts/get_amount_in.cdc";
import execute_script_factory from "../execute_script_factory"



export default async ({amountOut, inTokenName}) => {
    const do_get_x_amount_in = await execute_script_factory(get_amount_in)
    return await do_get_x_amount_in([
        fcl.arg(amountOut, t.UFix64),
        fcl.arg(inTokenName, t.String)
    ])
}   