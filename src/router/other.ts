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
    name: 'vote',
    path: '/vote',
    component: Components['Layout'],
    redirect: '/vote/list',
    meta: { title: '投票活动', icon: 'el-icon-s-check' },
    children: [
      {
        name: 'vote',
        path: '/vote/data',
        component: () => import('/@/views/vote/list.vue'),
        meta: { title: '概况', icon: 'el-icon-s-finance' }
      },
      {
        name: 'voteList',
        path: '/vote/list',
        component:  Components['LayoutBlank'],
        redirect: '/vote/list/index',
        meta: { title: '投票列表', icon: 'el-icon-s-finance' },
        children:[{
          name: 'voteListIndex',
          path: '/vote/list/index',
          component: () => import('/@/views/vote/list.vue'),
          meta: { title: '投票列表', icon: 'el-icon-s-finance' }
        },{
          name: 'voteListCreate',
          path: '/vote/list/create',
          component: () => import('/@/views/vote/create.vue'),
          meta: { title: '添加活动', icon: 'el-icon-s-finance', hidden: true }
        }]
      }
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