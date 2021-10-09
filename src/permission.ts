import router from '/@/router'
import { configure, start, done } from 'nprogress'
import { RouteRecordRaw } from 'vue-router'
import { decode, encode } from '/@/utils/tools'
import { useLayoutStore } from '/@/store/modules/layout'
import { useLocal } from '/@/utils/tools'

configure({ showSpinner: false })

const loginRoutePath = '/Login'
const defaultRoutePath = '/'

router.beforeEach(async(to, from) => {
  start()
  const { getStatus, getMenubar, setToken, logout, GenerateRoutes, concatAllowRoutes } = useLayoutStore()
  // 修改页面title
  const reg = new RegExp(/^(.+)(\s\|\s.+)$/)
  const appTitle = import.meta.env.VITE_APP_TITLE
  document.title = !to.meta.title
    ? appTitle
    : appTitle.match(reg) 
      ? appTitle.replace(reg, `${to.meta.title}$2`) 
      : `${to.meta.title}-${appTitle}`
  // 判断当前是否在登陆页面
  if (to.path.toLocaleLowerCase() === loginRoutePath.toLocaleLowerCase()) {
    done()
    if(getStatus.ACCESS_TOKEN) return typeof to.query.from === 'string' ? decode(to.query.from) : defaultRoutePath
    return
  }
  // 判断是否登录
  if(!getStatus.ACCESS_TOKEN) {
    return loginRoutePath + (to.fullPath ? `?from=${encode(to.fullPath)}` : '')
  }
    
  // 前端检查token是否失效
  useLocal('token')
    .then(d => setToken(d.ACCESS_TOKEN))
    .catch(() => logout())
    
  if(getMenubar.menuList.length === 0) {
    await GenerateRoutes()
    const { routes } = router.options
    for(let i = 0;i < getMenubar.menuList.length;i++) {
      router.addRoute(getMenubar.menuList[i] as RouteRecordRaw)
    }
    console.log('router',router)
    concatAllowRoutes()
    return to.fullPath
  }
})

router.afterEach(() => {
  done()
})