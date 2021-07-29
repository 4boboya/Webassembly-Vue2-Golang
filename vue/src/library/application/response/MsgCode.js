import { List } from '@/config/library/MsgCode';
export default new class MsgCode {
    Type(code) {
        return this.MsgList[code];
    }
    Success(code) {
        return String(this.Type(String(code))) === 'Success';
    }
    Error(code) {
        return String(this.Type(String(code))) !== 'Success';
    }
    Wrong(code) {
        return String(this.Type(String(code))) === 'Wrong';
    }
    Defined(code, type) {
        this.MsgList[code] = type;
    }
    MsgList = List;
}
