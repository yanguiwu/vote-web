<template>
  <el-drawer
    v-model='modelValue'
    :title='isShow ? "详情" : "入职审核"'
    direction='rtl'
    :before-close='handleClose'
    destroy-on-close
    size='40%'
    :with-header='false'
  >
    {{ currentFormData }}
    <div v-if='isShow && !showEdit' class='show-content'>
      <DrawerHeader v-if='isShow'>
        <template #title>
          <el-button class='mr-5' @click='handleClose'>返回</el-button>详情
        </template>
      </DrawerHeader>
      <div class='show-header justify-between'>
        <div class='justify-between'>
          <el-avatar class='avatar' shape='square' :size='60' />
          <div>
            <div class='title'>{{ currentFormData.name }}</div>
            {{ currentFormData.mobile }}
          </div>
        </div>
        <el-button type='primary' @click='handleCloseShow'>编辑</el-button>
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
    </div>
    <div v-else>
      <DrawerHeader v-if='isShow'>
        <template #title>
          详情
        </template>
        <el-button type='primary' @click='()=>handleSubmit(0,true)'>保存</el-button>
      </DrawerHeader>
      <DrawerHeader v-else>
        <template #title>
          <el-button class='mr-5' @click='()=>handleClose'>返回</el-button>入职审核
        </template>
        <el-button type='primary' @click='()=>handleSubmit(0)'>通过</el-button>
        <el-button type='danger' @click='()=>handleSubmit(3)'>拒绝</el-button>
      </DrawerHeader>
      <el-form label-width='120px' :model='currentFormData'>
        <el-form-item label='姓名' required>
          <el-input v-model='currentFormData.name' />
        </el-form-item>
        <el-form-item label='手机号码' required>
          <el-input v-model='currentFormData.mobile' />
        </el-form-item>
        <el-form-item label='部门' required>
          <treeselect v-if='department.length' v-model='currentFormData.departmentId' placeholder='选择部门' no-children-text='' default-expand-level='Infinity' :options='department' />
        </el-form-item>
        <el-form-item label='性别' required>
          <el-radio-group v-model='currentFormData.gender'>
            <el-radio :label='0'>男</el-radio>
            <el-radio :label='1'>女</el-radio>
            <el-radio :label='2'>未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='公司名称' required>
          {{ currentFormData.companyName }}
        </el-form-item>
        <el-form-item label='角色'>
          <el-select v-model='currentFormData.roleIds' multiple placeholder='请选择'>
            <el-option
              v-for='item in roles'
              :key='item.id'
              :label='item.name'
              :value='item.id'
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-if='isShow'>
          <el-button type='primary' @click='()=>handleSubmit(0,true)'>保存</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type='primary' @click='()=>handleSubmit(0)'>通过</el-button>
          <el-button type='danger' @click='()=>handleSubmit(3)'>拒绝</el-button>
        </el-form-item> -->
      </el-form>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { toRefs, ref, defineComponent, SetupContext, watch, onMounted } from 'vue'
import { getDepartmentTree } from '/@/api/company/department'
import { getStaffInfo, auditStaff, editStaff } from '/@/api/company/staff'
import { getRoleList } from '/@/api/company/role'
import { ElMessage } from 'element-plus'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'

const drawerRender = (props:any, context: SetupContext) => {
  const { id, modelValue, isShow } = toRefs(props)
  const roles = ref([])
  const department = ref([])
  const showEdit = ref(false)
  const currentFormData = ref({
    id: 0,
    name: '',
    mobile: '',
    departmentId: '',
    gender: '',
    companyId: '',
    roleIds: []
  })

  watch(modelValue, async() => {
    if(modelValue) {
      showEdit.value = false
      let data = await getStaffInfo(id.value)
      let _data = data.data.body
      currentFormData.value = {
        ..._data,
        roleIds:_data.roleIds ? _data.roleIds.split(',').map((item:string) => {
          return Number(item)
        }) : []
      }
      console.log('currentFormData',currentFormData.value)
    }
  })

  const getRolesData = async() => {
    let data = await getRoleList()
    let _data = data.data.body
    roles.value = _data
  }

  const getUserRepositories = async() => {
    let data = await getDepartmentTree()
    department.value = data
    console.log('department',data)
  }
  onMounted(() => {
    getUserRepositories()
    getRolesData()
  })

  const handleCloseShow = () => {
    showEdit.value = true
  }
  const handleClose = () => {
    context.emit('update:modelValue',false)
  }

  const handleSubmit = async(status:number, isEdit?: boolean | undefined) => {
    let { id, name, mobile, departmentId, gender, roleIds, companyId } = currentFormData.value
    isEdit ? await editStaff({
      id,
      name,
      mobile,
      departmentId,
      gender,
      companyId,
      roleIds: roleIds ? roleIds.join(',') : ''
    }) : await auditStaff({
      id,
      name,
      mobile,
      departmentId,
      gender,
      companyId,
      status,
      roleIds: roleIds ? roleIds.join(',') : ''
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
    roles,
    department,
    showEdit,
    handleClose,
    handleSubmit,
    handleCloseShow
  }
}
export default defineComponent({
  components:{ Treeselect },
  props:{
    id: {
      type: Number,
      default: 0
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    isShow: {
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