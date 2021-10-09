<template>
  <el-drawer
    v-model='modelValue'
    direction='rtl'
    :before-close='handleClose'
    destroy-on-close
    size='40%'
    :with-header='false'
  >
    <DrawerHeader>
      <template #title>
        <el-button size='medium' class='mr-5'>{{ currentFormData.id ? '编辑部门' : '添加部门' }}</el-button>
      </template>
      <el-button type='primary' @click='handleSubmit'>保存</el-button>
    </DrawerHeader>
    <el-form label-width='120px' :model='currentFormData'>
      <el-form-item label='部门名称'>
        <el-input v-model='currentFormData.name' />
      </el-form-item>
      <el-form-item v-if='currentFormData.departmentPid' label='上级部门'>
        {{ currentFormData.departmentPName }}
      </el-form-item>
      <el-form-item label='部门类型'>
        <el-select v-model='currentFormData.sysType' placeholder='请选择'>
          <el-option
            v-for='item in sysTypeS'
            :key='item.value'
            :label='item.label'
            :value='item.value'
          />
        </el-select>
      </el-form-item>
      <el-form-item label='所属公司'>
        <el-select v-model='currentFormData.companyId' placeholder='请选择'>
          <el-option
            v-for='item in companys'
            :key='item.value'
            :label='item.label'
            :value='item.value'
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script lang="ts">
import { toRefs, ref, defineComponent, computed, watch } from 'vue'
import { departmentEdit, departmentAdd } from '/@/api/company/department'
import { ElMessage } from 'element-plus'
import DrawerHeader from '/@/components/DrawerHeader.vue'

const drawerRender = (props: any,context: any) => {
  const handleClose = () => {
    context.emit('update:modelValue',false)
  }
  const { formData, modelValue } = toRefs(props)
  const currentFormData = ref({
    id: '',
    name: '',
    departmentPid: '',
    departmentPName: '',
    sysType: '',
    companyId: ''
  })
  watch(modelValue, () => {
    currentFormData.value = formData.value
  })
  const handleSubmit = async() => {
    const { departmentPName, departmentPid, ...data } = currentFormData.value
    currentFormData.value.id ? await departmentEdit({
      ...data,
      departmentPid
    }) : await departmentAdd({
      ...currentFormData.value,
      departmentPid: departmentPid || '1'
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
    handleSubmit,
    sysTypeS:[{ label: '部门类型', value: 1 }],
    companys:[{ label: '所属公司', value: 4 }]
  }
}
export default {
  props:{
    formData: {
      type:Object,
      default: {}
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props: any, context: any) {
    return {
      ...drawerRender(props,context)
    }
  }
}
</script>