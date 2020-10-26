import FungibleToken from 0xee82856bf20e2aa6
import Bitroot from 0x01cf0e2f2f715450
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
        let amount = 2000.0
        self.tokenMinter.mintTokens(amount: amount, recipient: self.tokenReceiver)

    }
}
