import { $http } from './http';
import store from '@/store';
export const formusUpdateUsername = async function (account) {
    const formusUpdateUsernameRes = await $http(
        'POST',
        `${store.state.Root.ForumService}/custom-includes/Service/Router.php`,
        {
            body: {
                account,
                action: 'updateNickName'
            }
        }
    );
    return formusUpdateUsernameRes;
}

export const forumsRegister = async function (account) {
    const forumsRegisterResponse = await $http(
        'POST',
        `${store.state.Root.ForumService}/custom-includes/Service/Router.php`,
        {
            body: {
                account,
                action: 'Register'
            }
        }
    );
    return forumsRegisterResponse;
}

export const heartBeat = async function () {
    const forumsRegisterResponse = await $http(
        'GET',
        `${store.state.Root.ForumService}heart.php`,
    );
    return forumsRegisterResponse != null ? forumsRegisterResponse : false;
}
