export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

export interface trademark {
    id?: number,
    tmName: string,
    logoUrl: string
}

export type records = trademark[]

export interface trademarkResponseData extends ResponseData {
    data: {
        records: records,
        total: number
        size: number,
        current: number,
        searchCount: boolean,
        pages: number
    },
}
