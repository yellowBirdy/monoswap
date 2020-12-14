import FungibleToken from 0xFUNGIBLETOKEN_ADDRESS
import FlowToken from 0xFLOWTOKEN_ADDRESS
import Bitroot from 0xBITROOT_ADDRESS
import MonoswapFTPair from 0xMONOSWAP_ADDRESS

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
        .getCapability(/public/flowTokenReceiver)!
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