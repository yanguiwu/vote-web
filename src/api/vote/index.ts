import request from '/@/utils/request'
import { AxiosResponse } from 'axios'

const api = {
  createVote: '/vote/add',
  editVote: '/vote/edit',
  queryVoteList: '/vote/query-list',
  queryVote: '/vote/query',
  copyVote : '/vote/copy-vote',
  editStatus : '/vote/edit-status',
  voteLogQueryList: '/vote/vote-log-query-list'
}

export function createVote(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.createVote,
    method: 'post',
    data: postData
  })
}

export function editVote(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.editVote,
    method: 'post',
    data: postData
  })
}

export function editStatus(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.editStatus,
    method: 'post',
    data: postData
  })
}

export function copyVote(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.copyVote,
    method: 'post',
    data: postData
  })
}

export function queryVoteList(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.queryVoteList,
    method: 'post',
    data: postData
  })
}

export function queryVote(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.queryVote,
    method: 'post',
    data: postData
  })
}

export function voteLogQueryList(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.voteLogQueryList,
    method: 'post',
    data: postData
  })
}


