import request from '/@/utils/request'
import { AxiosResponse } from 'axios'
import { IPostDataToCreateOrEdit, ISubStatus } from '/@/type/store/company/subsidiary'

const api = {
  getSubList: '/api/company/query',
  getSubView: '/api/company/view',
  subAdd: '/api/company/add',
  subEdit: '/api/company/edit',
  editStatus:  '/api/company/editStatus'
}

export function getSubList(params?: {
	regionLevel?: string,
	regionCode?: string,
	name?: string
}):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.getSubList,
    method: 'post',
    data: params
  })
}

export function getSubView(id:number):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.getSubView,
    method: 'post',
    data: { id }
  })
}

export function subAdd(postData: IPostDataToCreateOrEdit):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.subAdd,
    method: 'post',
    data: postData
  })
}

export function subEdit(postData: IPostDataToCreateOrEdit & {id: number}):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.subEdit,
    method: 'post',
    data: postData
  })
}

export function editStatus(id:number, status:ISubStatus):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.editStatus,
    method: 'post',
    data: { id, status }
  })
}
