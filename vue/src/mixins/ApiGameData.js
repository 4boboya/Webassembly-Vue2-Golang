import { ComponentOptions } from 'vue';
import { WSConfig } from '@/config/library/WebSocketConfig';
import { mapState } from 'vuex';
import { Format, DateTime } from '@/library';
import * as GameApi from "@/apis/game";
import WSLive from '@/library/application/main/WSLive';
import WSHotGame from '@/library/application/main/WSHotGame';
import store from '@/store';
import GameData from '@/mixins/GameData';
import GameDataConfig from "@/config/components/GameData";
import { mapMutations } from "vuex";
/**
 * 這是Sample
 * @type ComponentOptions
 */

// on connection 01 39 17
// on frist msg 01 39 46
const ApiGameData = {
    data() {
        return {
        };
    },
    computed: {
    },
    methods: {
        ...mapMutations("WebSocket", [
            "updateLiveGameData",
            "updateSiteGameIDMapping",
        ]),
        proccessGameData(liveGameData, form = 'live') {
            const lang = this.LangMapping[this.Lang];
            let mapping = JSON.parse(
                localStorage.getItem(`langLiveMapping${this.GameType}`)
            );
            if (mapping != null && mapping != undefined) {
                mapping = mapping.mapping;
            } else {
                mapping = {};
            }
            // 遊戲資料 (沒聯盟)、 聯盟清單、 siteGame資料、 要存入vuex的GameData (含聯盟)
            let leagueList = [];
            let LiveSiteGameIDMapping = [];
            let LiveGameData = [];
            let { SiteList: siteList } = this;
            let InitialGameDataVaribles = (gameDataList) => {
                let gameData = {};
                gameData.status = this.GameTypeStatus[this.GameType];
                gameData.site = this.$format.DeConnection(GameDataConfig.SiteGameStructure);
                let { gameID, gameDate, gameTime, score1, score2, team1, team2, liveUrl } = gameDataList;
                gameData.time = `${gameDate} &nbsp;${gameTime}`;
                gameData.mainGameID = gameID;
                gameData.score1 = score1;
                gameData.score2 = score2;
                gameData.team1 = this.undefinedCheck(mapping, team1, lang) ? team1 : mapping[team1][lang];
                gameData.team2 = this.undefinedCheck(mapping, team2, lang) ? team2 : mapping[team2][lang];
                gameData.liveUrl = liveUrl;
                return gameData;
            };
            liveGameData.gameLiveDtos.forEach((gameDataList) => {
                if (gameDataList.gameStatus == "Final") {
                    return;
                }
                let gameData = InitialGameDataVaribles(gameDataList);
                let { league, siteGameDtos } = gameDataList;
                league =
                    this.undefinedCheck(mapping, league, lang) ? league : mapping[league][lang];
                let leagueIndex = leagueList.indexOf(league);
                if (leagueIndex == -1) {
                    //此gamedata的聯盟是否存在
                    leagueList.push(league);
                }
                let newLeagueIndex = leagueList.indexOf(league); //取得聯盟 index
                siteGameDtos.forEach((siteDataList) => {
                    let index = siteList.indexOf(siteDataList.site);
                    if (siteDataList.site == "bet365.com") {
                        gameData.gameID = siteDataList.gameID;
                    }
                    LiveSiteGameIDMapping[siteDataList.gameID] = {
                        LeagueID: newLeagueIndex,
                        gameID: gameData.gameID,
                    };
                    let spreadTypeHA =
                        gameDataList.gameStatus == "PreGame" ? "HA" : "RBHA";
                    let spreadTypeOU =
                        gameDataList.gameStatus == "PreGame" ? "OU" : "RBOU";
                    // proccess odds
                    siteDataList.odds.forEach((odds) => {
                        if (index == -1) return;
                        gameData.site[index].siteGameID = siteDataList.gameID;
                        odds.prices.forEach((prices) => {
                            var priceString = JSON.stringify(prices)
                            var gameDataString = JSON.stringify(gameData)
                            var goGameData = ''
                            if (odds.playMode == spreadTypeHA) {
                                goGameData = this.$go.ProccessHA(index, priceString, gameDataString, this.GameType)
                                if (goGameData != null) {
                                    gameData = JSON.parse(goGameData)
                                }
                                // gameData = this.proccessHA(index, prices, gameData);
                            } else if (odds.playMode == spreadTypeOU) {
                                goGameData = this.$go.ProccessOU(index, priceString, gameDataString, this.GameType)
                                if (goGameData != null) {
                                    gameData = JSON.parse(goGameData)
                                }
                                // gameData = this.proccessOU(index, prices, gameData);
                            }
                        });
                    });
                });
                if (leagueIndex != -1) {
                    LiveGameData[leagueIndex].gameData.push(gameData);
                } else {
                    LiveGameData.push({
                        league: league,
                        gameData: [gameData],
                    });
                }
            });
            this.updateLiveGameData(LiveGameData);
            this.updateSiteGameIDMapping(LiveSiteGameIDMapping);
        },
        // proccessHA(index, prices, gameData) {
        //     let oddsIndex;
        //     if (prices.spread != "1X2") {
        //         //撇出 1X2
        //         if (prices.main) {
        //             //找出 main 為 true的
        //             if (prices.spread.indexOf("-") != 0) {
        //                 //如果為正，就是主隊讓分，就存在0
        //                 oddsIndex = 0;
        //                 if (gameData.site[index].odds[0].spread != "-") {
        //                     // 如果0已經有值(OU)，就把OU丟到1，HA存0
        //                     gameData.site[index].odds[2].spread =
        //                         gameData.site[index].odds[0].spread;
        //                     gameData.site[index].odds[2].oddType =
        //                         gameData.site[index].odds[0].oddType;
        //                 }
        //             } else {
        //                 prices.spread = prices.spread.substring(1);
        //                 oddsIndex = 2;
        //             }
        //             gameData.site[index].odds[oddsIndex].oddType = "HA";
        //         }
        //     } else {
        //         // 1X2
        //         oddsIndex = 1;
        //         gameData.site[index].odds[oddsIndex].oddType = "1X2";
        //     }
        //     // 保存賠率
        //     if (oddsIndex != undefined) {
        //         prices.odds.forEach((odd) => {
        //             gameData = this.saveOdds(odd, gameData, index, oddsIndex);
        //         });
        //         gameData.site[index].odds[oddsIndex].spread = prices.spread;
        //     }
        //     return gameData;
        // },
        // proccessOU(index, prices, gameData) {
        //     //找出OU
        //     let oddsIndex = 2;
        //     if (prices.main) {
        //         if (gameData.site[index].odds[0].spread == "-") {
        //             // 如果0沒值(HA)，就存到0
        //             oddsIndex = 0;
        //         }
        //         prices.odds.forEach((odd) => {
        //             // 存入賠率
        //             gameData = this.saveOdds(odd, gameData, index, oddsIndex);
        //         });
        //         gameData.site[index].odds[oddsIndex].spread = `o${prices.spread}`;
        //         gameData.site[index].odds[oddsIndex].oddType = "OU";
        //     }
        //     return gameData;
        // },
        saveOdds(odd, gameData, index, oddsIndex) {
            let oddData = "-";
            if (odd.odd != -1) {
                oddData = odd.odd;
            }
            if (odd.oddType == "O" || odd.oddType == "H") {
                gameData.site[index].odds[oddsIndex].odd1 = oddData;
            } else if (odd.oddType == "U" || odd.oddType == "A") {
                gameData.site[index].odds[oddsIndex].odd2 = oddData;
            }
            return gameData;
        },
        async LanguageMapping(form, date = null) {
            if (date == null) date = DateTime.diff_f(0).replace(/-/gi, "")
            let localMapping = localStorage.getItem(`lang${form}Mapping`)
            if (!Format.NotNull(localMapping) || (localMapping.date != date || localMapping.gameType != store.state.Render.GameType)) {
                if (form == "Hot") {
                    this.gameTypeArr.forEach(async (type) => {
                        await this.GetLanguageMapping('Live', date, type)
                    })
                } else {
                    await this.GetLanguageMapping(form, date)
                }
            }
        },
        async GetLanguageMapping(form, date, gameType = store.state.Render.GameType) {
            const requestData = { gameType: gameType, date: date }
            const data = await GameApi.LanguageMapping(requestData);
            const mapping = await data != undefined && data.mapping != null ? data.mapping : {}
            localStorage.setItem(`lang${form}Mapping${gameType}`, JSON.stringify({ date: date, gameType: gameType, mapping: mapping }))
        },
        undefinedCheck(mapping, name, lang) {
            if (!this.$format.NotNull(mapping) || mapping.mapping[name] == undefined || mapping.mapping[name][lang] == undefined) {
                return true
            }
            return false
        }
    },
};
export default ApiGameData;
