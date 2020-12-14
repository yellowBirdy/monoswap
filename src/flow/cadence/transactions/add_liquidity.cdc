import FungibleToken from 0xFUNGIBLETOKEN_ADDRESS
import FlowToken from 0xFLOWTOKEN_ADDRESS
import Bitroot from 0xBITROOT_ADDRESS
import MonoswapFTPair from 0xMONOSWAP_ADDRESS


/* ADD LIQUIDITY
*/
transaction(xAmount: UFix64, yAmount: UFix64) {
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
        let xTokens <- self.xTokensProvider.withdraw(amount: xAmount)
        let yTokens <- self.yTokensProvider.withdraw(amount: yAmount)

        MonoswapFTPair.addLiquidity(ltReceiver: self.tokenReceiver, xTokens: <-xTokens, yTokens: <-yTokens)


    }
}