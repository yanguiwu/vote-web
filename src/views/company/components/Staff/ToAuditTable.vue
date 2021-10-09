<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>待审核列表</span>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item label='员工名称'>
        <el-input v-model='formData.userName' placeholder='输入员工名称' />
      </el-form-item>
      <el-form-item label='手机号'>
        <el-input v-model='formData.mobile' placeholder='输入手机号' />
      </el-form-item>
      <el-form-item label='邀请人名称'>
        <el-input v-model='formData.invitationName' placeholder='输入邀请人名称' />
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='handleSearch'>查询</el-button>
      </el-form-item>
    </el-form>
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
      <el-table-column label='性别'>
        <template #default='scope'>
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column
        prop='invitationTime'
        label='申请时间'
      />
      <el-table-column
        prop='invitationName'
        label='邀请人'
      />
      <el-table-column label='操作'>
        <template #default='scope'>
          <el-button
            size='mini'
            type='text'
            @click='()=>handleOpenAudit(scope.row.id)'
          >审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AuditDrawer :id='currentId' v-model='drawerVisable' />
  </el-card>
</template>
  
<script lang="ts">
import { ref,defineComponent } from 'vue'
import AuditDrawer from './AuditDrawer.vue'
export default defineComponent({
  components:{ AuditDrawer },
  props: {
    listData: {
      type: Array,
      default: () => []
    }
  },
  emits:['on-search'],
  setup(props:any, context: any) {
    const formData = ref({ userName:'',invitationName: '',mobile: '' })
    const currentId = ref()
    const drawerVisable = ref(false)
    const handleSearch = () => {
      context.emit('on-search', formData.value)
    }
    const handleOpenAudit = (id:number) => {
      drawerVisable.value = true
      currentId.value = id
    }
    return {
      formData,
      currentId,
      drawerVisable,
      handleSearch,
      handleOpenAudit
    }
  }
})
</script>