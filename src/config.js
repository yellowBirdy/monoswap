import * as fcl from "@onflow/fcl"

const LOCAL_ACCESS_API_HOST = "http://localhost:8080"
const LOCAL_WALLET_HOST = "http://localhost:8701/flow/authenticate"
const TESTNET_ACCESS_API_HOST = "https://access-testnet.onflow.org"
const TESTNET_BLOCKTO_WALLET_HOST = "https://flow-wallet-testnet.blocto.app/authn"
const MAINNET_ACCESS_API_HOST = ""
const MAINNET_WALLET_HOST = ""

let addresses,
  accessAPIHost,
  walletProviderHost


export const TOKEN_NAMES = [
    "Bitroot",
    "FlowToken"
]

switch (process.env.REACT_APP_CHAIN) {
  case "mainnet":
    addresses = {
      Bitroot: '0xMAINNET_BITROOT', 
      FlowToken: '0x1654653399040a61',
      Monoswap: '0xMAINNET_MONOSWAP',
      FungibleToken: '0xf233dcee88fe0abe'
    };
    accessAPIHost = MAINNET_ACCESS_API_HOST;
    walletProviderHost = MAINNET_WALLET_HOST;
    break;
  case "testnet":
    addresses = {
      Bitroot: '0x40e0ced5e2cf034c', 
      FlowToken: '0x7e60df042a9c0868',
      Monoswap: '0x56b4abe67bcb092d',
      FungibleToken: '0x9a0766d93b6608b7'
    };
    accessAPIHost = TESTNET_ACCESS_API_HOST;
    walletProviderHost = TESTNET_BLOCKTO_WALLET_HOST;
    break;
  case "emulator":
  default:
    addresses = {
      Bitroot: '0x01cf0e2f2f715450',
      FlowToken: '0x0ae53cb6e3f42a79',
      Monoswap: '0x179b6b1cb6755e31',
      FungibleToken: '0xee82856bf20e2aa6'
    };
    accessAPIHost = LOCAL_ACCESS_API_HOST;
    walletProviderHost = LOCAL_WALLET_HOST;
    break;
}
export const ADDRESSES = addresses

export const TOKEN_ADDRESES = [addresses['Bitroot'], addresses['FlowToken']]

export const LP_TOKEN_NAME = "Mono_LP"
export const LP_TOKEN_ADDRESS = addresses['Monoswap']


fcl.config()
  .put("challenge.handshake", walletProviderHost)
  .put("accessNode.api", accessAPIHost)




