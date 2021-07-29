import FingerPrintLibrary from "fingerprintjs2";
import store from "@/store";

export default new class Finger {
    async Create() {
        FingerPrintLibrary.get(function (components) {
            const values = components.map(function (component, index) {
                if (index === 0) {
                    // 去除網路資訊，避免因不同網路(如4G 5G Wifi等)造成區別
                    return component.value.replace(/\bNetType\/\w+\b/, "");
                }
                return component.value;
            });
            // 生成加密後id murmur
            const murmur = FingerPrintLibrary.x64hash128(values.join(""), 31);
            store.commit("Login/setUserFinger", murmur);
            return murmur;
        });
    }
}
