import { $external } from './http';
import qs from 'qs';
export const discordTokenCheck = async (body, headers) => {
    return await $external("POST", "https://discord.com/api/oauth2/token", {body}, headers);

}

export const getDiscordAtMe = async (headers) => {
    return await $external("GET", "https://discord.com/api/users/@me", {}, headers);
}
