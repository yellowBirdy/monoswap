import FungibleToken from 0xee82856bf20e2aa6
import MonoswapFTPair from 0x179b6b1cb6755e31

/*
    INSTALL ALL VAULTS
    install_all.cdc
*/

transaction {

    prepare(signer: AuthAccount) {

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



