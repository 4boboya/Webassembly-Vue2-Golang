'use strict';

Date.prototype.dtFormat = function (fmt) {
    const o = {
        'M+': this.getMonth() + 1,  // 月份
        'd+': this.getDate(),       // 日
        'h+': this.getHours(),      // 小時
        'm+': this.getMinutes(),    // 分
        's+': this.getSeconds(),    // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3),    // 季度
        'S' : this.getMilliseconds()    // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    return fmt;
}

function makeid(length) {
    let result = '';
    let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

process.env.VUE_APP_VERSION = (new Date()).dtFormat('yyyyMMdd') + '-' + makeid(8);

const proxyPrefix = process.env.VUE_APP_PROXY_PREFIX || '/';
const proxyTarget = process.env.VUE_APP_PROXY_TARGET || '/';
// Vue.prototype.API =  process.env.NODE_ENV == 'production' ? '' : '';
module.exports = {
    productionSourceMap: false,
    publicPath : process.env.BASE_URL,
    devServer: {
        disableHostCheck: true,
        host: '0.0.0.0',
        port: 8000,
        // proxy: {
        //     [proxyPrefix]: {
        //         target: proxyTarget,
        //         pathRewrite: {
        //             ['^' + proxyPrefix]: ''
        //         },
        //         changeOrigin: true,
        //         headers: {
        //             'X-Forwarded-For': '',
        //         },
        //         // logLevel: 'debug',
        //     }
        // }
    }
};
