import * as fcl from "@onflow/fcl"


fcl.config()
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate")
  .put("accessNode", "http://localhost:8080")


export const TOKEN_NAMES = [
    "Bitroot",
    "FauxFlow"
]

export const LP_TOKEN_NAME = "Mono_LP"

