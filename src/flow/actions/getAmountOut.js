import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

//import get_amount_out from "../../cadence/scripts/get_y_amount_out.cdc";
import get_amount_out from "../../cadence/scripts/get_amount_out.cdc";
import execute_script_factory from "../execute_script_factory"



export default async ({amountIn, inTokenName}) => {
    const do_get_y_amount_out = await execute_script_factory(get_amount_out)

    return await do_get_y_amount_out([
        fcl.arg(amountIn, t.UFix64),
        fcl.arg(inTokenName, t.String)
    ])
}   