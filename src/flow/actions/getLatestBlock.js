import * as fcl from "@onflow/fcl"


export default async () => {
    const response = await fcl.send([
        fcl.getLatestBlock()
    ])
    return (await fcl.decode(response))
}