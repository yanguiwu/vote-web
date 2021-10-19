<template>
  <div class='w-screen h-screen layout-body'>
    <div class='layout-login' @keyup='enterSubmit'>
      <div class='layout-login-right'>
        <el-form ref='ruleForm' class='layout-login-form' label-position='right' label-width='80px' :model='form' :rules='rules'>
          <div class='title'>
            投票管理系统
          </div>
          <el-form-item class='mb-6 -ml-20' prop='name'>
            <el-input v-model='form.name' placeholder='请输入用户名' prefix-icon='el-icon-user' />
          </el-form-item>
          <el-form-item class='mb-6 -ml-20' prop='pwd'>
            <el-input v-model='form.pwd' placeholder='请输入密码' prefix-icon='el-icon-lock' show-password />
          </el-form-item>
          <el-form-item class='mb-6 -ml-20'>
            <el-button type='primary' class='w-full' @click='onSubmit'>登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
        
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue'
import { useLayoutStore } from '/@/store/modules/layout'
import { validate } from '/@/utils/formExtend'

const formRender = () => {
  const { login } = useLayoutStore()
  let form = reactive({
    name: '1a2b3c',
    pwd: 'tianlan1103'
  })
  const ruleForm = ref(null)
  const enterSubmit = (e:KeyboardEvent) => {
    if(e.key === 'Enter') {
      onSubmit()
    }
  }
  const onSubmit = async() => {
    let { name, pwd } = form
    if(!await validate(ruleForm)) return
    await login({ username: name, password: pwd })
  }
  const rules = reactive({
    name: [
      { validator: (rule: any, value: any, callback: (arg0?: Error|undefined) => void) => {
        if (!value) {
          return callback(new Error('用户名不能为空'))
        }
        callback()
      }, trigger: 'blur' 
      }
    ],
    pwd: [
      { validator: (rule: any, value: any, callback: (arg0?: Error|undefined) => void) => {
        if (!value) {
          return callback(new Error('密码不能为空'))
        }
        callback()
      }, trigger: 'blur' 
      }
    ]
  })
  return {
    form, 
    onSubmit,
    enterSubmit,
    rules,
    ruleForm
  }
}
export default defineComponent({
  name: 'Login',
  setup() {
    const layout = useLayoutStore()
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      userList: computed(() => layout.getUserListData),
      ...formRender()
    }
  }
})
</script>

<style lang='postcss' scoped>

.layout-body {
    background: rgb(14 26 84);
    display: flex;
    align-items: center;
    justify-content: center;
    .layout-login {
        margin: 0 auto;
        display: flex;
        align-items: center;
        .layout-login-right {
            width: 400px;
						padding: 0 40px;
            background: rgba(255,255,255,0.5);
            display: flex;
            align-items: center;
            border-radius: 4px;
            .layout-login-form {
                width: 100%;
                height: 300px;
                padding-top: 40px;
                .title {
                  text-align: center;
                  font-size: 25px;
                  color: #333;
                  margin-bottom: 15px;
                }
            }
        }
    }
}
</style>