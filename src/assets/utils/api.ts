import Vue from 'vue';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from 'element-ui';
import store from '@/store';
axios.interceptors.request.use(
    config => {
        if (config.method === 'post' && (!config.headers['Content-Type'])) {
            // config.data = qs.stringify(config.data);
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use((response: AxiosResponse): any => {
    const data = response.data;
    if (data.code === 401) {
        window.location.href = data.sso;
    }
    return response;
});
class Api {
    public install(): void {
        Vue.prototype.$api = {
            get: this.get,
            post: this.post,
            delete: this.delete,
            put: this.put
        };
    }
    // get 请求，config 跟 axios 参数配置一致
    private get(url: string, requestData?: any, config?: any, cancelToken?: any): AxiosPromise {
        return new Promise((resolve, reject) => {
            const option: AxiosRequestConfig = {
                url: url,
                method: 'get',
                params: requestData,
            }
            Object.assign(option, config);

            if (cancelToken) {
                Object.assign(option, {
                    cancelToken: cancelToken
                })
            }

            axios(option)
                .then(res => {
                    if (res.data.code == 3000) {
                        resolve(res.data.data);
                    } else {
                        if (res.data.msg) {
                            Message.error(res.data.msg);
                        }
                        store.commit('changeLoadingStatus', false);
                        reject(res.data);
                    }
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
    // post 请求，requestData、config 跟 axios 参数配置一致
    private post(url: string, requestData?: any, config?: AxiosRequestConfig): AxiosPromise {
        return new Promise((resolve, reject) => {
            axios
                .post(url, requestData, config)
                .then(res => {
                    if (res.data.code == 3000) {
                        resolve(res.data.data);
                    }  else {
                        if (res.data.msg) {
                            Message.error(res.data.msg);
                        }
                        store.commit('changeLoadingStatus', false);
                        reject(res.data);
                    }
                })
                .catch(e => {
                    console.log(e);
                    // 500 默认走 catch
                    reject(e);
                });
        });
    }

    private put(url: string, requestData?: any, config?: any, cancelToken?: any): AxiosPromise {
        return new Promise((resolve, reject) => {
            const option: AxiosRequestConfig = {
                url: url,
                method: 'put',
                params: requestData,
            }
            Object.assign(option, config);

            if (cancelToken) {
                Object.assign(option, {
                    cancelToken: cancelToken
                })
            }

            axios(option)
                .then(res => {
                    if (res.data.code == 3000) {
                        resolve(res.data.data);
                    } else {
                        if (res.data.msg) {
                            Message.error(res.data.msg);
                        }
                        store.commit('changeLoadingStatus', false);
                        reject(res.data);
                    }
                })
                .catch(e => {
                    reject(e);
                });
        });
    }

    private delete(url: string, requestData?: any, config?: any, cancelToken?: any): AxiosPromise {
        return new Promise((resolve, reject) => {
            const option: AxiosRequestConfig = {
                url: url,
                method: 'delete',
                params: requestData,
            }
            Object.assign(option, config);

            if (cancelToken) {
                Object.assign(option, {
                    cancelToken: cancelToken
                })
            }

            axios(option)
                .then(res => {
                    if (res.data.code == 3000) {
                        resolve(res.data.data);
                    }  else {
                        if (res.data.msg) {
                            Message.error(res.data.msg);
                        }
                        store.commit('changeLoadingStatus', false);
                        reject(res.data);
                    }
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
}

const apiTool = new Api();

export default apiTool;
