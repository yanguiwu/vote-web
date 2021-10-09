// 见面&到店
export enum IntentionType {
  normal = 0, // 普通跟进
  meet = 1 // 见面跟进
}

export declare interface IIntentionCreatePostData {
  type: IntentionType // 普通跟进 or 见面跟进
  placeId: number, // 见面地点， 取自系统配置,
  desc: string,
  images?: IImageItem[],
  customerId: number,
}

export declare interface IIntentionItem {
  type: IntentionType // 普通跟进 or 见面跟进
  typeName: string // 普通跟进 or 见面跟进
  placeId: number, // 见面地点， 取自系统配置,
  placeName: number, // 见面地点， 取自系统配置,
  desc: string,
  images: IImageItem[],
  createTime: string
}
