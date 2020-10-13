import FungibleToken from x0FUNGIBLETOKENADDRESS
import FlowToken from x0FLOWTOKENADDRESS
import BitrootToken from x0BITROOTTOKENADDRESS

pub contract interface MonoswapFTPairI {

}

pub contract MonoswapFTPair: MonoswapFTPairI, FungibleToken {

    pub let MINIMUM_LIQUIDITY: UFix64;
    //pub let factory Address;
    pub let token0: address;  //FLOW
    pub let token1: address;  //BITROOT  

    access(contract) var reserve0: @FungibleToken.Vault;   //  balance accessible via getReserves         
    access(contract) var reserve1: @FungibleToken.Vault;  //  balance accessible via getReserves       
    access(contract) var blockTimestampLast: UInt256;   //  accessible via getReserves

    pub var fee: UFix64;

    access(contract) let minter: @Minter;
    pub var totalSupply: UFix64;
 
    /* ORACLE provisions

       uncoment 3 lines blow when oracle code is gonnba be developed
     */
    //pub var price0CumulativeLast: UInt256;
    //pub var price1CumulativeLast: UInt256;
    //pub var kLast: UInt256; // reserve0 * reserve1, as of immediately after the most recent liquidity event


    pub fun getReserves(): {String: UInt256} {
        return { 
            "reserve0" : self.reserve0.getBalance(),
            "reserve1" : self.reserve1.getBalance(),
            "blockTimestampLast" : self.blockTimestampLast
        }
    }

    /*
    TODO: figure out what's _safeTransfer for and how it works 
    
    */
    //function _safeTransfer(address token, address to, uint value) private {
    //    (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
    //    require(success && (data.length == 0 || abi.decode(data, (bool))), 'UniswapV2: TRANSFER_FAILED');
    //}

    /*
        LP_token related events
     */
    //event Mint(address indexed sender, uint amount0, uint amount1);
    //event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
   
    /*
        Exchange related events
     */
    //event Swap(
    //    address indexed sender,
    //    uint amount0In,
    //    uint amount1In,
    //    uint amount0Out,
    //    uint amount1Out,
    //    address indexed to
    //);
    //event Sync(uint112 reserve0, uint112 reserve1);

    //init(factory: Address, token0: Address, token1: Address) {
    //    require(that it was in fact factory that deployed the contract)    
    //    self.factory = facotory;
    //    self.token0 = token0;
    //    self.token1 = token1;
    //}
    init() {
        self.token0 <- FlowToken.createEmptyVault();
        self.token1  <- Bitroot.createEmptyVault();
        self.blockTimestampLast = UInt256(0);

        self.fee = UInt64(0);

        self.totalSupply = 0.0;
        self.MINIMUM_LIQUIDITY = 1000;
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
            destroy vault
            emit TokensBurned(amount: amount)
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
    // ORACLE STUFF, 
    // ALSO, we don't need tou update reserve values as we have them localy in the vaults
    // update reserves and, on the first call per block, price accumulators
    //function _update(uint balance0, uint balance1, uint112 _reserve0, uint112 _reserve1) private {
    //    require(balance0 <= uint112(-1) && balance1 <= uint112(-1), 'UniswapV2: OVERFLOW');
    //    uint32 blockTimestamp = uint32(block.timestamp % 2**32);
    //    uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
    //    if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            // * never overflows, and + overflow is desired
    //        price0CumulativeLast += uint(UQ112x112.encode(_reserve1).uqdiv(_reserve0)) * timeElapsed;
    //        price1CumulativeLast += uint(UQ112x112.encode(_reserve0).uqdiv(_reserve1)) * timeElapsed;
    //    }
    //    reserve0 = uint112(balance0);
    //    reserve1 = uint112(balance1);
    //    blockTimestampLast = blockTimestamp;
    //    emit Sync(reserve0, reserve1);
    // }

    // WE DON'T NEED FEES at this point
    // if fee is on, mint liquidity equivalent to 1/6th of the growth in sqrt(k)
    //function _mintFee(uint112 _reserve0, uint112 _reserve1) private returns (bool feeOn) {
    //    address feeTo = IUniswapV2Factory(factory).feeTo();
    //    feeOn = feeTo != address(0);
    //    uint _kLast = kLast; // gas savings
    //    if (feeOn) {
    //        if (_kLast != 0) {
    //            uint rootK = Math.sqrt(uint(_reserve0).mul(_reserve1));
    //            uint rootKLast = Math.sqrt(_kLast);
    //            if (rootK > rootKLast) {
    //                uint numerator = totalSupply.mul(rootK.sub(rootKLast));
    //                uint denominator = rootK.mul(5).add(rootKLast);
    //                uint liquidity = numerator / denominator;
    //                if (liquidity > 0) _mint(feeTo, liquidity);
    //            }
    //        }
    //    } else if (_kLast != 0) {
    //        kLast = 0;
    //    }
    //}

    // this low-level function should be called from a contract which performs important safety checks
    /*MINT AFAIU is supposed to be called int the same transaction liquidity has been added  
    we shold have this functionality integrated in fun addLiquidity as all happens within the contract (account) */
    //function mint(address to) external lock returns (uint liquidity) {
    //   (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
    //    uint balance0 = IERC20(token0).balanceOf(address(this));
    //    uint balance1 = IERC20(token1).balanceOf(address(this));
    //    uint amount0 = balance0.sub(_reserve0);
    //    uint amount1 = balance1.sub(_reserve1);
    //
    //    bool feeOn = _mintFee(_reserve0, _reserve1);
    //    uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
    //    if (_totalSupply == 0) {
    //        liquidity = Math.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);
    //       _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
    //    } else {
    //        liquidity = Math.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);
    //    }
    //    require(liquidity > 0, 'UniswapV2: INSUFFICIENT_LIQUIDITY_MINTED');
    //    _mint(to, liquidity);
    //
    //    _update(balance0, balance1, _reserve0, _reserve1);
    //    if (feeOn) kLast = uint(reserve0).mul(reserve1); // reserve0 and reserve1 are up-to-date
    //    emit Mint(msg.sender, amount0, amount1);
    //}

    // this low-level function should be called from a contract which performs important safety checks
     /*BURN AFAIU is supposed to be called int the same transaction liquidity has been added  
    we shold have this functionality integrated in fun withdrawLiquidity as all happens within the contract (account) */
    //function burn(address to) external lock returns (uint amount0, uint amount1) {
    //    (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
    //    address _token0 = token0;                                // gas savings
    //    address _token1 = token1;                                // gas savings
    //    uint balance0 = IERC20(_token0).balanceOf(address(this));
    //    uint balance1 = IERC20(_token1).balanceOf(address(this));
    //    uint liquidity = balanceOf[address(this)];
    //
    //    bool feeOn = _mintFee(_reserve0, _reserve1);
    //    uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
    //    amount0 = liquidity.mul(balance0) / _totalSupply; // using balances ensures pro-rata distribution
    //    amount1 = liquidity.mul(balance1) / _totalSupply; // using balances ensures pro-rata distribution
    //    require(amount0 > 0 && amount1 > 0, 'UniswapV2: INSUFFICIENT_LIQUIDITY_BURNED');
    //    _burn(address(this), liquidity);
    //    _safeTransfer(_token0, to, amount0);
    //    _safeTransfer(_token1, to, amount1);
    //    balance0 = IERC20(_token0).balanceOf(address(this));
    //    balance1 = IERC20(_token1).balanceOf(address(this));
    //
    //    _update(balance0, balance1, _reserve0, _reserve1);
    //    if (feeOn) kLast = uint(reserve0).mul(reserve1); // reserve0 and reserve1 are up-to-date
    //    emit Burn(msg.sender, amount0, amount1, to);
    //}
    pub fun addLiquidity() {

    }
    pub fun withdrawLiquidity() {

    }

    access(contract) fun mint() {

    }   
    pub fun quote(
        input_amount: UFix64,
        input_reserve:UFix64,
        output_reserve:UFix64
    ): UFix64 {
        return input_amount  *  (output_reserve / input_reserve) 
    }
    pub fun getAmountOut(        
        input_amount: UFix64,
        input_reserve:UFix64,
        output_reserve:UFix64
    ): UFix64 {
        //require(amountIn > 0, 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT');
        //require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        let input_amount_minus_fee = input_amount * (1.0 - self.fee)
        let price = (input_reserve + input_amount_minus_fee) / output_reserve 
        return input_amount_minus_fee / price ;
    }

    pub fun getAmountIn(        
        output_amount: UFix64,
        input_reserve:UFix64,
        output_reserve:UFix64
    ): UFix64 {
        //require(amountIn > 0, 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT');
        //require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        let input_amount_with_fee_multiplier = 1.0 / (1.0 - self.fee);
        let price = (output_reserve - output_amount) / input_reserve; 
        return (output_amount / price) * input_amount_with_fee_multiplier;
    }

        // given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    //function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) internal pure returns (uint amountIn) {
    //    require(amountOut > 0, 'UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT');
    //    require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
    //    uint numerator = reserveIn.mul(amountOut).mul(1000);
    //    uint denominator = reserveOut.sub(amountOut).mul(997);
    //    amountIn = (numerator / denominator).add(1);
    //}
    
    pub fun swapFlowToBitroot(xTokens: @FlowToken.Vault, to: &{BitrootToken.Receiver}, minAmountOut: UFix64) {
        // 1.  - check xTokens not empty
        pre {
            xTokens.balance > UFix64(0): "Amount sent must be greater than zero"
        }
        // 2. getAmountOut
        let amountOut = self.getAmountOut(
            input_amount: xTokens.balance, 
            input_reserve: self.reserve0.balance, 
            output_reserve: self.reserve1.balance
        )
        // 3. assert amoutOut >= minAmountOut
        assert(amountOut >= minAmountOut, message: "Rat too bad")
        // 4. withdraw amountOut
        let yTokens = <-self.reserve1.withdraw(amount: amountOut)
        //(5a). deposit xTokens protocol fee if present
        // protocol fee
        // 5. deposit xToken to self.reserve0
        self.reserve0.deposit(<- xTokens)
        // 6. deposit amountOut to to
        to.deposit(<- yTokens)
        // 7. emit event
        //emit swap()
    }
    pub fun swapBitrootToFlow(yTokens: @BitrootToken.Vault, to: &{FlowToken.Receiver}, minAmountOut: UFix64) {
        // 1.  - check yTokens not empty
        pre {
            yTokens.balance > UFix64(0): "Amount sent must be greater than zero"
        }
        // 2. getAmountOut
        let amountOut = self.getAmountOut(
            input_amount: yTokens.balance, 
            input_reserve: self.reserve1.balance, 
            output_reserve: self.reserve0.balance
        )
        // 3. assert amoutOut >= minAmountOut
        assert(amountOut >= minAmountOut, message: "Rat too bad")
        // 4. withdraw amountOut
        let xTokens = <-self.reserve0.withdraw(amount: amountOut)
        //(5a). deposit yTokens protocol fee if present
        // protocol fee
        // 5. deposit yToken to self.reserve0
        self.reserve1.deposit(<- yTokens)
        // 6. deposit amountOut to to
        to.deposit(<- xTokens)
        // 7. emit event
        //emit swap()
    }
//
    //// this low-level function should be called from a contract which performs important safety checks
    //function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external lock {
    //    require(amount0Out > 0 || amount1Out > 0, 'UniswapV2: INSUFFICIENT_OUTPUT_AMOUNT');
    //    (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
    //    require(amount0Out < _reserve0 && amount1Out < _reserve1, 'UniswapV2: INSUFFICIENT_LIQUIDITY');
//
    //    uint balance0;
    //    uint balance1;
    //    { // scope for _token{0,1}, avoids stack too deep errors
    //    address _token0 = token0;
    //    address _token1 = token1;
    //    require(to != _token0 && to != _token1, 'UniswapV2: INVALID_TO');
    //    if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out); // optimistically transfer tokens
    //    if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out); // optimistically transfer tokens
    //    if (data.length > 0) IUniswapV2Callee(to).uniswapV2Call(msg.sender, amount0Out, amount1Out, data);
    //    balance0 = IERC20(_token0).balanceOf(address(this));
    //    balance1 = IERC20(_token1).balanceOf(address(this));
    //    }
    //    uint amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
    //    uint amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
    //    require(amount0In > 0 || amount1In > 0, 'UniswapV2: INSUFFICIENT_INPUT_AMOUNT');
    //    { // scope for reserve{0,1}Adjusted, avoids stack too deep errors
    //    uint balance0Adjusted = balance0.mul(1000).sub(amount0In.mul(3));
    //    uint balance1Adjusted = balance1.mul(1000).sub(amount1In.mul(3));
    //    require(balance0Adjusted.mul(balance1Adjusted) >= uint(_reserve0).mul(_reserve1).mul(1000**2), 'UniswapV2: K');
    //    }
//
    //    _update(balance0, balance1, _reserve0, _reserve1);
    //    emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    //}
    ///* IRRELEVANT IMO */
    //// force balances to match reserves
    //function skim(address to) external lock {
    //    address _token0 = token0; // gas savings
    //    address _token1 = token1; // gas savings
    //    _safeTransfer(_token0, to, IERC20(_token0).balanceOf(address(this)).sub(reserve0));
    //    _safeTransfer(_token1, to, IERC20(_token1).balanceOf(address(this)).sub(reserve1));
    //}

    // force reserves to match balances
    //function sync() external lock {
    //    _update(IERC20(token0).balanceOf(address(this)), IERC20(token1).balanceOf(address(this)), reserve0, reserve1);
    //}
}
