<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>离职列表</span>
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
      <el-table-column label='性别'>
        <template #default='scope'>
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column
        prop=''
        label='离职时间'
      />
      <el-table-column
        prop='departmentName'
        label='离职前部门'
      />
      <el-table-column
        prop=''
        label='操作人'
      />
      <el-table-column label='操作'>
        <template #default='scope'>
          <el-button
            size='mini'
            type='text'
            @click='() =>handleOpenShow(scope.row.id)'
          >详情</el-button>
          <el-button
            size='mini'
            type='text'
            @click='()=>handleJoin(scope.row.id)'
          >重新入职</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ShowDrawer :id='currentId' v-model='showDrawerVisible' @get-view='onGetView' />
  </el-card>
</template>
  
<script lang="ts">
import { defineComponent, SetupContext , ref } from 'vue'
import { StaffStatus } from '/@/type/store/company/staff'
import { editStaffStatus } from '/@/api/company/staff'
import { ElMessage, ElMessageBox } from 'element-plus'
import ShowDrawer from './ShowDrawer.vue'
export default defineComponent({
  components: { ShowDrawer },
  props: {
    listData: {
      type: Array,
      default: () => []
    }
  },
  emits:['get-view'],
  setup(props, context:SetupContext) {
    const showDrawerVisible = ref(false)
    const currentId = ref()

    const handleOpenShow = (id:number) => {
      currentId.value = id
      showDrawerVisible.value = true
    }
    const onGetView = () => {
      context.emit('get-view')
    }

    const handleJoin = async(id:number) => {
      ElMessageBox.confirm('确认将该员工重新入职?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await editStaffStatus({
          id,
          status: StaffStatus.online
        })
        context.emit('get-view')
        ElMessage.success({
          message: '操作成功',
          type: 'success'
        })
      })
    }
    return { 
      currentId,
      showDrawerVisible,
      handleJoin,
      handleOpenShow,
      onGetView
    }
  }
})
</script>