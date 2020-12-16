package main

import (
	"fmt"
	"io/ioutil"
	//"encoding/hex"
	"os"
	"github.com/joho/godotenv"
	//"github.com/onflow/cadence"
	"github.com/onflow/flow-go-sdk"
	"github.com/onflow/flow-go-sdk/client"
	"context"
	"google.golang.org/grpc"
	"github.com/onflow/flow-go-sdk/crypto"
	//"github.com/onflow/flow-go-sdk/templates"
)



//TODO
//1. install vaults on the exchange acc
//2. mint 42000 bitroot to the eX acc
//3. provide the initial liquidity from eX

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

	bitrootAddress := flow.HexToAddress(os.Getenv("BITROOT_ADD"))
	exchangeAddress := flow.HexToAddress(os.Getenv("MONOSWAP_ADD"))
	bitrootKeyIndex := 0
	bitrootAccount, err := flowClient.GetAccountAtLatestBlock(context.Background(), bitrootAddress)
	if err != nil {
		panic("failed to fetch bitroot account")
	}
	exchangeKeyIndex := 0
	exchangeAccount, err := flowClient.GetAccountAtLatestBlock(context.Background(), exchangeAddress)
	if err != nil {
	  panic("failed to fetch exchange account")
	}

  //
	//// Get the latest sequence number for this key
	bitrootSequenceNumber := bitrootAccount.Keys[bitrootKeyIndex].SequenceNumber
	exchangeSequenceNumber := exchangeAccount.Keys[exchangeKeyIndex].SequenceNumber

  //
	//payerAddress := flow.HexToAddress(os.Getenv("BITROOT_ADD"))
	//authorizerAddress1 := flow.HexToAddress(os.Getenv("BITROOT_ADD"))
	////--


	var exchangeKeyMeta = exchangeAccount.Keys[exchangeKeyIndex]
	var exchangePrivKeyString = os.Getenv("MONOSWAP_KEY")
	exchangePrivKey, err := crypto.DecodePrivateKeyHex(exchangeKeyMeta.SigAlgo, exchangePrivKeyString)
	if err != nil {
		panic("can't decode exchanges private key")
	}
	var exchangeSigner = crypto.NewInMemorySigner(exchangePrivKey, exchangeKeyMeta.HashAlgo)

	var bitrootKeyMeta = bitrootAccount.Keys[bitrootKeyIndex]
	var bitrootPrivKeyString = os.Getenv("BITROOT_KEY")
	bitrootPrivKey, err := crypto.DecodePrivateKeyHex(bitrootKeyMeta.SigAlgo, bitrootPrivKeyString)
	if err != nil {
		panic("can't decode exchanges private key")
	}
	var bitrootSigner = crypto.NewInMemorySigner(bitrootPrivKey, bitrootKeyMeta.HashAlgo)
	//
	//
	//1. INSTALL TX
	//BUILD TX

	install, err := ioutil.ReadFile("./transactions/install_all.cdc")
	if err != nil {
		panic("Could not read install trans file")
	}
	insntallTx := flow.NewTransaction()
	insntallTx.SetScript([]byte(install)).
		SetGasLimit(400).
	  	SetReferenceBlockID(latestBlock.ID).
		SetProposalKey(exchangeAddress, exchangeKeyIndex, exchangeSequenceNumber).
		SetPayer(exchangeAddress).
		AddAuthorizer(exchangeAddress)

	// SIGN TX
	
	err = insntallTx.SignEnvelope(exchangeAddress, exchangeKeyIndex, exchangeSigner)
	if err != nil {
	  panic("couldn't sign the install transaction")
	}

	err = flowClient.SendTransaction(context.Background(), *insntallTx)
  	if err != nil {
		fmt.Println(err)
		panic("failed to submit transaction")
	}
	
	fmt.Println("tx id")
	fmt.Println(insntallTx.ID())
	installResult, err := flowClient.GetTransactionResult(context.Background(), insntallTx.ID())
	if err != nil {
		panic("failed to get transaction result")
	}
	fmt.Println("TX result field names:")
	fmt.Printf("%+v\n", installResult)
	fmt.Printf("Transaction status: %s\n", installResult.Status)

		//2. MINT BTR TX
	//BUILD TX

	mint, err := ioutil.ReadFile("./transactions/mint_bitroot.cdc")
	if err != nil {
		panic("Could not read trans file")
	}
	mintTx := flow.NewTransaction()
	mintTx.SetScript([]byte(mint)).
		SetGasLimit(400).
	  	SetReferenceBlockID(latestBlock.ID).
		SetProposalKey(bitrootAddress, bitrootKeyIndex, bitrootSequenceNumber).
		SetPayer(bitrootAddress).
		AddAuthorizer(bitrootAddress)

	// SIGN TX

	err = mintTx.SignEnvelope(bitrootAddress, bitrootKeyIndex, bitrootSigner)
	if err != nil {
	  panic("couldn't sign the mint transaction")
	}

	err = flowClient.SendTransaction(context.Background(), *mintTx)
  	if err != nil {
		fmt.Println(err)
		panic("failed to submit transaction")
	}
	
	fmt.Println("tx id")
	fmt.Println(mintTx.ID())
	mintResult, err := flowClient.GetTransactionResult(context.Background(), mintTx.ID())
	if err != nil {
		panic("failed to get transaction result")
	}
	fmt.Println("TX result field names:")
	fmt.Printf("%+v\n", mintResult)
	fmt.Printf("Transaction status: %s\n", mintResult.Status)

		//3. ADD LIQUIDITY
	//BUILD TX

	add, err := ioutil.ReadFile("./transactions/add_liquidity.cdc")
	if err != nil {
		panic("Could not read add trans file")
	}
	addTx := flow.NewTransaction()
	addTx.SetScript([]byte(add)).
		SetGasLimit(400).
	  	SetReferenceBlockID(latestBlock.ID).
		SetProposalKey(exchangeAddress, exchangeKeyIndex, exchangeSequenceNumber + 1).
		SetPayer(exchangeAddress).
		AddAuthorizer(exchangeAddress)

	// SIGN TX
	
	err = addTx.SignEnvelope(exchangeAddress, exchangeKeyIndex, exchangeSigner)
	if err != nil {
	  panic("couldn't sign the add transaction")
	}

	err = flowClient.SendTransaction(context.Background(), *addTx)
  	if err != nil {
		fmt.Println(err)
		panic("failed to submit transaction")
	}
	
	fmt.Println("tx id")
	fmt.Println(addTx.ID())
	addResult, err := flowClient.GetTransactionResult(context.Background(), addTx.ID())
	if err != nil {
		panic("failed to get transaction result")
	}
	fmt.Println("TX result field names:")
	fmt.Printf("%+v\n", addResult)
	fmt.Printf("Transaction status: %s\n", addResult.Status)

	
}
