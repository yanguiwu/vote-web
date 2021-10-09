// 客户步骤完成状态枚举
export declare enum ICustomInfoStepStatus {
  process = 0 ,// 进行中
  done = 1// 已完成
}

// 客户状态枚举
export declare enum IcustomStep {
  intention = 1, // 意向客户
  meet = 2 ,// 见面&到店
  measureHouse = 3 ,// 量房
  deposit = 4, // 定金
  planeScheme = 5, // 平面方案
  designFee = 6, // 设计费&设计合同
  effectPic = 7 ,// 效果图
  productionDrawing = 8, // 施工图
  budget = 9, // 预算
  contract = 20,// 合同
}

// 客户步骤
export declare interface ICustomInfoStep {
  stepId: number,
  name: string,
  time?:string, // 角色ID
  status?: ICustomInfoStepStatus, // 0:进行中，1已完成
}

export declare interface ICustomserviceInfo {
  serviceId?: number,
  name?: string,
  serviceTeamId?:number, // 角色ID
  serviceTeamName?: string,
  type?: number,
}

// 客户列表返回
export declare interface IApicustomItem {
  id:number,
  stepId: IcustomStep,
  stepName: string, // 状态描述
  stepTime: string,
  
  regionCode:string ,// 
  regionCodeName:string,
  provinceCode: string,
  provinceCodeName: string,
  cityCode: string,
  cityCodeName: string,
  
  address: string, // 详细地址
  addressTitle: string, // 小区名称
  
  roomNumber:string, // 房号 号
  roomNumberBuilding:string, // 房号 栋
  roomNumberUnit:string, // 房号 单元
  
  houseTypeLayer:string,// 房屋 层
  houseTypeOffice:string,// 房屋 厅
  houseTypeRoom:string,// 房屋 室
  houseTypeWei:string,// 房屋 卫
  
  areaNum:string, // 面积
  
  latestFollowTime: string, // 最新一条的跟进记录时间
  latestFollowDetail: string, // 最新一条的跟进记录
  
  name: string, // 业主名称
  phone: string, // 联系方式
  
  houseType:string, // 房屋类型
  houseTypeName:string, // 房屋类型
  sourceId: string, // 来源
  sourceIdName: string, // 来源，
  
  serviceStaffNames: string, // 服务人员，多个逗号隔开
  serviceDepartmentNames: string, // 服务部门，多个逗号隔开
  
  intentionTime: string, // 意向时间
}

// 客户搜索入参
export declare interface IApiDepartmentCustomSearch {
  address?: string, // 请输入工程地址，例：尚海湾1-2-301
  name?: string // 业主
  phone?: string // 联系方式 
  provinceCode?: string
  cityCode?: string
  regionCode?:string 
  serviceDepartmentId?: string // 服务部门
  serviceStaffId?: string // 服务人员
  stepTimeId?: number
  stepStartTime?: string // 状态开始时间
  stepEndTime?: string // 状态结束时间
  stepId?:number,
  size?: number
  current?: number
}

// 客户详情返回
export declare interface IApiCustomInfo {
  id?:number,
  stepId?: IcustomStep,
  steps?: ICustomInfoStep[] | [], // [{stepId:xx,name: xxx,time: xxx, status: 0或1或没有该字段}]
  name?: string, // 业主名称
  phone?: string, // 联系方式
  
  regionCode?:string,
  regionCodeName?:string,
  provinceCode?: string,
  provinceCodeName?: string,
  cityCode?: string,
  cityCodeName?: string,
  
  address?: string, // 详细地址
  addressTitle?: string, // 小区名称
  areaNum?:string, // 面积
  
  roomNumber?:string, // 房号 号
  roomNumberBuilding?:string, // 房号 栋
  roomNumberUnit?:string, // 房号 单元
  
  houseTypeLayer?:string,// 房屋 层
  houseTypeOffice?:string,// 房屋 厅
  houseTypeRoom?:string,// 房屋 室
  houseTypeWei?:string,// 房屋 卫
  
  houseType?:string, // 房屋类型
  houseTypeDesc?:string, // 房屋类型
  sourceId?: string, // 来源
  sourceIdDesc?: string, // 来源，
  
  updateTime?: string, // 最后更新时间
  // 服务人员  如：[{name:xx,id: xx,roleId:xx(没有不返回该字段)，roleName：(没有不返回该字段)}]
  serviceStaff?: ICustomserviceInfo[] | [],  
  // 服务部门 如：[{name:xx,id: xx}]
  serviceDepartment?: ICustomserviceInfo[] | [],
  typeIds?: string
}

// 客户创建入参
export declare interface IApiCustomCreatePost {
  name: string, // 业主名称
  phone: string, // 联系方式
  
  regionCode:string,
  provinceCode: string,
  cityCode: string,
  
  address: string, // 详细地址
  addressTitle: string, // 小区名称
  areaNum:number | null, // 面积
  
  roomNumber:number | null, // 房号 号
  roomNumberBuilding:number | null, // 房号 栋
  roomNumberUnit:number | null, // 房号 单元
  
  houseTypeLayer:number | null,// 房屋 层
  houseTypeOffice:number | null,// 房屋 厅
  houseTypeRoom:number | null,// 房屋 室
  houseTypeWei:number | null,// 房屋 卫
  
  houseType:string, // 房屋类型
  sourceId: number | null, // 来源

  typeIds: string // 标签

  companyId: number
}
