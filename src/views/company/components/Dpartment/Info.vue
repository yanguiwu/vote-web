<template>
  <div>
    <el-card class='mb-5'>
      <template #header>	
        <div class='justify-between'>
          <span>{{ info.name }}</span>
          <div v-if='!isShow'>
            <el-button type='text' class='el-button--danger' @click='handleChange'>{{ info.status === DepartmentStatus.online ? '禁用部门' : '启用部门' }}</el-button>
            <el-button type='primary' plain @click='handleOpenEdit'>编辑部门</el-button>
            <el-button type='primary' @click='handleOpenCAdd'>添加子部门</el-button>
          </div>
        </div>
      </template>
      <el-form inline>
        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label='部门类型:'>
              {{ info.sysTypeName }}
            </el-form-item>
          </el-col>
          <el-col :span='6'>
            <el-form-item label='所属公司:'>
              {{ info.companyName }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <h3 class='justify-between mb-5'>
        <span>部门主管</span>
        <div v-if='!isShow'>
          <el-button type='primary' plain @click='handleAddManage'>新增部门主管</el-button>
        </div>
      </h3>
      <el-table :data='info.manage' border>
        <el-table-column
          prop='userName'
          label='姓名'
          width='180'
        />
        <el-table-column
          prop='mobile'
          label='手机号码'
          width='180'
        />
        <el-table-column
          prop='departmentName'
          label='部门'
        />
        <el-table-column
          prop='gender'
          label='性别'
        />
        <el-table-column
          prop='invitationTime'
          label='申请时间'
        />
        <el-table-column
          prop='invitationName'
          label='邀请人'
        />
        <el-table-column v-if='!isShow' label='操作'>
          <template #default='scope'>
            <el-button
              size='mini'
              type='text'
              @click='() => handleRemoveManage(scope.row)'
            >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <slot />
    <Drawer v-model='drawerVisible' :form-data='drawerInfo' @get-view='onGetView' />
    <Modal v-model='modalVisible' :info='info' @get-view='onGetView' />
  </div>

</template>

<script lang="ts">
import { toRefs, ref, defineComponent } from 'vue'
import { departmentEditStatus, departmentUpdateManage } from '/@/api/company/department'
import { DepartmentStatus, DepartmentManagerStatus, IDepartmentManager } from '/@/type/store/company/department'
import { ElMessage, ElMessageBox } from 'element-plus'
import Drawer from './Drawer.vue'
import Modal from './Modal.vue'

const renderInfo = (props: any, context: any) => {

  const { info } = toRefs(props)
  const drawerVisible = ref(false)
  const modalVisible = ref(false)
  const drawerInfo = ref({})

  const onGetView = () => {
    context.emit('get-view')
  }

  const handleOpenEdit = () => {
    drawerVisible.value = true
    drawerInfo.value = {
      ...info.value,
      departmentPid: ''
    }
  }

  const handleOpenCAdd = () => {
    drawerVisible.value = true
    drawerInfo.value = {
      departmentPid: info.value.id,
      departmentPName: info.value.name
    }
  }

  const handleChange = () => {
    ElMessageBox.confirm('确认操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      let status = info.value.status === DepartmentStatus.online ? DepartmentStatus.offline : DepartmentStatus.online
      await departmentEditStatus({
        id: info.value.id,
        status
      })
      ElMessage.success({
        message: '操作成功',
        type: 'success'
      })
      onGetView()
    })
  }

  const handleAddManage = () => {
    modalVisible.value = true
  }

  const handleRemoveManage = async(row: IDepartmentManager) => {
    ElMessageBox.confirm('确认移除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      await departmentUpdateManage({
        departmentId: info.value.id,
        userId: row.userId,
        status: DepartmentManagerStatus.remove
      })
      onGetView()
      ElMessage.success({
        message: '操作成功',
        type: 'success'
      })
      onGetView()
    })
  }

  return {
    drawerVisible,
    modalVisible,
    drawerInfo,
    DepartmentStatus,
    onGetView,
    handleOpenEdit,
    handleOpenCAdd,
    handleChange,
    handleRemoveManage,
    handleAddManage
  }
}
export default defineComponent({
  components: {
    Drawer,
    Modal
  },
  props: {
    info: { 
      type: Object,
      default: () => ({})
    },
    isShow: {
      type: Boolean,
      default:false
    }
  },
  setup(props: any, context: any) {
    return {
      ...renderInfo(props, context)
    }
  }
})
</script>