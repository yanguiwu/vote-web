<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>选手列表</span>
        <span>
          <el-button type='success' size='mini' @click='handleCreateClick'>添加选手</el-button>
          <el-button type='success' size='mini'>批量添加</el-button>
        </span>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item>
        <el-input v-model='formData.userName' size='mini' placeholder='输入主题名关键字' style='width: 146px' class='mr-2' />
        <el-input v-model='formData.mobile' size='mini' placeholder='输入名字、ID或手机号码' style='width: 146px' class='mr-2' />
        <el-button type='primary' size='mini' @click='handleSearch'>搜索</el-button>
        <el-button type='primary' size='mini'>全部</el-button>
        <el-button type='primary' size='mini'>未审核</el-button>
        <el-button type='primary' size='mini'>批量导入</el-button>
        <el-button type='primary' size='mini'>数据导出</el-button>
        <el-button type='primary' size='mini'>批量删除</el-button>
        <el-button type='danger' size='mini'>一键随机修改票数（1-10）</el-button>
        <el-button type='danger' size='mini'>一键随机修改票数（10-30）</el-button>
      </el-form-item>
    </el-form>
    <el-table :data='listData' border>
      <el-table-column
        prop='userName'
        label='选手编号'
      />
      <el-table-column
        prop='mobile'
        label='店铺名'
      />
      <el-table-column
        prop='departmentName'
        label='手机号'
      />
      <el-table-column label='票数'>
        <template #default='scope'>
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column
        prop='invitationTime'
        label='礼物'
      />
      <el-table-column
        prop='invitationName'
        label='浏览次数'
      />
      <el-table-column
        prop='invitationName'
        label='参与时间'
      />
      <el-table-column
        prop='invitationName'
        label='二维码'
      />
      <el-table-column
        prop='invitationName'
        label='备注'
      />
      <el-table-column
        prop='invitationName'
        label='状态'
      />
      <el-table-column label='操作' width='280px'>
        <template #default='scope'>
          <el-button
            size='mini'
            type='primary'
            class='mb-2'
          >复制选手链接</el-button>
          <el-button
            size='mini'
            type='primary'
            class='mb-2'
            @click='()=>handleGoPlayer(scope.row.id)'
          >数据记录</el-button>
          <div>
            <el-button
              size='mini'
              type='primary'
            >设为今日之星</el-button>
            <el-button
              size='mini'
              type='primary'
            >修改</el-button>
            <el-button
              size='mini'
              type='primary'
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
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