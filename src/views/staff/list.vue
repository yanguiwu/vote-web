<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>
          用户管理
        </span>
        <span>
          <el-button type='success' size='mini' @click='handleCreateClick'>添加用户</el-button>
        </span>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item>
        <el-input v-model='formData.userName' size='mini' placeholder='输入商户名称' style='width: 146px' class='mr-2' />
        <el-button type='primary' size='mini' @click='()=>handleSearch()'>搜索</el-button>
        <el-button type='primary' size='mini' class='mr-5' @click='()=>handleSearch(true)'>全部</el-button>
      </el-form-item>
    </el-form>
    <el-table :data='listData' border>
      <el-table-column
        prop='userName'
        label='账号名称'
      />
      <!-- <el-table-column
        prop='createTime'
        label='创建时间'
      >
        <template #default='scope'>
          {{ DateStringConvert(scope.row.createTime) }}
        </template>
      </el-table-column> -->
      <el-table-column label='密码' width='230px'>
        <template #default='scope'>
          <el-button
            size='mini'
            type='info'
            @click='()=>updateUserPassword(scope.row.id)'
          >修改密码</el-button>
        </template>
      </el-table-column>
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
import { useRouter } from 'vue-router'
import { queryUserList,deleteUser ,UpdateUser } from '/@/api/staff'
import { DateStringConvert } from '/@/utils/tools'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  emits:['on-search'],
  setup() {
    const router = useRouter()
    let formData = ref({ name:'',id: '' })
    let listData = ref([])
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
        name: 'staffCreate'
      })
    }

    const changeStatus = async(id:number| string) => {
      await deleteUser({
        id,
        status:2
      })
      ElMessage.success('操作成功')
      initListData()
    }
    const handleChangeStatus = (id:number | string) => {
      ElMessageBox.confirm('确认删除账号？','警告',{
        cancelButtonText: '取消',
        confirmButtonText: '确认删除'
      }).then(() => {
        changeStatus(id)
      })
    }

    const updateUserPassword = (id: number) => {
      ElMessageBox.prompt('请输入新密码', '修改密码', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(async({ value }) => {
          console.log(value)
          await UpdateUser({
            id,
            userPassword:value
          })
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
        })
    }

    const initListData = async() => {
      let datas = await queryUserList({
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

    onMounted(async() => {
      initListData()
    })

    return {
      listData,
      formData,
      handleSearch,
      handleCreateClick,
      updateUserPassword,
      handleChangeStatus
    }
  }
})
</script>