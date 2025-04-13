export interface ResponseData {
    code: number
    message: string
    ok: boolean
}

export interface SpuData {
    id?: number
    spuName: string
    description: string
    category3Id: number | string
    tmId?: number | string
    spuSaleAttrList?: null | SpuSaleAttr[]
    spuImageList?: null | SpuImage[]
}
export type records = SpuData[]
export interface SpuResponseData extends ResponseData {
    data: {
        records: records
        total: number
        size: number
        current: number
        searchCount: boolean
        pages: number
    }
}
export interface Trademark {
    id: number
    logoUrl: string
    tmName: string
}
export interface SaleAttrResponseData extends ResponseData {
    data: Trademark[]
}
export interface SpuImage {
    id?: number
    createTime?: string
    updateTime?: string
    imgName?: string
    imgUrl?: string
    spuId?: number
    name?: string
    url?: string
}
export interface SpuImageResponseData extends ResponseData {
    data: SpuImage[]
}
//已有销售属性对象
export interface SaleAttr {
    id?: number
    createTime?: string
    updateTime?: string
    spuId?: number
    baseSaleAttrId: number | string
    saleAttrName?: string
    saleAttrValueName?: string
    isChecked?: null
}
export type spuSaleAttrValueList = SaleAttr[]
//销售属性对象
export interface SpuSaleAttr {
    id?: number
    createTime?: null
    updateTime?: null
    spuId?: number
    baseSaleAttrId: number
    saleAttrName: string
    spuSaleAttrValueList: spuSaleAttrValueList
    flag?: boolean
    saleAttrInputValue?: string
}
export interface SpuSaleAttrResponseData extends ResponseData {
    data: SpuSaleAttr[]
}
export interface HasSaleAttr {
    id: number
    name: string
}
export interface HasSaleAttrResponseData extends ResponseData {
    data: HasSaleAttr[]
}
export interface skuAttrList {
    attrId: string | number
    valueId: string | number
}
export interface skuSaleAttrList {
    saleAttrId: string | number
    saleAttrValueId: string | number
}
export interface SkuData {
    category3Id: string | number
    spuId: string | number
    tmId: string | number
    skuName: string
    price: string | number
    weight: string | number
    skuDesc: string
    skuAttrValueList: skuAttrList[]
    skuSaleAttrValueList: skuSaleAttrList[]
    skuDefaultImg: string
}

export interface SkuInfoData extends ResponseData {
    data: SkuData[]
}