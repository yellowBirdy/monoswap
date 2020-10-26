import FungibleToken from 0xee82856bf20e2aa6
import FauxFlow from 0x179b6b1cb6755e31
import Bitroot from 0x01cf0e2f2f715450
import MonoswapFTPair from 0xf3fcd2c1a78f5eee

/* WITHDRAW LIQUIDITY
*/
transaction(lAmount: UFix64) {
    let xTokensReceiver: &{FungibleToken.Receiver}
    let yTokensReceiver: &{FungibleToken.Receiver} 
    let LPTokensProvider: &{FungibleToken.Provider}
    
    prepare(signer: AuthAccount) {

        self.LPTokensProvider = signer
        .borrow<&{FungibleToken.Provider}>(from: /storage/MonoswapFTPairVault)
        ?? panic("Unable to borrow xToken provider reference")

        self.xTokensReceiver = signer
        .getCapability(/public/FauxFlowReceiver)!
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Unable to borrow xToken receiver reference")

        self.yTokensReceiver = signer//getAccount(recipient)
        .getCapability(/public/BitrootReceiver)!
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Unable to borrow yToken receiver reference")
    }

    execute {
        let LPTokens <- self.LPTokensProvider.withdraw(amount: lAmount)

        MonoswapFTPair.withdrawLiquidity(lTokens: <-LPTokens, xReceiver: self.xTokensReceiver, yReceiver: self.yTokensReceiver)
    }
}