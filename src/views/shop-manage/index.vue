<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>
          商户管理
        </span>
        <span>
          <el-button type='success' size='mini' @click='handleCreateClick'>添加商户</el-button>
        </span>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item>
        <el-input v-model='formData.name' size='mini' placeholder='输入商户名称' style='width: 146px' class='mr-2' />
        <el-button type='primary' size='mini' @click='()=>handleSearch()'>搜索</el-button>
        <el-button type='primary' size='mini' class='mr-5' @click='()=>handleSearch(true)'>全部</el-button>
      </el-form-item>
    </el-form>
    <el-table :data='listData' border>
      <el-table-column
        prop='name'
        label='商户名称'
      />
      <el-table-column
        prop='userName'
        label='商户高级账号名称'
      />
      <el-table-column label='密码' width='230px'>
        <template #default='scope'>
          <el-button
            size='mini'
            type='info'
            @click='()=>updateUserPassword(scope.row.id)'
          >修改密码</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop='createTime'
        label='创建时间'
      >
        <template #default='scope'>
          {{ DateStringConvert(scope.row.createTime) }}
        </template>
      </el-table-column> -->
      <el-table-column label='操作' width='230px'>
        <template #default='scope'>
          <el-button
            size='mini'
            type='info'
            @click='()=>handleChangeStatus(scope.row.id, 2)'
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
  
<script lang="ts">
import { ref,defineComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { updateStoreP, deleteStore, queryStoreList } from '/@/api/shop'
import { DateStringConvert } from '/@/utils/tools'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  emits:['on-search'],
  setup() {
    const router = useRouter()
    const route = useRoute()
    let formData = ref({ name:'',id: '' })
    let listData = ref([])
    let voteData = ref({})
    let pageData = ref({
      current: 1,
      size: 10000,
      recordCount: 0
    })
  
    const handleSearch = (clear?: boolean) => {
      if(clear) {
        formData.value = { name:'',id: '' }
      }
      pageData.value = {
        current: 1,
        size: 10000,
        recordCount: 0
      }
      initListData()
    }

    const handleCreateClick = () => {
      router.push({
        name: 'shopManageCreate'
      })
    }

    const changeStatus = async(id:number| string) => {
      await deleteStore({
        storeId: id
      })
      ElMessage.success('操作成功')
      initListData()
    }
    const handleChangeStatus = (id:number | string) => {
      ElMessageBox.confirm('注意！确认删除商户？删除后该商户的所有账号及数据将被删，除且无法恢复！！！！请谨慎操作！！！！','警告',{
        cancelButtonText: '取消',
        confirmButtonText: '已知晓风险，确认删除'
      }).then(() => {
        changeStatus(id)
      })
    }

    const initListData = async() => {
      let datas = await queryStoreList({
        ...formData.value,
        ...pageData.value
      })
      let { data,...other } = datas.data.body
      listData.value = data.map((item) => {
        return {
          ...item,
          addInitialTicketNum: ''
        }
      })
      pageData.value = { ...other, size: 10000 }
    }

    const updateUserPassword = (id: number) => {
      ElMessageBox.prompt('请输入新密码', '修改密码', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(async({ value }) => {
          console.log(value)
          await updateStoreP({
            storeId:id,
            userPassword:value
          })
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
        })
    }

    onMounted(async() => {
      initListData()
    })

    return {
      listData,
      formData,
      pageData,
      voteData,
      handleSearch,
      handleCreateClick,
      DateStringConvert,
      handleChangeStatus,
      updateUserPassword
    }
  }
})
</script>