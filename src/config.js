import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"
import * as types from "@onflow/types"

window.fcl = fcl
window.sdk = sdk
window.types = types

fcl.config()
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate")
  .put("accessNode", "http://localhost:8080")


export const NFTStandardAddress = "0x01cf0e2f2f715450"
export const NFTAddress         = "0x179b6b1cb6755e31"