export interface ResponseData {
    code: number;
    message: string;
    ok: boolean;
}
export interface UserData{
    id?: number;
    name: string;
    updateTime?: string;
    createTime?: string;
    username: string;
    password?: string;
    phone?: null | string;
    roleName?: string;
}
export type Records = UserData[];

export interface UserResponseData extends ResponseData { 
    data: {
        records: Records;
        total: number;
        size: number;
        current: number;
        pages: number
    }
}
export interface RoleData { 
    id?: number;
    roleName: string;
    remark: null;
    createTime?: string;
    updateTime?: string;
}
export type RolesRecords = RoleData[];
export interface AllRolesRessponseData extends ResponseData {
    data: {
        assignRoles: RolesRecords;
        allRolesList: RolesRecords;
    }
}
//分配角色的参数
export interface SetRoleData {
    roleIdList: number[];
    userId: number;
}