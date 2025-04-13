export interface ResponseData{
    code: number,
    message: string,
    ok:boolean
}

export interface CategoryObj {
    id: string | number,
    name: string,
    category1Id?: number,
    category2Id?: number
}

export interface CategoryResponseData extends ResponseData {
    data:CategoryObj[]
}

export interface AttrValue { 
    id?: number,
    valueName: string,
    attrId?: number,
    flag?: boolean
}
export type AtttList = AttrValue[]
export interface Attr {
    id?: number,
    attrName: string,
    categoryId: number|string,
    categoryLevel: number,
    attrValueList: AtttList
}
export interface AttrResponseData extends ResponseData {
    data: Attr[]
}
