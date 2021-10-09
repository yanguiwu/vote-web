<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>员工列表</span>
      </div>
    </template>
    <el-table :data='listData' border>
      <el-table-column
        prop='name'
        label='姓名'
        width='180'
      />
      <el-table-column
        prop='phone'
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
    </el-table>
  </el-card>
</template>
	
<script lang="ts">
import { ref } from 'vue'
export default {
  props: {
    listData: {
      type: Array,
      default: () => []
    }
  },
  setup() {
  }
}
</script>