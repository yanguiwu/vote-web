import request from '/@/utils/request'
import { AxiosResponse } from 'axios'

const api = {
  createStore: '/sys/add-store',
  deleteStore: '/sys/delete-store',
  updateStoreP: '/sys/update-password',
  queryStoreList: '/sys/query-list',
  querySysInfo: '/store/query-sys-parameter',
  editSysInfo: '/store/edit-sys-parameter',
  addPayOrderList: '/store/add-pay-order-list',
  deletePayOrderList: '/store/delete-pay-order-list'
}

export function createStore(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.createStore,
    method: 'post',
    data: postData
  })
}

export function queryStoreList(postData?: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.queryStoreList,
    method: 'post',
    data: postData
  })
}

export function deleteStore(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.deleteStore,
    method: 'post',
    data: postData
  })
}

export function updateStoreP(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.updateStoreP,
    method: 'post',
    data: postData
  })
}
export function querySysInfo(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.querySysInfo,
    method: 'post',
    data: postData
  })
}
export function editSysInfo(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.editSysInfo,
    method: 'post',
    data: postData
  })
}
export function addPayOrderList(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.addPayOrderList,
    method: 'post',
    data: postData
  })
}
export function deletePayOrderList(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.deletePayOrderList,
    method: 'post',
    data: postData
  })
}