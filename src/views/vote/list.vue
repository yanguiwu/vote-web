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
        <el-button type='primary' size='mini'>未开始</el-button>
        <el-button type='primary' size='mini'>今日开始</el-button>
        <el-button type='primary' size='mini'>今日结束</el-button>
        <div>
          <el-button type='primary' size='mini'>礼物记录</el-button>
          <el-button type='primary' size='mini'>投票记录</el-button>
          <el-button type='primary' size='mini'>举报记录</el-button>
          <el-button type='primary' size='mini'>刷新</el-button>
          <el-button type='primary' size='mini'>2021-10-10</el-button>
          <el-button type='primary' size='mini'>2021-10-11</el-button>
          <el-button type='primary' size='mini'>2021-10-12</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-divider class='mt-1 mb-4' />
    <div class='mb-2'>
      <el-button type='danger' size='mini' @click='handleBetchDelete'>批量删除</el-button>
    </div>
    <el-table :data='listData' border @selection-change='handleSelectionChange'>
      <el-table-column type='selection' width='55' :selectable='selectable' />
      <el-table-column
        prop='fileWebPath'
        label='图片'
      >
        <template #default='scope'>
          <img :src='scope.row.fileWebPath' height='50px'>
        </template>
      </el-table-column>

      <el-table-column
        prop='title'
        label='活动名称'
      />
      <el-table-column label='投票时间' width='90px'>
        <template #default='scope'>
          {{ DateStringConvert(scope.row.startVoteTime) }}
          <br>
          {{ DateStringConvert(scope.row.endVoteTime) }}
          <br>
          {{ scope.row.countDown }}
        </template>
      </el-table-column>
      <el-table-column
        label='选手数量'
      />
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
      >
        <template #default='scope'>
          {{ scope.row.visitNum + scope.row.initialNum }}
        </template>
      </el-table-column>
      <el-table-column
        prop='invitationName'
        label='链接'
      />
      <el-table-column
        prop='infoStatus'
        label='状态'
      >
        <template #default='scope'>
          <div v-if='scope.row.status == 1'>
            <div v-if='scope.row.infoStatus == 2' class='color-success'>{{ infoStatusStr(scope.row.infoStatus) }}</div>
            <div v-else class='color-danger'>{{ infoStatusStr(scope.row.infoStatus) }}</div>
          </div>
          <div v-if='scope.row.status == 3'>已关闭</div>
          <div v-if='scope.row.status == 0'>未开启</div>
        </template>
      </el-table-column>
      <el-table-column
        prop='remark'
        label='备注'
      />
      <el-table-column label='操作' width='320px'>
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
            @click='()=>handleCopyVote(scope.row.id)'
          >复制添加</el-button>
          <div class='mt-2'>
            <el-button
              size='mini'
              type='info'
              @click='()=>handleGoPlayer(scope.row.id, "voteListRand")'
            >添加随机投票</el-button>
            <!-- status  0未发布 1已发布 2已删除 3已关闭 -->
            <el-button
              v-if='scope.row.status === 0'
              size='mini'
              type='info'
              @click='()=> handleChangeStatus(scope.row.id,1)'
            >开启</el-button>
            <el-button
              v-if='scope.row.status === 1'
              size='mini'
              type='info'
              @click='()=> handleChangeStatus(scope.row.id,3)'
            >关闭</el-button>
            <el-button
              v-if='scope.row.status === 0'
              size='mini'
              type='info'
              @click='()=>handleGoPlayer(scope.row.id, "voteListEdit")'
            >编辑</el-button>
            <el-button
              v-if='scope.row.status != 0'
              size='mini'
              type='info'
              @click='()=>handleGoPlayer(scope.row.id, "voteListShow")'
            >查看</el-button>
            <el-button
              v-if='scope.row.status === 0 || scope.row.status === 3 '
              size='mini'
              type='info'
              @click='()=>handleDelete(scope.row.id)'
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination layout='prev, pager, next' :total='pageData.recordCount' @current-change='pCurrentChange' />
  </el-card>
</template>
  
<script lang="ts">
import { ref,defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { queryVoteList, copyVote, editStatus } from '/@/api/vote/index'
import { ElMessage , ElMessageBox } from 'element-plus'
import { DateStringConvert, statusStr, infoStatusStr } from '/@/utils/tools'
export default defineComponent({
  emits:['on-search'],
  setup(props:any, context: any) {
    const router = useRouter()
    const formData = ref({ userName:'',invitationName: '',mobile: '' })
    const listData = ref([])
    const multipleSelection = ref([])
    let pageData = ref({
      current: 1,
      size: 10,
      recordCount: 0,
      count: 1
    })
    const currentId = ref()
    const currentPage = ref(1)
    const pageSize = ref(10)
    const drawerVisable = ref(false)
    const handleSelectionChange = (value: any) => {
      multipleSelection.value = value
    }
    const handleSearch = () => {
      context.emit('on-search', formData.value)
    }
    const initListData = async() => {
      let datas = await queryVoteList({
        ...formData.value,
        ...pageData.value
      })
      let { data,...other } = datas.data.body
      listData.value = data
      pageData.value = { ...other }
    }
    const pCurrentChange = (current: number) => {
      pageData.value = {
        ...pageData.value,
        current
      }
      initListData()
    }
    const handleGoPlayer = (id:number, name: string) => {
      router.push({
        name,
        params: {
          voteId: id
        }
      })
    }
    const handleCopyVote = async(id:number) => {
      await copyVote({ id })
      ElMessage.success('复制成功')
      initListData()
    }

    const handleCreateClick = () => {
      router.push({
        name: 'voteListCreate'
      })
    }
    const handleChangeStatus = async(id: number,status : number) => {
      await editStatus({
        id,
        status
      })
      ElMessage.success('操作成功')
      initListData()
    }
    const handleDelete = async(id: number | string) => {
      ElMessageBox.confirm('确认删除该活动?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await editStatus({
          id,
          status: 2
        })
        ElMessage.success('删除成功')
        initListData()
      })
    }
    const selectable = (row: any) => {
      return row.status === 0 || row.status === 3 
    }
    const handleBetchDelete = () => {
      if(!multipleSelection.value.length) {
        ElMessage.warning('请选择需要操作的数据')
        return 
      }
      handleDelete(multipleSelection.value.map((item) => {
        return item.id
      }).join(','))
    }
    onMounted(() => {
      initListData()
    })

    return {
      listData,
      formData,
      currentId,
      drawerVisable,
      pageData,
      handleCopyVote,
      handleDelete,
      handleSearch,
      handleGoPlayer,
      handleCreateClick,
      handleChangeStatus,
      DateStringConvert,
      statusStr, 
      infoStatusStr,
      pCurrentChange,
      handleBetchDelete,
      handleSelectionChange,
      selectable
    }
  }
})
</script>