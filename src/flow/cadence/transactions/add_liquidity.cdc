import FungibleToken from 0xee82856bf20e2aa6
import FauxFlow from 0x179b6b1cb6755e31
import Bitroot from 0x01cf0e2f2f715450
import MonoswapFTPair from 0xf3fcd2c1a78f5eee

/* ADD LIQUIDITY
*/
transaction(xAmount: UFix64, yAmount: UFix64) {
    let tokenReceiver: &{FungibleToken.Receiver}
    let xTokensProvider: &{FungibleToken.Provider} 
    let yTokensProvider: &{FungibleToken.Provider}
    
    prepare(signer: AuthAccount) {

        self.xTokensProvider = signer
        .borrow<&{FungibleToken.Provider}>(from: /storage/FauxFlowVault)
        ?? panic("Unable to borrow xToken provider reference")

        self.yTokensProvider = signer
        .borrow<&{FungibleToken.Provider}>(from: /storage/BitrootVault)
        ?? panic("Unable to borrow yToken provider reference")

        self.tokenReceiver = signer//getAccount(recipient)
        .getCapability(/public/MonoswapFTPairReceiver)!
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let xTokens <- self.xTokensProvider.withdraw(amount: xAmount)
        let yTokens <- self.yTokensProvider.withdraw(amount: yAmount)

        MonoswapFTPair.addLiquidity(ltReceiver: self.tokenReceiver, xTokens: <-xTokens, yTokens: <-yTokens)


    }
}