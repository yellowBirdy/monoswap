package main

import (
	"fmt"
	"io/ioutil"
	//"log"
	//"path/filepath"
//
	"encoding/hex"
	"os"
	"github.com/joho/godotenv"
	//"github.com/enescakir/emoji"
	"github.com/onflow/cadence"
	//"flow-go-sdk"
	//"flow-go-sdk/client"
	//"flow-go-sdk/crypto"
	"github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/client"
	"github.com/onflow/flow-go-sdk/crypto"
	"context"
	"google.golang.org/grpc"

	//--
	//"github.com/onflow/flow-go-sdk/templates"
)


//const accessAPIHost = "access-001.devnet17.nodes.onflow.org:9000"

const deployTemplate =`
transaction(name: String, source: String) {
    prepare(acc: AuthAccount)
    {
        acc.contracts.add(name: name,  code: source.decodeHex())
        log("deployed contract")
	}
}
`



func main() {
	if os.Getenv("CHAIN") == "testnet" {
		godotenv.Load(".env")
	}else {
		godotenv.Load(".env.local")
	}

	accessAPIHost := os.Getenv("ACCESS_API_URI")
	// Establish a connection with an access node
	flowClient, err := client.New(accessAPIHost, grpc.WithInsecure())
	if err != nil {
	  panic("failed to establish connection with Access API")
	}
	latestBlock, err := flowClient.GetLatestBlockHeader(context.Background(), true)
	if err != nil {
		panic("failed to fetch latest block")
	}
	fmt.Println(latestBlock.ID)

	proposerAddress := flow.HexToAddress(os.Getenv("BITROOT_ADD"))
	proposerKeyIndex := 0
	proposerAccount, err := flowClient.GetAccountAtLatestBlock(context.Background(), proposerAddress)
	if err != nil {
	  panic("failed to fetch proposer account")
	}
	fmt.Println(proposerAccount.Address)

  //
	//// Get the latest sequence number for this key
	sequenceNumber := proposerAccount.Keys[proposerKeyIndex].SequenceNumber
  //
	payerAddress := flow.HexToAddress(os.Getenv("BITROOT_ADD"))
	authorizerAddress1 := flow.HexToAddress(os.Getenv("BITROOT_ADD"))
	////--
//
//
//
	
	//BUILD TX
	tx := flow.NewTransaction()
	tx.SetScript([]byte(deployTemplate)).
		SetGasLimit(400).
	  	SetReferenceBlockID(latestBlock.ID).
		SetProposalKey(proposerAddress, proposerKeyIndex, sequenceNumber).
		SetPayer(payerAddress).
		AddAuthorizer(authorizerAddress1)

	name := cadence.NewString("Bitroot")
	txt, err := ioutil.ReadFile("./contracts/bitroot.cdc")
	if err != nil {
		panic("Could not read contract file")
	}
	source := cadence.NewString(hex.EncodeToString([]byte(txt)))
	
	err = tx.AddArgument(name)
	if err != nil {
		panic("invalid argument")
	}
	err = tx.AddArgument(source)
	if err != nil {
		panic("invalid argument")
	}	
	

	// SIGN TX
	var keyMeta = proposerAccount.Keys[proposerKeyIndex]
	var privKeyString = os.Getenv("BITROOT_KEY")
	privKey, err := crypto.DecodePrivateKeyHex(keyMeta.SigAlgo, privKeyString)
	if err != nil {
		panic("can't decode the private key")
	}
	var signer = crypto.NewInMemorySigner(privKey, keyMeta.HashAlgo)
	err = tx.SignEnvelope(proposerAddress, proposerKeyIndex, signer)
	if err != nil {
	  panic("couldn't sign the transaction")
	}

	err = flowClient.SendTransaction(context.Background(), *tx)
  	if err != nil {
		fmt.Println(err)
		panic("failed to submit transaction")
	}
	
	fmt.Println("tx id")
	fmt.Println(tx.ID())
	result, err := flowClient.GetTransactionResult(context.Background(), tx.ID())
	if err != nil {
		panic("failed to get transaction result")
	}
	fmt.Println("TX result field names:")
	fmt.Printf("%+v\n", result)
	fmt.Printf("Transaction status: %s\n", result.Status)

	
	
}
