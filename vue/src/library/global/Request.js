import axios from 'axios';
import store from '@/store';
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

export default new class Request {
    Get(Params = {}, Api = '', ApiName = '', Config = {}) {
        return axios.get(`${store.state.Root.ApiUrl}/${Api != null ? `${Api}/` : ''}${ApiName}`,{params:Params}, Config);
    }
    Post(Params = {}, Api = '', ApiName = '', Config = {}) {
        return axios.post(`${store.state.Root.ApiUrl}/${Api}/${ApiName}`, JSON.stringify(Params), Config);
    }
    Put(Params = {}, Api = '', ApiName = '', Config = {}) {
        return axios.put(`${store.state.Root.ApiUrl}/${Api}/${ApiName}`, JSON.stringify(Params), Config);
    }
    Delete(Params = {}, Api = '', ApiName = '', Config = {}) {
        return axios.delete(`${store.state.Root.ApiUrl}/${Api}/${ApiName}`, JSON.stringify(Params), Config);
    }
}
