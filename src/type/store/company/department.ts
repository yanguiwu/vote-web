export enum DepartmentStatus {
    online = 0,
    offline = 1
}

export enum DepartmentManagerStatus {
    add = 1,
    remove = 2
}

export interface IDepartmentManager {
	userId: number,
	/** @description 姓名 */
	userName: string
	/** @description 手机号 */
	phone: string
	/** @description 部门 */
	department: string
	/** @description 性别 */
	gender: string
}

export interface DepartmentItem {
/**
 * @description
 */
	id: number
	/**
	 * @description 公司状态
	 *
	 * @enum 0 - 有效; 1 - 无效
	 */
	status: DepartmentStatus
	// 部门名称
	name: string
	// 父部门id
	departmentPid: number,
	depaSub: DepartmentItem[],
}
  
export interface DepartmentPostData {
	/** @description 部门名称 */
	name: string
	/** @description 所属分类 */
	sysType: string
	/** @description 所属公司 */
	companyId: string
	/** @description 所属部门，如果为1为根节点 */
	departmentPid: string
}

export interface IDepartmentInfo {
	id: number,
	// 部门名称
	name: string
	/** @description 所属分类 */
	sysType: string
	sysTypeName: string
	/** @description 所属公司 */
	companyId: string
	companyName: string
	/** @description 所属部门 */
	departmentPid: string,
	departmentPname: string,
	manage: IDepartmentManager[],
	status: DepartmentStatus
}