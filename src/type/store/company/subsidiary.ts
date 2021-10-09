export interface IPostDataToCreateOrEdit {
  /** @description 公司名称 */
  name: string
  /** @description 公司简称 */
  shortName: string
  /** @description 法人 */
  legalPerson: string
  /** @description 手机号码 */
  phone: string
  /** @description 详细地址 */
  address: string
  /** @description 区划省份编码 */
  provinceCode: string
  /** @description 区划城市编码 */
  cityCode: string
  /** @description 区划地区编码 */
  regionCode: string
}

export enum ISubStatus {
  online = 0,
  offline = 1
}
