import MonoswapFTPair from 0xMONOSWAP_ADDRESS


pub fun main(amountOut: UFix64, inTokenName: String):  UFix64 {
	let reserves: {String: UFix64} = MonoswapFTPair.getReserves();
	var input_reserve_key: String = ""
	var output_reserve_key: String = ""
	if inTokenName == MonoswapFTPair.yName {
		input_reserve_key = "y"
		output_reserve_key = "x"
	} else {
		input_reserve_key = "x"
		output_reserve_key = "y"	
	}
    
  	return  MonoswapFTPair.getAmountIn(        
		output_amount: amountOut,
		input_reserve: reserves[input_reserve_key]!,
		output_reserve: reserves[output_reserve_key]!
	)
}
