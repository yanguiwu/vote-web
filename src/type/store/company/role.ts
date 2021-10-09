export enum RoleStatus {
  online = 0,
  offline = 1
}

export interface IRoleInfo {
  id: number
  /** @description 姓名 */
  name: string
  /** @description 备注 */
  remark: string
}

export interface IRoleMember {
  id: number,
  /** @description 姓名 */
  name: string
  /** @description 手机号 */
  phone: string
  /** @description 部门 */
  department: string
  /** @description 性别 */
  gender: string
}

export interface IRoleMenusData {
  /** @description 名称 */
  role_id: number,
  /** @description 备注 */
  menu_code: string
}

export interface IPostRoleMenusData {
  /** @description 名称 */
  roleId: number,
  /** @description 备注 */
  menuCode: string
}

export interface IPostDataToCreateOrEdit {
  /** @description 名称 */
  name: string
  /** @description 备注 */
  remark: string
}

export interface RoleItem {
  /**
   * @description
   */
   id: number
   /**
    * @description 状态
    *
    * @enum 0 - 有效; 1 - 无效
    */
   status: RoleStatus
   // 名称
   name: string
   // 备注
   remark: string
}