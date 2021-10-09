export declare interface ICreatePostToDoList {
  userId: number // 执行人
  deadline: string // 截止时间
  desc: string // 事件详情
}

export declare enum IDoListStatus {
  process = 0 ,// 进行中
  done = 1// 已完成
}

export declare interface IEditPostToDoList {
  id: number, // 
  userId: number // 执行人
  deadline: string // 截止时间
  desc: string // 事件详情
  status: IDoListStatus // 状态
}

export declare interface IToDoListItem {
  id?: number, // 
  userId?: number // 执行人
  deadline?: string // 截止时间
  desc?: string // 事件详情
  status?: IDoListStatus // 状态
  statusName?: string // 状态
}


