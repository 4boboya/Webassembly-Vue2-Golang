import axios from 'axios';
import qs from 'qs';
import { allowedMethods, timeoutSec, headers, apiUrl, formDataHeaders } from '@/config/library/http.js';
const priceCenterAjax = axios.create({
    baseURL: apiUrl,
    headers: headers,
    timeout: timeoutSec * 1000
});
const httpAjax = axios.create({
    baseURL: '',
    headers: formDataHeaders,
    timeout: timeoutSec * 1000
});
let externalAjax = {};
/**
 * HTTP請求
 * @param {string} method 請求方法
 * @param {string} url 請求路由
 * @param {object} payload 請求資料
 */
export async function $external(method, url, payload = {}, headers = {}) {
    externalAjax = axios.create({
        baseURL: '',
        headers,
        timeout: timeoutSec * 1000
    });
    if (allowedMethods.indexOf(method) < 0) {
        throw new Error(`Not Allowed Method: '${ method }'`);
    }
    try {
        const response = await externalAjax.request({
            url,
            method,
            data  : payload.body || null,
            params: payload.query || null,
        });
        return response.data;
    } catch (err) {
        // window.location.assign('/error')
        // router.push('error')
    }
}

export async function $priceCenterSite(method, url, payload = {}) {
    if (allowedMethods.indexOf(method) < 0) {
        throw new Error(`Not Allowed Method: '${ method }'`);
    }
    try {
        const response = await priceCenterAjax.request({
            url,
            method,
            data  : payload.body || null,
            params: payload.query || null,
        });
        return response.data;
    } catch (err) {
        // window.location.assign('/error')
        // router.push('error')
    }
}

export async function $http(method, url, payload = {}) {
    if (allowedMethods.indexOf(method) < 0) {
        throw new Error(`Not Allowed Method: '${ method }'`);
    }
    try {
        const response = await httpAjax.request({
            url,
            method,
            data  : qs.stringify(payload.body),
            params: payload.query,
        });
        return response.data;
    } catch (err) {
        return null;
    }
}
