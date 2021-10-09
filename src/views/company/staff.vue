<template>
  <div>
    <el-tabs v-model='activeName' class='staff-tabs' @tab-click='handleClick'>
      <el-tab-pane label='待审核' :name='2'>
        <ToAuditTable :list-data='TableListData' @on-search='onSearch' />
      </el-tab-pane>
      <el-tab-pane label='在职中' :name='0'>
        <WorkingList />
      </el-tab-pane>
      <el-tab-pane label='已离职' :name='4'>
        <DimissionTable :list-data='TableListData' @get-view='getListData' />
      </el-tab-pane>
    </el-tabs>
    <Drawer v-model='drawerVisible' :form-data='drawerInfo' />
  </div>
</template>
	
<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from 'vue'
import { getStaffList } from '/@/api/company/staff'
import Drawer from './components/Dpartment/Drawer.vue'
import ToAuditTable from './components/Staff/ToAuditTable.vue'
import DimissionTable from './components/Staff/DimissionTable.vue'
import WorkingList from './components/Staff/WorkingList.vue'
	
const treeRender = () => {
  const activeName = ref(2)
  const searchData = ref({ userName:'',invitationName: '',mobile: '' })
  const TableListData = ref([])
  const drawerVisible = ref(false)
  const drawerInfo = ref({})
	
  const getListData = async() => {
    let data = await getStaffList(
      { status: activeName.value, ...(activeName.value === 2 ? searchData.value : {}) }
    )
    TableListData.value = data.data.body
  }
  onMounted(getListData)

  const handleClick = (value: any) => {
    activeName.value = value.props.name
    if(activeName.value !== 0) {
      getListData()
    }
  }

  const onSearch = (_searchData: any) => {
    searchData.value = _searchData
    getListData()
  }
	
  return {
    TableListData,
    drawerVisible,
    drawerInfo,
    handleClick,
    onSearch,
    getListData
  }
}
export default defineComponent({
  components:{ ToAuditTable, DimissionTable, WorkingList, Drawer },
  setup() {
    return {
      ...treeRender(),
      activeName: 2
    }
  }
})
</script>

  <style lang='postcss'>
.staff-tabs {
  .el-tabs__header {
    padding:  10px 20px 0;
    margin: -20px -20px 20px;
    background-color: #fff;
  }
}
  </style>