import request from '@/utils/request'
import type { LoginData,LoginResponseData,userResponseData } from './type'
//统一管理接口

enum API {
    LOGIN_URL = '/admin/acl/index/login',
    USERINFO_URL = '/admin/acl/index/info',
    LOGOUT_URL = '/admin/acl/index/logout'
}

//暴露请求函数
//登录
export const reqLogin = (data: LoginData) => request.post<any,LoginResponseData>(API.LOGIN_URL, data)
//获取用户信息
export const reqUserInfo = () => request.get<any,userResponseData>(API.USERINFO_URL)
//退出登录
export const reqLogout = () => request.post<any,any>(API.LOGOUT_URL)