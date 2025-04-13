export interface ResponseData {
    code: number;
    message: string;
    ok: boolean;
}
//获取sku列表数据的ts类型
export interface skuAttrList {
    attrId: string | number
    valueId: string | number
    id?: number
    valueName?: string
}
export interface skuSaleAttrList {
    saleAttrId: string | number
    saleAttrValueId: string | number
    id?: number
    saleAttrValueName?: string
}
export interface skuImageList{
    id?: number
    imgName?: string
    imgUrl?: string
}
export interface SkuData {
    category3Id?: string | number
    spuId?: string | number
    tmId?: string | number
    skuName?: string
    price?: string | number
    weight?: string | number
    skuDesc?: string
    skuAttrValueList?: skuAttrList[]
    skuSaleAttrValueList?: skuSaleAttrList[]
    skuDefaultImg?: string
    isSale?: number
    id?: number
    skuImageList?: skuImageList[]
}
export interface SkuListResponseData extends ResponseData{
    data: {
        records: SkuData[],
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number,
        orders: [],
        optimizeCountSql: boolean,
        hitCount: boolean,
        countId: null,
        maxLimit: null
    }
}

export interface SkuInfoData extends ResponseData{
    data: SkuData
}