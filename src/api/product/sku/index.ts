import request from "@/utils/request";
import type {SkuListResponseData,SkuInfoData} from "./type"
enum API {
    SKU_URL = "/admin/product/list/",
    ONSALE_URL = "/admin/product/onSale/", //上架
    OFFSALE_URL = "/admin/product/cancelSale/", //下架
    GETSKUINFO_URL = "/admin/product/getSkuInfo/",
    DELETESKU_URL = "/admin/product/deleteSku/"
}
//获取sku列表
export const reqSkuList = (page: number, limit: number) => request.get<any, SkuListResponseData>(API.SKU_URL + `${page}/${limit}`)
//上架
export const reqOnSale = (skuId: number) => request.get<any, any>(API.ONSALE_URL + skuId)
//下架  
export const reqOffSale = (skuId: number) => request.get<any, any>(API.OFFSALE_URL + skuId)
//获取sku详情
export const reqGetSkuInfo = (skuId: number) => request.get<any, SkuInfoData>(API.GETSKUINFO_URL + skuId)
//删除sku
export const reqDeleteSku = (skuId: number) => request.delete<any, any>(API.DELETESKU_URL + skuId)





