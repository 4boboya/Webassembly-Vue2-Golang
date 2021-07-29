import { $priceCenterSite } from './http';
export const AdvData = async function (type) {
    const hotGameData = await $priceCenterSite('GET', '/adv/advertisingData', { query: type });
    return hotGameData;
}

