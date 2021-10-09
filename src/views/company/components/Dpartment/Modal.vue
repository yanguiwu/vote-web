<template>
  <el-dialog
    v-model='modelValue'
    title='提示'
    width='50%'
    :before-close='handleClose'
  >
    <el-table ref='table' :data='listData' border @selection-change='handleSelectionChange'>
      <el-table-column
        type='selection'
        width='55'
      />
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
    </el-table>
    <template #footer>
      <span class='dialog-footer'>
        <el-button @click='handleClose'>取 消</el-button>
        <el-button type='primary' @click='handleOk'>确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, getCurrentInstance, toRefs } from 'vue' 
import { getStaffList } from '/@/api/company/staff'
import { departmentUpdateManage } from '/@/api/company/department'
import { DepartmentManagerStatus } from '/@/type/store/company/department'
import { ElMessage } from 'element-plus'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue','ok', 'get-view'],
  setup(props, context) {
    let listData = ref()
    let multipleSelection = ref([])
    const { info } = toRefs(props)
    const { proxy } = getCurrentInstance()

    const handleSelectionChange = (val:any) => {
      if (val.length > 1) {
        proxy.$refs['table'].clearSelection()
        let row = val.pop()
        proxy.$refs['table'].toggleRowSelection(row)
        multipleSelection.value = [row]
      }else {
        multipleSelection.value = val
      }
      console.log('multipleSelection',multipleSelection.value)
    }

    const getListData = async() => {
      let data = await getStaffList(
        { status: 0 }
      )
      listData.value = data.data.body
    }
    onMounted(getListData)


    const handleClose = () => {
      proxy.$refs['table'].clearSelection()
      context.emit('update:modelValue',false)
    }
    const handleOk = async() => {
      if(!multipleSelection.value.length) {
        ElMessage.warning('至少选择一个员工！')
        return
      }
      if(info.value.id) {
        await departmentUpdateManage({
          departmentId:info.value.id,
          userId: multipleSelection.value[0].id,
          status: DepartmentManagerStatus.add
        })
        context.emit('get-view')
      }
      context.emit('ok',multipleSelection.value)
      handleClose()
    }

    return {
      listData,
      multipleSelection,
      handleClose,
      handleOk,
      handleSelectionChange
    }
  }
})
</script>