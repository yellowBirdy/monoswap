import * as fcl from "@onflow/fcl"

import url from "../../cadence/scripts/get_combinations.cdc";
import execute_script_factory from "../../flow/execute_script_factory"



export default async () => {
    const do_get_comb_data = await execute_script_factory(url)

    let cd = await do_get_comb_data()

    return await fcl.decode(cd)
}   