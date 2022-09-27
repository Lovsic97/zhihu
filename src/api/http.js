import axios from "axios";
import qs from 'qs';
import { isPlainObject } from '@/assets/utils';
import { Notify } from 'vant';
import md5 from 'blueimp-md5';

axios.defaults.baseURL = '';   //开发环境接口地址
axios.defaults.timeout = 60000;   // 设置超时时间，6秒

/**
 * 设置请求数据参数传递的格式，默认是json格式，但是在登录校验中后台一般设置请求格式：x-www-form-urlencoded(name=xxx&age=xxx)
 * 看服务器要求什么格式
 */
axios.defaults.transformRequest = data => {   //qs是第三方库，转换为x-www-form-urlencoded
    if (isPlainObject(data)) return qs.stringify(data);
    return data;
};

/**
 * 设置请求拦截器：----在项目中发请求（请求没有发出去）可以做一些事情
 * 客户端->[请求拦截器]->服务器端
 * token校验（JWT）：接收到服务器的token,存储到vuex/本地存储中，每次向服务器发送请求，我们应该把token带上
 * config :发起请求的请求配置项
 */
axios.interceptors.request.use(config => {
    // 针对于部分接口，我们携带令牌和签名信息
    let apiList = ['/check_login', '/user_info', '/user_update', '/store', '/store_remove', '/store_list'],
        token = localStorage.getItem('token');
    if (apiList.includes(config.url.replace('/api', '')) && token) {
        let time = +new Date(),
            sign = md5(`${token}@${time}@zhufeng`);
        config.headers['authorzation'] = token;
        config.headers['time'] = time;
        config.headers['sign'] = sign;
    }
    return config;
});

/**
 * 设置响应拦截器
 * 服务器端返回信息->[响应拦截器]->客户端js获取到信息
 * response中包含属性：
 * data：相应数据,status:响应状态码,statusText：响应状态信息,headers：响应头,config：响应提供的配置信息,request
 */
axios.interceptors.response.use(response => {
    return response.data;  //将主体内容返回  axios.get().then(result=>{拿到的就是响应主体})
}, reason => {
    Notify({
        type: 'danger',
        message: '小主,当前网络繁忙,请稍后再试!'
    });
    return Promise.reject(reason);
});
export default axios;