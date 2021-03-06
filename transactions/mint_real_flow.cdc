import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79
/* MINT FLOW
*/

//transaction(recipientAddress: Address) {
transaction() {

    let tokenAdmin: &FlowToken.Administrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {

        let recipientAddress: Address =  0x179b6b1cb6755e31

        self.tokenAdmin = signer
        .borrow<&FlowToken.Administrator>(from: /storage/flowTokenAdmin) 
        ?? panic("Signer is not the token admin")

        //self.tokenReceiver = signer//getAccount(recipient)
        self.tokenReceiver = getAccount(recipientAddress)
        .getCapability(/public/flowTokenReceiver)!
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let amount = UFix64(1000000)
        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
        let mintedVault <- minter.mintTokens(amount: amount)

        self.tokenReceiver.deposit(from: <-mintedVault)

        destroy minter
    }
}
