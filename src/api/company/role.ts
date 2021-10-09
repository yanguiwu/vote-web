import request from '/@/utils/request'
import { AxiosResponse } from 'axios'
import { IPostRoleMenusData, IPostDataToCreateOrEdit, RoleItem } from '/@/type/store/company/role'

const api = {
  getRoleList: '/api/sysRole/queryList',
  createRole: '/api/sysRole/add',
  editRole: '/api/sysRole/edit',
  getRoleMembers: '/api/sysRole/queryStaffList',
  getMenusByRoleId: '/api/sysRole/queryRoleSub',
  editRoleMenus: '/api/sysRole/addRoleSub'
}


export function getRoleList(postData?: {
  // 角色名称 模糊查询
  name: string
}):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.getRoleList,
    method: 'post',
    data: postData
  })
}

export function createRole(postData: IPostDataToCreateOrEdit):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.createRole,
    method: 'post',
    data: postData
  })
}

export function editRole(postData: IPostDataToCreateOrEdit & { id: RoleItem['id']}):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.editRole,
    method: 'post',
    data: postData
  })
}

export function getRoleMembers(roleId: RoleItem['id']):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.getRoleMembers,
    method: 'post',
    data: { roleId }
  })
}

export function getMenusByRoleId(roleId: RoleItem['id']):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.getMenusByRoleId,
    method: 'post',
    data: { roleId }
  })
}

export function editRoleMenus(postData: IPostRoleMenusData):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.editRoleMenus,
    method: 'post',
    data: postData
  })
}