import FungibleToken from 0xee82856bf20e2aa6
import FauxFlow from 0x179b6b1cb6755e31
/* MINT FLOW
*/

transaction(recipientAddress: Address) {
    let tokenAdmin: &FauxFlow.Administrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.tokenAdmin = signer
        .borrow<&FauxFlow.Administrator>(from: /storage/FauxFlowAdmin) 
        ?? panic("Signer is not the token admin")

        //self.tokenReceiver = signer//getAccount(recipient)
        self.tokenReceiver = getAccount(recipientAddress)
        .getCapability(/public/FauxFlowReceiver)!
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let amount = UFix64(1000)
        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
        let mintedVault <- minter.mintTokens(amount: amount)

        self.tokenReceiver.deposit(from: <-mintedVault)

        destroy minter
    }
}
