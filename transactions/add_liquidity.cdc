import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79
import Bitroot from 0x01cf0e2f2f715450
import MonoswapFTPair from 0x179b6b1cb6755e31

/* ADD LIQUIDITY
*/
//transaction(xAmount: UFix64, yAmount: UFix64) {
transaction() {

    let tokenReceiver: &{FungibleToken.Receiver}
    let xTokensProvider: &{FungibleToken.Provider} 
    let yTokensProvider: &{FungibleToken.Provider}
    
    prepare(signer: AuthAccount) {

        self.xTokensProvider = signer
        .borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)
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
        let xAmount: UFix64 = UFix64(500)
        let yAmount: UFix64 = UFix64(1500000)

        let xTokens <- self.xTokensProvider.withdraw(amount: xAmount)
        let yTokens <- self.yTokensProvider.withdraw(amount: yAmount)

        MonoswapFTPair.addLiquidity(ltReceiver: self.tokenReceiver, xTokens: <-xTokens, yTokens: <-yTokens)


    }
}