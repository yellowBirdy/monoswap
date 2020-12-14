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

	fmt.Println("Setting up user account")
	// fmt.Scanln()
	//flow.CreateAccount("User1")
	//flow.FindAddress("User1")
	flow.SendTransactionWithArguments("install_all", "User3")

	//fmt.Println("Minting Flow")
	//flow.FindAddress(FlowToken)
	//flow.SendTransactionWithArguments("mint_flow", "User1",)
}