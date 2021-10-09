export enum StaffStatus {
  online = 0,
  offline = 1,
  toAudit=2,
  reject = 3,
  pass= 4
}

export interface IStaffInfo {
  id: number,
  name: string
  /** @description 性别 */
  gender: string
  /** @description 手机号 */
  mobile: string
  /** @description 部门 */
  departmentId: string
  /** @description 部门 */
  departmentName: string
  /** @description 公司 */
  companyId: string
  /** @description 公司 */
  companyName: string
  /** @description 角色 */
  roleIds: string
  /** @description 角色 */
  roleNames: string
}

export interface StaffItem {
  /**
   * @description
   */
   id: number
   /**
    * @description 状态
    *
    * @enum 0 - 有效; 1 - 无效; 2 - 待审核; 3 - 驳回;  4 - 离职;
    */
   status: StaffStatus
   /** @description 名称 */
   userName: string
   /** @description 性别 */
   gender: string,
   /** @description 手机号 */
   mobile: string,
   /** @description 邀请人 */
   invitationName: string,
   /** @description 申请时间 */
   invitationTime: string,
   /** @description 部门 */
   departmentName: string,
}

export interface IPostDataToCreateOrEdit {
  name: string
  /** @description 性别 */
  gender: string,
  /** @description 手机号 */
  mobile: string,
  /** @description 部门 */
  departmentId: string,
  /** @description 公司 */
  companyId: string,
  /** @description 角色 */
  roleIds: string,
}