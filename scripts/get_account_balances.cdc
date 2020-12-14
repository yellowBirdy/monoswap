import FungibleToken from 0xee82856bf20e2aa6


pub fun main(userAddress: Address):  {String:UFix64} {
    let user = getAccount(userAddress)

    return {
        "FlowToken": user.getCapability(/public/FlowTokenBalance)!.borrow<&{FungibleToken.Balance}>()!.balance,
        "Bitroot": user.getCapability(/public/BitrootBalance)!.borrow<&{FungibleToken.Balance}>()!.balance,
        "Mono_LP": user.getCapability(/public/MonoswapFTPairBalance)!.borrow<&{FungibleToken.Balance}>()!.balance
    }
}
