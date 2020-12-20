//import FungibleToken from 0xee82856bf20e2aa6
import FungibleToken from 0x9a0766d93b6608b7


pub fun main(/*userAddress: Address*/):  {String:UFix64} {
    //let userAddress:Address = 0x56b4abe67bcb092d  // MONOSWAP
    let userAddress:Address = 0x8a9d9baa5a743c95    // BLOCTO 1
    let user = getAccount(userAddress)

    return {
        "FlowToken": user.getCapability(/public/flowTokenBalance)!.borrow<&{FungibleToken.Balance}>()!.balance,
        "Bitroot": user.getCapability(/public/BitrootBalance)!.borrow<&{FungibleToken.Balance}>()!.balance,
        "Mono_LP": user.getCapability(/public/MonoswapFTPairBalance)!.borrow<&{FungibleToken.Balance}>()!.balance
    }
}
