<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>
          <span v-if='voteData.status == 1'>
            <el-button v-if='voteData.infoStatus == 2' size='mini' type='success'>{{ infoStatusStr(voteData.infoStatus) }}</el-button>
            <el-button v-else size='mini' type='primary'>活动{{ infoStatusStr(voteData.infoStatus) }}</el-button>
          </span>
          <el-button v-if='voteData.status == 3' size='mini' type='warning'>已关闭</el-button>
          <el-button v-if='voteData.status == 0' size='mini' type='warning'>未开启</el-button>
          活动：{{ voteData.title }}
        </span>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item>
        <el-input v-model='formData.userName' size='mini' placeholder='输入选手名称关键字' style='width: 146px' class='mr-2' />
        <el-input v-model='formData.id' size='mini' placeholder='输入ID' style='width: 146px' class='mr-2' />
        <el-button type='primary' size='mini' class='mr-5' @click='handleSearch'>搜索</el-button>
        <el-button type='danger' size='mini'>所用投票</el-button>
        <el-button type='primary' size='mini'>普通投票</el-button>
        <el-button type='primary' size='mini'>砖石投票</el-button>
        <el-button type='primary' size='mini'>虚拟投票</el-button>
        <el-button type='primary' size='mini'>刷新</el-button>
        <!-- <el-button type='primary' size='mini'>数据导出</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data='listData' border @selection-change='handleSelectionChange'>
      <el-table-column type='selection' width='55' />
      <el-table-column
        width='60px'
        prop='infoSeq'
        label='编号'
      />
      <el-table-column
        prop='name'
        label='选手名称'
      >
        <template #default='scope'>
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        prop='phone'
        label='手机号'
      />
      <el-table-column
        prop='invitationTime'
        label='活动名'
      />
      <el-table-column
        prop='viewNum'
        label='电话'
      />
      <el-table-column
        width='90px'
        prop='createTime'
        label='时间'
      >
        <template #default='scope'>
          {{ DateStringConvert(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop='invitationName'
        label='票数'
      />
      <el-table-column
        prop='remark'
        label='类型'
      />
      <el-table-column
        prop='remark'
        label='IP'
      />
      <el-table-column
        prop='remark'
        label='城市'
      />
      <el-table-column
        prop='remark'
        label='钻石'
      />
      <el-table-column
        label='状态'
        width='95px'
      >
        <template #default='scope'>
          <el-button
            v-if='scope.row.status == 1'
            size='mini'
            type='info'
            @click='()=>handleChangeStatus(scope.row.id, 3)'
          >允许投票</el-button>
          <el-button
            v-if='scope.row.status == 3'
            size='mini'
            type='danger'
            @click='()=>handleChangeStatus(scope.row.id, 1)'
          >停止投票</el-button>
        </template>
      </el-table-column>
      <el-table-column label='操作' width='230px'>
        <template #default='scope'>
          <el-button
            size='mini'
            type='info'
            class='mb-2'
          >复制选手链接</el-button>
          <el-button
            size='mini'
            type='info'
            class='mb-2'
            @click='()=>handleGoPlayer(scope.row.id)'
          >数据记录</el-button>
          <div>
            <el-button
              size='mini'
              :type='scope.row.todayStar ? "danger": "info"'
              @click='()=>handleStart(scope.row.id,scope.row.todayStar)'
            >
              {{ scope.row.todayStar ? '今日之星' : '设为今日之星' }}</el-button>
            <el-button
              size='mini'
              type='info'
              @click='()=>handleEdit(scope.row.id)'
            >修改</el-button>
            <el-button
              size='mini'
              type='info'
              @click='()=>handleChangeStatus(scope.row.id, 2)'
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
   
    <el-pagination layout='prev, pager, next' :total='pageData.recordCount' :page-size='pageData.size' @current-change='pCurrentChange' />
  </el-card>
</template>
  
<script lang="ts">
import { ref,defineComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { queryVote } from '/@/api/vote/index'
import { queryPlayerList, editPlayerStatus, playerTodayStar, updateRandomTicket } from '/@/api/vote/player'
import { DateStringConvert , playerStatusStr,infoStatusStr } from '/@/utils/tools'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  emits:['on-search'],
  setup(props:any, context: any) {
    const router = useRouter()
    const route = useRoute()
    let formData = ref({ userName:'',invitationName: '',mobile: '' })
    let listData = ref([])
    let multipleSelection = ref([])
    let voteData = ref({})
    let pageData = ref({
      current: 1,
      size: 20,
      recordCount: 0
    })
    const handleSearch = () => {
      initListData()
    }
    const handleGoPlayer = (id:number) => {
      router.push({
        name: 'voteListPlayerListRecord',
        params: {
          voteId: route.params.voteId ,
          playerId: id
        }
      })
    }
    const handleCreateClick = () => {
      router.push({
        name: 'voteListPlayerCreate',
        params: {
          voteId: route.params.voteId
        }
      })
    }
    const handleBetchClick = () => {
      router.push({
        name: 'voteListPlayerBetchCreate',
        params: {
          voteId: route.params.voteId
        }
      })
    }
    const handleEdit = (id:number) => {
      router.push({
        name: 'voteListPlayerEdit',
        params: {
          voteId: route.params.voteId,
          playerId: id
        }
      })
    }
    const handleStart = async(id:number, todayStar: number) => {
      await playerTodayStar({
        subId: id,
        todayStar: todayStar ? 0 : 1,
        infoId:route.params.voteId
      })
      ElMessage.success('操作成功')
      initListData()
    }

    const changeStatus = async(id:number| string, status: number) => {
      await editPlayerStatus({
        id,
        status,
        infoId:route.params.voteId
      })
      ElMessage.success('操作成功')
      initListData()
    }
    const handleChangeStatus = (id:number | string, status: number) => {
      if(status === 2) {
        ElMessageBox.confirm('确认删除选手？','提示',{
          cancelButtonText: '取消',
          confirmButtonText: '确认'
        }).then(() => {
          changeStatus(id,status)
        })
        return
      }
      changeStatus(id,status)
    }

    const handleBetchDelete = () => {
      if(!multipleSelection.value.length) {
        ElMessage.warning('请选择需要操作的数据')
        return 
      }
      handleChangeStatus(multipleSelection.value.map((item) => {
        return item.id
      }).join(','),2)
    }

    const initListData = async() => {
      let datas = await queryPlayerList({
        infoId:route.params.voteId,
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

    const handleSelectionChange = (value: any) => {
      multipleSelection.value = value
    }
    const handleChangeTicket = async(min: number,max:number) => {
      if(!multipleSelection.value.length) {
        ElMessage.warning('请选择需要操作的数据')
        return 
      }
      await updateRandomTicket({
        infoId:route.params.voteId,
        subIdArr:multipleSelection.value.map((item) => {
          return item.id
        }).join(','),
        maxTicketNum:max,
        minTicketNum:min
      })
      ElMessage.success('操作成功')
      initListData()
    }
    onMounted(async() => {
      initListData()
      let datas = await queryVote({
        id: route.params.voteId
      })
      voteData.value = datas.data.body
    })

    return {
      listData,
      formData,
      pageData,
      voteData,
      handleSearch,
      handleEdit,
      handleGoPlayer,
      handleCreateClick,
      DateStringConvert,
      playerStatusStr,
      handleChangeStatus,
      handleStart,
      pCurrentChange,
      handleSelectionChange,
      handleBetchDelete,
      handleChangeTicket,
      handleBetchClick,
      infoStatusStr
    }
  }
})
</script>