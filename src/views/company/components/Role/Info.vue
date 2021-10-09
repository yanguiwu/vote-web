<template>
  <div>
    <el-card class='mb-5'>
      <template #header>	
        <div class='justify-between'>
          <span>{{ info.name }}</span>
          <div>
            <el-button type='primary' plain @click='handleOpenRoleMenus'>调整权限</el-button>
            <el-button type='primary' plain @click='handleOpenEdit'>编辑</el-button>
          </div>
        </div>
      </template>
      <el-form inline>
        <el-form-item label='说明:'>
          {{ info.remark }}
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const renderInfo = (props: any, context: any) => {

  const handleOpenEdit = () => {
    context.emit('show-edit')
  }

  const handleOpenRoleMenus = () => {
    context.emit('show-edit-menus')
  }

  return {
    handleOpenEdit,
    handleOpenRoleMenus
  }
}
export default defineComponent({
  components: {
  },
  props: {
    info: { 
      type: Object,
      default: () => {}
    }
  },
  setup(props: any, context: any) {
    return {
      ...renderInfo(props, context)
    }
  }
})
</script>