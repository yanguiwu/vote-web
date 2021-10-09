import request from '/@/utils/request'
import { AxiosResponse } from 'axios'
import { IApiDepartmentCustomSearch, IApicustomItem } from '/@/type/store/custom/index'

const api = {
  getDepartmentCustomList: '/api/customer/query-list'
}

export function getDepartmentCustomList(postData?: IApiDepartmentCustomSearch):Promise<AxiosResponse<IResponse<ITable<IApicustomItem>>>> {
  return request({
    url: api.getDepartmentCustomList,
    method: 'post',
    data: postData
  })
}
