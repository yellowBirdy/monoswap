import FungibleToken from 0xee82856bf20e2aa6
import FauxFlow from 0x179b6b1cb6755e31
import Bitroot from 0x01cf0e2f2f715450
import MonoswapFTPair from 0xf3fcd2c1a78f5eee


/*
    SWAP X to Y
    install_all.cd
*/

//TODO: add optional(?) min_amount_out param
transaction (amountIn: UFix64) {
      
    let xTokensProvider: &{FungibleToken.Provider}
    let yTokensReceiver: &{FungibleToken.Receiver} 
    
    prepare(signer: AuthAccount) {
       


        self.xTokensProvider = signer
        .borrow<&{FungibleToken.Provider}>(from: /storage/FauxFlowVault)
        ?? panic("Unable to borrow xToken provider reference")


        self.yTokensReceiver = signer//getAccount(recipient)
        .getCapability(/public/BitrootReceiver)!
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Unable to borrow yToken receiver reference")
    }

    execute {
        let prices = MonoswapFTPair.getPrices()
        let xTokensAmount: UFix64;
        xTokensAmount = amountIn;
        let xTokens <- self.xTokensProvider.withdraw(amount: xTokensAmount)
        // I know, it's a hudge slippage, front running attack tolerance
        let minAmountOut = (prices["y"]! * xTokensAmount) * 0.8
        log(minAmountOut)

        MonoswapFTPair.swapXtoY(xTokens: <-xTokens, to: self.yTokensReceiver, minAmountOut: minAmountOut)


    }
}



