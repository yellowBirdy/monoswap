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

//NB! start from root dir with makefile
func main() {
	flow := tooling.NewFlowConfigLocalhost()

	fmt.Println("Deploy contracts - press ENTER")
	fmt.Scanln()
	flow.DeployContract(Bitroot)
	flow.DeployContract(FlowToken)
	flow.DeployContract(Exchange)

	fmt.Println()
	fmt.Println()
	fmt.Println("Contracts successfully deployed!")

	fmt.Println("Setting up user account")
	// fmt.Scanln()
	flow.CreateAccount("User1")
	flow.SendTransactionWithArguments("install_all", "User1")
	fmt.Println("Minting Flow")
	flow.SendTransactionWithArguments("mint_flow", FlowToken, flow.FindAddress("User1"))

	fmt.Println("Minting Bitroot")
	flow.SendTransactionWithArguments("mint_bitroot", Bitroot, flow.FindAddress("User1"))

	//fmt.Println("Minting Flow")
	//flow.FindAddress(FlowToken)
	//flow.SendTransactionWithArguments("mint_flow", "User1",)
	// 	ufix("0.15"),      //cut percentage,
	// 	cadence.UInt64(5), //drop length
	// 	cadence.UInt64(5)) //minimumBlockRemainingAfterBidOrTie

	// fmt.Println()
	// fmt.Println()
	// fmt.Println("Create a drop in versus that is already started with 10 editions")
	// fmt.Scanln()
	// flow.CreateAccount(artist)
	// flow.SendTransactionWithArguments("setup/actor", artist, ufix("0.0"))
	// flow.SendTransactionWithArguments("setup/drop", marketplace,
	// 	flow.FindAddress(artist),          //marketplace locaion
	// 	ufix("10.01"),                     //start price
	// 	cadence.NewUInt64(11),             //start block
	// 	cadence.NewString("Vincent Kamp"), //artist name
	// 	cadence.NewString("when?"),        //name of art
	// 	cadence.NewString("https://instagram.fosl3-1.fna.fbcdn.net/v/t51.2885-15/e35/104280574_270973930649849_1688474937245466725_n.jpg?_nc_ht=instagram.fosl3-1.fna.fbcdn.net&_nc_cat=105&_nc_ohc=RbxHzbEtUKAAX_snGNw&oh=285144010b5a99883a1f28e73311b179&oe=5F6B948F"),
	// 	cadence.NewString("Here's a lockdown painting I did of a super cool guy and pal, @jburrowsactor"),
	// 	cadence.NewUInt64(10), //number of editions to use for the editioned auction
	// 	ufix("5.0"))           //minimum bid increment
	// flow.RunScript("get_active_auction", flow.FindAddress(marketplace))

	// fmt.Println()
	// fmt.Println()
	// fmt.Println("Setup a buyer and make him bid on the unique auction")
	// fmt.Scanln()
	// flow.CreateAccount(buyer1)
	// flow.SendTransactionWithArguments("setup/actor", buyer1, ufix("100.0")) //tokens to mint
	// auctionID := 1
	// amount := "10.01"
	// flow.SendTransactionWithArguments("buy/bid", buyer1,
	// 	flow.FindAddress(marketplace),
	// 	cadence.UInt64(1),         //id of drop
	// 	cadence.UInt64(auctionID), //id of auction to bid on
	// 	ufix(amount))              //amount to bid

	// fmt.Println()
	// fmt.Println()
	// fmt.Println("Go to website to bid there")
	// fmt.Scanln()
	// fmt.Println("Tick the clock to make the auction end and settle it")
	// fmt.Scanln()

	// flow.SendTransactionWithArguments("tick", marketplace, cadence.NewUInt64(1))
	// flow.SendTransactionWithArguments("tick", marketplace, cadence.NewUInt64(1))
	// flow.SendTransactionWithArguments("tick", marketplace, cadence.NewUInt64(1))
	// flow.SendTransactionWithArguments("tick", marketplace, cadence.NewUInt64(1))
	// flow.SendTransactionWithArguments("tick", marketplace, cadence.NewUInt64(1))
	// flow.SendTransactionWithArguments("buy/settle", marketplace, cadence.UInt64(1))

	// flow.RunScript("check_account", flow.FindAddress(buyer1), cadence.NewString("buyer1"))
	// flow.RunScript("check_account", flow.FindAddress(buyer2), cadence.NewString("buyer2"))
	// flow.RunScript("check_account", flow.FindAddress(artist), cadence.NewString("artist"))
	// flow.RunScript("check_account", flow.FindAddress(marketplace), cadence.NewString("marketplace"))
}
