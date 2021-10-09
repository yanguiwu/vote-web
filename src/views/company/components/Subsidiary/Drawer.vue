<template>
  <el-drawer
    v-model='modelValue'
    :title='currentFormData.id ? "编辑分公司": "添加分公司"'
    direction='rtl'
    :before-close='handleClose'
    destroy-on-close
    size='50%'
    :with-header='false'
  > 
    <div v-if='isShow'>
      <DrawerHeader>
        <template #title>
          <el-button class='mr-5' size='medium'>返回</el-button>分公司详情 
        </template>
        <el-button type='text' class='el-button--danger' @click='handleChange'>{{ currentFormData.status === ISubStatus.online ? '禁用':'启用' }}</el-button>
      </DrawerHeader>
      <div class='justify-between sub-header'>
        <div>
          <div class='title'>{{ currentFormData.shortName }}</div>
          {{ currentFormData.name }}
        </div>
        <el-button type='primary' plain size='medium' @click='handleShowEdit'>编辑</el-button>
      </div>
      <el-form>
        <el-row>
          <el-col :span='12'>
            <el-form-item label='状态:'>
              已{{ currentFormData.status === ISubStatus.online ? '启用 ':'禁用' }}
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='企业法人:'>
              {{ currentFormData.legalPerson }}
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='联系地址:'>
              {{ currentFormData.provinceName }}{{ currentFormData.cityName }}{{ currentFormData.regionName }}
              <br>{{ currentFormData.address }}
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='联系方式:'>
              {{ currentFormData.phone }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-else>
      <DrawerHeader>
        <template #title>
          {{ currentFormData.id ? '编辑分公司' : '新增分公司' }} 
        </template>
        <el-button @click='handleClose'>取消</el-button>
        <el-button type='primary' @click='handleSubmit'>保存</el-button>
      </DrawerHeader>
      <el-form label-width='120px' :model='currentFormData'>
        <el-form-item label='公司全称' required>
          <el-input v-model='currentFormData.name' />
        </el-form-item>
        <el-form-item label='公司简称'>
          <el-input v-model='currentFormData.shortName' />
        </el-form-item>
        <el-form-item label='企业法人' required>
          <el-input v-model='currentFormData.legalPerson' />
        </el-form-item>
        <el-form-item label='联系方式' required>
          <el-input v-model='currentFormData.phone' />
        </el-form-item>
        <el-form-item label='联系地址'>
          <Distpicker v-model='pcrData' />
          <el-input v-model='currentFormData.address' placeholder='详细地址' />
        </el-form-item>
      </el-form>
    </div>
    
  </el-drawer>
</template>
<script lang="ts">
import { toRefs, ref, SetupContext, defineComponent, computed, watch, onMounted } from 'vue'
import { getSysRegionCodeTree } from '/@/api/util'
import { subAdd, subEdit, getSubView, editStatus } from '/@/api/company/subsidiary'
import { ISubStatus } from '/@/type/store/company/subsidiary'
import { ElMessage, ElMessageBox } from 'element-plus'

import Distpicker from '/@/components/Distpicker/index.vue'

const drawerRender = (props: any, context:SetupContext) => {
  const { formData, modelValue } = toRefs(props)
  const currentFormData = ref({
    id: 0,
    name: '',
    shortName: '',
    legalPerson: '',
    phone: '',
    address: '',
    status: 0
  })
  const treeData = ref([])
  const pcrData: any = ref([])
  const isShow = ref(false)
  const initSubView = async(id:number) => {
    const data = await getSubView(id)
    currentFormData.value = {
      ...data.data.body
    }
    pcrData.value = []
    if(currentFormData.value.provinceCode) {
      pcrData.value.push(currentFormData.value.provinceCode)
    }
    if(currentFormData.value.cityCode) {
      pcrData.value.push(currentFormData.value.cityCode)
    }
    if(currentFormData.value.regionCode) {
      pcrData.value.push(currentFormData.value.regionCode)
    }
  }

  watch(modelValue, (newValue) => {
    if(newValue) {
      currentFormData.value = {
        ...formData.value
      }
      if(currentFormData.value.id) {
        isShow.value = true
        initSubView(currentFormData.value.id)
      }else {
        isShow.value = false
      }
    }
  })

  const initTreeData = async() => {
    let data = await getSysRegionCodeTree()
    treeData.value = data
  }

  onMounted(initTreeData)

  const handleClose = () => {
    context.emit('update:modelValue',false)
  }

  const handleSubmit = async() => {
    const { id, status, ...data } = currentFormData.value
    let _data = {
      provinceCode: pcrData.value.length > 0 ? pcrData.value[0] : '',
      cityCode: pcrData.value.length > 0 ? pcrData.value[1] : '',
      regionCode: pcrData.value.length > 0 ? pcrData.value[2] : ''
    }
    !id ? await subAdd({
      ...data,
      ..._data
    }) : await subEdit({
      ...data,
      ..._data,
      id
    })
    ElMessage.success({
      message: '操作成功',
      type: 'success'
    })
    context.emit('get-view')
    handleClose()
  }

  const handleShowEdit = () => {
    isShow.value = false
  }

  const handleChange = async() => {
    let { id , name, status } = currentFormData.value
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
      initSubView(currentFormData.value.id)
    })
    
  }

  return {
    isShow,
    currentFormData,
    treeData,
    ISubStatus,
    pcrData,
    handleClose,
    handleSubmit,
    handleShowEdit,
    handleChange,
    sysTypeS:[{ label: '部门类型', value: 1 }],
    companys:[{ label: '所属公司', value: 4 }]
  }
}
export default defineComponent({
  components: { Distpicker },
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
  setup(props, context:SetupContext) {
    return {
      ...drawerRender(props,context)
    }
  }
})
</script>

<style lang='postcss' scoped>
  .sub-header {
    font-size: 14px;
    color: #666;
    margin-bottom: 30px;
    .title {
      color: #333;
      font-weight: 500;
      font-size: 20px;
    }
  }
</style>