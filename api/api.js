import http from "./http.js";

// 首页
export const getBanner = (url,) => {
    return http('/api/getBanner')
 }