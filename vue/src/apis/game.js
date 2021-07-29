import { $priceCenterSite } from './http';
export const HotGame = async function () {
    const hotGameData = await $priceCenterSite('GET', '/game/hotgame', {});
    return hotGameData;
}

export const LiveGame = async function (requestData) {
    const liveGameData = await $priceCenterSite('GET', '/game/gamedata', {query: requestData});
    return liveGameData;
}

export const Result = async function (requestData) {
    const liveGameData = await $priceCenterSite('GET', '/game/gameresult', {query: requestData});
    return liveGameData;
}

export const LanguageMapping = async function (requestData) {
    const liveGameData = await $priceCenterSite('GET', '/game/getmorelang', {query: requestData});
    return liveGameData;
}

export const AllChannel = async function (){
    const channelData = await $priceCenterSite('GET', '/game/livechannel', {});
    return channelData;
}

export const SingleChannel = async function (requestData){
    const channelData = await $priceCenterSite('GET', '/game/singleChannel', {query: requestData});
    return channelData;
}

export const OnlyGameData = async function (requestData){
    const liveGameData = await $priceCenterSite('GET', '/game/onlygamedata', {query: requestData});
    return liveGameData;
}

export const ChatStatus = async function (){
    const chatStatus = await $priceCenterSite('GET', '/game/checkchat', {});
    return chatStatus;
}

