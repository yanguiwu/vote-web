<template>
  <div>
    <el-row :gutter='20'>
      <el-col :span='6'>
        <el-card>
          <template #header>
            <div class='justify-between'>
              <span>地区</span>
            </div>
          </template>
          <el-tree 
            v-if='treeData.length'
            :default-expanded-keys='["1"]'
            check-on-click-node
            highlight-current
            :expand-on-click-node='false'
            :current-node-key='currentNodeKey.region_code'
            node-key='id'
            :data='treeData'
            @node-click='handleNodeClick'
          />
        </el-card>
      </el-col>
      <el-col :span='18'>
        <Table :list-data='currentTableListData' @get-view='onGetView' />
      </el-col>
    </el-row>
  </div>
</template>
	
<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { getSubList } from '/@/api/company/subsidiary'
import { getSysRegionCodeTree } from '/@/api/util'
import Table from './components/Subsidiary/Table.vue'
import Node from 'element-plus/packages/tree/src/model/node'

const treeRender = () => {
  let treeData = ref<IElementTree[]>([])
  let searchData = reactive({
    name: ''
  })
  let currentNodeKey = ref({ 
    region_level: '',
    region_code: ''
  })
  let currentTableListData = ref([])
	
  const getCurrentCodeTableData = async() => {
    let data = await getSubList({
      regionLevel: currentNodeKey.value.region_level,
      regionCode: currentNodeKey.value.region_code,
      name: searchData.name
    })
    currentTableListData.value = data.data.body
  }
	
  const initTreeData = async() => {
    let data = await getSysRegionCodeTree()
    treeData.value = data
    if(data.length) {
      console.log(data)
      if(currentNodeKey.value.region_code) {
        getCurrentCodeTableData()
      }
      else {
        currentNodeKey.value = data[0].data
        getCurrentCodeTableData()
      }
    }
  }
  onMounted(initTreeData)
	
  const handleNodeClick = (node: Node) => {
    currentNodeKey.value = {
      region_level: node.data.region_level,
      region_code:node.data.region_code
    }
    getCurrentCodeTableData()
  }
		
  const onGetView = (data: any) => {
    if(data) {
      searchData = data
    }
    getCurrentCodeTableData()
  }
	
  return {
    treeData,
    currentNodeKey,
    currentTableListData,
    handleNodeClick,
    onGetView
  }
}
export default defineComponent({
  components:{ Table },
  setup() {
    let cityData = ref([])
    return {
      cityData,
      ...treeRender()
    }
  }
})
</script>