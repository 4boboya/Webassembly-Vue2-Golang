import { $priceCenterSite } from './http';
export const Login = async function (loginData) {   // login.vue (Done)
    const loginResult = await $priceCenterSite('POST', '/auth/login', { body: loginData });
    return loginResult;
}

export const TokenCheck = async function (tokenInfo) {   // Auth.js (Done)
    const tokenCheckResult = await $priceCenterSite('POST', '/auth/tokencheck', { body: tokenInfo });
    return tokenCheckResult;
}

export const ForgetPassword = async function (data) {   //ForgetPWD.vue (Done)
    const forgetPasswordResult = await $priceCenterSite('POST', '/auth/forgetpassword', { body: data });
    return forgetPasswordResult;
}

export const RequestPassword = async function (data) {   //RequestPWD.vue (Done)
    const requestPasswordResult = await $priceCenterSite('POST', '/auth/requestpassword', { body: data });
    return requestPasswordResult;
}

export const Register = async function (data) {   //Register.vue (Done)
    const registerResult = await $priceCenterSite('POST', '/auth/register', { body: data });
    return registerResult;
}

export const Validate = async function (data) {   //Validate.vue (Done)
    const validateResult = await $priceCenterSite('POST', '/auth/validate', { body: data });
    return validateResult;
}

export const UpdateUsername = async function (data) {   //Profile.vue (Done)
    const updateUsernameResult = await $priceCenterSite('POST', '/auth/updateusername', { body: data });
    return updateUsernameResult;
}

export const UpdatePassword = async function (data) {   //Profile.vue (Done)
    const updatePasswordResult = await $priceCenterSite('POST', '/auth/updatepassword', { body: data });
    return updatePasswordResult;
}

export const loginForSite = async function(data){
    const loginForSiteResult = await $priceCenterSite('POST', '/auth/loginforsite', { body: data });
    return loginForSiteResult;
}
