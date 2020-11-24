all: demo

.PHONY: demo
demo:
	go run ./demo/main.go
	go run ./demo/add_liquidity.go

