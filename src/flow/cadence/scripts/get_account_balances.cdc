import FungibleToken from 0xFUNGIBLETOKEN_ADDRESS


pub fun main(userAddress: Address):  {String:UFix64} {
    let user = getAccount(userAddress)

    return {
        "FlowToken": user.getCapability(/public/flowTokenBalance)!.borrow<&{FungibleToken.Balance}>()!.balance,
        "Bitroot": user.getCapability(/public/BitrootBalance)!.borrow<&{FungibleToken.Balance}>()!.balance,
        "Mono_LP": user.getCapability(/public/MonoswapFTPairBalance)!.borrow<&{FungibleToken.Balance}>()!.balance
    }
}
