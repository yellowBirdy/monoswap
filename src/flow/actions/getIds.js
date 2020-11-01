import * as fcl from "@onflow/fcl"

import get_idslUrl from "../../cadence/scripts/get_ids.cdc";
import execute_script_factory from "../../flow/execute_script_factory"



export default async ({targetAddress}) => {

    const do_get_ids = await execute_script_factory(get_idslUrl, {
        query: /0xtargetAddress/g,
        "0xtargetAddress": targetAddress
    })
    
    return await fcl.decode(await do_get_ids())
}   