import * as fcl from "@onflow/fcl"

import installUrl from "../cadence/transactions/install_all.cdc";
import execute_transaction_factory from "../execute_transaction_factory"


export default async () => {
    const do_install = await execute_transaction_factory(installUrl)
    
    const installTx = await do_install()

    fcl.tx(installTx).subscribe(txStatus => {
        if (fcl.tx.isExecuted(txStatus)) {
            console.log(`Monoswap Demo dependencies hav been installed for current account.`)
        }
    })
}  