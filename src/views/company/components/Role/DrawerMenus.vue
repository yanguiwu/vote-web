<template>
  <el-drawer
    v-model='modelValue'
    title='调整权限'
    direction='rtl'
    :before-close='handleClose'
    destroy-on-close
    size='40%'
    :with-header='false'
  >
    <DrawerHeader>
      <template #title>
        调整权限
      </template>
      <el-button @click='handleClose'>取消</el-button>
      <el-button type='primary' @click='handleSubmit'>保存</el-button>
    </DrawerHeader>
    <el-tree 
      v-if='treeData.length && modelValue'
      default-expand-all
      check-on-click-node
      show-checkbox
      highlight-current
      :expand-on-click-node='false'
      :default-checked-keys='currentNodeKey'
      node-key='id'
      :data='treeData'
      @check='onCheckChange'
    />
  </el-drawer>
</template>
<script lang="ts">
import { toRefs, ref, defineComponent, SetupContext, onMounted ,watch } from 'vue'
import { getMenusByRoleId, editRoleMenus } from '/@/api/company/role'
import { getsysMenuTree } from '/@/api/util'
import { ElMessage } from 'element-plus'

export default defineComponent({
  props:{
    formData: {
      type:Object,
      default: () => ({})
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, context: SetupContext) {
    const { formData, modelValue } = toRefs(props)
    const treeData = ref([])
    const currentNodeKey = ref([])
    
    const getListData = async() => {
      let data = await getsysMenuTree()
      treeData.value = data
      console.log('tree1',data)
    }

    onMounted(getListData)

    watch(modelValue, async() => {
      if(modelValue.value) {
        currentNodeKey.value = []
        let data = await getMenusByRoleId(formData.value.id)
        let _data = data.data.body || []
        _data = _data.map((item:any) => {
          return item.menu_code
        })
        console.log('tree2',_data)
        currentNodeKey.value = _data
      }
    })

    const handleClose = () => {
      context.emit('update:modelValue',false)
    }

    const handleSubmit = async() => {
      await editRoleMenus({
        roleId: formData.value.id,
        menuCode:currentNodeKey.value.join(',')
      })
      ElMessage.success({
        message: '操作成功',
        type: 'success'
      })
      handleClose()
    }

    const onCheckChange = (data:any, tree:any) => {
      currentNodeKey.value = tree.checkedKeys
    }

    return { 
      treeData,
      currentNodeKey,
      handleSubmit,
      handleClose,
      onCheckChange
    }
  }
})
</script>