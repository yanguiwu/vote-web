import { useLayoutStore } from '/@/store/modules/layout'
import axios from 'axios'
import { AxiosResponse } from 'axios'
import { ElLoading, ElNotification } from 'element-plus'
console.log(import.meta)
let loading:{close():void}
// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: '//api.yanguiwu.com/yanguiwu',
  timeout: 60000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error:{message:string}) => {
  loading.close()
  console.log(`err${error}`)
  ElNotification({
    title: '请求失败',
    message: error.message,
    type: 'error'
  })
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const { getStatus } = useLayoutStore()
  loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.4)'
  })
  console.log('getStatus.ACCESS_TOKEN',getStatus.ACCESS_TOKEN)
  const token = getStatus.ACCESS_TOKEN
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['x-auth-token'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response:AxiosResponse<IResponse>) => {
  const { data } = response
  console.log(response)
  const { getStatus, logout } = useLayoutStore()
  loading.close()
  if(data.code !== 0) {
    let title = '请求失败'
    if(data.code === 8888) {
      if (getStatus.ACCESS_TOKEN) {
        logout()
      }
      title = '身份认证失败'
    }
    ElNotification({
      title,
      message: data.message,
      type: 'error'
    })
    return Promise.reject(new Error(data.message || 'Error'))
  }
  return response
}, errorHandler)

export default request