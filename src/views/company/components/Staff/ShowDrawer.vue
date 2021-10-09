<template>
  <el-drawer
    v-model='modelValue'
    title='详情'
    direction='rtl'
    :before-close='handleClose'
    destroy-on-close
    size='40%'
  >
    <el-button class='mb-5' type='primary' @click='handleJoin'>离职</el-button>
    <div class='show-header justify-between'>
      <div class='justify-between'>
        <el-avatar class='avatar' shape='square' :size='60' />
        <div>
          <div class='title'>{{ currentFormData.name }}</div>
          {{ currentFormData.mobile }}
        </div>
      </div>
    </div>
    <el-form>
      <el-row>
        <el-col :span='12'>
          <el-form-item label='部门:'>
            {{ currentFormData.departmentName }}
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label='性别:'>
            {{ currentFormData.gender }}
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label='公司:'>
            {{ currentFormData.companyName }}
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label='角色:'>
            {{ currentFormData.roleNames }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>
</template>
<script lang="ts">
import { toRefs, ref, defineComponent, SetupContext, watch } from 'vue'
import { getStaffInfo, editStaffStatus } from '/@/api/company/staff'
import { StaffStatus } from '/@/type/store/company/staff'
import { ElMessage, ElMessageBox } from 'element-plus'

const drawerRender = (props:any, context: SetupContext) => {
  const { id, modelValue } = toRefs(props)
  const currentFormData = ref({
    id: 0,
    departmentName: '',
    gender: '',
    companyName: '',
    genderoleNamesr: '',
    roleNames:''
  })

  watch(modelValue, async() => {
    if(modelValue) {
      let data = await getStaffInfo(id.value)
      currentFormData.value = data.data.body
    }
  })

  const handleClose = () => {
    context.emit('update:modelValue',false)
  }

  const handleJoin = async() => {
    ElMessageBox.confirm('确认离职该员工?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      await editStaffStatus({
        id: id.value,
        status: StaffStatus.online
      })
      context.emit('get-view')
      handleClose()
      ElMessage.success({
        message: '操作成功',
        type: 'success'
      })
    })
  }


  return {
    currentFormData,
    handleClose,
    handleJoin
  }
}
export default defineComponent({
  props:{
    id: {
      type: Number,
      default: 0
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
<style lang='postcss'>
  .show-header {
    margin-bottom: 20px;
    .avatar {
      margin-right: 10px;
    }
    .title {
      margin-bottom: 5px;
      font-size: 20px;
      color: #333;
      font-weight: 500;
    }
  }
</style>