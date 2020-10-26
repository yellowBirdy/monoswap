package main

import (
	"fmt"

	"github.com/onflow/cadence"
	"github.com/versus-flow/go-flow-tooling/tooling"
)

const Bitroot = "Bitroot"
const FauxFlow = "FauxFlow"
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
	//flow.FindAddress(FauxFlow)
	flow.SendTransactionWithArguments("mint_flow", FauxFlow, flow.FindAddress("User1"))

	fmt.Println("Minting Bitroot")
	//flow.FindAddress(Bitroot)
	flow.SendTransactionWithArguments("mint_bitroot", Bitroot, flow.FindAddress("User1"))
}
