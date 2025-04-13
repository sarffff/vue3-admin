//登录接口需要携带参数
export interface LoginData {
    username: string
    password: string
}
interface dataType {
    token: string
}
//登录接口返回数据
export interface ResponseData { 
    code: number
    message: string,
    ok: boolean,
}
export interface LoginResponseData extends ResponseData {
    data: string
}
//服务器返回的用户信息
interface userInfo {
    name: string,
    avatar: string,
    roles: string[],
    buttons: string[],
    routes: string[],
}
interface user{
    checkUser: userInfo
}
export interface userResponseData extends ResponseData{
    data: user
}
