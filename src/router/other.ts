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
    meta: { title: '投票活动', icon: 'el-icon-present' },
    children: [
      {
        name: 'vote',
        path: '/vote/data',
        component: () => import('/@/views/vote/data.vue'),
        meta: { title: '数据统计', icon: 'el-icon-coin' }
      },
      {
        name: 'voteList',
        path: '/vote/list',
        component:  Components['LayoutBlank'],
        redirect: '/vote/list/index',
        meta: { title: '投票评选', icon: 'el-icon-s-finance' },
        children:[{
          name: 'voteListIndex',
          path: '/vote/list/index',
          component: () => import('/@/views/vote/list.vue'),
          meta: { title: '投票评选', icon: 'el-icon-s-finance', hidden: true, hiddenBreadcrumb: true }
        },{
          name: 'voteListCreate',
          path: '/vote/list/create',
          component: () => import('/@/views/vote/create.vue'),
          meta: { title: '添加活动', icon: 'el-icon-s-finance', hidden: true }
        },{
          name: 'voteListShow',
          path: '/vote/list/show/:voteId',
          component: () => import('/@/views/vote/create.vue'),
          meta: { title: '查看活动', icon: 'el-icon-s-finance', hidden: true }
        },{
          name: 'voteListEdit',
          path: '/vote/list/edit/:voteId',
          component: () => import('/@/views/vote/create.vue'),
          meta: { title: '查看活动', icon: 'el-icon-s-finance', hidden: true }
        },{
          name: 'voteListPlayer',
          path: '/vote/list/player',
          component: Components['LayoutBlank'],
          meta: { title: '选手列表', icon: 'el-icon-s-finance',hidden: true },
          redirect: {
            name: 'voteListPlayerList'
          },
          children: [{
            name: 'voteListPlayerList',
            path: '/vote/list/:voteId/player/list',
            component:  Components['LayoutBlank'],
            meta: { title: '选手列表', icon: 'el-icon-s-finance', hidden: true ,hiddenBreadcrumb: true },
            redirect: {
              name: 'voteListPlayerListIndex'
            },
            children: [{
              name: 'voteListPlayerListIndex',
              path: '/vote/list/:voteId/player/list/index',
              component: () => import('/@/views/vote/player/list.vue'),
              meta: { title: '选手列表', icon: 'el-icon-s-finance', hidden: true, hiddenBreadcrumb: true }
            },{
              name: 'voteListPlayerListRecord',
              path: '/vote/list/:voteId/player/list/:playerId/record',
              component: () => import('/@/views/vote/player/record.vue'),
              meta: { title: '投票列表', icon: 'el-icon-s-finance', hidden: true }
            },
            {
              name: 'voteListPlayerEdit',
              path: '/vote/list/:voteId/player/:playerId/edit',
              component: () => import('/@/views/vote/player/create.vue'),
              meta: { title: '编辑选手', icon: 'el-icon-s-finance' }
            }]
          },
          {
            name: 'voteListPlayerCreate',
            path: '/vote/list/:voteId/player/create',
            component: () => import('/@/views/vote/player/create.vue'),
            meta: { title: '添加选手', icon: 'el-icon-s-finance' }
          },
          {
            name: 'voteListPlayerBetchCreate',
            path: '/vote/list/:voteId/player/betch-create',
            component: () => import('/@/views/vote/player/create.vue'),
            meta: { title: '添加选手', icon: 'el-icon-s-finance' }
          }]
        },{
          name: 'voteListComplain',
          path: '/vote/list/:voteId/complain/list',
          component: () => import('/@/views/vote/complain/list.vue'),
          meta: { title: '举报', icon: 'el-icon-s-finance', hidden: true }
        },{
          name: 'voteListPay',
          path: '/vote/list/:voteId/pay/list',
          component: () => import('/@/views/vote/pay/list.vue'),
          meta: { title: '礼物', icon: 'el-icon-s-finance', hidden: true }
        },{
          name: 'voteListRecord',
          path: '/vote/list/:voteId/record/list',
          component: () => import('/@/views/vote/record/list.vue'),
          meta: { title: '投票', icon: 'el-icon-s-finance', hidden: true }
        },{
          name: 'voteListRand',
          path: '/vote/list/rand',
          redirect: {
            name: 'voteListRandList'
          },
          component: Components['LayoutBlank'],
          meta: { title: '随机投票', icon: 'el-icon-s-finance', hidden: true },
          children: [{
            name: 'voteListRandList',
            path: '/vote/list/:voteId/rand/list',
            component: Components['LayoutBlank'],
            redirect: {
              name: 'voteListRandListIndex'
            },
            meta: { title: '列表', icon: 'el-icon-s-finance', hidden: true,hiddenBreadcrumb: true },
            children: [{
              name: 'voteListRandListIndex',
              path: '/vote/list/:voteId/rand/list/index',
              component: () => import('/@/views/vote/rand/list.vue'),
              meta: { title: '列表', icon: 'el-icon-s-finance', hidden: true,hiddenBreadcrumb: true }
            },{
              name: 'voteListRandListEdit',
              path: '/vote/list/:voteId/rand/:randId/edit',
              component: () => import('/@/views/vote/rand/create.vue'),
              meta: { title: '编辑定时投票', icon: 'el-icon-s-finance', hidden: true }
            }]
          },{
            name: 'voteListRandCreate',
            path: '/vote/list/:voteId/rand/create',
            component: () => import('/@/views/vote/rand/create.vue'),
            meta: { title: '添加定时投票', icon: 'el-icon-s-finance', hidden: true }
          },{
            name: 'voteListRandAuto',
            path: '/vote/list/:voteId/rand/auto',
            component: Components['LayoutBlank'],
            meta: { title: '自动任务', icon: 'el-icon-s-finance', hidden: true },
            redirect: {
              name: 'voteListRandAutoList'
            },
            children: [{
              name: 'voteListRandAutoList',
              path: '/vote/list/:voteId/rand/auto/list',
              component: () => import('/@/views/vote/rand/auto/list.vue'),
              meta: { title: '列表', icon: 'el-icon-s-finance', hidden: true, hiddenBreadcrumb: true }
            },{
              name: 'voteListRandAutoCreate',
              path: '/vote/list/:voteId/rand/auto/create',
              component: () => import('/@/views/vote/rand/auto/create.vue'),
              meta: { title: '添加任务', icon: 'el-icon-s-finance', hidden: true }
            }]
          }]
        }]
      }
    ]
  },{
    name: 'staff',
    path: '/staff',
    component: Components['Layout'],
    redirect: '/staff/list',
    meta: { title: '用户管理', icon: 'el-icon-s-check' },
    children: [
      {
        name: 'staffList',
        path: '/staff/list',
        component: () => import('/@/views/staff/list.vue'),
        meta: { title: '用户管理', icon: 'el-icon-s-custom', hiddenBreadcrumb: true }
      }
    ]
  },{
    name: 'setting',
    path: '/setting',
    component: Components['Layout'],
    redirect: '/setting/index',
    meta: { title: '系统设置', icon: 'el-icon-s-tools' },
    children: [
      {
        name: 'settingIndex',
        path: '/setting/index',
        component: () => import('/@/views/setting/index.vue'),
        meta: { title: '系统设置', icon: 'el-icon-s-tools' , hiddenBreadcrumb: true }
      }
    ]
  }
  ,{
    name: 'shop-manage',
    path: '/shop-manage',
    component: Components['Layout'],
    redirect: '/shop-manage/index',
    meta: { title: '开通商户', icon: 'el-icon-s-tools' },
    children: [
      {
        name: 'shopManageIndex',
        path: '/shop-manage/index',
        component: () => import('/@/views/shop-manage/index.vue'),
        meta: { title: '开通商户', icon: 'el-icon-s-tools' , hiddenBreadcrumb: true }
      }
    ]
  }
]

export default otherRouter