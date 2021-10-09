<template>
  <Department :is-show='true' @on-get-view='onGetView'>
    <el-card>
      <template #header>
        <div class='justify-between'>
          <span>员工列表</span>
        </div>
      </template>
      <el-table :data='listData' border>
        <el-table-column
          prop='userName'
          label='姓名'
        />
        <el-table-column
          prop='mobile'
          label='手机号码'
        />
        <el-table-column
          prop='departmentName'
          label='部门'
        />
        <el-table-column
          prop='roleNames'
          label='角色'
        />
        <el-table-column label='性别'>
          <template #default='scope'>
            {{ scope.row.gender }}
          </template>
        </el-table-column>
        <el-table-column label='操作'>
          <template #default='scope'>
            <el-button
              size='mini'
              type='text'
              @click='() => handleOpenShow(scope.row.id)'
            >详情</el-button>
            <el-button
              size='mini'
              type='text'
              @click='() => handlePass(scope.row.id)'
            >离职</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <AuditDrawer :id='currentId' v-model='drawerVisable' :is-show='true' />
  </Department>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getStaffList, editStaffStatus } from '/@/api/company/staff'
import { StaffStatus, StaffItem } from '/@/type/store/company/staff'
import { ElMessage, ElMessageBox } from 'element-plus'
import Department from '../../department.vue'
import AuditDrawer from './AuditDrawer.vue'

export default defineComponent({
  components:{ Department, AuditDrawer },
  setup() {
    const listData = ref<StaffItem[]>([])
    const drawerVisable = ref(false)
    const currentId = ref()
    const departmentId = ref(0)

    const handleOpenShow = (id:number) => {
      drawerVisable.value = true
      currentId.value = id
    }

    const handlePass = async(id:number) => {
      ElMessageBox.confirm('确认离职该员工?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await editStaffStatus({
          id,
          status: StaffStatus.pass
        })
        onGetView(departmentId.value)
        ElMessage.success({
          message: '操作成功',
          type: 'success'
        })
      })
    }

    const getListData = async(departmentId: number) => {
      let data = await getStaffList(
        { status: 0, departmentId }
      )
      listData.value = data.data.body
    }

    const onGetView = (_departmentId: number) => {
      departmentId.value = _departmentId
      getListData(departmentId.value)
    }

    return {
      currentId,
      drawerVisable,
      listData,
      onGetView,
      handleOpenShow,
      handlePass
    }
  }
})

</script>