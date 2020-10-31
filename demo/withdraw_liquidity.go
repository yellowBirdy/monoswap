package main

import (
	"fmt"

	"github.com/onflow/cadence"
	"github.com/versus-flow/go-flow-tooling/tooling"
)


func ufix(input string) cadence.UFix64 {
	amount, err := cadence.NewUFix64(input)
	if err != nil {
		panic(err)
	}
	return amount
}

func main() {
	flow := tooling.NewFlowConfigLocalhost()

	var userInput string
	fmt.Println("Withdrawing Liquidity, specify amount:")
	fmt.Scanln(&userInput)
	var liquidityAmount = ufix(userInput)
	flow.SendTransactionWithArguments("withdraw_liquidity", "User1", liquidityAmount)

}
