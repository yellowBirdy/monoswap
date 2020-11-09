import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

import get_amount_out from "../../cadence/scripts/get_y_amount_out.cdc";
import execute_script_factory from "../execute_script_factory"



export default async ({amountIn}) => {
    const do_get_ids = await execute_script_factory(get_amount_out)

    return await do_get_ids([fcl.arg(amountIn, t.UFix64)])
}   