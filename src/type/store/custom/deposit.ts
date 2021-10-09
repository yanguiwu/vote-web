// 分期记录
export declare interface IInstallmentRecordItem {
  id: number,
  status: IDepositStatus,
  statusName: string,
  name: string // 款项名称
  percent: string // 分期比例
  totalMoney: number //  应收金额
  paidMoney: number //  应收金额,
  unPaidMoney: number // 剩余应收
}

// 资金流水
export declare interface IMoneyRecordItem {
  id: number, // 流水号
  typeName: string // 类型  收入，退款
  money: string // 金额
  recordTime: string // 发生时间
  playTypeName: string // 微信，支付宝 
  images: IImageItem[] // 附件
  createTime: string // 操作时间
}

// 定金状态
export declare enum IDepositStatus {
  undone = 0,// 未收款
  process = 1, // 收款中
  done = 2// 已收款
}

// 添加定金
export declare interface ICreatePostDeposit {
  money: number
}

// 定金详情
export declare interface IDepositInfo {
  id: number,
  money: number // 定金金额
  status: IDepositStatus
  statusName: string,
  billId: number // 账单编号
  installmentTypeId: number // 分期支付ID
  installmentTypeName: string // 分期支付name
  installmentRecord: IInstallmentRecordItem[], // 分期列表
  moneyRecord: IMoneyRecordItem[]
}

// 添加凭证收款
export declare interface IProofPayCreatePost {
  depositId: number, // 定金ID
  installmentRecordId: number, // 分期列表项目ID
  money: number // 金额
  recordTime: string // 发生时间
  images: IImageItem[] // 附件
}
