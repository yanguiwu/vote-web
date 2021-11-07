import request from '/@/utils/request'
import { AxiosResponse } from 'axios'

const api = {
  createUser: '/store/add-user',
  deleteUser: '/store/update-user-status',
  queryUserList: '/store/query-user-list',
  UpdateUser: '/store/update-user'
}

export function createUser(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.createUser,
    method: 'post',
    data: postData
  })
}

export function UpdateUser(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.UpdateUser,
    method: 'post',
    data: postData
  })
}

export function deleteUser(postData?: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.deleteUser,
    method: 'post',
    data: postData
  })
}

export function queryUserList(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.queryUserList,
    method: 'post',
    data: postData
  })
}
