package main

import (
	"fmt"
	"strings"
	"syscall/js"
)

var jb = js.Global()

func ProccessHA(this js.Value, haData []js.Value) interface{} {
	var oddIndex int
	index := haData[0].Int()
	priceMain := haData[1].Get("main").Bool()
	priceSpread := haData[1].Get("spread").String()
	priceOdds := haData[1].Get("odds")
	priceOddsLength := priceOdds.Length()
	gameData := haData[2].Get("site").Index(index).Get("odds")
	if priceSpread == "1X2" {
		oddIndex = 1
		gameData.Index(oddIndex).Set("oddType", "1X2")
	} else {
		if priceMain {
			if strings.IndexAny(priceSpread, "-") != -1 {

			}
		}
	}
	for i := 0; i < priceOddsLength; i++ {
		fmt.Println(priceOdds.Index(i).Get("oddType"))
	}
	fmt.Println(index)
	fmt.Println(priceMain)
	fmt.Println(priceOddsLength)
	fmt.Println(gameData.Index(oddIndex).Get("oddType"))
	return nil
}

func main() {
	c := make(chan struct{}, 0)

	jb.Set("ProccessHA", js.FuncOf(ProccessHA))

	<-c
}
