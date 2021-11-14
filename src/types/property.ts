import { AxiosRequestConfig, AxiosPromise } from 'axios';

// 定义 $api 请求方法类的接口
interface $api {
    get(url: string, data?: any, config?: AxiosRequestConfig, cancelToken?: any): AxiosPromise;
    post(url: string, data?: any, config?: AxiosRequestConfig, cancelToken?: any): AxiosPromise;
}

// Vue 原型上添加的方法/属性，对其添加声明，让编辑器识别
declare module 'vue/types/vue' {
    interface Vue {
        $api: $api;
        NODE_ENV: string;
    }
}
