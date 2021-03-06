import FlowToken from 0xFLOWTOKEN_ADDRESS
import Bitroot from 0xBITROOT_ADDRESS
/* MINT Bitroot
*/

transaction(recipientAddress: Address) {
    let tokenMinter: &Bitroot.Minter
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.tokenMinter = signer
        .borrow<&Bitroot.Minter>(from: /storage/BitrootMinter) 
        ?? panic("Signer is not the token admin")

        //self.tokenReceiver = signer//getAccount(recipient)
        self.tokenReceiver = getAccount(recipientAddress)
        .getCapability(/public/BitrootReceiver)!
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let amount = UFix64(2000)
        self.tokenMinter.mintTokens(amount: amount, recipient: self.tokenReceiver)

    }
}
