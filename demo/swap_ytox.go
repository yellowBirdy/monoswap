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

	fmt.Println("Swapping Liquidity")
	flow.SendTransactionWithArguments("swapYtoX", "User1", ufix("189.49"))

}