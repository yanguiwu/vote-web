<template>
  <div>
    <el-row :gutter='20'>
      <el-col :span='7'>
        <el-card>
          <template #header>
            <div class='justify-between'>
              <span>部门列表</span>
              <el-button if='!isShow' type='primary' @click='handleOpenAdd'>添加部门</el-button>
            </div>
          </template>
          <el-tree 
            v-if='treeData.length'
            default-expand-all
            check-on-click-node
            highlight-current
            :expand-on-click-node='false'
            :current-node-key='currentNodeKey'
            node-key='id'
            :data='treeData'
            @node-click='handleNodeClick'
          />
        </el-card>
      </el-col>
      <el-col :span='17'>
        <Info :is-show='isShow' :info='currentDepartMent' @get-view='onGetView' />
        <slot />
      </el-col>
    </el-row>
    <Drawer v-model='drawerVisible' :form-data='drawerInfo' />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getDepartmentTree, departmentView } from '/@/api/company/department'
import Info from './components/Dpartment/Info.vue'
import Drawer from './components/Dpartment/Drawer.vue'

const treeRender = (props: any, context: any) => {
  const treeData = ref([])
  const currentNodeKey = ref()
  const currentDepartMent = ref({})
  const drawerVisible = ref(false)
  const drawerInfo = ref({})

  const getCurrentDepartMent = async(id: number) => {
    context.emit('on-get-view', id)
    let data = await departmentView(id)
    currentDepartMent.value = data.data.body
  }

  const getUserRepositories = async() => {
    let data = await getDepartmentTree()
    let _depaSub = data
    if(_depaSub.length) {
      _depaSub[0].disabled = true
      _depaSub[0].label = _depaSub[0].companyName
      if(currentNodeKey.value) {
        getCurrentDepartMent(currentNodeKey.value)
      }
      else {
        currentNodeKey.value = _depaSub[0].children[0].id
        getCurrentDepartMent(currentNodeKey.value)
      }
    }
    treeData.value = _depaSub
  }
  onMounted(getUserRepositories)

  const handleNodeClick = (node:any) => {
    console.log(node)
    if(node.disabled) {
      return
    }
    getCurrentDepartMent(node.id)
  }
	
  const handleOpenAdd = () => {
    drawerVisible.value = true
  }
	
  const onGetView = () => {
    getUserRepositories()
  }

  return {
    treeData,
    currentNodeKey,
    currentDepartMent,
    drawerVisible,
    drawerInfo,
    handleNodeClick,
    handleOpenAdd,
    onGetView
  }
}
export default defineComponent({
  components:{ Info, Drawer },
  props: {
    isShow: {
      type: Boolean,
      default:false
    }
  },
  setup(props: any, context: any) {
    return {
      ...treeRender(props, context)
    }
  }
})
</script>