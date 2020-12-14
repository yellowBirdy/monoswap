import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x179b6b1cb6755e31
import Bitroot from 0x01cf0e2f2f715450
import MonoswapFTPair from 0xf3fcd2c1a78f5eee


/*
    SWAP X to Y
    install_all.cd
*/

//TODO: add optional(?) min_amount_out param
transaction (amountIn: UFix64) {
      
    let yTokensProvider: &{FungibleToken.Provider}
    let xTokensReceiver: &{FungibleToken.Receiver} 
    
    prepare(signer: AuthAccount) {
       


        self.yTokensProvider = signer
        .borrow<&{FungibleToken.Provider}>(from: /storage/BitrootVault)
        ?? panic("Unable to borrow yToken provider reference")


        self.xTokensReceiver = signer//getAccount(recipient)
        .getCapability(/public/flowTokenReceiver)!
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Unable to borrow xToken receiver reference")
    }

    execute {
        let prices = MonoswapFTPair.getPrices()
        let yTokensAmount = amountIn
        let yTokens <- self.yTokensProvider.withdraw(amount: yTokensAmount)
        // I know, it's a hudge slippage, front running attack tolerance
        let minAmountOut = (prices["x"]! * yTokensAmount) * 0.4//0.8
        log(minAmountOut)

        MonoswapFTPair.swapYtoX(yTokens: <-yTokens, to: self.xTokensReceiver, minAmountOut: minAmountOut)

    }
}



