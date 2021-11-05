<template>
  <el-card>
    <template #header>	
      <div class='justify-between'>
        <span>
          <span v-if='voteData.status == 1'>
            <el-button v-if='voteData.infoStatus == 2' size='mini' type='success'>{{ infoStatusStr(voteData.infoStatus) }}</el-button>
            <el-button v-else size='mini' type='warning'>{{ infoStatusStr(voteData.infoStatus) }}</el-button>
          </span>
          <el-button v-if='voteData.status == 3' size='mini' type='warning'>已关闭</el-button>
          <el-button v-if='voteData.status == 0' size='mini' type='warning'>未开启</el-button>
          活动：{{ voteData.title }}
        </span>
        <span>
          <el-button type='success' size='mini' @click='handleCreateClick'>添加选手</el-button>
          <el-button type='success' size='mini' @click='handleBetchClick'>批量添加</el-button>
        </span>
      </div>
    </template>
    <el-form :inline='true' :model='formData' class='demo-form-inline'>
      <el-form-item>
        <el-input v-model='formData.name' size='mini' placeholder='输入选手名称关键字' style='width: 146px' class='mr-2' />
        <el-button type='primary' size='mini' @click='()=>handleSearch()'>搜索</el-button>
        <el-button type='primary' size='mini' class='mr-5' @click='()=>handleSearch(true)'>全部</el-button>
        <!-- <el-button type='primary' size='mini'>数据导出</el-button> -->
      </el-form-item>
    </el-form>
    <el-divider class='mt-1 mb-4' />
    <div class='mb-2'>
      <el-button type='danger' size='mini' @click='handleBetchDelete'>批量删除</el-button>
      <el-button type='danger' size='mini' @click='handleChangeTicket(1,10)'>一键随机修改票数（1-10）</el-button>
      <el-button type='danger' size='mini' @click='handleChangeTicket(10,30)'>一键随机修改票数（10-30）</el-button>
    </div>
    <el-table :data='listData' border @selection-change='handleSelectionChange'>
      <el-table-column type='selection' width='55' />
      <el-table-column
        width='60px'
        prop='infoSeq'
        label='选手编号'
      />
      <el-table-column
        prop='name'
        label='店铺名'
      >
        <template #default='scope'>
          <el-image
            style='width: 100%; height: auto'
            :src='scope.row.fileWebPath'
            fit='fill'
          />
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        prop='phone'
        label='手机号'
      />
      <el-table-column label='票数' min-width='120px'>
        <template #default='scope'>
          <span class='color-danger'>{{ scope.row.ticketNum }}</span> / {{ scope.row.orderTicketNum + scope.row.ticketNum + scope.row.initialTicketNum }}
          <br>
          <el-input
            v-model='listData[scope.$index].addInitialTicketNum'
            style='width: 60px;'
            type='number'
            size='mini'
          />
          <el-tooltip
            class='item'
            effect='dark'
            content='加票输入正数，减票输入负数'
            placement='top'
          >
            <el-button icon='el-icon-plus' size='mini' @click='() => handleAddInitialTicketNum(scope.row)' />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop='invitationTime'
        label='礼物'
      />
      <el-table-column
        prop='viewNum'
        label='浏览次数'
      />
      <el-table-column
        width='90px'
        prop='createTime'
        label='参与时间'
      >
        <template #default='scope'>
          {{ DateStringConvert(scope.row.createTime) }}
        </template>
      </el-table-column>
     <el-table-column
        prop='invitationName'
        label='链接'
      >
        <template #default='scope'>
            <QrcodeVue :value='getUrl(scope.row)' size='60' level='H' />
        </template>
      </el-table-column>
      <el-table-column
        prop='remark'
        label='备注'
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
import QrcodeVue from 'qrcode.vue'
import { useLayoutStore } from '/@/store/modules/layout'

export default defineComponent({
  components:{
    QrcodeVue
  },
  emits:['on-search'],
  setup(props:any, context: any) {
    const router = useRouter()
    const route = useRoute()
    let formData = ref({ name:'',id: '' })
    let listData = ref([])
    let multipleSelection = ref([])
    let voteData = ref({})
    let pageData = ref({
      current: 1,
      size: 20,
      recordCount: 0
    })
     const getUrl = (row) => {
      const { getUserInfo,getUserListData } = useLayoutStore()
      let apiDomain = getUserInfo.sysSetting && getUserInfo.sysSetting.apiDomain
      return `${apiDomain || window.location.origin }/wx/#/pages/player/index?voteId=${row.id}&playerId=45`
    }
    const handleSearch = (clear?: boolean) => {
      if(clear) {
        formData.value = { name:'',id: '' }
      }
      pageData.value = {
        current: 1,
        size: 20,
        recordCount: 0
      }
      initListData()
    }
    const handleAddInitialTicketNum = async(row: any) => {
      if(!row.addInitialTicketNum) {
        ElMessage.success('请输入需要增加的浏览量')
        return
      }
      await updateRandomTicket({
        infoId:route.params.voteId,
        subIdArr:row.id,
        maxTicketNum:Number(row.addInitialTicketNum),
        minTicketNum:Number(row.addInitialTicketNum)
      }) 
      ElMessage.success('操作成功')
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
      listData.value = data.map((item) => {
        return {
          ...item,
          addInitialTicketNum: ''
        }
      })
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
      infoStatusStr,
      handleAddInitialTicketNum,
      getUrl
    }
  }
})
</script>