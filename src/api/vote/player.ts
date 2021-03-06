import request from '/@/utils/request'
import { AxiosResponse } from 'axios'

const api = {
  createPlayer: '/vote/sub-add ',
  editPlayer: '/vote/sub-edit',
  queryPlayerList: '/vote/sub-query-list',
  queryPlayer: '/vote/sub-query',
  editPlayerStatus : '/vote/sub-status-edit',
  playerTodayStar : '/vote/today-star',
  updateRandomTicket : '/vote/update-random-ticket'
  
}

export function createPlayer(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.createPlayer,
    method: 'post',
    data: postData
  })
}

export function editPlayer(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.editPlayer,
    method: 'post',
    data: postData
  })
}

export function queryPlayerList(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.queryPlayerList,
    method: 'post',
    data: postData
  })
}

export function queryPlayer(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.queryPlayer,
    method: 'post',
    data: postData
  })
}

export function editPlayerStatus(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.editPlayerStatus,
    method: 'post',
    data: postData
  })
}

export function playerTodayStar(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.playerTodayStar,
    method: 'post',
    data: postData
  })
}

export function updateRandomTicket(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.updateRandomTicket,
    method: 'post',
    data: postData
  })
}
