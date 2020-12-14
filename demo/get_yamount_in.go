package main

import (
	"fmt"

	"github.com/onflow/cadence"
	"github.com/versus-flow/go-flow-tooling/tooling"
)

const Bitroot = "Bitroot"
const FlowToken = "FlowToken"
const Exchange = "Exchange"

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
	fmt.Println("input amount you wanna get out: ")
	fmt.Scanln(&userInput)
	 
	amountXOut := ufix(userInput)
	fmt.Println("Getting amount In for", amountXOut)
	flow.RunScript("get_y_amount_in", amountXOut)


}