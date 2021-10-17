import request from '/@/utils/request'
import { AxiosResponse } from 'axios'
import { IApiRegionCodeItem, IApiRegionCodeTreeItem ,ISysMenusItem } from '/@/type/store/utils'

const api = {
  getSysRegionCode: '/api/util/sysRegionCode',
  sysMenu: '/api/util/queryMenu',
  imageDelete : 'http://api.yanguiwu.com/vote-api/sys-file/img-delete'
}

function buildSysRegionCodeTree(data:IApiRegionCodeItem[]) {
  const idChildren: {
    [k in IApiRegionCodeItem['region_code']]?: IApiRegionCodeTreeItem[]
  } = {}
  const root = {
    key: '0',
    children: (idChildren['0'] = []),
    root: true
  };
  (data || []).forEach(item => {
    // 顶级节点 _code.parent_region 为 '',
    const p_id = item.parent_region || '0'

    if (!idChildren[p_id]) {
      idChildren[p_id] = []
    }

    const pChildren = idChildren[p_id]

    const _item = {
      data: item,
      id: item.region_code,
      label: item.region_name,
      parentId: p_id,
      children: (idChildren[item.region_code] = idChildren[item.region_code] || [])
    }

    pChildren?.push(_item)
  })
  return root
}

function buildSysMenuTree(menu: ISysMenusItem):IElementTree {
  const hasChild = menu.menuSub && menu.menuSub.length > 0
  return {
    id: menu.menuCode,
    label: menu.menuName,
    children: hasChild ? menu.menuSub.map(i => buildSysMenuTree(i)) : []
  }
}

export function getSysRegionCode():Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.getSysRegionCode,
    method: 'get'
  })
}

export function sysMenu():Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.sysMenu,
    method: 'get'
  })
}

export async function getSysRegionCodeTree():Promise<any> {
  return getSysRegionCode().then(res => {
    return [buildSysRegionCodeTree(res.data.body).children[0]]
  })
}

export async function getsysMenuTree():Promise<IElementTree[]> {
  return sysMenu().then(res => {
    const { body: { menuList = [] } } = res.data
    console.log('tree',menuList.map((item :ISysMenusItem) => buildSysMenuTree(item)))
    return menuList.map((item :ISysMenusItem) => buildSysMenuTree(item))
  })
}

export function imageDelete(postData: any):Promise<AxiosResponse<IResponse>> {
  return request({
    url: api.imageDelete,
    method: 'post',
    data: postData
  })
}