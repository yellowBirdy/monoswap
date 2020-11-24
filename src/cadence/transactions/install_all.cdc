import FungibleToken from 0xee82856bf20e2aa6
import FauxFlow from 0x179b6b1cb6755e31
import Bitroot from 0x01cf0e2f2f715450
import MonoswapFTPair from 0xf3fcd2c1a78f5eee


/*
    INSTALL ALL VAULTS
    install_all.cdc
*/

transaction {

    prepare(signer: AuthAccount) {

        if signer.borrow<&Bitroot.Vault>(from: /storage/BitrootVault) == nil {
            // Create a new Bitroot Vault and put it in storage
            //signer.save(<-Bitroot.createEmptyVault(), to: /storage/BitrootVault)
            signer.save(<-Bitroot.createPromoVault(), to: /storage/BitrootVault)


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

        if signer.borrow<&FauxFlow.Vault>(from: /storage/FauxFlowVault) == nil {
            // Create a new FauxFlow Vault and put it in storage
            //signer.save(<-FauxFlow.createEmptyVault(), to: /storage/FauxFlowVault)
            signer.save(<-FauxFlow.createPromoVault(), to: /storage/FauxFlowVault)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&FauxFlow.Vault{FungibleToken.Receiver}>(
                /public/FauxFlowReceiver,
                target: /storage/FauxFlowVault
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&FauxFlow.Vault{FungibleToken.Balance}>(
                /public/FauxFlowBalance,
                target: /storage/FauxFlowVault
            )
        }

        if signer.borrow<&MonoswapFTPair.Vault>(from: /storage/MonoswapFTPairVault) == nil {
            // Create a new MonoswapFTPair Vault and put it in storage
            signer.save(<-MonoswapFTPair.createEmptyVault(), to: /storage/MonoswapFTPairVault)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&MonoswapFTPair.Vault{FungibleToken.Receiver}>(
                /public/MonoswapFTPairReceiver,
                target: /storage/MonoswapFTPairVault
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&MonoswapFTPair.Vault{FungibleToken.Balance}>(
                /public/MonoswapFTPairBalance,
                target: /storage/MonoswapFTPairVault
            )
        }
    }
}



