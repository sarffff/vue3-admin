export interface RespnseData { 
    code: number
    message: string
    ok: boolean
}
//获取所有角色返回值的ts类型
export interface RoleListData { 
    createTime?: string
    id?: number
    remark?: null
    roleName: string
    updateTime?: string
}
export type Rocords = RoleListData[]
export interface AllRolesResponseData extends RespnseData { 
    data: {
        records: Rocords
        total: number
    }
}

//获取所有权限返回值的ts类型
export interface PermissionData { 
    id?: number
    createTime?: string
    updateTime?: string
    name?: string
    pid?: number
    code?: string
    toCode?: string
    type?: number
    status?: null
    level?: number
    children?: PermissionData[]
    select?: boolean
}
export type PermissionList = PermissionData[]
export interface AllPermissionResponseData extends RespnseData { 
    data: PermissionList
}