<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>投票列表</span>
        <span>
          <el-button type='success' size='mini' @click='handleCreateClick'>添加选手</el-button>
          <el-button type='success' size='mini'>批量添加</el-button>
        </span>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item>
        <el-input v-model='formData.userName' size='mini' placeholder='输入主题名关键字' style='width: 146px' class='mr-2' />
        <el-button type='primary' size='mini' class='mr-5' @click='handleSearch'>搜索</el-button>
        <el-button type='danger' size='mini'>所有投票</el-button>
        <el-button type='primary' size='mini'>普通投票</el-button>
        <el-button type='primary' size='mini'>砖石投票</el-button>
        <el-button type='primary' size='mini'>虚拟投票</el-button>
        <el-button type='primary' size='mini'>刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table :data='listData' border>
      <el-table-column
        prop='userName'
        label='编号'
      />
      <el-table-column
        prop='mobile'
        label='选手姓名'
      />
      <el-table-column
        prop='departmentName'
        label='活动'
      />
      <el-table-column label='电话'>
        <template #default='scope'>
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column
        prop='invitationTime'
        label='时间'
      />
      <el-table-column
        prop='invitationName'
        label='票数'
      />
      <el-table-column
        prop='invitationName'
        label='类型'
      />
      <el-table-column
        prop='invitationName'
        label='IP'
      />
      <el-table-column
        prop='invitationName'
        label='城市'
      />
      <el-table-column
        prop='invitationName'
        label='钻石'
      />
    </el-table>
  </el-card>
</template>
  
<script lang="ts">
import { ref,defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  emits:['on-search'],
  setup(props:any, context: any) {
    const router = useRouter()
    const formData = ref({ userName:'',invitationName: '',mobile: '' })
    const listData = ref([])
    const currentId = ref()
    const drawerVisable = ref(false)
    const handleSearch = () => {
      context.emit('on-search', formData.value)
    }
    const handleGoPlayer = (id:number) => {
      router.push({
        name: 'voteListPlayerListRecord',
        params: {
          voteId: id,
          playerId: 1
        }
      })
    }
    const handleCreateClick = () => {
      router.push({
        name: 'voteListPlayerCreate',
        params: {
          voteId: 1
        }

      })
    }
    onMounted(() => {
      listData.value = [{ name: 1, id: 1 }]
    })

    return {
      listData,
      formData,
      currentId,
      drawerVisable,
      handleSearch,
      handleGoPlayer,
      handleCreateClick
    }
  }
})
</script>