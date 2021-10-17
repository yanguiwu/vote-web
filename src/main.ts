import { createApp } from 'vue'
import App from '/@/App.vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import direct from '/@/directive/index'
import router from '/@/router/index'
import { pinia } from '/@/store'
import '/@/permission'

import 'element-plus/lib/theme-chalk/index.css'
import 'element-plus/lib/theme-chalk/display.css'
import 'nprogress/nprogress.css'
import '/@/assets/css/index.css'
import 'virtual:svg-icons-register'
import DrawerHeader from '/@/components/DrawerHeader.vue'
import FadeInput from './components/FadeInput.vue' 

const app = createApp(App)
direct(app)
app.use(ElementPlus, { locale })
app.use(router)
app.use(pinia)
app.component('DrawerHeader', DrawerHeader)
app.component('FadeInput', FadeInput)
app.mount('#app')