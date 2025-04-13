import request from "@/utils/request";
import type {
    AllRolesResponseData, RoleListData,
    AllPermissionResponseData
 } from "./type";
enum API{
    ALLROLES_URL = '/admin/acl/role/',
    ADDROLE_URL = '/admin/acl/role/save',
    UPDATEROLE_URL = '/admin/acl/role/update',
    ALLPERMISSIONS_URL = '/admin/acl/permission/toAssign/',
    SETPERMISSIONS_URL = '/admin/acl/permission/doAssign/?',
    DELETEROLE_URL = '/admin/acl/role/remove/',
}
//获取所有角色
export const reqGetAllRoles = (page: number, limit: number,roleName:string) => { 
    return request.get<any,AllRolesResponseData>(API.ALLROLES_URL + `${page}/${limit}/?roleName=${roleName}`)
}
//添加和更新角色
export const reqAddOrUpdateRole = (data: RoleListData) => { 
    if(data.id){
        return request.put<any, any>(API.UPDATEROLE_URL, data)
    }else{
        return request.post<any, any>(API.ADDROLE_URL, data)
    }
}
//获取所有权限
export const reqGetAllPermissions = (roleId: number) => { 
    return request.get<any, AllPermissionResponseData>(API.ALLPERMISSIONS_URL + roleId)
}
//设置权限
export const reqSetPermissions = (roleId: number,permissionsIds: number[]) => { 
    return request.post<any, any>(API.SETPERMISSIONS_URL + `roleId=${roleId}&permissionId=${permissionsIds}`)
}
//删除角色
export const reqDeleteRole = (roleId: number) => { 
    return request.delete<any, any>(API.DELETEROLE_URL + roleId)
}