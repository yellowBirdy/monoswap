import MonoswapFTPair from 0xMONOSWAP_ADDRESS


pub fun main(amountIn: UFix64, inTokenName: String):  UFix64 {
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
    
  	return  MonoswapFTPair.getAmountOut(        
		input_amount: amountIn,
		input_reserve: reserves[input_reserve_key]!,
		output_reserve: reserves[output_reserve_key]!
	)
}
