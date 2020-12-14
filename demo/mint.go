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

	fmt.Println("Minting Flow")
	flow.SendTransactionWithArguments("mint_flow", FlowToken, flow.FindAddress("User2"))

	fmt.Println("Minting Bitroot")
	flow.SendTransactionWithArguments("mint_bitroot", Bitroot, flow.FindAddress("User2"))
}
