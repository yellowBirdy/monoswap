// This is an example implementation of a Flow Non-Fungible Token
// It is not part of the official standard but it assumed to be
// very similar to how many NFTs would implement the core functionality.

import NonFungibleToken from 0xNFTStandardAddress

//import NonFungibleToken from 0x045a1763c93006ca

pub contract SurvivalNFT: NonFungibleToken {

    pub var totalSupply: UInt64

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64

        pub var metadata: {String: String}

        init(initID: UInt64) {
            self.id = initID
            self.metadata = {}
        }
    }

    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // deposit takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @SurvivalNFT.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // borrowNFT gets a reference to an NFT in the collection
        // so that the caller can read its metadata and call its methods
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // public function that anyone can call to create a new empty collection
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
    //
	pub resource NFTMinter {

		// mintNFT mints a new NFT with a new ID
		// and deposit it in the recipients collection using their collection reference
		pub fun mintNFT(recipient: &{NonFungibleToken.CollectionPublic}) {

			// create a new NFT
			var newNFT <- create NFT(initID: SurvivalNFT.totalSupply)

			// deposit it in the recipient's account using their reference
			recipient.deposit(token: <-newNFT)

            SurvivalNFT.totalSupply = SurvivalNFT.totalSupply + UInt64(1)
            //double generate every 5th token
            /*if SurvivalNFT.totalSupply % UInt64(5) == UInt64(0)   {
                var newerNFT <- create NFT(initID: SurvivalNFT.totalSupply)

			// deposit it in the recipient's account using their reference
			    recipient.deposit(token: <-newerNFT)

                SurvivalNFT.totalSupply = SurvivalNFT.totalSupply + UInt64(1)
            }
            */
            //double generate every 5th token on average
            if unsafeRandom() % UInt64(5) == UInt64(0)   {
                var newerNFT <- create NFT(initID: SurvivalNFT.totalSupply)

			// deposit it in the recipient's account using their reference
			    recipient.deposit(token: <-newerNFT)

                SurvivalNFT.totalSupply = SurvivalNFT.totalSupply + UInt64(1)
            }

		}
	}

	init() {
        // Initialize the total supply
        self.totalSupply = 0

        // Create a Collection resource and save it to storage
        if self.account.load<&Collection>(from: /storage/NFTCollection) != nil  {
            let collection <- create Collection()
            self.account.save(<-collection, to: /storage/NFTCollection)
                    // create a public capability for the collection

            self.account.link<&{NonFungibleToken.CollectionPublic}>(
            /public/NFTCollection,
            target: /storage/NFTCollection
)
        
        }


        // Create a Minter resource and save it to storage
        let oldMinter <- self.account.load<@NFTMinter>(from:/storage/NFTMinter)
        destroy oldMinter


        let minter <- create NFTMinter()
        self.account.save(<-minter, to: /storage/NFTMinter)

        emit ContractInitialized()
	}
}
 