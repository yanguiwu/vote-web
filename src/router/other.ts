import { IMenubarList } from '/@/type/store/layout'
import { components } from '/@/router/asyncRouter'

const Components:IObject<() => Promise<typeof import('*.vue')>> = Object.assign({}, components, {
  Layout: (() => import('/@/layout/index.vue')) as unknown as () => Promise<typeof import('*.vue')>,
  Redirect: (() => import('/@/layout/redirect.vue')) as unknown as () => Promise<typeof import('*.vue')>,
  LayoutBlank: (() => import('/@/layout/blank.vue')) as unknown as () => Promise<typeof import('*.vue')>
})

// 静态路由页面
export const otherRouter:Array<IMenubarList> = [
  {
    name: 'company',
    path: '/company',
    component: Components['Layout'],
    redirect: '/company/subsidiary',
    meta: { title: '投票活动', icon: 'el-icon-s-check' },
    children: [
      {
        name: 'subsidiary',
        path: '/company/subsidiary',
        component: () => import('/@/views/company/subsidiary.vue'),
        meta: { title: '概况', icon: 'el-icon-s-shop' }
      },
      {
        name: 'department',
        path: '/company/department',
        component: () => import('/@/views/company/department.vue'),
        meta: { title: '投票管理', icon: 'el-icon-s-finance' }
      },
    ]
  },{
    name: 'user',
    path: '/user',
    component: Components['Layout'],
    redirect: '/user/role',
    meta: { title: '用户管理', icon: 'el-icon-s-check' },
    children: [
      {
        name: 'userRole',
        path: '/user/role',
        component: () => import('/@/views/company/role.vue'),
        meta: { title: '角色管理', icon: 'el-icon-user-solid' }
      },
      {
        name: 'userStaff',
        path: '/user/staff',
        component: () => import('/@/views/company/staff.vue'),
        meta: { title: '员工管理', icon: 'el-icon-s-custom' }
      }
    ]
  }
]

export default otherRouter