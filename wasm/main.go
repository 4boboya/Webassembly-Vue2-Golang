package main

import (
	"strconv"
	"strings"
	"syscall/js"
)

var jb = js.Global()

func ProccessHA(this js.Value, haData []js.Value) interface{} {
	oddIndex := 3
	index := haData[0].Int()
	price := haData[1]
	priceMain := haData[1].Get("main").Bool()
	priceSpread := haData[1].Get("spread").String()
	priceOddsLength := haData[1].Get("odds").Length()
	gameData := haData[2].Get("site").Index(index).Get("odds")
	if priceSpread == "1X2" {
		oddIndex = 1
		gameData.Index(oddIndex).Set("oddType", "1X2")
	} else {
		if priceMain {
			if strings.IndexAny(priceSpread, "-") != 0 {
				oddIndex = 0
				if gameData.Index(0).Get("spread").String() != "-" {
					gameData.Index(2).Set("spread", gameData.Index(0).Get("spread"))
					gameData.Index(2).Set("oddType", gameData.Index(0).Get("oddType"))
				}
			} else {
				oddIndex = 2
				price.Set("spread", priceSpread[1:])
			}
			gameData.Index(oddIndex).Set("oddType", "HA")
		}
	}
	if oddIndex != 3 {
		for i := 0; i < priceOddsLength; i++ {
			gameData = saveOdd(price.Get("odds").Index(i), gameData, oddIndex)
		}
		gameData.Index(oddIndex).Set("spread", price.Get("spread"))
	}
	haData[2].Get("site").Index(index).Set("odds", gameData)
	return haData[2]
}

func ProccessOU(this js.Value, haData []js.Value) interface{} {
	oddIndex := 2
	index := haData[0].Int()
	price := haData[1]
	priceMain := haData[1].Get("main").Bool()
	priceOddsLength := haData[1].Get("odds").Length()
	gameData := haData[2].Get("site").Index(index).Get("odds")
	if priceMain {
		if gameData.Index(0).Get("spread").String() == "-" {
			oddIndex = 0
		}
		for i := 0; i < priceOddsLength; i++ {
			gameData = saveOdd(price.Get("odds").Index(i), gameData, oddIndex)
		}
		gameData.Index(oddIndex).Set("spread", "o"+price.Get("spread").String())
		gameData.Index(oddIndex).Set("oddType", "OU")
	}
	haData[2].Get("site").Index(index).Set("odds", gameData)
	return haData[2]
}

func saveOdd(odd js.Value, gameData js.Value, oddsIndex int) js.Value {
	oddData := "-"
	if strconv.Itoa(odd.Get("odd").Int()) != "-1" {
		oddData = odd.Get("odd").String()
	}
	if odd.Get("oddType").String() == "O" || odd.Get("oddType").String() == "H" {
		gameData.Index(oddsIndex).Set("odd1", oddData)
	} else if odd.Get("oddType").String() == "U" || odd.Get("oddType").String() == "A" {
		gameData.Index(oddsIndex).Set("odd2", oddData)
	}
	return gameData
}

func main() {
	c := make(chan struct{}, 0)

	jb.Set("ProccessHA", js.FuncOf(ProccessHA))
	jb.Set("ProccessOU", js.FuncOf(ProccessOU))

	<-c
}
