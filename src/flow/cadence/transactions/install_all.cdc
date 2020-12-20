import FungibleToken from 0xFUNGIBLETOKEN_ADDRESS
import Bitroot from 0xBITROOT_ADDRESS
import MonoswapFTPair from 0xMONOSWAP_ADDRESS


/*
    INSTALL ALL VAULTS
    install_all.cdc
*/

transaction {

    prepare(signer: AuthAccount) {

        if signer.borrow<&Bitroot.Vault>(from: /storage/BitrootVault) == nil {
            // Create a new Bitroot Vault and put it in storage
            signer.save(<-Bitroot.createPromoVault(), to: /storage/BitrootVault)
            //signer.save(<-Bitroot.createPromoVault(), to: /storage/BitrootVault)


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



