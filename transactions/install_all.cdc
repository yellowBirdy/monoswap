//import FungibleToken from 0xee82856bf20e2aa6
//import Bitroot from 0x01cf0e2f2f715450
//import MonoswapFTPair from 0x179b6b1cb6755e31
import FungibleToken from 0x9a0766d93b6608b7
import Bitroot from 0x40e0ced5e2cf034c
import MonoswapFTPair from 0x56b4abe67bcb092d
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



