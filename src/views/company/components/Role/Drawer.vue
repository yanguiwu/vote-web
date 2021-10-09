<template>
  <el-drawer
    v-model='modelValue'
    :title='currentFormData.id ? "编辑角色" : "添加角色"'
    direction='rtl'
    :before-close='handleClose'
    destroy-on-close
    size='40%'
    :with-header='false'
  >
    <DrawerHeader>
      <template #title>
        {{ currentFormData.id ? "编辑角色" : "添加角色" }}
      </template>
      <el-button @click='handleClose'>取消</el-button>
      <el-button type='primary' @click='handleSubmit'>保存</el-button>
    </DrawerHeader>
    <el-form label-width='120px' :model='currentFormData'>
      <el-form-item label='角色名称' required>
        <el-input v-model='currentFormData.name' />
      </el-form-item>
      <el-form-item label='说明'>
        <el-input
          v-model='currentFormData.remark'
          type='textarea'
          :rows='2'
          placeholder='请输入内容'
        />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script lang="ts">
import { toRefs, ref, defineComponent, SetupContext, watch } from 'vue'
import { createRole, editRole } from '/@/api/company/role'
import { ElMessage } from 'element-plus'
import DrawerHeader from '/@/components/DrawerHeader.vue'

const drawerRender = (props,context: SetupContext) => {
  const handleClose = () => {
    context.emit('update:modelValue',false)
  }
  const { formData, modelValue } = toRefs(props)
  const currentFormData = ref({
    id: 0,
    name: '',
    remark: ''
  })
  watch(modelValue, () => {
    currentFormData.value = formData.value
  })
  const handleSubmit = async() => {
    const { id, ...data } = currentFormData.value
    !id ? await createRole({
      ...data
    }) : await editRole({
      ...data,
      id
    })
    ElMessage.success({
      message: '操作成功',
      type: 'success'
    })
    context.emit('get-view')
    handleClose()
  }
  return {
    currentFormData,
    handleClose,
    handleSubmit
  }
}
export default defineComponent({
  props:{
    formData: {
      type:Object,
      default: () => ({})
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context: SetupContext) {
    return {
      ...drawerRender(props,context)
    }
  }
})
</script>