<template>
  <div class='content'>
    <el-card class='mb-2' shadow='hover'>
      <div class='py-4 font-bold'>工作台</div>
      <el-row>
        <el-col :xs='24' :md='16'>
          <div class='flex items-center'>
            <div class='pr-4 flex items-center'>
              <el-avatar class='w-16 h-16' src='https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg' />
            </div>
            <div>
              <div class='text-xl'>你好，{{ user.username }}！</div>
              <div class='text-sm text-gray-400 pt-2'>欢迎登录</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useLayoutStore } from '/@/store/modules/layout'

export default defineComponent({
  name: 'Workplace',
  setup() {
    const { getUserInfo,getUserListData } = useLayoutStore()
    return {
      user: getUserInfo,
      userList: getUserListData

    }
  }
})
</script>