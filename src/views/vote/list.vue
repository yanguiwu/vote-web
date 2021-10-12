<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>投票评选列表</span>
        <span>
          <el-button type='success' size='mini' @click='handleCreateClick'>添加活动</el-button>
          <el-button type='success' size='mini'>数据统计</el-button>
        </span>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item>
        <el-input v-model='formData.userName' size='mini' placeholder='输入主题名关键字' style='width: 146px' class='mr-5' />
        开始日期：<el-input v-model='formData.mobile' size='mini' placeholder='输入手机号' style='width: 292px' class='mr-5' />
        <el-button type='primary' size='mini' @click='handleSearch'>搜索</el-button>
        <el-button type='danger' size='mini'>全部活动</el-button>
        <el-button type='primary' size='mini'>进行中</el-button>
        <el-button type='primary' size='mini'>已结束</el-button>
        <el-button type='primary' size='mini'>今日开始</el-button>
        <el-button type='primary' size='mini'>今日结束</el-button>
        <el-button type='primary' size='mini'>未开始</el-button>
        <el-button type='primary' size='mini'>礼物记录</el-button>
        <el-button type='primary' size='mini'>投票记录</el-button>
        <el-button type='primary' size='mini'>举报记录</el-button>
        <el-button type='primary' size='mini'>刷新</el-button>
        <el-button type='primary' size='mini'>2021-10-10</el-button>
        <el-button type='primary' size='mini'>2021-10-11</el-button>
        <el-button type='primary' size='mini'>2021-10-12</el-button>
      </el-form-item>
    </el-form>
    <el-table :data='listData' border>
      <el-table-column
        prop='userName'
        label='图片'
      />
      <el-table-column
        prop='mobile'
        label='活动名称'
      />
      <el-table-column
        prop='departmentName'
        label='投票时间'
      />
      <el-table-column label='选手数量'>
        <template #default='scope'>
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column
        prop='invitationTime'
        label='投票量'
      />
      <el-table-column
        prop='invitationName'
        label='礼物'
      />
      <el-table-column
        prop='invitationName'
        label='浏览量'
      />
      <el-table-column
        prop='invitationName'
        label='链接'
      />
      <el-table-column
        prop='invitationName'
        label='状态'
      />
      <el-table-column
        prop='invitationName'
        label='备注'
      />
      <el-table-column label='操作' width='380px'>
        <template #default='scope'>
          <el-button
            size='mini'
            type='info'
            @click='()=>handleGoPlayer(scope.row.id, "voteListPlayer")'
          >选管</el-button>
          <el-button
            size='mini'
            type='info'
            @click='()=>handleGoPlayer(scope.row.id, "voteListComplain")'
          >举报</el-button>
          <el-button
            size='mini'
            type='info'
            @click='()=>handleGoPlayer(scope.row.id, "voteListPay")'
          >礼物</el-button>
          <el-button
            size='mini'
            type='info'
            @click='()=>handleGoPlayer(scope.row.id, "voteListRecord")'
          >投票</el-button>
          <el-button
            size='mini'
            type='info'
          >复制添加</el-button>
          <div class='mt-2'>
            <el-button
              size='mini'
              type='info'
              @click='()=>handleGoPlayer(scope.row.id, "voteListRand")'
            >添加随机投票</el-button>
            <el-button
              size='mini'
              type='info'
            >查看</el-button>
            <el-button
              size='mini'
              type='info'
            >关闭</el-button>
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
    const handleGoPlayer = (id:number, name: string) => {
      router.push({
        name,
        params: {
          voteId: id
        }
      })
    }
    const handleCreateClick = () => {
      router.push({
        name: 'voteListCreate'
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