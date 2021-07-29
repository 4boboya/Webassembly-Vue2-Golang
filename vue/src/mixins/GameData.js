import { ComponentOptions } from 'vue';
import { WSConfig } from '@/config/library/WebSocketConfig';
import { mapState } from 'vuex';
import { Format, DateTime } from '@/library';
import * as GameApi from "@/apis/game";
import WSLive from '@/library/application/main/WSLive';
import WSHotGame from '@/library/application/main/WSHotGame';
import store from '@/store';
/**
 * 這是Sample
 * @type ComponentOptions
 */

// on connection 01 39 17
// on frist msg 01 39 46
const WSProccessWithMain = {
    data() {
        return {
            LiveServer: null,
            HotGame: null,
            SiteList: [
                "twsl",
                "bet365.com",
                "bwin.com",
                "ku888",
                "betfair.com",
                "pinnacle.com",
            ],
            GameTypeStatus: {
                BK: { time: "", event: "", team: "", status: false },
                SC: { HYC: "", HRC: "", AYC: "", ARC: "", time: "", event: "", status: false },
                BS: { balls: "", striles: "", out: "", time: "", event: "", base: "", status: false },
            },
            LangMapping:{
              zhtw: "zh-TW",
              zhcn: "zh-CN",
              enus: "en-US",
              jajp: "ja-JP",
            },
            gameTypeArr : ['BK','SC','BS']
        };
    },
    computed: {
        ...mapState('WebSocket', ["LiveGameIDMapping"]),
        ...mapState('Render', ["GameType"])
    },
    methods: {
        SubscribeToLiveServer() {
            // this.LiveServer != null ? this.LiveServer.DeConnection() : null;
            this.LiveServer = new WSLive();
            this.LiveServer.ConnectHub(WSConfig.LiveServer, this.GameType);
            Object.defineProperty(WSLive, 'ResponseMsg', {
                set: function (res) {
                    WSProccessWithMain.methods.LiveServerCallBack(res);
                }
            })
        },
        LiveServerCallBack(msg) { // websocket on message
            if (msg == "Add group error ,gametype not support.") return;
            let GameTypeStatus = {
                BK: { time: "", event: "", team: "", status: false },
                SC: { HYC: "", HRC: "", AYC: "", ARC: "", time: "", event: "", status: false },
                BS: { balls: "", striles: "", out: "", time: "", event: "", base: "", status: false },
            };
            let GameTypeStatusMapping = {
                time: "Time",
                event: "Event",
                team: "Team",
                HYC: "Home Yellow Cards",
                HRC: "Home Red Cards",
                AYC: "Away Yellow Cards",
                ARC: "Away Red Cards",
                balls: "Balls",
                striles: "Striles",
                out: "Out",
                base: "Bases",
            };
            let LiveServerRes = JSON.parse(msg);
            const Proccess = new ProccessOddsData();
            if (LiveServerRes.SiteGames.length > 0) {
                LiveServerRes.SiteGames.forEach((siteGameObj) => {
                    if (store.state.WebSocket.LiveSiteGameIDMapping[siteGameObj.GameID] != undefined) {
                        let leagueID = store.state.WebSocket.LiveSiteGameIDMapping[siteGameObj.GameID].LeagueID //所在聯盟Index
                        // let MainGameID = store.state.WebSocket.LiveSiteGameIDMapping[siteGameObj.GameID].gameID;
                        // let GameIDIndex = store.state.WebSocket.LiveGameIDMapping[MainGameID].index;
                        let gameData = store.state.WebSocket.LiveGameData[leagueID].gameData;
                        gameData.forEach((subGameData, gameIndex) => {
                            let updateLiveGameData = store.state.WebSocket.LiveGameData;
                            if (subGameData.gameID == siteGameObj.GameID) {
                                if (siteGameObj.GameStatus == "InProgress") {
                                    // 依據球種定義 status
                                    subGameData.status = Format.DeConnection(GameTypeStatus)[siteGameObj.GameType];
                                    let statusKeys = Object.keys(subGameData.status);
                                    // 修改分數
                                    subGameData.score1 = siteGameObj.Score1;
                                    subGameData.score2 = siteGameObj.Score2;
                                    /* 處理PlayByPlay，Object Type => {Key: "Time", Value: "Q3 01:10"} */
                                    if (siteGameObj.PlayByPlay != null) {
                                        siteGameObj.PlayByPlay.forEach((playByPlayObject) => {
                                            if (playByPlayObject.Key == "Time") {
                                                if ((siteGameObj.Site == "bet365.com" || siteGameObj.Site == "ku888")) {
                                                    subGameData.time = playByPlayObject.Value;  // 時間以bet365、ku888為主
                                                } else {
                                                    subGameData.time = "Live";
                                                }
                                            }
                                            // 更新Status
                                            let falseStatus = 0;
                                            subGameData.status.status = true;
                                            statusKeys.forEach((statusKey) => {
                                                let responseStatusKey = GameTypeStatusMapping[statusKey];
                                                if (playByPlayObject.Key == responseStatusKey) {
                                                    subGameData.status[statusKey] = playByPlayObject.Value;
                                                    if (!Format.NotNull(playByPlayObject.Value)) falseStatus++;
                                                }
                                            })
                                            if (falseStatus == (statusKeys.length - 1)) subGameData.status.status = false;
                                        });
                                    }
                                } else if (siteGameObj.GameStatus == "PreGame") { // PreGame;
                                    subGameData.time = `${siteGameObj.GameDate} &nbsp;${siteGameObj.GameTime}`;
                                }
                                subGameData.site.forEach((siteObject, siteIndex)=>{
                                    let temp = siteObject.odds[0];
                                    if (siteObject.odds[2].oddType.includes("HA")){
                                        siteObject.odds[0] = siteObject.odds[2];
                                        siteObject.odds[0].spread = `-${siteObject.odds[0].spread}`
                                        siteObject.odds[2] = temp;
                                    }
                                })
                                siteGameObj.Odds.forEach((oddsObject) => {
                                    let odds = Proccess.Replace(oddsObject, siteGameObj.GameStatus);
                                    let site = siteGameObj.Site.toLowerCase();
                                    subGameData.site.forEach((siteObject, siteIndex) => {
                                        if (site.includes(siteObject.site.toLowerCase())) {
                                            if (odds[0].oddType != "") {
                                                subGameData.site[siteIndex].odds[0] = odds[0];
                                            }
                                            if (odds[1].oddType != "") {
                                                subGameData.site[siteIndex].odds[1] = odds[1];
                                            }
                                            if (odds[2].oddType != "") {
                                                subGameData.site[siteIndex].odds[2] = odds[2];
                                            }
                                        }
                                    });
                                })
                                subGameData.site.forEach((siteObject, siteIndex) => {
                                    let temp = siteObject.odds[2];
                                    if (siteObject.odds[0].oddType.includes("HA") && siteObject.odds[0].spread.indexOf("-") == 0) {
                                        siteObject.odds[0].spread = siteObject.odds[0].spread.substring(1)
                                        siteObject.odds[2] = siteObject.odds[0];
                                        siteObject.odds[0] = temp;
                                    }
                                });
                                updateLiveGameData[leagueID].gameData[gameIndex] = subGameData;
                                store.commit("WebSocket/updateLiveGameData", updateLiveGameData);
                            }
                            /* 處理賠率
                                Object Type =>
                                {
                                    PlayMode: "RBOU",
                                    Prices: [
                                        {
                                            Main: true,
                                            Odds: [{OddType: "1", ODD: 0.87}],
                                            OriginSpread: "-8.5",
                                            Spread: "-8.5",
                                            Suggest: false
                                        }
                                    ]
                                }
                            */
                        })
                    }
                })
            }
        },
        deSubscribeToLiveServer() {
            if (typeof this.LiveServer == 'object' && this.LiveServer !== null) {
                this.LiveServer.DeConnection();
            }
        },
        SubscribeToHotGame() {
            // this.LiveServer != null ? this.LiveServer.DeConnection() : null;
            this.HotGame = new WSHotGame();
            this.HotGame.ConnectHub(WSConfig.HotGame);
            Object.defineProperty(WSHotGame, 'ResponseMsg', {
                set: function (res) {
                    WSProccessWithMain.methods.HotGameCallBack(res);
                }
            })
        },
        HotGameCallBack(msg) { // websocket on message
            let HotGameRes = JSON.parse(msg);
            if (HotGameRes.SiteGames.length > 0) {
                HotGameRes.SiteGames.forEach((item, index) => {
                    if (store.state.WebSocket.HotGameIDMapping[item.GameID] != undefined) {
                        this.proccessHotGameResponse(item, store.state.WebSocket.HotGameIDMapping[item.GameID])
                    }
                })
            }
        },
        deSubscribeToHotGame() {
            if (typeof this.HotGame == 'object' && this.HotGame !== null) {
                this.HotGame.DeConnection();
            }
        },
        proccessHotGameResponse(data, GameID) {
            let updateHotGameData = store.state.WebSocket.HotGameData;
            // if (store.state.Render.GameType == "BK") {
            //     updateHotGameData[GameID].score = `${data.Score1} - ${data.Score2}`
            // } else {
            //     updateHotGameData[GameID].score = `${data.Score2} - ${data.Score1}`
            // }
            updateHotGameData[GameID].score = `${data.Score1} - ${data.Score2}`
            if (data.GameStatus == "InProgress") {
                data.PlayByPlay.forEach((playByPlay) => {
                    if (playByPlay.Key == 'Time') {
                        updateHotGameData[GameID].time = playByPlay.Value
                    }
                })
            } else if (data.GameStatus == "PreGame") {
                updateHotGameData[GameID].time = DateTime.Simplify(`${data.gameDate} ${data.gameTime}`)
            }
            store.commit('WebSocket/updateHotGameData', updateHotGameData);
        },
    },
    beforeDestroy() {
        this.deSubscribeToLiveServer();
    }
};
class ProccessOddsData {
    Replace(oddsObj, status) {
        let response = [
            { oddType: "", odd1: "-", odd2: "-", spread: "-" }, // HA
            { oddType: "", odd1: "-", odd2: "-", spread: "-" }, // 1X2
            { oddType: "", odd1: "-", odd2: "-", spread: "-" }, // OU
        ];
        let oddTypeIndex;
        oddsObj.Prices.forEach((priceObject) => {
            // let oddTypeIndex = oddsObj.PlayMode.includes("OU") ? 2 : priceObject.Spread == "1X2" ? 1 : 0
            if (oddsObj.PlayMode == "OU" || oddsObj.PlayMode == "RBOU") {
                oddTypeIndex = 2
            } else if (oddsObj.PlayMode == "HA" || oddsObj.PlayMode == "RBHA") {
                if (priceObject.Spread == "1X2") {
                    oddTypeIndex = 1
                } else {
                    oddTypeIndex = 0
                }
            } else {
                return;
            }
            // if (!Format.NotNull(priceObject.Odds[0].Odd) || priceObject.Odds[0].Odd == -1) priceObject.Odds[0].Odd = "-";
            // if (!Format.NotNull(priceObject.Odds[1].Odd) || priceObject.Odds[1].Odd == -1) priceObject.Odds[1].Odd = "-";
            if (priceObject.Main) {
                priceObject.Odds.forEach((odd, index) => {
                    if (!Format.NotNull(odd.Odd) || odd.Odd == -1) odd.Odd = "-";
                    if (oddTypeIndex == 1) {
                        response[oddTypeIndex].oddType = "1X2";
                        response[oddTypeIndex].spread = "1X2";
                        if (index == 0) {
                            response[oddTypeIndex].odd1 = odd.Odd
                        } else {
                            if (odd.OddType != "T") response[oddTypeIndex].odd2 = odd.Odd
                        }
                    } else {
                        response[oddTypeIndex].oddType = oddsObj.PlayMode;
                        response[oddTypeIndex].spread = oddsObj.PlayMode.includes("OU") ? `o${priceObject.Spread}` : priceObject.Spread;
                        if (index == 0) {
                            response[oddTypeIndex].odd1 = odd.Odd;
                        } else {
                            response[oddTypeIndex].odd2 = odd.Odd;
                        }
                    }
                })
                // if (priceObject.Spread == "1X2") {
                //     response[1].oddType = "1X2";
                //     response[1].odd1 = priceObject.Odds[0].Odd;
                //     response[1].odd2 = priceObject.Odds[1].OddType == "T" ? priceObject.Odds[2].Odd : priceObject.Odds[1].Odd;
                //     response[1].spread = "1X2";
                // } else {
                //     response[oddsObj.PlayMode.includes("OU") ? 2 : 0].oddType = oddsObj.PlayMode;
                //     response[oddsObj.PlayMode.includes("OU") ? 2 : 0].odd1 = priceObject.Odds[0].Odd;
                //     response[oddsObj.PlayMode.includes("OU") ? 2 : 0].odd2 = priceObject.Odds[1].Odd;
                //     response[oddsObj.PlayMode.includes("OU") ? 2 : 0].spread = oddsObj.PlayMode.includes("OU") ? `o${priceObject.Spread}` : priceObject.Spread;
                // }
            }
        });
        return response;
    }
}
export default WSProccessWithMain;
