import FungibleToken from 0x01
import FlowToken from 0x02
import Bitroot from 0x03

pub contract MonoswapFTPair: FungibleToken {
    // Total supply of Flow tokens in existence
    pub var totalSupply: UFix64

    // Event that is emitted when the contract is created
    pub event TokensInitialized(initialSupply: UFix64)

    // Event that is emitted when tokens are withdrawn from a Vault
    pub event TokensWithdrawn(amount: UFix64, from: Address?)

    // Event that is emitted when tokens are deposited to a Vault
    pub event TokensDeposited(amount: UFix64, to: Address?)

    // Event that is emitted when new tokens are minted
    pub event TokensMinted(amount: UFix64)

    // Event that is emitted when tokens are destroyed
    pub event TokensBurned(amount: UFix64)

    // Event that is emitted when a new minter resource is created
    pub event MinterCreated(allowedAmount: UFix64)

    // Event that is emitted when a new burner resource is created
    pub event BurnerCreated()
    
    pub let MINIMUM_LIQUIDITY: UFix64;
    //pub let factory Address;
    pub let xToken: Address;  //FLOW
    pub let yToken: Address;  //BITROOT  
    pub let xName: String;
    pub let yName: String;

    access(contract) var xReserve: @FungibleToken.Vault;  //  balance accessible via getReserves         
    access(contract) var yReserve: @FungibleToken.Vault;  //  balance accessible via getReserves       
  //  access(contract) var blockTimestampLast: UInt256;   //  accessible via getReserves

    pub var fee: UFix64;

    access(contract) let minter: @Minter;
    pub var totalSupply: UFix64;
 
    /* ORACLE provisions

       uncoment 3 lines blow when oracle code is gonnba be developed
     */
    //pub var price0CumulativeLast: UInt256;
    //pub var price1CumulativeLast: UInt256;
    //pub var kLast: UInt256; // xReserve * yReserve, as of immediately after the most recent liquidity event

    pub fun getReserves(): {String: UFix64} {
        return { 
            "x" : self.xReserve.balance,
            "y" : self.yReserve.balance//,
           // "blockTimestampLast" : self.blockTimestampLast
        }
    }
    pub fun getPrices(): {String: UFix64} {
        return {
            "x" : self.getXPrice(),
            "y" : self.getYPrice()
        }
    } 
    pub fun getXPrice(): UFix64 {
        return self.xReserve.balance / self.yReserve.balance
    }
    pub fun getYPrice(): UFix64 {
        return self.yReserve.balance / self.xReserve.balance
    }

    init() {
        self.xToken = 0x02
        self.yToken = 0x03
        self.xName = "FlowToken"
        self.yName = "Bitroot"

        self.xReserve <- FlowToken.createEmptyVault();
        self.yReserve  <- Bitroot.createEmptyVault();
        //self.blockTimestampLast = UInt256(0);

        self.fee = UFix64(0);

        self.totalSupply = 0.0;
        self.MINIMUM_LIQUIDITY = UFix64(1000);
        self.minter <- create Minter();

    }

    // FT stuff

    pub resource Minter {

        pub fun mintTokens(amount: UFix64): @MonoswapFTPair.Vault {
            pre {
                amount > UFix64(0): "Amount minted must be greater than zero"
            }
            MonoswapFTPair.totalSupply = MonoswapFTPair.totalSupply + amount 
            //emit TokensMinted(amount: amount)
            return <-create Vault(balance: amount)
        }

        pub fun burnTokens(from: @FungibleToken.Vault) {
            let vault <- from as! @MonoswapFTPair.Vault
            let amount = vault.balance
            MonoswapFTPair.totalSupply = MonoswapFTPair.totalSupply - amount
            destroy vault
            //emit TokensBurned(amount: amount)
        }
    }
    
        
    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {
        pub var balance: UFix64;

        init(balance: UFix64) {
            self.balance = balance
        }
    

      pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }
        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @FlowToken.Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            vault.balance = 0.0
            destroy vault
        }

        destroy() {
            MonoswapFTPair.totalSupply = MonoswapFTPair.totalSupply - self.balance
        }
    }

    pub fun addLiquidity(ltReceiver: &{FungibleToken.Receiver}, xTokens: @FungibleToken.Vault, yTokens: @FungibleToken.Vault) {
        pre {
            // allow 1% diff
            // TODO: refactor to use getPrice instead of imperatie calls to reserves
            (xTokens.balance / yTokens.balance - self.getXPrice()) < 0.01: "Wrong ratio"
            (xTokens.balance / yTokens.balance - self.getYPrice()) > (-0.01): "Wrong ratio"
        }
        // just deposits all the tokens into reserves but mints lTokens corresponding the current reserves ratio
        let deposit_to_reserve_ratio = (xTokens.balance / self.xReserve.balance + yTokens.balance / self.yReserve.balance) / 2  
        let liquidity_amount = self.totalSupply * deposit_to_reserve_ratio
        //mint new liequidity tokens and deposit them
        ltReceiver.deposit(from: <-self.minter.mintTokens(amount: liquidity_amount))
        // add liquidity to reserves
        self.xReserve.deposit(from: <-xTokens)
        self.yReserve.deposit(from: <-yTokens)
        // emit added liquidity event
    }
    /*
        Top level interfact recievers to make it reusable
        It's fine as the actuall token implementations are expected to cast the receivers into their respective types.break
        TODO: asses impact if they do not do it, possibly there is a loophole to make a irrevesible sink for other types of tokens
     */
    pub fun withdrawLiquidity(lTokens: @FungibleToken.Vault, xReceiver: &{FungibleToken.Receiver}, yReceiver: &{FungibleToken.Receiver}) {
        let liquidity_fraction = self.totalSupply / lTokens.balance
        let xShare <- self.xReserve.withdraw(self.xReserve.balance * liquidity_fraction)
        let yShare <- self.yReserve.withdraw(self.yReserve.balance * liquidity_fraction)

        xReceiver.deposit(<-xShare)
        yReceiver.deposit(<-yShare)

        self.minter.burnTokens(from: lTokens)
    }
 
    pub fun quote(
        input_amount: UFix64,
        input_reserve:UFix64,
        output_reserve:UFix64
    ): UFix64 {
        return input_amount  *  (output_reserve / input_reserve) 
    }

    // given an input amount of an asset and pair reserves, returns a expected output amount of the other asset
    pub fun getAmountOut(        
        input_amount: UFix64,
        input_reserve:UFix64,
        output_reserve:UFix64
    ): UFix64 {
        let input_amount_minus_fee = input_amount * (1.0 - self.fee)
        let price = (input_reserve + input_amount_minus_fee) / output_reserve 
        return input_amount_minus_fee / price ;
    }

    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    pub fun getAmountIn(        
        output_amount: UFix64,
        input_reserve:UFix64,
        output_reserve:UFix64
    ): UFix64 {
        let input_amount_with_fee_multiplier = 1.0 / (1.0 - self.fee);
        let price = (output_reserve - output_amount) / input_reserve; 
        return (output_amount / price) * input_amount_with_fee_multiplier;
    }

    
    pub fun swapXtoY(xTokens: @FungibleToken.Vault, to: &{FungibleToken.Receiver}, minAmountOut: UFix64) {
        // 1.  - check xTokens not empty
        pre {
            xTokens.balance > UFix64(0): "Amount sent must be greater than zero"
        }
        // 2. getAmountOut
        let amountOut = self.getAmountOut(
            input_amount: xTokens.balance, 
            input_reserve: self.xReserve.balance, 
            output_reserve: self.yReserve.balance
        )
        // 3. assert amoutOut >= minAmountOut
        assert(amountOut >= minAmountOut, message: "Rat too bad")
        // 4. withdraw amountOut
        let yTokens = <-self.yReserve.withdraw(amount: amountOut)
        //(5a). deposit xTokens protocol fee if present
        // protocol fee
        // 5. deposit xToken to self.xReserve
        self.xReserve.deposit(<- xTokens)
        // 6. deposit amountOut to to
        to.deposit(<- yTokens)
        // 7. emit event
        //emit swap()
    }
    pub fun swapYtoX(yTokens: @FungibleToken.Vault, to: &{FungibleToken.Receiver}, minAmountOut: UFix64) {
        // 1.  - check yTokens not empty
        pre {
            yTokens.balance > UFix64(0): "Amount sent must be greater than zero"
        }
        // 2. getAmountOut
        let amountOut = self.getAmountOut(
            input_amount: yTokens.balance, 
            input_reserve: self.yReserve.balance, 
            output_reserve: self.xReserve.balance
        )
        // 3. assert amoutOut >= minAmountOut
        assert(amountOut >= minAmountOut, message: "Rat too bad")
        // 4. withdraw amountOut
        let xTokens = <-self.xReserve.withdraw(amount: amountOut)
        //(5a). deposit yTokens protocol fee if present
        // protocol fee
        // 5. deposit yToken to self.xReserve
        self.yReserve.deposit(<- yTokens)
        // 6. deposit amountOut to to
        to.deposit(<- xTokens)
        // 7. emit event
        //emit swap()
    }

}
