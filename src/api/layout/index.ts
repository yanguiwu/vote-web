import request from '/@/utils/request'
import { AxiosResponse } from 'axios'
import { IMenubarList } from '/@/type/store/layout'


const api = {
  login: '/login/backLogin',
  getUser: '/login/chooseUser',
  getUserList: '/login/queryUserList',
  chooseUser: '/login/chooseUser',
  getRouterList: '/User/getRoute',
  publickey: '/User/Publickey'
}

export interface loginParam {
    username: string,
    password: string
}

export function login(param: loginParam):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.login,
    method: 'post',
    data: param
  })
}

export function publickey():Promise<AxiosResponse<IResponse<string>>> {
  return request({
    url: api.publickey,
    method: 'get'
  })
}

interface IGetuserRes {
    name: string
    role: Array<string>
}

export function getUser(id:number): Promise<AxiosResponse<IResponse<IGetuserRes>>> {
  return request({
    url: api.getUser,
    method: 'get'
  })
}
export function getUserList(): Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.getUserList,
    method: 'get'
  })
}
export function chooseUser(id:number): Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.chooseUser,
    method: 'post',
    data: {
      userId: id
    }
  })
}
export function getRouterList(): Promise<AxiosResponse<IResponse<Array<IMenubarList>>>> {
  return request({
    url: api.getRouterList,
    method: 'get'
  })
}