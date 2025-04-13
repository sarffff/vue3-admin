import request from "@/utils/request";
import type {
    SpuResponseData, SaleAttrResponseData, SpuImageResponseData,
    SpuSaleAttrResponseData,
    HasSaleAttrResponseData,
    SkuData,SkuInfoData
} from "./type";
enum API {
    GETSPU_URL = '/admin/product/',
    ALLTARDEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    IMAGE_URL = '/admin/product/spuImageList/',
    //获取spu属性
    SPUSALEATTR_URL = '/admin/product/spuSaleAttrList/',
    //获取全部销售属性
    ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
    //添加spu
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    //更新spu
    UPDATESPU_URL = '/admin/product/updateSpuInfo',
    ADDSKU_URL = '/admin/product/saveSkuInfo',
    SKUINFO_URL = '/admin/product/findBySpuId/',
    DELETESPU_URL = '/admin/product/deleteSpu/'
}

export const reqGetSpuList = (page: number, limit: number, category3Id: number | string) => {
    return request.get<any, SpuResponseData>(API.GETSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)
}

export const reqGetTrademarkList = () => {
    return request.get<any, SaleAttrResponseData>(API.ALLTARDEMARK_URL)
}
//获取spu图片列表
export const reqGetSpuImageList = (spuId: number) => request.get<any, SpuImageResponseData>(API.IMAGE_URL + spuId)

export const reqGetSpuSaleAttrList = (spuId: number) => request.get<any, SpuSaleAttrResponseData>(API.SPUSALEATTR_URL + spuId)

export const reqGetAllSaleAttrList = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

export const reqUpdateSpu = (data: any) => {
    if (data.id) {
        return request.post<any, any>(API.UPDATESPU_URL, data)
    } else {
        return request.post<any, any>(API.ADDSPU_URL, data)
    }
}

//添加sku
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.ADDSKU_URL, data)
//获取sku数据
export const reqSkuList = (spuId: number) => request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)
//删除spu
export const reqDeleteSpu = (spuId: number | string) => request.delete<any, any>(API.DELETESPU_URL + spuId)