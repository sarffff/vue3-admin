import requset from '@/utils/request'
import type {trademarkResponseData,trademark} from './type'
enum API { 
    TRADEMARK_URL = '/admin/product/baseTrademark/',
    //添加品牌
    ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
    //修改品牌
    UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
    //删除品牌
    DELETETRADEMARK_URL = '/admin/product/baseTrademark/remove/'
}
//获取品牌
export const reqTradeMarkList = (page: number, limit: number) => requset.get<any, trademarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)

//添加和修改品牌
export const reqAddOrUpdateTradeMark = (data: trademark) => {
    if (data.id) {
        return requset.put(API.UPDATETRADEMARK_URL, data)
    } else {
        return requset.post(API.ADDTRADEMARK_URL, data)
    }
}
export const reqDeleteTradeMark = (id: number) => requset.delete(API.DELETETRADEMARK_URL + id)