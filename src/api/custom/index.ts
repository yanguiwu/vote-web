import request from '/@/utils/request'
import { AxiosResponse } from 'axios'
import { IApiCustomCreatePost, IApiCustomInfo, IApicustomItem } from '/@/type/store/custom/index'
import { IIntentionCreatePostData } from '/@/type/store/custom/meet'

const api = {
  customCreate: '/api/customer/add',
  customView: '/api/customer/view',
  customEdit: '/api/customer/edit',
  customMeet: '/api/customer/meet',
  customTeam: '/api/util/query-service-team',
  customEditServiceTeam: '/api/customer/edit-service-team',
  customDeleteServiceTeam: '/api/customer/delete-service-team'
}

export function customCreate(postData: IApiCustomCreatePost):Promise<AxiosResponse<IResponse<IApiCustomInfo>>> {
  return request({
    url: api.customCreate,
    method: 'post',
    data: postData
  })
}

export function customEdit(postData: IApiCustomCreatePost & {id: IApicustomItem['id']}):Promise<AxiosResponse<IResponse<IApiCustomInfo>>> {
  return request({
    url: api.customEdit,
    method: 'post',
    data: postData
  })
}

export function customView(customerId:number):Promise<AxiosResponse<IResponse<IApiCustomInfo>>> {
  return request({
    url: api.customView,
    method: 'post',
    data: {
      customerId
    }
  })
}

export function customMeet(postData: IIntentionCreatePostData):Promise<AxiosResponse<IResponse<IApiCustomInfo>>> {
  return request({
    url: api.customMeet,
    method: 'post',
    data: postData
  })
}

export function customTeam(id: number):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.customTeam,
    method: 'post',
    data: {
      id
    }
  })
}

export function customEditServiceTeam(postData: {
  serviceTeamId: number
  serviceId: number // 人员或部门ID
  customerId:number
  type: number
}):Promise<AxiosResponse<IResponse<IApiCustomInfo>>> {
  return request({
    url: api.customEditServiceTeam,
    method: 'post',
    data: postData
  })
}
export function customDeleteServiceTeam(postData: {
  serviceTeamId: number
  customerId:number
  type: number
}):Promise<AxiosResponse<IResponse<IApiCustomInfo>>> {
  return request({
    url: api.customDeleteServiceTeam,
    method: 'post',
    data: postData
  })
}




