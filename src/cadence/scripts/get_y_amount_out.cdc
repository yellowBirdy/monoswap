import MonoswapFTPair from 0xf3fcd2c1a78f5eee

pub fun main(amountXIn: UFix64):  UFix64 {
	//let amountXIn: UFix64 = UFix64(<amountIn>)
    let reserves: {String: UFix64} = MonoswapFTPair.getReserves();
  	return  MonoswapFTPair.getAmountOut(        
		input_amount: amountXIn,
		input_reserve: reserves["x"]!,
		output_reserve: reserves["y"]!
	)
}
