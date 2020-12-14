import FungibleToken from 0xee82856bf20e2aa6
import Bitroot from 0x01cf0e2f2f715450
/* MINT Bitroot
*/

//transaction(recipientAddress: Address) {
transaction() {

    let tokenMinter: &Bitroot.Minter
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        let recipientAddress: Address = 0x179b6b1cb6755e31

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
        let amount = UFix64(20000000)
        self.tokenMinter.mintTokens(amount: amount, recipient: self.tokenReceiver)

    }
}
