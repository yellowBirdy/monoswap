import * as fcl from "@onflow/fcl"


export default async () => await fcl.send([fcl.getLatestBlock()]).then(fcl.decode)
