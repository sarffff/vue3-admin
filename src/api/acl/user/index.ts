import request from "@/utils/request";
import type {
    UserResponseData, UserData,
    AllRolesRessponseData,SetRoleData
} from "./type";
enum API{
    ALLUSER_URL = '/admin/acl/user',
    ADDUSER_URL = '/admin/acl/user/save',
    UPDATEUSER_URL = '/admin/acl/user/update',
    ALLROLES_URL = '/admin/acl/user/toAssign/',
    SETROLE_URL = '/admin/acl/user/doAssignRole',
    DELETEUSER_URL = '/admin/acl/user/remove/', //单个删除
    DELETEBATCHUSER_URL = '/admin/acl/user/batchRemove', //批量删除
}

//获取所有用户列表
export const reqAllUser = (page: number, limit: number,username:string) => {
    return request.get<any, UserResponseData>(API.ALLUSER_URL + `/${page}/${limit}/?username=${username}`)
}
//添加或者更新用户
export const reqHandleUser = (data: UserData) => {
    if (data.id != 0) { 
        return request.put<any, any>(API.UPDATEUSER_URL, data)
    }
    else {
        return request.post<any, any>(API.ADDUSER_URL, data)
    }
}
//获取角色
export const reqAllRoles = (id: number) => {
    return request.get<any, AllRolesRessponseData>(API.ALLROLES_URL + id)
}
//分配角色
export const reqSetRole = (data: SetRoleData) => {
    return request.post<any, any>(API.SETROLE_URL, data)
}
//删除用户
export const reqDeleteUser = (id: number) => {
    return request.delete<any, any>(API.DELETEUSER_URL + id)
}
//批量删除用户
export const reqDeleteBatchUser = (idlist: number[]) => {
    return request.delete<any, any>(API.DELETEBATCHUSER_URL, { data: idlist })
}