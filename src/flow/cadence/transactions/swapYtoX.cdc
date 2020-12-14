import FungibleToken from 0xFUNGIBLETOKEN_ADDRESS
import FlowToken from 0xFLOWTOKEN_ADDRESS
import Bitroot from 0xBITROOT_ADDRESS
import MonoswapFTPair from 0xMONOSWAP_ADDRESS


/*
    SWAP Y to X
*/

//TODO: add optional(?) min_amount_out param
transaction (amountIn: UFix64, minAmountOut: UFix64) {
      
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
        //TODO: figure if optional args are allowd, if so maybe add a default here
        //I know, it's a hudge slippage, front running attack tolerance
        //let minAmountOut = (prices["x"]! * yTokensAmount) * 0.4//0.8
        log(minAmountOut)

        MonoswapFTPair.swapYtoX(yTokens: <-yTokens, to: self.xTokensReceiver, minAmountOut: minAmountOut)

    }
}



