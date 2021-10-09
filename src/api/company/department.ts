import request from '/@/utils/request'
import { AxiosResponse } from 'axios'
import { DepartmentPostData, DepartmentStatus, DepartmentItem, DepartmentManagerStatus, IDepartmentManager } from '/@/type/store/company/department'

const api = {
  getDepartmentTree: '/api/department/query',
  departmentAdd: '/api/department/add',
  departmentEdit: '/api/department/edit',
  departmentView: '/api/department/view',
  departmentEditStatus: '/api/department/editStatus',
  departmentUpdateManage: '/api/department/update-manage'
}

function buildDepartmentTree(item:any) {
  const hasChild = item.depaSub && item.depaSub.length > 0
  return hasChild ? {
    id: item.id,
    label: item.name,
    companyName: item.companyName,
    children:  item.depaSub.map((i:any) => buildDepartmentTree(i)) 
  } : {
    id: item.id,
    label: item.name,
    companyName: item.companyName
  }
}

export function getDepartmentTree():Promise<any> {
  return request({
    url: api.getDepartmentTree,
    method: 'get'
  }).then((res) => {
    const _depaSub = res.data.body.depaSub
    return _depaSub.map((item:any) => buildDepartmentTree(item))
  })
}

export function departmentView(id:number):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.departmentView,
    method: 'post',
    data: { departmentId: id }
  })
}

export function departmentAdd(params:DepartmentPostData):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.departmentAdd,
    method: 'post',
    data: params
  })
}

export function departmentEdit(params:DepartmentPostData):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.departmentEdit,
    method: 'post',
    data: params
  })
}

export function departmentEditStatus(params:{
	id: DepartmentItem['id'],
	status: DepartmentStatus
}):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.departmentEditStatus,
    method: 'post',
    data: params
  })
}

export function departmentUpdateManage(params:{
  departmentId: DepartmentItem['id'],
  userId: IDepartmentManager['userId'],
  status: DepartmentManagerStatus
}):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.departmentUpdateManage,
    method: 'post',
    data: params
  })
}