package main

import (
	"encoding/json"
	"fmt"
	"strings"
	"syscall/js"
)

var jb = js.Global()

type SiteOdds struct {
	Odd1    string `json:"odd1"`
	Odd2    string `json:"odd2"`
	OddType string `json:"oddType"`
	Spread  string `json:"spread"`
}
type Site struct {
	Site       string     `json:"site"`
	SiteGameID string     `json:"siteGameId"`
	Odds       []SiteOdds `json:"odds"`
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
	Site       []Site `json:"site"`
}

type BKGameData struct {
	*GameData
	Status BKStatus `json:"status"`
}
type SCGameData struct {
	*GameData
	Status SCStatus `json:"status"`
}
type BSGameData struct {
	*GameData
	Status BSStatus `json:"status"`
}

type BKStatus struct {
	Time   string `json:"time"`
	Event  string `json:"event"`
	Team   string `json:"team"`
	Status bool   `json:"status"`
}
type SCStatus struct {
	HYC    string
	HRC    string
	AYC    string
	ARC    string
	Time   string `json:"time"`
	Event  string `json:"event"`
	Status bool   `json:"status"`
}
type BSStatus struct {
	Balls   string `json:"balls"`
	Striles string `json:"striles"`
	Out     string `json:"out"`
	Base    string `json:"base"`
	Time    string `json:"time"`
	Event   string `json:"event"`
	Status  bool   `json:"status"`
}

type HAOU struct {
	Main   bool   `json:"main"`
	Spread string `json:"spread"`
	Odds   []odds `json:"odds"`
}
type odds struct {
	OddType string  `json:"oddType"`
	Odd     float64 `json:"odd"`
}

func ProccessHA(this js.Value, haData []js.Value) interface{} {
	index := haData[0].Int()
	priceString := haData[1].String()
	gameDataString := haData[2].String()
	gameType := haData[3].String()
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

	resultStruct := resultStruct(gameDataStruct, gameType)

	if resultStruct != nil {
		resultJson, _ := json.Marshal(resultStruct)
		result := string(resultJson)
		return result
	} else {
		return resultStruct
	}
}

func ProccessOU(this js.Value, haData []js.Value) interface{} {
	index := haData[0].Int()
	priceString := haData[1].String()
	gameDataString := haData[2].String()
	gameType := haData[3].String()
	var priceStruct HAOU
	var gameDataStruct GameData
	json.Unmarshal([]byte(priceString), &priceStruct)
	json.Unmarshal([]byte(gameDataString), &gameDataStruct)

	oddIndex := 2
	if priceStruct.Main {
		if gameDataStruct.Site[index].Odds[0].Spread == "-" {
			oddIndex = 0
		}
		for _, odd := range priceStruct.Odds {
			gameDataStruct = saveOdds(odd, gameDataStruct, index, oddIndex)
		}
		gameDataStruct.Site[index].Odds[oddIndex].Spread = "o" + priceStruct.Spread
		gameDataStruct.Site[index].Odds[oddIndex].OddType = "OU"
	}

	resultStruct := resultStruct(gameDataStruct, gameType)

	if resultStruct != nil {
		resultJson, _ := json.Marshal(resultStruct)
		result := string(resultJson)
		return result
	} else {
		return resultStruct
	}
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

func resultStruct(gameDataStruct GameData, gameType string) interface{} {
	if gameType == "BK" {
		return BKGameData{
			GameData: &gameDataStruct,
		}
	} else if gameType == "SC" {
		return SCGameData{
			GameData: &gameDataStruct,
		}
	} else if gameType == "BS" {
		return BSGameData{
			GameData: &gameDataStruct,
		}
	} else {
		return nil
	}
}

func main() {
	c := make(chan struct{}, 0)
	jb.Set("ProccessHA", js.FuncOf(ProccessHA))
	jb.Set("ProccessOU", js.FuncOf(ProccessOU))

	<-c
}
