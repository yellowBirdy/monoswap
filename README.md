# Monoswap - a POC of AMM DEX for FLOW blockchain

# Deployed on the testnet 
Address: 56b4abe67bcb092d

[UI link](https://monoswap.herokuapp.com) feel free to check it out, onboarding is seemles:
you will be using an integrated wallet provided by blockto - so there is no need to install
browser extensions, the wallet subidises gas and the SWAP app will mint a small amount of Bitroot token into your wallet, so no need to visit any faucets.

## Dependencies

* `yarn install`
* `npm install -g @onflow/dev-wallet`

And flow CLI for Linux/MacOS
* `sh -ci "$(curl -fsSL https://storage.googleapis.com/flow-cli/install.sh)"`
and Win
* `iex "& { $(irm 'https://storage.googleapis.com/flow-cli/install.ps1') }"`

Dev wallet home: https://github.com/onflow/flow-js-sdk/tree/master/packages/dev-wallet

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Dev run

Following commands should be executed, each in separate terminal 

    yarn run flow:emulator
    yarn run flow:dev-wallet
    yarn start
    make

## Contents

There are currently two pages: 
* Sandbox: login / signin; installatioon of Vaults
* Swap: Swap and Liqudity Management    
