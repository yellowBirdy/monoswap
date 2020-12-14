import FungibleToken from 0xee82856bf20e2aa6
import Bitroot from 0x01cf0e2f2f715450



/*
    INSTALL ALL VAULTS
    install_all.cdc
*/

transaction {

    prepare(signer: AuthAccount) {

        if signer.borrow<&Bitroot.Vault>(from: /storage/BitrootVault) == nil {
            // Create a new Bitroot Vault and put it in storage
            signer.save(<-Bitroot.createEmptyVault(), to: /storage/BitrootVault)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&Bitroot.Vault{FungibleToken.Receiver}>(
                /public/BitrootReceiver,
                target: /storage/BitrootVault
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&Bitroot.Vault{FungibleToken.Balance}>(
                /public/BitrootBalance,
                target: /storage/BitrootVault
            )
        }

    }
}



