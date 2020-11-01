import * as fcl from "@onflow/fcl"

export default async (address) => {
    const response = await fcl.send([
        fcl.getAccount(address)
    ])
    return (await fcl.decode(response))
}