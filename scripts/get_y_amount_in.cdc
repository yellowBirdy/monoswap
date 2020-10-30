import MonoswapFTPair from 0xf3fcd2c1a78f5eee

pub fun main(amountXOut: UFix64):  UFix64 {
    let reserves: {String: UFix64} = MonoswapFTPair.getReserves();
  	return  MonoswapFTPair.getAmountIn(        
		output_amount: amountXOut,
		input_reserve: reserves["y"]!,
		output_reserve: reserves["x"]!
	)
}
