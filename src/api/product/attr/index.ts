import request from "@/utils/request";
import type { CategoryResponseData,AttrResponseData,Attr } from "./type";
enum API {
    C1_URL = '/admin/product/getCategory1',
    C2_URL = '/admin/product/getCategory2/',
    C3_URL = '/admin/product/getCategory3/',
    ALLCATEGORY_URL = '/admin/product/attrInfoList/',
    ADDATTR_URL = '/admin/product/saveAttrInfo',
    DELETEATTR_URL = '/admin/product/deleteAttr/',
}

//获取一级分类
export const reqGetCfirst = () => request.get<any,CategoryResponseData>(API.C1_URL)
//获取二级分类
export const reqGetCsecond = (category1Id:number | string) => request.get<any,CategoryResponseData>(API.C2_URL + category1Id)
//获取三级分类
export const reqGetCthird = (category2Id: number | string) => request.get<any, CategoryResponseData>(API.C3_URL + category2Id)
//获取属性列表
export const reqGetInfoList = (category1Id: number | string, category2Id: number | string, category3Id: number | string) => {
    return request.get<any, AttrResponseData>(API.ALLCATEGORY_URL + `${category1Id}/${category2Id}/${category3Id}`)
}
//新增属性
export const reqAddAttr = (data: Attr) => request.post<any, any>(API.ADDATTR_URL, data)
//删除属性
export const reqDeleteAttr = (attrId: number) => request.delete<any, any>(API.DELETEATTR_URL + attrId)

