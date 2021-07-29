import { $priceCenterSite } from './http';
export const HeartBeat = async function() {
    // 10分鐘呼叫一次後端，確認伺服器存活
    // 若後端斷線則強制登出
    const response = await $priceCenterSite('GET', '/heart', {})
    return response;
};
