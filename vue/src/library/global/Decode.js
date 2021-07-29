import Zlib from "zlib";

export const Decode = new class {
    async DeCompress(message) {
        //Step1.解Base64編碼
        let strData = atob(message);
        //Step2.將base64字串切割為binnary array
        let charData = strData.split('').map((x) => { return x.charCodeAt(0); });
        let binData = new Uint8Array(charData);
        //Step3.前四碼為壓縮前的字串長度,可忽略.
        binData = binData.slice(4);
        try {
            // 解壓縮並decode成字串
            await Zlib.gunzip(binData, async function (e, b) {
                let msg = b.toString('utf8');
                console.log(msg);
                return msg;
            });
        } catch (error) {
            return null;
        }
    }
}