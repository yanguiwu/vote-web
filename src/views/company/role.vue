<template>
  <div>
    <el-row :gutter='20'>
      <el-col :span='7'>
        <el-card>
          <template #header>
            <div class='justify-between'>
              <span>角色列表</span>
              <el-button type='primary' @click='handleOpenAdd'>添加角色</el-button>
            </div>
          </template>
          <el-tree 
            v-if='treeData.length'
            default-expand-all
            check-on-click-node
            highlight-current
            :expand-on-click-node='false'
            :current-node-key='currentNodeKey.id'
            node-key='id'
            :data='treeData'
            :props='treeDefaultProps'
            @node-click='handleNodeClick'
          />
        </el-card>
      </el-col>
      <el-col :span='17'>
        <Info :info='currentNodeKey' @show-edit='onOpenEdit' @show-edit-menus='onOpenMenus' />
        <Table :list-data='currentListData' />
      </el-col>
    </el-row>
    <Drawer v-model='drawerVisible' :form-data='drawerInfo' @get-view='onGetView' />
    <DrawerMenus v-model='drawerMenusVisible' :form-data='drawerInfo' />
  </div>
</template>
	
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getRoleList, getRoleMembers } from '/@/api/company/role'
import Info from './components/Role/Info.vue'
import Table from './components/Role/Table.vue'
import Drawer from './components/Role/Drawer.vue'
import DrawerMenus from './components/Role/DrawerMenus.vue'
	
const treeRender = () => {
  const treeDefaultProps = {
    children: 'depaSub',
    label: 'name'
  }
  const treeData = ref([])
  const currentNodeKey = ref({ id:0 })
  const currentListData = ref([])
  const drawerVisible = ref(false)
  const drawerInfo = ref({})
  const drawerMenusVisible = ref(false)
	
  const getCurrentRoleMember = async() => {
    let data = await getRoleMembers(currentNodeKey.value.id)
    currentListData.value = data.data.body
  }
	
  const getListData = async() => {
    treeData.value = []
    let data = await getRoleList()
    let _data = data.data.body
    if(_data.length) {
      if(currentNodeKey.value.id) {
        getCurrentRoleMember()
      }
      else {
        currentNodeKey.value = { ... _data[0] }
        getCurrentRoleMember()
      }
    }
    treeData.value = _data
  }
  onMounted(getListData)
	
  const handleNodeClick = (node:any) => {
    currentNodeKey.value = { ...node }
    getCurrentRoleMember()
  }
		
  const handleOpenAdd = () => {
    drawerVisible.value = true
    drawerInfo.value = {}
  }
  
  const onOpenEdit = () => {
    drawerVisible.value = true
    drawerInfo.value = currentNodeKey.value
  }

  const onOpenMenus = () => {
    drawerMenusVisible.value = true
    drawerInfo.value = currentNodeKey.value
  }
		
  const onGetView = () => {
    getListData()
  }
	
  return {
    treeDefaultProps,
    treeData,
    currentNodeKey,
    currentListData,
    drawerVisible,
    drawerMenusVisible,
    drawerInfo,
    handleNodeClick,
    handleOpenAdd,
    onOpenEdit,
    onOpenMenus,
    onGetView
  }
}
export default defineComponent({
  components:{ Info, Table, Drawer ,DrawerMenus },
  setup() {
    return {
      ...treeRender()
    }
  }
})
</script>