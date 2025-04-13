import request from "@/utils/request";
import type { AllPermissionResponseData ,MenuParams} from "./type";
enum API{
    ALLPERMISSIONS_URL = '/admin/acl/permission',
    ADDPERMISSION_URL = '/admin/acl/permission/save',
    UPDATEPERMISSION_URL = '/admin/acl/permission/update',
    DELETEPERMISSION_URL = '/admin/acl/permission/remove/',
}
//获取所有权限列表
export const reqAllPermissions = () => request.get<any, AllPermissionResponseData>(API.ALLPERMISSIONS_URL)
//添加权限
export const reqAddPermission = (data: MenuParams) => request.post<any, any>(API.ADDPERMISSION_URL, data)
//修改权限
export const reqUpdatePermission = (data: MenuParams) => request.put<any, any>(API.UPDATEPERMISSION_URL, data)
//删除权限
export const reqDeletePermission = (id: number) => request.delete<any, any>(API.DELETEPERMISSION_URL + id)