<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>分公司管理</span>
        <div>
          <el-button type='primary' @click='handleOpenAdd'>添加分公司</el-button>
        </div>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item label='公司名称'>
        <el-input v-model='formData.name' placeholder='输入公司简称或全称' />
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='onGetView(formData)'>查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data='listData' border>
      <el-table-column
        prop='shortName'
        label='公司简称'
      />
      <el-table-column
        prop='name'
        label='公司全称'
      />
      <el-table-column
        prop='address'
        label='公司地址'
      />
      <el-table-column label='操作' width='80'>
        <template #default='scope'>
          <el-button
            size='mini'
            type='text'
            class='el-button--danger'
            @click='() => handleChange(scope.row)'
          >{{ scope.row.status === ISubStatus.online ? '禁用':'启用' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label='操作' width='80'>
        <template #default='scope'>
          <el-button
            size='mini'
            type='text'
            @click='() => handleOpenEdit(scope.row.id)'
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Drawer v-model='drawerVisible' :form-data='drawerInfo' @get-view='onGetView' />
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { ISubStatus } from '/@/type/store/company/subsidiary'
import { editStatus } from '/@/api/company/subsidiary'
import { ElMessage, ElMessageBox } from 'element-plus'
import Drawer from './Drawer.vue'

export default defineComponent({
  components: { Drawer },
  props: {
    listData: {
      type: Array,
      default: () => []
    }
  },
  emits: ['get-view'],
  setup(props, context) {
    const formData = reactive({ name:'' })
    const drawerVisible = ref(false)
    const drawerInfo = ref({})
    const handleOpenAdd = () => {
      drawerVisible.value = true
      drawerInfo.value = {
      }
    }
    const handleOpenEdit = (id: number) => {
      drawerVisible.value = true
      drawerInfo.value = {
        id
      }
    }
    const onGetView = (data: any) => {
      context.emit('get-view', data)
    }
    const handleChange = async(row:any) => {
      let { id , name, status } = row
      let _status = (status === ISubStatus.online) ? ISubStatus.offline : ISubStatus.online
      ElMessageBox.confirm(`确认${status === ISubStatus.online ? '禁用' : '启用'}【${name}】`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await editStatus(id, _status)
        ElMessage.success({
          message: '操作成功',
          type: 'success'
        })
        context.emit('get-view')
      })
    }

    return {
      formData,
      ISubStatus,
      handleOpenAdd,
      onGetView,
      handleOpenEdit,
      handleChange,
      drawerVisible,
      drawerInfo
    }
  }
})
</script>