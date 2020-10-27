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

type Balance struct {
	token   string
	balance float64
}

func decodeBalance(b []struct {
	token   string
	balance cadence.UFix64
}) []Balance {
	balances := []Balance{}
	for _, balance := range b {
		balances = append(balances, Balance{
			token:   balance.token,
			balance: float64(balance.balance),
		})
	}

	return balances
}

func main() {
	flow := tooling.NewFlowConfigLocalhost()

	fmt.Println("Getting status")
	fmt.Println("RESERVES")
	flow.RunScript("get_reserves")
	fmt.Println("TOTAL SUPPLY (LP TOKENS)")
	flow.RunScript("get_total_supply")

	fmt.Println("ACCOUNT BALANCES")
	flow.RunScript("get_account_balances", flow.FindAddress("User1"))

	//fmt.Println("Minting Flow")
	//flow.FindAddress(FauxFlow)
	//flow.SendTransactionWithArguments("mint_flow", "User1",)
}
