export interface IApiRegionCodeItem {
  region_level: string
  region_name: string
  parent_region: string
  region_code: string
}

export interface IApiRegionCodeTreeItem {
  data: IApiRegionCodeItem,
  id: IApiRegionCodeItem['region_code'],
  label: IApiRegionCodeItem['region_name'],
  parentId:IApiRegionCodeItem['parent_region'],
  children: IApiRegionCodeTreeItem[]
}

export interface ISysMenusItem {
  menuCode: string,
  menuName: string,
  menuSub: ISysMenusItem[]
}

// 分期支付类型
export declare interface IInstallmentType {
  id: number,
  name: string,
}