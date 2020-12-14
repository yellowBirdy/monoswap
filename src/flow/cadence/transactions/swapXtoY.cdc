import FungibleToken from 0xFUNGIBLETOKEN_ADDRESS
import FlowToken from 0xFLOWTOKEN_ADDRESS
import Bitroot from 0xBITROOT_ADDRESS
import MonoswapFTPair from 0xMONOSWAP_ADDRESS


/*
    SWAP X to Y
    install_all.cd
*/

//TODO: add optional(?) min_amount_out param
transaction (amountIn: UFix64, minAmountOut: UFix64) {
      
    let xTokensProvider: &{FungibleToken.Provider}
    let yTokensReceiver: &{FungibleToken.Receiver} 
    
    prepare(signer: AuthAccount) {

        self.xTokensProvider = signer
        .borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)
        ?? panic("Unable to borrow xToken provider reference")

        self.yTokensReceiver = signer//getAccount(recipient)
        .getCapability(/public/BitrootReceiver)!
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Unable to borrow yToken receiver reference")
    }

    execute {
        let prices = MonoswapFTPair.getPrices()
        let xTokensAmount = amountIn
        let xTokens <- self.xTokensProvider.withdraw(amount: xTokensAmount)
        //TODO: find out if minAmountOut can be an optional param
        // I know, it's a hudge slippage, front running attack tolerance
        //let minAmountOut = (prices["y"]! * xTokensAmount) * 0.8

        MonoswapFTPair.swapXtoY(xTokens: <-xTokens, to: self.yTokensReceiver, minAmountOut: minAmountOut)

    }
}



