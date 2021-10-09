import request from '/@/utils/request'
import { AxiosResponse } from 'axios'
import { StaffStatus, StaffItem , IPostDataToCreateOrEdit } from '/@/type/store/company/staff'
const api = {
  getStaffList: '/api/staff/queryList',
  editStaff: '/api/staff/edit',
  auditStaff: '/api/staff/examineEdit',
  editStaffStatus: '/api/staff/editStatus',
  getStaffInfo: '/api/staff/view'
}

export function getStaffList(params?: {
	// 角色名称 模糊查询
  invitationName?: string,
  userName?: string,
  mobile?: string,
  departmentId?: number,
  status: number
}):Promise<AxiosResponse<IResponse<StaffItem[]>>> {
  return request({
    url: api.getStaffList,
    method: 'post',
    data: params
  })
}

export function editStaff(postData: IPostDataToCreateOrEdit & { id: StaffItem['id']}):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.editStaff,
    method: 'post',
    data: postData
  })
}

export function auditStaff(postData: IPostDataToCreateOrEdit & { id: StaffItem['id'], status: StaffStatus}):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.auditStaff,
    method: 'post',
    data: postData
  })
}

export function editStaffStatus(postData: { 
  id: StaffItem['id'],
  status: StaffStatus 
}):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.editStaffStatus,
    method: 'post',
    data: postData
  })
}

export function getStaffInfo(id: StaffItem['id']):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.getStaffInfo,
    method: 'post',
    data: { id }
  })
}