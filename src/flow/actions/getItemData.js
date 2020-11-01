import * as fcl from "@onflow/fcl"

import get_form_dataUrl from "../../cadence/scripts/get_form_data.cdc";
import execute_script_factory from "../../flow/execute_script_factory"



export default async ({formId}) => {
    const do_get_form_data = await execute_script_factory(get_form_dataUrl, {
        query: /id_placeholder/g,
        "id_placeholder": formId
    })

    let fd = await do_get_form_data()

    return await fcl.decode(fd)
}   