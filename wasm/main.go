package main

import (
	"encoding/json"
	"fmt"
	"strings"
	"syscall/js"
)

var jb = js.Global()

type PricesOdds struct {
	oddType string
	odd     float64
}
type Prices struct {
	main   bool
	odds   []PricesOdds
	spread string
}
type SiteOdds struct {
	Odd1    string `json:"odd1"`
	Odd2    string `json:"odd2"`
	OddType string `json:"oddType"`
	Spread  string `json:"spread"`
}
type Site struct {
	Odds []SiteOdds
}
type GameData struct {
	GameID     string `json:"gameID"`
	LiveUrl    string `json:"liveUrl"`
	MainGameID string `json:"mainGameID"`
	Score1     int    `json:"score1"`
	Score2     int    `json:"score2"`
	Team1      string `json:"team1"`
	Team2      string `json:"team2"`
	Time       string `json:"time"`
	Site       []Site
}

type HAOU struct {
	Main   bool   `json:"main"`
	Spread string `json:"spread"`
	Odds   []odds
}

type odds struct {
	OddType string  `json:"oddType"`
	Odd     float64 `json:"odd"`
}

func ProccessHA(this js.Value, haData []js.Value) interface{} {
	index := haData[0].Int()
	priceString := haData[3].String()
	gameDataString := haData[4].String()
	var priceStruct HAOU
	var gameDataStruct GameData
	json.Unmarshal([]byte(priceString), &priceStruct)
	json.Unmarshal([]byte(gameDataString), &gameDataStruct)

	oddIndex := -1
	if priceStruct.Spread != "1X2" {
		if priceStruct.Main {
			if strings.IndexAny(priceStruct.Spread, "-") != 0 {
				oddIndex = 0
				if gameDataStruct.Site[index].Odds[0].Spread != "-" {
					gameDataStruct.Site[index].Odds[2].Spread = gameDataStruct.Site[index].Odds[0].Spread
					gameDataStruct.Site[index].Odds[2].OddType = gameDataStruct.Site[index].Odds[0].OddType
				}
			} else {
				priceStruct.Spread = priceStruct.Spread[1:]
				oddIndex = 2
			}
			gameDataStruct.Site[index].Odds[oddIndex].OddType = "HA"
		}
	} else {
		oddIndex = 1
		gameDataStruct.Site[index].Odds[oddIndex].OddType = "1X2"
	}
	if oddIndex != -1 {
		for _, odd := range priceStruct.Odds {
			gameDataStruct = saveOdds(odd, gameDataStruct, index, oddIndex)
		}
		gameDataStruct.Site[index].Odds[oddIndex].Spread = priceStruct.Spread
	}
	resultJson, _ := json.Marshal(gameDataStruct)
	result := string(resultJson)
	fmt.Println(result)
	return result

	// oddIndex := 3
	// index := haData[0].Int()
	// price := haData[1]
	// priceMain := haData[1].Get("main").Bool()
	// priceSpread := haData[1].Get("spread").String()
	// priceOddsLength := haData[1].Get("odds").Length()
	// gameData := haData[2].Get("site").Index(index).Get("odds")
	// if priceSpread == "1X2" {
	// 	oddIndex = 1
	// 	gameData.Index(oddIndex).Set("oddType", "1X2")
	// } else {
	// 	if priceMain {
	// 		if strings.IndexAny(priceSpread, "-") != 0 {
	// 			oddIndex = 0
	// 			if gameData.Index(0).Get("spread").String() != "-" {
	// 				gameData.Index(2).Set("spread", gameData.Index(0).Get("spread"))
	// 				gameData.Index(2).Set("oddType", gameData.Index(0).Get("oddType"))
	// 			}
	// 		} else {
	// 			oddIndex = 2
	// 			price.Set("spread", priceSpread[1:])
	// 		}
	// 		gameData.Index(oddIndex).Set("oddType", "HA")
	// 	}
	// }
	// if oddIndex != 3 {
	// 	for i := 0; i < priceOddsLength; i++ {
	// 		gameData = saveOdd(price.Get("odds").Index(i), gameData, oddIndex)
	// 	}
	// 	gameData.Index(oddIndex).Set("spread", price.Get("spread"))
	// }
	// haData[2].Get("site").Index(index).Set("odds", gameData)
}

func saveOdds(odd odds, gameDataStruct GameData, index int, oddIndex int) GameData {
	oddData := "-"
	if odd.Odd != -1 {
		oddData = fmt.Sprint(odd.Odd)
	}
	if odd.OddType == "O" || odd.OddType == "H" {
		gameDataStruct.Site[index].Odds[oddIndex].Odd1 = oddData
	} else if odd.OddType == "U" || odd.OddType == "A" {
		gameDataStruct.Site[index].Odds[oddIndex].Odd2 = oddData
	}

	return gameDataStruct
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
	oddString := fmt.Sprint(odd.Get("odd").Float())
	if oddString != "-1" {
		oddData = oddString
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
